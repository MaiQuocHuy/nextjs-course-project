// Hook: useInfiniteScroll
// Purpose: UI/interaction hook that attaches a scroll listener to a
// provided scroll container. Responsible for:
//  - detecting when the user scrolls near the top to trigger loading older pages
//  - preventing triggers during programmatic (auto) scrolling
//  - exposing a `setAutoScrolling` helper for callers to temporarily
//    suspend scroll-triggered loads while performing smooth scrolls.
// Note: This hook intentionally does not manage data fetching or message
// state. See `useChatInfiniteScroll` for the data-layer logic. Keeping these
// concerns separate improves testability and reuse.
import { useEffect, useCallback, useRef, RefObject } from "react";

interface UseInfiniteScrollProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number; // Distance from top to trigger load more (in pixels)
  disabled?: boolean; // Disable infinite scroll temporarily
}

export const useInfiniteScroll = (
  scrollElementRef: RefObject<HTMLDivElement | null>,
  {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 100,
    disabled = false,
  }: UseInfiniteScrollProps
) => {
  const isAutoScrollingRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const handleScroll = useCallback(() => {
    if (disabled) {
      return;
    }

    const element = scrollElementRef.current;
    if (!element) {
      return;
    }

    if (!hasNextPage) {
      return;
    }

    if (isFetchingNextPage) {
      return;
    }

    // Try to find the scrollable viewport within ScrollArea
    const viewport = element.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    const scrollableElement = viewport || element;

    const { scrollTop, scrollHeight, clientHeight } = scrollableElement;

    // Check if user is scrolling up (to load older messages)
    const isScrollingUp = scrollTop < lastScrollTopRef.current;
    lastScrollTopRef.current = scrollTop;

    // Skip if auto scrolling
    if (isAutoScrollingRef.current) {
      return;
    }

    // Only trigger when scrolling up and near the top
    const shouldTrigger = isScrollingUp && scrollTop <= threshold;

    if (shouldTrigger) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold,
    scrollElementRef,
    disabled,
  ]);

  // Method to mark auto scroll start/end
  const setAutoScrolling = useCallback((isScrolling: boolean) => {
    isAutoScrollingRef.current = isScrolling;
    if (isScrolling) {
      // Clear after a delay
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 1000);
    }
  }, []);

  useEffect(() => {
    const element = scrollElementRef.current;
    if (!element) {
      return;
    }

    // Try to find the scrollable viewport within ScrollArea
    const viewport = element.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    const scrollableElement = viewport || element;

    const listener = () => handleScroll();
    scrollableElement.addEventListener("scroll", listener);

    return () => {
      scrollableElement.removeEventListener("scroll", listener);
    };
  }, [handleScroll]);

  return { handleScroll, setAutoScrolling };
};
