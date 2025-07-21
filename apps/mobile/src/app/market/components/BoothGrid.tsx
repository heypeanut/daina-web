"use client";

import React from 'react';
import { Booth } from '../../../../../src/types/booth';
import { MobileBoothCard } from './MobileBoothCard';
import { InfiniteScrollList } from '@/components/common/InfiniteScrollList';

interface BoothGridProps {
  booths: Booth[];
  onBoothClick: (booth: Booth) => void;
  onFavoriteToggle: (booth: Booth) => void;
  favoriteIds?: Set<string>;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  layout?: 'grid' | 'list';
  className?: string;
}

export function BoothGrid({
  booths,
  onBoothClick,
  onFavoriteToggle,
  favoriteIds = new Set(),
  onLoadMore,
  hasNextPage,
  isLoading,
  layout = 'grid',
  className = ''
}: BoothGridProps) {
  const renderBoothItem = (booth: Booth) => (
    <MobileBoothCard
      key={booth.id}
      booth={booth}
      onCardClick={onBoothClick}
      onFavoriteClick={onFavoriteToggle}
      isFavorited={favoriteIds.has(booth.id)}
      layout={layout}
      className={layout === 'grid' ? '' : 'border-b border-gray-100 last:border-b-0'}
    />
  );

  const containerClassName = layout === 'grid' 
    ? `grid grid-cols-2 gap-4 px-4 ${className}` 
    : `space-y-0 ${className}`;

  return (
    <InfiniteScrollList
      items={booths}
      renderItem={renderBoothItem}
      onLoadMore={onLoadMore}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isEmpty={booths.length === 0}
      emptyTitle="没有找到匹配的档口"
      emptyDescription="试试调整筛选条件或搜索关键词"
      className={containerClassName}
    />
  );
}