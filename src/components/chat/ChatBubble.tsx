"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useChatInfiniteScroll } from "@/hooks/useChatInfiniteScroll";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
  useGetCourseMessagesQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} from "@/services/websocket/chatApi";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Upload,
  Wifi,
  WifiOff,
  MessageCircle,
  Minimize2,
  Edit2,
  Trash2,
  X,
  Check,
  Download,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { ChatMessage, UserStatusMessage } from "@/types/chat";
import { useAuth } from "@/hooks/useAuth";
import { getSession } from "next-auth/react";

interface ChatBubbleProps {
  courseId: string;
  accessToken: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  courseId,
  accessToken,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [deletingMessages, setDeletingMessages] = useState<Set<string>>(
    new Set()
  );
  const [updatingMessages, setUpdatingMessages] = useState<Set<string>>(
    new Set()
  );
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get current user info
  const { user } = useAuth();
  const currentUserId = user?.id;

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

  // Infinite scroll hook for loading messages
  const {
    messages: loadedMessages,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    error,
    fetchNextPage,
    resetMessages,
    addNewMessage,
    updateMessage: updateInfiniteScrollMessage,
    removeMessage,
    isInitialized,
    infiniteScrollDisabled,
  } = useChatInfiniteScroll({
    courseId,
    pageSize: 20,
    enabled: isOpen,
  });

  // Setup infinite scroll
  const { setAutoScrolling } = useInfiniteScroll(scrollAreaRef, {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 100,
    disabled: infiniteScrollDisabled,
  });

  // WebSocket hook
  const {
    messages: wsMessages,
    isConnected,
    connectionState,
    error: wsError,
    userStatus,
  } = useChatWebSocket({
    accessToken,
    courseId,
    userId: userId || undefined,
    autoConnect: isOpen,
    onConnect: () => {
      console.log("Chat bubble connected for course:", courseId);
    },
    onDisconnect: () => {
      console.log("Chat bubble disconnected for course:", courseId);
    },
    onError: (error: any) => {
      console.error("Chat bubble WebSocket error:", error);
    },
    onUserStatus: (status: UserStatusMessage) => {
      console.log("Chat bubble user status update:", status);
      // Handle different status types
      if (status.type === "MESSAGE_SENT" && status.status === "success") {
        console.log("Chat bubble message sent successfully:", status.messageId);
        // Remove pending message on success
        setPendingMessages((prev) =>
          prev.filter((pending) => pending.tempId !== status.messageId)
        );
      } else if (status.status === "error") {
        console.error("Chat bubble message error:", status.error);
        // Mark pending message as error
        setPendingMessages((prev) =>
          prev.map((pending) =>
            pending.tempId === status.messageId
              ? { ...pending, status: "ERROR" }
              : pending
          )
        );
      }
    },
    onReconnect: () => {
      // Remove pending message if this is a confirmation
      setPendingMessages((prev) =>
        prev.filter((pending) => pending.status !== "SUCCESS")
      );
    },
  });

