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
      console.log("❌ Infinite scroll disabled");
      return;
    }

    const element = scrollElementRef.current;
    if (!element) {
      console.log("❌ No scroll element found");
      return;
    }

    if (!hasNextPage) {
      console.log("❌ No more pages to load");
      return;
    }

    if (isFetchingNextPage) {
      console.log("❌ Already fetching next page");
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
      console.log("❌ Skipping - auto scrolling in progress");
      return;
    }

    // Only trigger when scrolling up and near the top
    const shouldTrigger = isScrollingUp && scrollTop <= threshold;

    if (shouldTrigger) {
      console.log("🚀 Triggering fetchNextPage");
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
      console.log("❌ No element for scroll listener");
      return;
    }

    // Try to find the scrollable viewport within ScrollArea
    const viewport = element.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;
    const scrollableElement = viewport || element;

    console.log(
      "✅ Setting up scroll listener on:",
      scrollableElement.tagName,
      {
        hasViewport: !!viewport,
        elementType: scrollableElement === element ? "direct" : "viewport",
      }
    );

    const listener = () => handleScroll();
    scrollableElement.addEventListener("scroll", listener);

    return () => {
      console.log("🧹 Cleaning up scroll listener");
      scrollableElement.removeEventListener("scroll", listener);
    };
  }, [handleScroll]);

  return { handleScroll, setAutoScrolling };
};
