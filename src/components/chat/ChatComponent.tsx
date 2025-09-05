import React, { useState, useEffect, useRef, useMemo } from "react";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import {
  useGetCourseMessagesQuery,
  useSendMessageMutation,
} from "@/services/websocket/chatApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Upload, Users, Wifi, WifiOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "next-auth/react";

interface ChatComponentProps {
  courseId: string;
  accessToken: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  courseId,
  accessToken,
}) => {
  const [messageText, setMessageText] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user ID from session
  useEffect(() => {
    const getUserId = async () => {
      const session = await getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      }
    };
    getUserId();
  }, []);

  // WebSocket hook with updated API
  const {
    messages,
    isConnected,
    connectionState,
    error: wsError,
    userStatus,
    addMessage,
  } = useChatWebSocket({
    accessToken,
    courseId,
    userId: userId || undefined,
    autoConnect: true,
    onConnect: () => {
      console.log("Chat connected for course:", courseId);
    },
    onDisconnect: () => {
      console.log("Chat disconnected for course:", courseId);
    },
    onError: (error: any) => {
      console.error("Chat WebSocket error:", error);
    },
    onUserStatus: (status) => {
      console.log("User status update:", status);
      // Show toast notification for message status
      if (status.type === "MESSAGE_SENT" && status.status === "success") {
        console.log("Message sent successfully:", status.messageId);
        // Optional: Show success toast
      } else if (status.status === "error") {
        console.error("Message error:", status.error);
        // Optional: Show error toast
      }
    },
  });

  // RTK Query hooks
  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetCourseMessagesQuery(
      { courseId, page: 1, size: 50 },
      { skip: !courseId }
    );

  // Combine initial messages from API with real-time messages from WebSocket
  const allMessages = useMemo(() => {
    const initialMessages = messagesData?.data?.messages || [];
    const wsMessages = messages || [];

    console.log("🔍 Initial messages:", initialMessages.length);
    console.log("🔍 WebSocket messages:", wsMessages.length);

    // Merge and deduplicate messages by ID, but exclude pending messages
    const messageMap = new Map();

    // Add initial messages first (only real messages with ID)
    initialMessages.forEach((msg) => {
      if (msg.id && !(msg as any).tempId) {
        // Only real messages
        messageMap.set(msg.id, msg);
      }
    });

    // Add WebSocket messages (only real messages with ID)
    wsMessages.forEach((msg) => {
      if (msg.id && !(msg as any).tempId) {
        // Only real messages
        messageMap.set(msg.id, msg);
      }
    });

    // Convert back to array and sort by timestamp
    return Array.from(messageMap.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesData?.data?.messages, messages]);

  console.log(
    "🐛 All messages debug:",
    allMessages.map((msg) => ({
      id: msg.id,
      tempId: (msg as any).tempId,
      status: (msg as any).status,
      content: msg.content,
      rawMessage: msg, // Log toàn bộ object
      senderName: msg.senderName,
    }))
  );

  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();

  // Load initial messages - not needed since useChatWebSocket handles this
  // useEffect(() => {
  //   if (messagesData?.data?.content) {
  //     // Initial messages are handled by the WebSocket hook
  //   }
  // }, [messagesData]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || isSendingMessage) return;

    const tempMessage = messageText.trim();
    console.log("🚀 Sending message:", tempMessage);
    console.log("🚀 Before sending - messages count:", messages.length);

    try {
      const result = await sendMessage({
        courseId,
        content: tempMessage,
        type: "TEXT",
        tempId: uuidv4(),
      }).unwrap();

      console.log("🚀 Message sent successfully:", result);
      console.log("🚀 After sending - messages count:", messages.length);

      // Message will be added via WebSocket when received from server
      // No need for optimistic update here since WebSocket handles real-time updates
      setMessageText("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here you would typically upload the file and then send a message
    // For now, we'll just show a placeholder
    console.log("File upload:", file.name);
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Render user status component
  const renderUserStatus = () => {
    if (!userStatus) return null;

    const getStatusColor = (status: string) => {
      switch (status) {
        case "success":
          return "text-green-600";
        case "error":
          return "text-red-600";
        default:
          return "text-muted-foreground";
      }
    };

    const getStatusText = (type: string) => {
      switch (type) {
        case "MESSAGE_SENT":
          return "Message sent";
        case "MESSAGE_DELIVERED":
          return "Message delivered";
        case "MESSAGE_READ":
          return "Message read";
        default:
          return type;
      }
    };

    return (
      <div className="text-xs px-4 py-2 bg-muted/20 border-t">
        <span className={`${getStatusColor(userStatus.status)} font-medium`}>
          {getStatusText(userStatus.type)}
        </span>
        {userStatus.status === "success" && (
          <span className="text-muted-foreground ml-2">
            {formatDistanceToNow(new Date(userStatus.timestamp), {
              addSuffix: true,
            })}
          </span>
        )}
        {userStatus.error && (
          <span className="text-red-500 ml-2">Error: {userStatus.error}</span>
        )}
      </div>
    );
  };

  return (
    <Card className={`flex flex-col h-96 `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Course Chat</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "default" : "secondary"}
              className="text-xs"
            >
              {isConnected ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  {connectionState}
                </>
              )}
            </Badge>
          </div>
        </div>
        {wsError && <p className="text-sm text-red-500 mt-1">{wsError}</p>}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {isLoadingMessages ? (
                <div className="text-center text-sm text-muted-foreground">
                  Loading messages...
                </div>
              ) : allMessages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                allMessages.map((message, index) => {
                  console.log("🎯 Rendering message:", {
                    id: message.id,
                    type: message.type,
                    content: message.content,
                    senderName: message.senderName,
                    senderThumbnailUrl: message.senderThumbnailUrl,
                  });

                  return (
                    <div key={index} className="flex gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={message.senderThumbnailUrl}
                          alt={message.senderName}
                        />
                        <AvatarFallback>
                          {message.senderName?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">
                            {message.senderName}
                          </span>
                          <Badge
                            variant={
                              message.senderRole === "INSTRUCTOR"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {message.senderRole}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {/* {formatDistanceToNow(new Date(message.createdAt), {
                              addSuffix: true,
                            })} */}
                          </span>
                        </div>
                        <div className="text-sm break-words">
                          {message.type === "TEXT" ? (
                            message.content || "[No content]"
                          ) : message.type === "FILE" ? (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                              <Upload className="w-4 h-4" />
                              <a
                                href={message.fileUrl}
                                download={message.fileName}
                                className="text-blue-500 hover:underline"
                              >
                                {message.fileName}
                              </a>
                              {message.fileSize && (
                                <span className="text-xs text-muted-foreground">
                                  ({(message.fileSize / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </div>
                          ) : message.type === "AUDIO" ? (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                              <span className="text-green-600">
                                🎵 {message.fileName}
                              </span>
                              {message.duration && (
                                <span className="text-xs text-muted-foreground">
                                  ({Math.floor(message.duration / 60)}:
                                  {(message.duration % 60)
                                    .toString()
                                    .padStart(2, "0")}
                                  )
                                </span>
                              )}
                            </div>
                          ) : message.type === "VIDEO" ? (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded">
                              <span className="text-red-600">
                                🎥 {message.fileName}
                              </span>
                              {message.duration && (
                                <span className="text-xs text-muted-foreground">
                                  ({Math.floor(message.duration / 60)}:
                                  {(message.duration % 60)
                                    .toString()
                                    .padStart(2, "0")}
                                  )
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected || isSendingMessage}
              className="resize-none"
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={!isConnected}
            title="Upload file"
          >
            <Upload className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || !isConnected || isSendingMessage}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2 px-4">
            Connecting to chat server...
          </p>
        )}

        {/* User Status Display */}
        {userStatus && renderUserStatus()}
      </CardContent>
    </Card>
  );
};