  // Combine loaded messages with WebSocket messages
  const allMessages = useMemo(() => {
    // Start with loaded messages (from infinite scroll)
    const combinedMessages = [...loadedMessages];

    // Add new WebSocket messages that aren't already in loaded messages
    if (wsMessages && wsMessages.length > 0) {
      const loadedMessageIds = new Set(loadedMessages.map((msg) => msg.id));

      wsMessages.forEach((wsMsg) => {
        if (wsMsg.id && !loadedMessageIds.has(wsMsg.id)) {
          // Add new message at the beginning (newest first in display order)
          combinedMessages.unshift(wsMsg);
        }
      });
    }

    // Add pending messages
    const pendingWithoutDuplicates = pendingMessages.filter(
      (pending) => !combinedMessages.some((msg) => msg.id === pending.id)
    );

    // Sort by createdAt (newest first for display)
    return [...combinedMessages, ...pendingWithoutDuplicates].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [loadedMessages, wsMessages, pendingMessages]);

  // Handle new WebSocket messages
  useEffect(() => {
    if (wsMessages && wsMessages.length > 0) {
      const latestWsMessage = wsMessages[wsMessages.length - 1];
      if (latestWsMessage?.id) {
        addNewMessage(latestWsMessage);
        // Auto scroll to bottom for new messages
        setShouldScrollToBottom(true);
      }
    }
  }, [wsMessages, addNewMessage]);

  // Reset messages when course changes or chat opens
  useEffect(() => {
    if (isOpen) {
      resetMessages();
      // Don't auto scroll immediately, wait for messages to load
    }
  }, [courseId, isOpen, resetMessages]);

  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  // Auto scroll to bottom only when necessary
  useEffect(() => {
    if (isOpen && allMessages.length > 0 && shouldScrollToBottom) {
      // Mark as auto scrolling
      setAutoScrolling(true);

      // Wait for DOM to update
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          setShouldScrollToBottom(false);
        }
      }, 300); // Longer delay to avoid triggering infinite scroll
    }
  }, [allMessages.length, shouldScrollToBottom, isOpen, setAutoScrolling]);

  // Auto scroll when first opening chat (after messages loaded)
  useEffect(() => {
    if (
      isOpen &&
      isInitialized &&
      allMessages.length > 0 &&
      !shouldScrollToBottom
    ) {
      // Only scroll to bottom on first load
      const isFirstLoad = allMessages.length <= 20; // Assuming first load is ≤ 20 messages
      if (isFirstLoad) {
        setAutoScrolling(true);
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "instant" }); // Instant to avoid triggering scroll events
          }
        }, 200); // Shorter delay for first load
      }
    }
  }, [isOpen, isInitialized, allMessages.length, setAutoScrolling]);

  // Debug infinite scroll state
  useEffect(() => {
    console.log("🔍 Infinite scroll state:", {
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      loadedMessagesCount: loadedMessages.length,
      allMessagesCount: allMessages.length,
      isOpen,
    });
  }, [
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    loadedMessages.length,
    allMessages.length,
    isOpen,
  ]);

  // Auto resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!messageText.trim() || isSendingMessage) return;

    const tempMessage = messageText.trim();
    console.log("🚀 Sending message:", tempMessage);
    console.log(
      "🚀 Before sending - wsMessages count:",
      wsMessages?.length || 0
    );

    try {
      const result = await sendMessage({
        courseId,
        content: tempMessage,
        type: "TEXT",
        tempId: uuidv4(),
      }).unwrap();

      console.log("🚀 Message sent successfully:", result);
      console.log(
        "🚀 After sending - wsMessages count:",
        wsMessages?.length || 0
      );

      // Message will be added via WebSocket when received from server
      // No need for optimistic update here since WebSocket handles real-time updates
      setMessageText("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  // Handle edit message
  const handleEditMessage = async (messageId: string) => {
    if (!editingText.trim()) return;

    // Add to updating messages for optimistic update
    setUpdatingMessages((prev) => new Set(prev).add(messageId));

    try {
      // Optimistically update local messages first
      updateInfiniteScrollMessage(messageId, { content: editingText.trim() });

      const result = await updateMessage({
        courseId,
        messageId,
        type: "TEXT",
        content: editingText.trim(),
      }).unwrap();

      console.log("✅ Message updated successfully:", result);
      setEditingMessageId(null);
      setEditingText("");

      // Ensure hook cache is in sync (in case server returns different data)
      if (result?.data) {
        updateInfiniteScrollMessage(messageId, result.data);
      }
    } catch (error) {
      console.error("❌ Failed to update message:", error);
    } finally {
      // Remove from updating messages
      setUpdatingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId: string) => {
    // Add to deleting messages for optimistic update
    setDeletingMessages((prev) => new Set(prev).add(messageId));

    try {
      // Optimistically remove from local messages first
      removeMessage(messageId);

      const result = await deleteMessage({ courseId, messageId }).unwrap();
      console.log("✅ Message deleted successfully:", result);

      // If server did not actually delete, we could re-add or refetch, but
      // assume success; RTK Query cache will sync on its own
    } catch (error) {
      console.error("❌ Failed to delete message:", error);
      // Remove from deleting messages if error occurred
      setDeletingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
    // Remove from deletingMessages on success
    setDeletingMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // TODO: Implement file upload
    console.log("File upload:", file.name);
  };

  // Handle key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const startEditing = (message: ChatMessage) => {
    // Only allow editing TEXT messages
    if (message.type.toUpperCase() !== "TEXT") {
      console.warn("Only TEXT messages can be edited");
      return;
    }

    setEditingMessageId(message.id);
    setEditingText(message.content || "");
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  // Check if message can be edited (only TEXT messages by current user)
  const canEditMessage = (message: ChatMessage) => {
    return (
      isCurrentUser(message) &&
      message.type.toUpperCase() === "TEXT" &&
      message.status !== "PENDING" &&
      message.status !== "ERROR" &&
      !updatingMessages.has(message.id) &&
      !deletingMessages.has(message.id)
    );
  };

  const formatFileSize = (bytes: number): string => {
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const isCurrentUser = (message: ChatMessage) => {
    return message.senderId === currentUserId;
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
      <div className="text-xs px-2 py-1 bg-muted/20 border-t">
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

  const renderMessage = (message: ChatMessage) => {
    const isOwn = isCurrentUser(message);
    const isPending = (message as ChatMessage).status === "PENDING";
    const isError = (message as ChatMessage).status === "ERROR";
    const isDeleting = deletingMessages.has(message.id);
    const isUpdating = updatingMessages.has(message.id);

    return (
      <div
        key={message.id || (message as ChatMessage).tempId}
        className={cn(
          "flex gap-2 group transition-opacity duration-200",
          isOwn ? "justify-end" : "justify-start",
          isDeleting && "opacity-50 pointer-events-none"
        )}
      >
        {!isOwn && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage
              src={message.senderThumbnailUrl}
              alt={message.senderName}
            />
            <AvatarFallback className="text-xs">
              {message.senderName?.charAt(0)?.toUpperCase() || "Y"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className={cn("flex flex-col max-w-[80%]", isOwn && "items-end")}>
          {/* Sender info */}
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {message.senderName}
              </span>
              <Badge
                variant={
                  message.senderRole === "INSTRUCTOR" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {message.senderRole}
              </Badge>
            </div>
          )}

          {/* Message bubble */}
          <div className="relative">
            {editingMessageId === message.id ? (
              <div className="p-3 bg-muted rounded-2xl">
                <Textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="min-h-[60px] mb-2 resize-none"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={cancelEditing}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleEditMessage(message.id)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "p-3 rounded-2xl shadow-sm relative",
                    message.type.toUpperCase() === "TEXT" &&
                      (isOwn
                        ? "bg-blue-500 text-white"
                        : "bg-muted text-foreground"),
                    isPending && "opacity-70",
                    isError && "bg-red-100 border border-red-300",
                    isUpdating && "opacity-70"
                  )}
                >
                  {message.type.toUpperCase() === "TEXT" ? (
                    <div className="text-sm whitespace-pre-wrap break-words">
                      {(() => {
                        return message.content || "[No content available]";
                      })()}
                      {isPending && (
                        <span className="text-xs opacity-70 ml-2">
                          sending...
                        </span>
                      )}
                      {isUpdating && (
                        <span className="text-xs opacity-70 ml-2">
                          updating...
                        </span>
                      )}
                      {isDeleting && (
                        <span className="text-xs opacity-70 ml-2">
                          deleting...
                        </span>
                      )}
                      {isError && (
                        <span className="text-xs text-red-600 ml-2">
                          failed
                        </span>
                      )}
                    </div>
                  ) : message.type.toUpperCase() === "FILE" ? (
                    <div className="flex items-center gap-3 p-2 bg-background/10 rounded-lg">
                      <div className="text-2xl">📎</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {message.fileName}
                        </div>
                        {message.fileSize && (
                          <div className="text-xs opacity-70">
                            {formatFileSize(message.fileSize)}
                          </div>
                        )}
                      </div>
                      {message.fileUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                          className="text-current hover:bg-background/20"
                        >
                          <a href={message.fileUrl} download={message.fileName}>
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ) : message.type.toUpperCase() === "AUDIO" ? (
                    <div className="flex items-center gap-3 p-2">
                      <span className="text-2xl">🎵</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {message.fileName}
                        </div>
                        {message.duration && (
                          <div className="text-xs opacity-70">
                            {Math.floor(message.duration / 60)}:
                            {(message.duration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : message.type.toUpperCase() === "VIDEO" ? (
                    <div className="flex items-center gap-3 p-2">
                      <span className="text-2xl">🎥</span>
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {message.fileName}
                        </div>
                        {message.duration && (
                          <div className="text-xs opacity-70">
                            {Math.floor(message.duration / 60)}:
                            {(message.duration % 60)
                              .toString()
                              .padStart(2, "0")}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Message actions */}
                {canEditMessage(message) && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 right-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-6 w-6 p-0 rounded-full"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => startEditing(message)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteMessage(message.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {isOwn && (
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage
              src={message.senderThumbnailUrl}
              alt={message.senderName}
            />
            <AvatarFallback className="text-xs bg-blue-500 text-white">
              {message.senderName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat bubble trigger */}
      {!isOpen && (
        <Button
          onClick={toggleOpen}
          size="lg"
          className="h-16 w-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-blue-500 hover:bg-blue-600"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card className="w-96 h-[32rem] flex flex-col shadow-2xl">
          <CardHeader className="pb-3 border-b">
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
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleOpen}
                  className="h-8 w-8 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {wsError && <p className="text-sm text-red-500 mt-1">{wsError}</p>}
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                <div className="space-y-4" ref={scrollAreaViewportRef}>
                  {/* Loading indicator for fetching older messages */}
                  {isFetchingNextPage && (
                    <div className="text-center py-2">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Loading older messages...
                      </p>
                    </div>
                  )}

                  {/* No more messages indicator */}
                  {!hasNextPage && allMessages.length > 0 && (
                    <div className="text-center py-2">
                      <p className="text-xs text-muted-foreground">
                        No more messages
                      </p>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="text-center text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                      Loading messages...
                    </div>
                  ) : allMessages.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    // Reverse messages for display (oldest to newest)
                    [...allMessages]
                      .reverse()
                      .map((message) => renderMessage(message))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Type your message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!isConnected || isSendingMessage}
                    className="min-h-[40px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!isConnected}
                    title="Upload file"
                    className="h-10 w-10"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={handleSendMessage}
                    disabled={
                      !messageText.trim() || !isConnected || isSendingMessage
                    }
                    size="icon"
                    className="h-10 w-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Connection Status */}
              {!isConnected && (
                <p className="text-xs text-muted-foreground mt-2 px-2">
                  Connecting to chat server...
                </p>
              )}

              {/* User Status Display */}
              {userStatus && renderUserStatus()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
