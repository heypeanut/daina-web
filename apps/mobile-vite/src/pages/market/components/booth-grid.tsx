import React from "react";
import Masonry from "react-masonry-css";
import { Loader2 } from "lucide-react";
import type { Booth } from "@/types/api";
import { MobileBoothCard } from "./mobile-booth-card";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";

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
  // 使用通用的无限滚动hook
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(onLoadMore, {
    hasMore: hasNextPage,
    isLoading,
  });

  // 初始加载状态：正在加载且暂无数据
  const isInitialLoading = isLoading && booths.length === 0;

  // 瀑布流列数配置 - 移动端固定2列
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    640: 2,
    480: 2,
  };

  // 如果初始加载，显示骨架屏
  if (isInitialLoading) {
    return (
      <div className={`px-2 ${className}`}>
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-3">
                <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 如果没有数据，显示美观的空状态
  if (booths.length === 0 && !isLoading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500">
          <div className="text-4xl mb-4">🏪</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            没有找到匹配的档口
          </h3>
          <p className="text-sm text-gray-600">
            试试调整搜索关键词或浏览其他分类
          </p>
        </div>
      </div>
    );
  }

  // 列表布局
  if (layout === "list") {
    return (
      <div className={`space-y-0 ${className}`}>
        {booths.map((booth) => (
          <BoothItem
            key={booth.id}
            booth={booth}
            onCardClick={onBoothClick}
            onFavoriteClick={onFavoriteToggle}
            isFavorited={favoriteIds.has(booth.id)}
            layout={layout}
          />
        ))}

        {/* 加载更多按钮 */}
        {hasNextPage && (
          <div className="text-center py-4">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span className="text-sm text-gray-600">加载中...</span>
              </div>
            ) : (
              <button
                onClick={onLoadMore}
                className="px-4 py-2 text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                加载更多
              </button>
            )}
          </div>
        )}
      </div>
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
      {shouldShowTrigger && <div ref={triggerRef} className="py-2" />}

      {/* 加载状态提示 */}
      {isLoading && hasNextPage && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm text-gray-600">加载更多...</span>
          </div>
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasNextPage && booths.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部档口
        </div>
      )}
    </div>
  );
}
