import React, { useRef, useEffect, useCallback } from 'react';

interface InfiniteScrollBarProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

const InfiniteScrollBar: React.FC<InfiniteScrollBarProps> = ({
  onLoadMore,
  hasMore,
  loading,
  children,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  const handleScroll = useCallback(() => {
    const { current: scrollContainer } = scrollContainerRef;
    if (!scrollContainer || loading || !hasMore) return;

    const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // Adjust threshold as needed

    if (isAtBottom) {
      onLoadMore();
    }
  }, [onLoadMore, loading, hasMore]);

  const debouncedHandleScroll = useCallback(() => {
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = window.setTimeout(() => {
      handleScroll();
    }, 500); // Adjust the debounce delay as needed (e.g., 200ms)
  }, [handleScroll]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', debouncedHandleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', debouncedHandleScroll);
      }
      if (debounceTimeoutRef.current !== null) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedHandleScroll]);

  return (
    <div
      ref={scrollContainerRef}
      style={{ overflowY: 'auto', maxHeight: '100%', border: '1px solid #ccc', margin: '10px 0' }}
    >
      {children}
    </div>
  );
};

export default InfiniteScrollBar;
