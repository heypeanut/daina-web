"use client";

import React from 'react';
import { BoothRecommend } from '@/components/home/BoothRecommend';
import { LoadingState, ErrorState, EmptyState } from './SearchStates';
import { InfiniteScrollIndicator } from './InfiniteScrollIndicator';
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
}: BoothSearchResultsProps) {
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
      <>
        <BoothRecommend
          title=""
          booths={boothSearchData.rows}
          type="hot"
          showMore={false}
          onBoothClick={onBoothClick}
        />
        
        {/* 无限滚动指示器 */}
        <InfiniteScrollIndicator
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
          totalCount={boothSearchData.total}
          loadedCount={boothSearchData.rows.length}
          itemType="档口"
          className="bg-white"
        />
      </>
    );
  }

  // 空结果状态
  if (searchKeyword) {
    return <EmptyState type="booth" />;
  }

  // 默认状态
  return null;
}