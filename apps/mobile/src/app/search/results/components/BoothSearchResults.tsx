"use client";

import React, { useState } from 'react';
import { BoothGrid } from '@/app/market/components/BoothGrid';
import { LoadingState, ErrorState, EmptyState } from './SearchStates';
import type { BoothSearchResponse } from '@/hooks/api/search';
import type { Booth } from '@/types/booth';

interface BoothSearchResultsProps {
  boothSearchData?: BoothSearchResponse;
  boothLoading: boolean;
  boothError: Error | null;
  onBoothClick: (booth: Booth, index: number) => void;
  onRefetch: () => void;
  searchKeyword: string;
  // 新增：无限滚动相关属性
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

/**
 * 档口搜索结果组件
 * 重构版本：支持无限滚动，显示底部加载状态
 */
export function BoothSearchResults({
  boothSearchData,
  boothLoading,
  boothError,
  onBoothClick,
  onRefetch,
  searchKeyword,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
}: BoothSearchResultsProps) {
  // 收藏状态管理（占位符实现）
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 处理收藏切换
  const handleFavoriteToggle = (booth: Booth) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(booth.id)) {
        newSet.delete(booth.id);
        // TODO: 调用取消收藏 API
      } else {
        newSet.add(booth.id);
        // TODO: 调用收藏 API
      }
      return newSet;
    });
  };

  // 适配onBoothClick函数签名
  const handleBoothClick = (booth: Booth) => {
    // 找到booth在数组中的索引
    const index = boothSearchData?.rows?.findIndex(b => b.id === booth.id) ?? 0;
    onBoothClick(booth, index);
  };

  // 加载更多的占位符函数
  const handleLoadMore = () => {
    // 此功能由父组件的无限滚动处理
  };
  // 初始加载状态
  if (boothLoading && !boothSearchData?.rows?.length) {
    return <LoadingState />;
  }

  // 错误状态
  if (boothError) {
    return <ErrorState error={boothError} onRetry={onRefetch} />;
  }

  // 有数据时显示档口列表
  if (boothSearchData?.rows?.length) {
    return (
      <BoothGrid
        booths={boothSearchData.rows}
        onBoothClick={handleBoothClick}
        onFavoriteToggle={handleFavoriteToggle}
        favoriteIds={favoriteIds}
        onLoadMore={handleLoadMore}
        hasNextPage={hasNextPage}
        isLoading={isFetchingNextPage}
        layout="grid"
        className="py-3"
      />
    );
  }

  // 空结果状态
  if (searchKeyword) {
    return <EmptyState type="booth" />;
  }

  // 默认状态
  return null;
}