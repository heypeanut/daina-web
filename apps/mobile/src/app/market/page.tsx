"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// 页面组件
import { MarketSearchBar } from "./components/MarketSearchBar";
import { MarketCategoryTabs } from "./components/MarketCategoryTabs";
import { MarketSortOptions } from "./components/MarketSortOptions";
import { MarketFilters } from "./components/MarketFilters";
import { BoothGrid } from "./components/BoothGrid";

// Hooks
import { useMarketData } from "./hooks/useMarketData";
import { useMarketFilters } from "./hooks/useMarketFilters";
import { useBoothCategories } from "@/hooks/api/booth/useBoothCategories";
import { useTrackBoothView } from "@/hooks/api/booth/useBooths";

// Types
import { Booth } from "../../../../../src/types/booth";
import { MarketFilters as MarketFiltersType } from "./types/market";

export default function MarketPage() {
  const router = useRouter();

  // 筛选器状态
  const {
    filters,
    isFiltersOpen,
    hasActiveFilters,
    activeFiltersCount,
    updateFilters,
    resetFilters,
    openFilters,
    closeFilters,
    applyFilters,
  } = useMarketFilters();

  // 主数据管理
  const {
    booths,
    totalCount,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    activeCategory,
    sortType,
    sortOrder,
    handleCategoryChange,
    handleSortChange,
    handleLoadMore,
    handleRefresh,
  } = useMarketData({
    initialCategory: "all",
    initialSortType: "default",
    initialFilters: filters,
  });

  // 分类数据
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useBoothCategories();

  // 浏览埋点
  const trackViewMutation = useTrackBoothView();

  // 收藏状态（简化版，实际项目中可能需要更复杂的状态管理）
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 处理档口点击
  const handleBoothClick = (booth: Booth) => {
    // 埋点记录
    trackViewMutation.mutate(booth.id);

    // 跳转到详情页
    router.push(`/booth/${booth.id}`);
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

  // 处理筛选器变化
  const handleFiltersChange = (newFilters: MarketFiltersType) => {
    updateFilters(newFilters);
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
    <ErrorBoundary>
      <MobileLayout>
        <div className="min-h-screen bg-gray-50">
          {/* 搜索栏 */}
          <MarketSearchBar
            className="fixed top-0 left-0 right-0 z-50"
            placeholder="搜索档口名称、主营商品..."
          />

          {/* 为固定搜索栏留出空间 */}
          <div className="pt-16">
            {/* 分类标签 */}
            <MarketCategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              loading={isCategoriesLoading}
              className="sticky top-0 z-40"
            />

            {/* 排序选项 */}
            <MarketSortOptions
              sortType={sortType}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              className="sticky top-12 z-30"
            />

            {/* 结果统计 */}
            {!isLoading && (
              <div className="mx-4 mb-4 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-800">
                      找到{" "}
                      <span className="text-orange-600 font-bold">
                        {totalCount}
                      </span>{" "}
                      个档口
                    </span>
                    {hasActiveFilters && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium border border-orange-200">
                        {activeFiltersCount} 个筛选条件
                      </span>
                    )}
                  </div>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-200 font-medium"
                    >
                      清除筛选
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 档口网格 */}
            <div className="pb-20">
              <BoothGrid
                booths={booths}
                onBoothClick={handleBoothClick}
                onFavoriteToggle={handleFavoriteToggle}
                favoriteIds={favoriteIds}
                onLoadMore={handleLoadMore}
                hasNextPage={hasNextPage}
                isLoading={isLoading || isFetchingNextPage}
                layout="grid"
                className="py-4"
              />
            </div>

            {/* 筛选器面板 */}
            <MarketFilters
              isOpen={isFiltersOpen}
              onClose={closeFilters}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={resetFilters}
              onApply={applyFilters}
            />
          </div>
        </div>

        <Footer />
      </MobileLayout>
    </ErrorBoundary>
  );
}
