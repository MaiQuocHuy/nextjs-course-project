// Hook: useChatInfiniteScroll
// Purpose: Data-layer hook for the chat message list. Responsible for
//  - fetching pages of messages (RTK Query)
//  - storing/merging/deduplicating messages
//  - add/update/remove operations for messages (used by WebSocket and UI)
//  - pagination state and an API to fetch next page
// Note: This hook does NOT attach scroll listeners. Scrolling / viewport
// detection is intentionally separated into `useInfiniteScroll` (see
// src/hooks/useInfiniteScroll.ts) so concerns are decoupled: one hook
// manages data, the other manages scroll behavior.
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
  removeMessage: (messageId: string) => void;
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
      // Previously we skipped when `isInitialized` was true which caused
      // the initial REST call to be skipped when reopening the chat or
      // switching courses (race between reset and query hook initialization).
      // Remove `isInitialized` from skip so the API call runs whenever we
      // have a valid `courseId` and the hook is enabled.
      skip: !enabled || !courseId,
      // Ensure RTK Query will refetch when the hook mounts or args change
      // (covers reopening the chat panel or switching courses)
      refetchOnMountOrArgChange: true,
      // Return the refetch function so callers can trigger a manual refetch
    }
  );
  // Note: useGetCourseMessagesQuery returns a `refetch` function but the
  // RTK Query hook typing may not expose it in destructuring above depending
  // on your versions. Use the query hook again to get the refetch function
  // (no network call because RTK caches the result) so we can manually
  // trigger fetch when switching courses.
  const { refetch: refetchInitial } = useGetCourseMessagesQuery(
    { courseId, size: pageSize },
    { skip: !enabled || !courseId }
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
      // Store messages in chronological order (newest first from API)
      setAllMessages(messages);
      setIsInitialized(true);

      // Check if we have more pages
      if (messages.length < pageSize) {
        setHasNextPage(false);
      } else {
        setHasNextPage(true);
      }
    }
  }, [initialData, isInitialized, pageSize]);

  // Handle next page data
  useEffect(() => {
    if (nextPageData?.data?.messages && beforeMessageId) {
      const newMessages = nextPageData.data.messages;

      // Append new messages to the end (older messages)
      setAllMessages((prev) => {
        // Deduplicate by ID to avoid duplicates
        const existingIds = new Set(prev.map((msg) => msg.id));
        const uniqueNewMessages = newMessages.filter(
          (msg) => !existingIds.has(msg.id)
        );
        return [...prev, ...uniqueNewMessages];
      });

      // Check if we have more pages
      if (newMessages.length < pageSize) {
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
        setBeforeMessageId(oldestMessage.id);
      }
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
    // Clear local state quickly
    resetMessages();
    // Also trigger a manual refetch to ensure the initial REST endpoint
    // is called immediately when the course changes or the chat reopens.
    try {
      refetchInitial?.();
    } catch (err) {
      // ignore refetch errors here; the normal query state will surface errors
      console.debug("useChatInfiniteScroll: refetchInitial failed", err);
    }
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
    removeMessage: (messageId: string) => {
      setAllMessages((prev) => prev.filter((m) => m.id !== messageId));
    },
    preserveScrollPosition,
    isInitialized,
    // Disable infinite scroll when loading initial data or when not initialized
    infiniteScrollDisabled: !isInitialized || isLoadingInitial,
  };
};
