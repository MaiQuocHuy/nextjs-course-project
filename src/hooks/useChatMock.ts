import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
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
import { mockChatMessages } from "@/lib/mockChatData";

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

// Mock WebSocket connection - always connected for development
const MOCK_WEBSOCKET = process.env.NODE_ENV === "development";

export const useChatMock = (courseId: string): UseChatReturn => {
  const { data: session } = useSession();
  const [page, setPage] = useState(0);
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isConnected, setIsConnected] = useState(MOCK_WEBSOCKET);
  const messagesMapRef = useRef(new Map<string, ChatMessage>());

  // Initialize with mock data in development
  useEffect(() => {
    if (MOCK_WEBSOCKET && allMessages.length === 0) {
      setAllMessages(mockChatMessages);
      mockChatMessages.forEach((msg) => {
        messagesMapRef.current.set(msg.id, msg);
      });
      setHasMore(false); // No pagination for mock data
    }
  }, [allMessages.length]);

  // API queries and mutations (disabled in mock mode)
  const {
    data: messagesResponse,
    isLoading,
    error: apiError,
    refetch,
  } = useGetChatMessagesQuery(
    { courseId, page, size: 50 },
    { skip: MOCK_WEBSOCKET || !session?.user?.id }
  );

  const [sendMessageMutation] = useSendMessageMutation();
  const [deleteMessageMutation] = useDeleteMessageMutation();
  const [updateMessageMutation] = useUpdateMessageMutation();

  // Mock WebSocket connection status
  useEffect(() => {
    if (MOCK_WEBSOCKET) {
      setIsConnected(true);
    } else if (session?.user?.id) {
      setIsConnected(true);
    }
  }, [session?.user?.id]);

  // Handle API messages (only when not in mock mode)
  useEffect(() => {
    if (!MOCK_WEBSOCKET && messagesResponse?.data?.messages) {
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

  // Send message function
  const sendMessage = useCallback(
    async (message: Omit<SendMessageRequest, "tempId">) => {
      // Create a mock user session if none exists
      const currentUserId = session?.user?.id || "current-user";
      const currentUserName = session?.user?.name || "You";

      const tempId = `temp-${Date.now()}-${Math.random()}`;

      try {
        // Create optimistic message
        const optimisticMessage: ChatMessage = {
          id: tempId,
          courseId,
          senderId: currentUserId,
          senderName: currentUserName,
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

        if (MOCK_WEBSOCKET) {
          // Mock success after delay for demo
          setTimeout(() => {
            const successMessage = {
              ...optimisticMessage,
              id: `msg-${Date.now()}`,
              status: "SENT" as const,
              tempId: undefined,
            };

            setAllMessages((prev) =>
              prev.map((msg) => (msg.tempId === tempId ? successMessage : msg))
            );
            messagesMapRef.current.set(successMessage.id, successMessage);
            messagesMapRef.current.delete(tempId);
          }, 1000);
        } else {
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
        if (MOCK_WEBSOCKET) {
          // Mock delete
          setAllMessages((prev) => prev.filter((msg) => msg.id !== messageId));
          messagesMapRef.current.delete(messageId);
        } else {
          await deleteMessageMutation({ courseId, messageId }).unwrap();

          // Optimistically remove from UI
          setAllMessages((prev) => prev.filter((msg) => msg.id !== messageId));
          messagesMapRef.current.delete(messageId);
        }
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
        if (MOCK_WEBSOCKET) {
          // Mock update
          setAllMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, content, textContent: content }
                : msg
            )
          );
        } else {
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
        }
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
    if (MOCK_WEBSOCKET) {
      setIsConnected(true);
    }
    refetch();
  }, [refetch]);

  return {
    messages: allMessages,
    isLoading: isLoading && page === 0,
    isLoadingMore: isLoading && page > 0,
    isConnected,
    error: apiError ? "Failed to load messages" : null,
    sendMessage,
    deleteMessage,
    updateMessage,
    loadMore,
    hasMore,
    reconnect,
    currentUserId: session?.user?.id || "current-user",
  };
};
