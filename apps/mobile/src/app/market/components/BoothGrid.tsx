"use client";

import React from "react";
import { Booth } from "@/types/booth";
import { MobileBoothCard } from "./MobileBoothCard";
import { InfiniteScrollList } from "@/components/common/InfiniteScrollList";
import { BoothGridSkeleton } from "./BoothCardSkeleton";
import { BoothEmptyState } from "./BoothEmptyState";

interface BoothGridProps {
  booths: Booth[];
  onBoothClick: (booth: Booth) => void;
  onFavoriteToggle: (booth: Booth) => void;
  favoriteIds?: Set<string>;
  onLoadMore: () => void;
  hasNextPage: boolean;
  isLoading: boolean;
  layout?: "grid" | "list";
  className?: string;
}

// BoothItem 组件 - 使用 React.memo 进行优化
const BoothItem = React.memo(
  ({
    booth,
    onCardClick,
    onFavoriteClick,
    isFavorited,
    layout,
  }: {
    booth: Booth;
    onCardClick: (booth: Booth) => void;
    onFavoriteClick: (booth: Booth) => void;
    isFavorited: boolean;
    layout: "grid" | "list";
  }) => (
    <MobileBoothCard
      booth={booth}
      onCardClick={onCardClick}
      onFavoriteClick={onFavoriteClick}
      isFavorited={isFavorited}
      layout={layout}
      className={
        layout === "grid" ? "" : "border-b border-gray-100 last:border-b-0"
      }
    />
  )
);

BoothItem.displayName = "BoothItem";

export function BoothGrid({
  booths,
  onBoothClick,
  onFavoriteToggle,
  favoriteIds = new Set(),
  onLoadMore,
  hasNextPage,
  isLoading,
  layout = "grid",
  className = "",
}: BoothGridProps) {
  // 初始加载状态：正在加载且暂无数据
  const isInitialLoading = isLoading && booths.length === 0;

  const renderBoothItem = (booth: Booth) => (
    <BoothItem
      key={booth.id}
      booth={booth}
      onCardClick={onBoothClick}
      onFavoriteClick={onFavoriteToggle}
      isFavorited={favoriteIds.has(booth.id)}
      layout={layout}
    />
  );

  const containerClassName =
    layout === "grid"
      ? `columns-2 gap-2 px-2 ${className}`
      : `space-y-0 ${className}`;

  // 如果初始加载，显示骨架屏
  if (isInitialLoading) {
    return (
      <BoothGridSkeleton
        count={6}
        layout={layout}
        className={containerClassName}
      />
    );
  }

  // 如果没有数据，显示美观的空状态
  if (booths.length === 0 && !isLoading) {
    return (
      <BoothEmptyState
        type="search"
        title="没有找到匹配的档口"
        description="试试调整搜索关键词或浏览其他分类"
        className={className}
      />
    );
  }

  return (
    <InfiniteScrollList
      items={booths}
      renderItem={renderBoothItem}
      onLoadMore={onLoadMore}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      isEmpty={false}
      emptyTitle=""
      className={containerClassName}
    />
  );
}
