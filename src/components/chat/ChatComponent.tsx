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

interface ChatComponentProps {
  courseId: string;
  accessToken: string;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  courseId,
  accessToken,
}) => {
  const [messageText, setMessageText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // WebSocket hook with updated API
  const {
    messages,
    isConnected,
    connectionState,
    error: wsError,
    addMessage,
  } = useChatWebSocket({
    accessToken,
    courseId,
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
  });

  // RTK Query hooks
  const { data: messagesData, isLoading: isLoadingMessages } =
    useGetCourseMessagesQuery(
      { courseId, page: 0, size: 50 },
      { skip: !courseId }
    );

  // Combine initial messages from API with real-time messages from WebSocket
  const allMessages = useMemo(() => {
    const initialMessages = messagesData?.data?.content || [];
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
  }, [messagesData?.data?.content, messages]);

  console.log(
    "🐛 All messages debug:",
    allMessages.map((msg) => ({
      id: msg.id,
      tempId: (msg as any).tempId,
      status: (msg as any).status,
      content: msg.textContent || (msg as any).content,
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
        type: "text",
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

      <CardContent className="flex-1 flex flex-col p-4 pt-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 mb-4">
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
              allMessages.map((message, index) => (
                <div key={index} className="flex gap-3">
                  <Avatar className="w-8 h-8">
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
                        message.textContent
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

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
          <p className="text-xs text-muted-foreground mt-2">
            Connecting to chat server...
          </p>
        )}
      </CardContent>
    </Card>
  );
};
