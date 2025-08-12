import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout";

import { BoothGrid } from "./market/components";
import { UnifiedSearchBar } from "@/components/common";

import { useMarketData } from "./market/hooks/use-market-data";
import { useTrackBoothView } from "@/hooks/use-api";

import type { Booth } from "@/types/api";

export default function MarketPage() {
  const navigate = useNavigate();

  // 主数据管理
  const {
    booths,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    handleRefresh,
  } = useMarketData();

  // 浏览埋点
  const trackViewMutation = useTrackBoothView();

  // 收藏状态（简化版，实际项目中可能需要更复杂的状态管理）
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 处理档口点击
  const handleBoothClick = (booth: Booth) => {
    // 埋点记录
    trackViewMutation.mutate(booth.id);

    // 跳转到详情页
    navigate(`/booth/${booth.id}`);
  };

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

  // 错误状态
  if (isError) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              加载失败
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || "网络错误，请稍后重试"}
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        <UnifiedSearchBar
          variant="market"
          className="fixed top-0 left-0 right-0 z-50"
          placeholder="搜索档口名称、主营商品..."
          showLogo={true}
          showCamera={true}
          logoSize={32}
        />

        {/* 为固定搜索栏留出空间 */}
        <div className="pt-16">
          {/* 档口网格 */}
          <div className="pb-0">
            <BoothGrid
              booths={booths}
              onBoothClick={handleBoothClick}
              onFavoriteToggle={handleFavoriteToggle}
              favoriteIds={favoriteIds}
              onLoadMore={handleLoadMore}
              hasNextPage={hasNextPage}
              isLoading={isLoading || isFetchingNextPage}
              layout="grid"
              className="py-2"
            />
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}