import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useChatWebSocket } from "./useChatWebSocket";
import {
  useGetChatMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "@/services/chatApi";
import type {
  ChatMessage,
  SendMessageRequest,
  UpdateMessageRequest,
} from "@/types/chat";
import type { ChatMessage as WsChatMessage } from "@/services/websocket/webSocketService";

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  sendMessage: (message: Omit<SendMessageRequest, "tempId">) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessage: (messageId: string, content: string) => Promise<void>;
  loadMore: () => void;
  hasMore: boolean;
  isLoadingMore: boolean;
  reconnect: () => void;
  currentUserId?: string;
}

export const useChat = (courseId: string): UseChatReturn => {
  const { data: session } = useSession();
  const [page, setPage] = useState(0);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const messagesMapRef = useRef(new Map<string, ChatMessage>());

  // Helper function to convert WebSocket message to our ChatMessage format
  const convertWsMessage = (wsMessage: WsChatMessage): ChatMessage => ({
    id: wsMessage.id,
    courseId: wsMessage.courseId,
    senderId: wsMessage.senderId,
    senderName: wsMessage.senderName,
    senderRole: wsMessage.senderRole,
    type: wsMessage.type.toLowerCase() as "text" | "file" | "video" | "audio",
    content: wsMessage.textContent,
    textContent: wsMessage.textContent,
    fileUrl: wsMessage.fileUrl,
    fileName: wsMessage.fileName,
    fileSize: wsMessage.fileSize,
    duration: wsMessage.duration,
    thumbnailUrl: wsMessage.thumbnailUrl,
    createdAt: wsMessage.createdAt,
  });

  // API queries and mutations
  const {
    data: messagesResponse,
    isLoading,
    error: apiError,
    refetch,
  } = useGetChatMessagesQuery({ courseId, page, size: 50 });

  const [sendMessageMutation] = useSendMessageMutation();
  const [deleteMessageMutation] = useDeleteMessageMutation();
  const [updateMessageMutation] = useUpdateMessageMutation();

  // WebSocket connection
  const {
    messages: wsMessages,
    isConnected,
    error: wsError,
    addMessage: addWsMessage,
    reconnect: wsReconnect,
  } = useChatWebSocket({
    accessToken: (session as any)?.accessToken || "",
    courseId,
    autoConnect: !!(session as any)?.accessToken,
  });

  // Handle API messages
  useEffect(() => {
    if (messagesResponse?.data?.messages) {
      const apiMessages = messagesResponse.data.messages;

      // Update messages map
      apiMessages.forEach((msg) => {
        messagesMapRef.current.set(msg.id, msg);
      });

      if (page === 0) {
        // First page - replace all messages
        setAllMessages(apiMessages);
      } else {
        // Subsequent pages - prepend older messages
        setAllMessages((prev) => [...apiMessages, ...prev]);
      }

      // Update hasMore based on pagination
      setHasMore(
        messagesResponse.data.page < messagesResponse.data.totalPages - 1
      );
    }
  }, [messagesResponse, page]);

  // Handle WebSocket messages (new messages from other users)
  useEffect(() => {
    if (wsMessages.length > 0) {
      const latestWsMessage = wsMessages[wsMessages.length - 1];
      const convertedMessage = convertWsMessage(latestWsMessage);

      // Only add if it's not already in our messages map (avoid duplicates)
      if (!messagesMapRef.current.has(convertedMessage.id)) {
        messagesMapRef.current.set(convertedMessage.id, convertedMessage);
        setAllMessages((prev) => [...prev, convertedMessage]);
      } else {
        // Update existing message if it exists (for status updates)
        setAllMessages((prev) =>
          prev.map((msg) =>
            msg.id === convertedMessage.id ? convertedMessage : msg
          )
        );
        messagesMapRef.current.set(convertedMessage.id, convertedMessage);
      }
    }
  }, [wsMessages]);

  // Send message function
  const sendMessage = useCallback(
    async (message: Omit<SendMessageRequest, "tempId">) => {
      if (!session?.user?.id) return;

      const tempId = `temp-${Date.now()}-${Math.random()}`;

      try {
        // Create optimistic message
        const optimisticMessage: ChatMessage = {
          id: tempId,
          courseId,
          senderId: session.user.id,
          senderName: session.user.name || "You",
          senderRole: "STUDENT", // Assuming student role
          type: message.type,
          content: message.content,
          textContent: message.content,
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          mimeType: message.mimeType,
          thumbnailUrl: message.thumbnailUrl,
          duration: message.duration,
          resolution: message.resolution,
          createdAt: new Date().toISOString(),
          tempId,
          status: "PENDING",
        };

        // Add optimistic message immediately
        setAllMessages((prev) => [...prev, optimisticMessage]);
        messagesMapRef.current.set(tempId, optimisticMessage);

        // Send to API
        const response = await sendMessageMutation({
          courseId,
          message: { ...message, tempId },
        }).unwrap();

        // Update message status based on response
        if (response.status === "PENDING") {
          setAllMessages((prev) =>
            prev.map((msg) =>
              msg.tempId === tempId ? { ...msg, status: "PENDING" } : msg
            )
          );
        }
      } catch (error) {
        console.error("Failed to send message:", error);

        // Mark message as failed
        setAllMessages((prev) =>
          prev.map((msg) =>
            msg.tempId === tempId ? { ...msg, status: "FAILED" } : msg
          )
        );
      }
    },
    [courseId, session, sendMessageMutation]
  );

  // Delete message function
  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        await deleteMessageMutation({ courseId, messageId }).unwrap();

        // Optimistically remove from UI
        setAllMessages((prev) => prev.filter((msg) => msg.id !== messageId));
        messagesMapRef.current.delete(messageId);
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    },
    [courseId, deleteMessageMutation]
  );

  // Update message function
  const updateMessage = useCallback(
    async (messageId: string, content: string) => {
      try {
        const updatedMessage = await updateMessageMutation({
          courseId,
          messageId,
          message: { type: "TEXT", content },
        }).unwrap();

        // Update in UI
        setAllMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? updatedMessage : msg))
        );
        messagesMapRef.current.set(messageId, updatedMessage);
      } catch (error) {
        console.error("Failed to update message:", error);
      }
    },
    [courseId, updateMessageMutation]
  );

  // Load more messages (pagination)
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, isLoading]);

  // Reconnect function
  const reconnect = useCallback(() => {
    wsReconnect();
    refetch();
  }, [wsReconnect, refetch]);

  return {
    messages: allMessages,
    isLoading: isLoading && page === 0,
    isLoadingMore: isLoading && page > 0,
    isConnected,
    error: apiError ? "Failed to load messages" : wsError,
    sendMessage,
    deleteMessage,
    updateMessage,
    loadMore,
    hasMore,
    reconnect,
    currentUserId: session?.user?.id,
  };
};
