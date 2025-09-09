"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useChatInfiniteScroll } from "@/hooks/useChatInfiniteScroll";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import {
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
import { useSession } from "next-auth/react";
import { validateFile, formatFileSize } from "@/lib/websocket/config";
import { toast } from "sonner";

interface ChatProps {
  courseId: string;
  courseTitle?: string;
  onClose: () => void;
  isMobile?: boolean;
}

const Chat: React.FC<ChatProps> = ({
  courseId,
  courseTitle,
  onClose,
  isMobile = false,
}) => {
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
  const [isInitializing, setIsInitializing] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: session } = useSession();

  if (!session?.user?.accessToken || !courseId) {
    return null;
  }

  const currentUserId = session.user.id;

  const {
    messages: loadedMessages,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
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
    enabled: true,
  });

  const { setAutoScrolling } = useInfiniteScroll(scrollAreaRef, {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold: 100,
    disabled: infiniteScrollDisabled,
  });

  const {
    messages: wsMessages,
    isConnected,
    connectionState,
    error: wsError,
    userStatus,
  } = useChatWebSocket({
    accessToken: session.user.accessToken,
    courseId,
    userId: userId || undefined,
    autoConnect: true,
    onUserStatus: (status: UserStatusMessage) => {
      if (status.type === "MESSAGE_SENT" && status.status === "success") {
        setPendingMessages((prev) =>
          prev.filter((p) => p.tempId !== status.messageId)
        );
      } else if (status.status === "error") {
        setPendingMessages((prev) =>
          prev.map((p) =>
            p.tempId === status.messageId ? { ...p, status: "ERROR" } : p
          )
        );
      }
    },
    onReconnect: () => {
      setPendingMessages((prev) => prev.filter((p) => p.status !== "SUCCESS"));
    },
  });

  const allMessages = useMemo(() => {
    const combinedMessages = [...loadedMessages];
    if (wsMessages && wsMessages.length > 0) {
      const loadedMessageIds = new Set(loadedMessages.map((m) => m.id));
      wsMessages.forEach((wsMsg) => {
        if (wsMsg.id && !loadedMessageIds.has(wsMsg.id)) {
          combinedMessages.unshift(wsMsg);
        }
      });
    }

    const pendingWithoutDuplicates = pendingMessages.filter(
      (pending) => !combinedMessages.some((msg) => msg.id === pending.id)
    );

    return [...combinedMessages, ...pendingWithoutDuplicates].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [loadedMessages, wsMessages, pendingMessages]);

  useEffect(() => {
    if (wsMessages && wsMessages.length > 0) {
      const latestWsMessage = wsMessages[wsMessages.length - 1];
      if (latestWsMessage?.id) {
        addNewMessage(latestWsMessage);
        setShouldScrollToBottom(true);
      }
    }
  }, [wsMessages, addNewMessage]);

  useEffect(() => {
    resetMessages();
    setIsInitializing(true);
    // Clear initializing state when we have data or finish loading
    const timer = setTimeout(() => setIsInitializing(false), 300);
    return () => clearTimeout(timer);
  }, [courseId, resetMessages]);

  useEffect(() => {
    if (isInitialized || !isLoading) {
      setIsInitializing(false);
    }
  }, [isInitialized, isLoading]);

  const [sendMessage, { isLoading: isSendingMessage }] =
    useSendMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  useEffect(() => {
    if (allMessages.length > 0 && shouldScrollToBottom) {
      setAutoScrolling(true);
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
          setShouldScrollToBottom(false);
        }
      }, 300);
    }
  }, [allMessages.length, shouldScrollToBottom, setAutoScrolling]);

  useEffect(() => {
    if (isInitialized && allMessages.length > 0 && !shouldScrollToBottom) {
      const isFirstLoad = allMessages.length <= 20;
      if (isFirstLoad) {
        setAutoScrolling(true);
        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
              behavior: "instant" as any,
            });
          }
        }, 200);
      }
    }
  }, [
    isInitialized,
    allMessages.length,
    shouldScrollToBottom,
    setAutoScrolling,
  ]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || isSendingMessage) return;

    try {
      await sendMessage({
        courseId,
        content: messageText.trim(),
        type: "TEXT",
        tempId: uuidv4(),
      }).unwrap();
      setMessageText("");
    } catch (error) {
      console.error("❌ Failed to send message:", error);
    }
  };

  const handleEditMessage = async (messageId: string) => {
    if (!editingText.trim()) return;
    setUpdatingMessages((prev) => new Set(prev).add(messageId));

    try {
      updateInfiniteScrollMessage(messageId, { content: editingText.trim() });
      const result = await updateMessage({
        courseId,
        messageId,
        type: "TEXT",
        content: editingText.trim(),
      }).unwrap();
      setEditingMessageId(null);
      setEditingText("");
      if (result?.data) updateInfiniteScrollMessage(messageId, result.data);
    } catch (error) {
      console.error("❌ Failed to update message:", error);
    } finally {
      setUpdatingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setDeletingMessages((prev) => new Set(prev).add(messageId));

    try {
      removeMessage(messageId);
      await deleteMessage({ courseId, messageId }).unwrap();
    } catch (error) {
      console.error("❌ Failed to delete message:", error);
      setDeletingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(messageId);
        return newSet;
      });
    }

    setDeletingMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(`File error: ${validation.error}`);
      return;
    }

    const tempId = uuidv4();

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const uploadToCloudinary = async (file: File): Promise<string> => {
      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary config missing (NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)"
        );
      }

      const isImage = file.type.startsWith("image/");
      const endpoint = isImage
        ? `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
        : `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);

      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          `Cloudinary upload failed: ${res.status} ${JSON.stringify(err)}`
        );
      }

      const data = await res.json();
      const fileUrl = (data.secure_url || data.url) as string;

      try {
        await sendMessage({
          courseId,
          tempId,
          type: "FILE",
          fileUrl,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        }).unwrap();
      } catch (error) {
        console.error("Failed to send file message after upload:", error);
        setPendingMessages((prev) =>
          prev.map((m) => (m.tempId === tempId ? { ...m, status: "ERROR" } : m))
        );
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      return fileUrl;
    };

    uploadToCloudinary(file).catch((err) => {
      console.error("File upload failed:", err);
      setPendingMessages((prev) =>
        prev.map((m) => (m.tempId === tempId ? { ...m, status: "ERROR" } : m))
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const startEditing = (message: ChatMessage) => {
    if (message.type.toUpperCase() !== "TEXT") {
      toast.error("Only text messages can be edited.");
      return;
    }

    setEditingMessageId(message.id);
    setEditingText(message.content || "");
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

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

  const isCurrentUser = (message: ChatMessage) =>
    message.senderId === currentUserId;

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
          <Avatar
            className={cn("flex-shrink-0", isMobile ? "w-7 h-7" : "w-8 h-8")}
          >
            <AvatarImage
              src={message.senderThumbnailUrl}
              alt={message.senderName}
            />
            <AvatarFallback className={cn(isMobile ? "text-xs" : "text-xs")}>
              {message.senderName?.charAt(0)?.toUpperCase() || "Y"}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "flex flex-col",
            isMobile ? "max-w-[85%]" : "max-w-[80%]",
            isOwn && "items-end"
          )}
        >
          {!isOwn && (
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "font-medium text-muted-foreground",
                  isMobile ? "text-xs" : "text-xs"
                )}
              >
                {message.senderName}
              </span>
              <Badge
                variant={
                  message.senderRole === "INSTRUCTOR" ? "default" : "secondary"
                }
                className={cn(isMobile ? "text-xs px-1.5 py-0.5" : "text-xs")}
              >
                {message.senderRole}
              </Badge>
            </div>
          )}

          <div className="relative">
            {editingMessageId === message.id ? (
              <div
                className={cn(
                  "bg-muted rounded-2xl",
                  isMobile ? "p-2.5" : "p-3"
                )}
              >
                <Textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className={cn(
                    "mb-2 resize-none",
                    isMobile ? "min-h-[50px] text-sm" : "min-h-[60px]"
                  )}
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
                    "rounded-2xl shadow-sm relative",
                    isMobile ? "p-2.5" : "p-3",
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
                    <div
                      className={cn(
                        "whitespace-pre-wrap break-words",
                        isMobile ? "text-sm" : "text-sm"
                      )}
                    >
                      {message.content || "[No content available]"}
                      {isPending && (
                        <span
                          className={cn(
                            "opacity-70 ml-2",
                            isMobile ? "text-xs" : "text-xs"
                          )}
                        >
                          sending...
                        </span>
                      )}
                      {isUpdating && (
                        <span
                          className={cn(
                            "opacity-70 ml-2",
                            isMobile ? "text-xs" : "text-xs"
                          )}
                        >
                          updating...
                        </span>
                      )}
                      {isDeleting && (
                        <span
                          className={cn(
                            "opacity-70 ml-2",
                            isMobile ? "text-xs" : "text-xs"
                          )}
                        >
                          deleting...
                        </span>
                      )}
                      {isError && (
                        <span
                          className={cn(
                            "text-red-600 ml-2",
                            isMobile ? "text-xs" : "text-xs"
                          )}
                        >
                          failed
                        </span>
                      )}
                    </div>
                  ) : message.type.toUpperCase() === "FILE" ? (
                    <div className="max-w-xs">
                      {(() => {
                        const mimeType = message.mimeType?.toLowerCase() || "";
                        const fileName = message.fileName || "Unknown file";
                        const isImage =
                          mimeType.startsWith("image/") ||
                          /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);
                        const isPdf =
                          mimeType === "application/pdf" ||
                          fileName.toLowerCase().endsWith(".pdf");
                        const isDoc =
                          mimeType.includes("document") ||
                          mimeType.includes("word") ||
                          mimeType.includes("msword") ||
                          /\.(doc|docx|txt|rtf)$/i.test(fileName);

                        if (isImage) {
                          return (
                            <div className="space-y-2">
                              {message.fileUrl && (
                                <div className="relative rounded-lg overflow-hidden bg-background/10">
                                  <img
                                    src={
                                      message.thumbnailUrl || message.fileUrl
                                    }
                                    alt={fileName}
                                    className="max-w-full h-auto max-h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() =>
                                      window.open(message.fileUrl, "_blank")
                                    }
                                  />
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                    <button className="bg-black/50 text-white px-2 py-1 rounded text-xs hover:bg-black/70 transition-colors">
                                      Click to view full size
                                    </button>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-2 p-2 bg-background/10 rounded-lg">
                                <div className="text-lg">�️</div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs truncate">
                                    {fileName}
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
                                    className="text-current hover:bg-background/20 h-8 w-8 p-0"
                                  >
                                    <a
                                      href={message.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Download image"
                                    >
                                      <Download className="w-3 h-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        } else if (isPdf) {
                          return (
                            <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
                              <div className="text-2xl">📄</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {fileName}
                                </div>
                                <div className="text-xs opacity-70 flex items-center gap-1">
                                  <span>PDF Document</span>
                                  {message.fileSize && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {formatFileSize(message.fileSize)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {message.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                  className="text-current hover:bg-background/20"
                                >
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open PDF in new tab"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          );
                        } else if (isDoc) {
                          return (
                            <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
                              <div className="text-2xl">📝</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {fileName}
                                </div>
                                <div className="text-xs opacity-70 flex items-center gap-1">
                                  <span>Document</span>
                                  {message.fileSize && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {formatFileSize(message.fileSize)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {message.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                  className="text-current hover:bg-background/20"
                                >
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Download document"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          );
                        } else {
                          return (
                            <div className="flex items-center gap-3 p-3 bg-background/10 rounded-lg border">
                              <div className="text-2xl">📎</div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {fileName}
                                </div>
                                <div className="text-xs opacity-70 flex items-center gap-1">
                                  <span>File</span>
                                  {message.fileSize && (
                                    <>
                                      <span>•</span>
                                      <span>
                                        {formatFileSize(message.fileSize)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {message.fileUrl && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  asChild
                                  className="text-current hover:bg-background/20"
                                >
                                  <a
                                    href={message.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Download file"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          );
                        }
                      })()}
                    </div>
                  ) : null}
                </div>

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

          <span
            className={cn(
              "text-muted-foreground mt-1",
              isMobile ? "text-xs" : "text-xs"
            )}
          >
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {isOwn && (
          <Avatar
            className={cn("flex-shrink-0", isMobile ? "w-7 h-7" : "w-8 h-8")}
          >
            <AvatarImage
              src={message.senderThumbnailUrl}
              alt={message.senderName}
            />
            <AvatarFallback
              className={cn(
                "bg-blue-500 text-white",
                isMobile ? "text-xs" : "text-xs"
              )}
            >
              {message.senderName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "flex flex-col shadow-none border-0 gap-0 py-0",
        // Remove fixed sizing and let parent control size
        "w-full h-full"
      )}
    >
      <CardHeader
        className={cn(
          "border-b bg-gray-100 !gap-0",
          // Responsive padding
          isMobile ? "px-4 pt-[14px] !pb-[14px]" : "px-6 pt-[14px] !pb-[14px]"
        )}
      >
        <div className="flex items-center justify-between">
          <CardTitle
            className={cn("line-clamp-1", isMobile ? "text-base" : "text-lg")}
          >
            {courseTitle || "Course Chat"}
            {isInitializing && (
              <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={isConnected ? "completed" : "destructive"}
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
            {!isMobile && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        {wsError && <p className="text-sm text-red-500 mt-1">{wsError}</p>}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <ScrollArea
            className={cn("h-full", isMobile ? "p-3" : "px-4")}
            ref={scrollAreaRef}
          >
            <div
              className={cn("space-y-3", isMobile ? "space-y-2" : "space-y-4")}
              ref={scrollAreaViewportRef}
            >
              {isFetchingNextPage && (
                <div className="text-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Loading older messages...
                  </p>
                </div>
              )}

              {!hasNextPage && allMessages.length > 0 && (
                <div className="text-center py-2">
                  <p className="text-xs text-muted-foreground">
                    No more messages
                  </p>
                </div>
              )}

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <div className="text-base font-medium text-gray-900 mb-2">
                    Loading messages...
                  </div>
                  <div className="text-sm text-gray-500">
                    Please wait while we fetch your chat history
                  </div>
                </div>
              ) : allMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-base font-medium text-gray-900 mb-2">
                    No messages yet
                  </div>
                  <div className="text-sm text-gray-500">
                    Start the conversation! Type a message below.
                  </div>
                </div>
              ) : (
                [...allMessages]
                  .reverse()
                  .map((message) => renderMessage(message))
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        <div className={cn("border-t bg-white", isMobile ? "p-3" : "p-4")}>
          <div className="flex gap-2">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={!isConnected || isSendingMessage}
                className={cn(
                  "resize-none border-gray-200 focus:border-primary",
                  isMobile
                    ? "min-h-[36px] max-h-24 text-sm"
                    : "min-h-[40px] max-h-32"
                )}
                rows={1}
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt,.rtf"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={!isConnected}
                title="Upload file"
                className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}
              >
                <Upload className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={
                  !messageText.trim() || !isConnected || isSendingMessage
                }
                size="icon"
                className={cn(isMobile ? "h-9 w-9" : "h-10 w-10")}
              >
                <Send className={cn(isMobile ? "w-3.5 h-3.5" : "w-4 h-4")} />
              </Button>
            </div>
          </div>

          {!isConnected && (
            <p
              className={cn(
                "text-muted-foreground mt-2 px-2",
                isMobile ? "text-xs" : "text-xs"
              )}
            >
              Connecting to chat server...
            </p>
          )}
          {userStatus && renderUserStatus()}
        </div>
      </CardContent>
    </Card>
  );
};

export default Chat;
