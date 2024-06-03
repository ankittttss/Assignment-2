import React, { useRef, useEffect, useCallback } from "react"; // Import necessary modules and Hooks

interface InfiniteScrollBarProps {
  // Interface defined for the expected Props
  onLoadMore: () => void; // Need to be called when more content to be loaded
  hasMore: boolean;
  loading: boolean; // to identify whether the content is loading
  children: React.ReactNode; // Content to be rendered inside the Container
}

const InfiniteScrollBar: React.FC<InfiniteScrollBarProps> = ({
  // Functional Component that takes Props as an argument //
  onLoadMore,
  hasMore,
  loading,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null); // used for debouncing scroll events

  const handleScroll = useCallback(() => {
    // called when a scroll event occurs. Checks if the user has
    // scrolled to the bottom of the container. if it is true the it'll load more
    const { current: scrollContainer } = scrollContainerRef;
    if (!scrollContainer || loading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // Adjust threshold as needed

    if (isAtBottom) {
      onLoadMore();
    }
  }, [onLoadMore, loading, hasMore]);

  const debouncedHandleScroll = useCallback(() => {  // Debounced Version of HandleScroll. It handles the delay //
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      handleScroll();
    }, 900); // Adjust the debounce delay as needed (e.g., 200ms)
  }, [handleScroll]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", debouncedHandleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", debouncedHandleScroll);
      }
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedHandleScroll]);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 50px)",
        border: "1px solid #ccc",
        margin: "10px 0",
      }} // Adjust maxHeight if you have a header/footer
    >
      {children}
    </div>
  );
};

export default InfiniteScrollBar;


// Overall this event is handling the debouncing and Infinite Scrolling functionality//