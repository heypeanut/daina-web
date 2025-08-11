"use client";

import React, { useEffect, useRef, ReactNode } from 'react';
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
  // 新增骨架屏支持
  renderSkeleton?: () => ReactNode;
  isInitialLoading?: boolean;
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
  className = '',
  renderSkeleton,
  isInitialLoading = false
}: InfiniteScrollListProps<T>) {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 只有当有下一页且当前没有在加载时才设置观察器
    if (!hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // 简化判断条件，避免重复检查
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // 减少预加载距离，避免过早触发
      }
    );

    const loadingElement = loadingRef.current;
    if (loadingElement) {
      observer.observe(loadingElement);
    }

    return () => {
      if (loadingElement) {
        observer.unobserve(loadingElement);
      }
      observer.disconnect();
    };
  }, [hasNextPage, isLoading, onLoadMore]); // 移除 items.length 依赖，避免频繁重建观察器

  // 初始加载时显示骨架屏
  if (isInitialLoading && renderSkeleton) {
    return (
      <div className={className}>
        {renderSkeleton()}
      </div>
    );
  }

  // 数据为空时显示空状态
  if (isEmpty && !isInitialLoading) {
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
    <div>
      <div className={className}>
        {items.map((item, index) => renderItem(item, index))}
      </div>

      {hasNextPage && (
        <div
          ref={loadingRef}
          className="w-full flex justify-center pt-4"
        >
          {isLoading && items.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-600 font-medium">加载更多...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}