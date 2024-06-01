import React, { useRef, useEffect } from 'react';

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

  useEffect(() => {
    const handleScroll = () => {
      const { current: scrollContainer } = scrollContainerRef;
      if (!scrollContainer || loading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = scrollContainer;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // Adjust threshold as needed

      if (isAtBottom) {
        onLoadMore();
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [onLoadMore, loading, hasMore]);

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
