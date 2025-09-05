import { useState, useEffect, useCallback, useRef } from "react";
import { useGetCourseMessagesQuery } from "@/services/websocket/chatApi";
import { ChatMessage } from "@/types/chat";

interface UseChatInfiniteScrollProps {
  courseId: string;
  pageSize?: number;
  enabled?: boolean;
}

interface UseChatInfiniteScrollReturn {
  messages: ChatMessage[];
  hasNextPage: boolean;
  isFetching: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  error: any;
  fetchNextPage: () => void;
  resetMessages: () => void;
  addNewMessage: (message: ChatMessage) => void;
  updateMessage: (messageId: string, updates: Partial<ChatMessage>) => void;
  preserveScrollPosition: (
    element: HTMLElement,
    previousHeight: number
  ) => void;
  isInitialized: boolean;
  infiniteScrollDisabled: boolean;
}

export const useChatInfiniteScroll = ({
  courseId,
  pageSize = 20,
  enabled = true,
}: UseChatInfiniteScrollProps): UseChatInfiniteScrollReturn => {
  const [allMessages, setAllMessages] = useState<ChatMessage[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [beforeMessageId, setBeforeMessageId] = useState<string | undefined>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);

  // Fetch initial messages (without beforeMessageId)
  const {
    data: initialData,
    isLoading: isLoadingInitial,
    error: initialError,
    isFetching: isFetchingInitial,
  } = useGetCourseMessagesQuery(
    {
      courseId,
      size: pageSize,
    },
    {
      skip: !enabled || !courseId || isInitialized,
    }
  );

  // Fetch next page (with beforeMessageId)
  const {
    data: nextPageData,
    isLoading: isLoadingNextPage,
    error: nextPageError,
    isFetching: isFetchingNextPage,
  } = useGetCourseMessagesQuery(
    {
      courseId,
      size: pageSize,
      beforeMessageId,
    },
    {
      skip: !enabled || !courseId || !beforeMessageId,
    }
  );

  // Initialize with first page
  useEffect(() => {
    if (initialData?.data?.messages && !isInitialized) {
      const messages = initialData.data.messages;
      console.log("🎯 Initializing with messages:", messages.length);
      // Store messages in chronological order (newest first from API)
      setAllMessages(messages);
      setIsInitialized(true);

      // Check if we have more pages
      if (messages.length < pageSize) {
        console.log("📄 No more pages available");
        setHasNextPage(false);
      } else {
        console.log("📄 More pages available");
        setHasNextPage(true);
      }
    }
  }, [initialData, isInitialized, pageSize]);

  // Handle next page data
  useEffect(() => {
    if (nextPageData?.data?.messages && beforeMessageId) {
      const newMessages = nextPageData.data.messages;
      console.log("📥 Received next page:", newMessages.length, "messages");

      // Append new messages to the end (older messages)
      setAllMessages((prev) => {
        // Deduplicate by ID to avoid duplicates
        const existingIds = new Set(prev.map((msg) => msg.id));
        const uniqueNewMessages = newMessages.filter(
          (msg) => !existingIds.has(msg.id)
        );
        console.log(
          "✅ Adding",
          uniqueNewMessages.length,
          "new unique messages"
        );
        return [...prev, ...uniqueNewMessages];
      });

      // Check if we have more pages
      if (newMessages.length < pageSize) {
        console.log("📄 No more pages available (received less than pageSize)");
        setHasNextPage(false);
      }

      // Reset beforeMessageId for next fetch
      setBeforeMessageId(undefined);
    }
  }, [nextPageData, beforeMessageId, pageSize]);

  // Preserve scroll position function
  const preserveScrollPosition = useCallback(
    (element: HTMLElement, previousHeight: number) => {
      const newHeight = element.scrollHeight;
      const heightDifference = newHeight - previousHeight;
      element.scrollTop = element.scrollTop + heightDifference;
    },
    []
  );

  // Fetch next page function
  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && allMessages.length > 0) {
      // Get the ID of the last (oldest) message
      const oldestMessage = allMessages[allMessages.length - 1];
      if (oldestMessage?.id) {
        console.log(
          "🔄 Fetching next page with beforeMessageId:",
          oldestMessage.id
        );
        console.log("📊 Current state:", {
          hasNextPage,
          isFetchingNextPage,
          messagesCount: allMessages.length,
          oldestMessageId: oldestMessage.id,
        });
        setBeforeMessageId(oldestMessage.id);
      } else {
        console.log("❌ No oldest message ID found");
      }
    } else {
      console.log("❌ Cannot fetch next page:", {
        hasNextPage,
        isFetchingNextPage,
        messagesCount: allMessages.length,
      });
    }
  }, [hasNextPage, isFetchingNextPage, allMessages]);

  // Reset messages (useful when switching courses)
  const resetMessages = useCallback(() => {
    setAllMessages([]);
    setBeforeMessageId(undefined);
    setHasNextPage(true);
    setIsInitialized(false);
  }, []);

  // Add new message (from WebSocket)
  const addNewMessage = useCallback((message: ChatMessage) => {
    setAllMessages((prev) => {
      // Check if message already exists
      const exists = prev.some((msg) => msg.id === message.id);
      if (exists) return prev;

      // Add new message at the beginning (newest messages first)
      return [message, ...prev];
    });
  }, []);

  // Update existing message
  const updateMessage = useCallback(
    (messageId: string, updates: Partial<ChatMessage>) => {
      setAllMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
      );
    },
    []
  );

  // Reset when courseId changes
  useEffect(() => {
    resetMessages();
  }, [courseId, resetMessages]);

  return {
    messages: allMessages,
    hasNextPage,
    isFetching: isFetchingInitial || isFetchingNextPage,
    isFetchingNextPage,
    isLoading: isLoadingInitial,
    error: initialError || nextPageError,
    fetchNextPage,
    resetMessages,
    addNewMessage,
    updateMessage,
    preserveScrollPosition,
    isInitialized,
    // Disable infinite scroll when loading initial data or when not initialized
    infiniteScrollDisabled: !isInitialized || isLoadingInitial,
  };
};
