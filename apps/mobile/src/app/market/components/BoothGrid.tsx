"use client";

import React from "react";
import Masonry from "react-masonry-css";
import { Loader2 } from "lucide-react";
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
  
  // 瀑布流列数配置 - 移动端固定2列
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    640: 2,
    480: 2
  };

  // 如果初始加载，显示骨架屏
  if (isInitialLoading) {
    return (
      <BoothGridSkeleton
        count={6}
        layout={layout}
        className={layout === "grid" ? "px-2" : className}
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

  // 列表布局直接使用InfiniteScrollList
  if (layout === "list") {
    return (
      <InfiniteScrollList
        items={booths}
        renderItem={(booth: Booth) => (
          <BoothItem
            key={booth.id}
            booth={booth}
            onCardClick={onBoothClick}
            onFavoriteClick={onFavoriteToggle}
            isFavorited={favoriteIds.has(booth.id)}
            layout={layout}
          />
        )}
        onLoadMore={onLoadMore}
        hasNextPage={hasNextPage}
        isLoading={isLoading}
        isEmpty={false}
        emptyTitle=""
        className={`space-y-0 ${className}`}
      />
    );
  }

  // 网格布局使用瀑布流 + 自定义无限滚动
  return (
    <div className={`px-2 ${className}`}>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-2 w-auto"
        columnClassName="pl-2 bg-clip-padding"
      >
        {booths.map((booth) => (
          <div key={booth.id} className="mb-2">
            <BoothItem
              booth={booth}
              onCardClick={onBoothClick}
              onFavoriteClick={onFavoriteToggle}
              isFavorited={favoriteIds.has(booth.id)}
              layout={layout}
            />
          </div>
        ))}
      </Masonry>

      {/* 无限滚动触发器 */}
      {hasNextPage && (
        <div 
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && hasNextPage && !isLoading) {
                    onLoadMore();
                  }
                },
                { threshold: 0.1, rootMargin: '50px' }
              );
              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
          className="w-full flex justify-center pt-4"
        >
          {isLoading && booths.length > 0 && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          )}
        </div>
      )}

      {/* 已加载完成提示 */}
      {!hasNextPage && booths.length > 0 && (
        <div className="text-center mt-4 text-gray-500 text-sm">
          已显示全部 {booths.length} 个档口
        </div>
      )}
    </div>
  );
}
