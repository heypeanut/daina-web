"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface InfiniteScrollListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  className?: string;
}

export function InfiniteScrollList<T>({
  items,
  renderItem,
  onLoadMore,
  hasNextPage,
  isLoading,
  isEmpty,
  emptyTitle,
  emptyDescription,
  className = ''
}: InfiniteScrollListProps<T>) {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isLoading, onLoadMore]);

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        type="search"
        className={className}
      />
    );
  }

  return (
    <div className={className}>
      {items.map((item, index) => renderItem(item, index))}
      
      {hasNextPage && (
        <div 
          ref={loadingRef}
          className="flex justify-center py-4"
        >
          {isLoading && (
            <LoadingSpinner text="加载中..." />
          )}
        </div>
      )}
    </div>
  );
}