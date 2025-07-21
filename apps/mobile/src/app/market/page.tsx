"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Footer } from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// 页面组件
import { MarketSearchBar } from './components/MarketSearchBar';
import { MarketCategoryTabs } from './components/MarketCategoryTabs';
import { MarketSortOptions } from './components/MarketSortOptions';
import { MarketFilters } from './components/MarketFilters';
import { BoothGrid } from './components/BoothGrid';

// Hooks
import { useMarketData } from './hooks/useMarketData';
import { useMarketFilters } from './hooks/useMarketFilters';
import { useMarketSearch } from './hooks/useMarketSearch';
import { useBoothCategories } from '@/hooks/api/booth/useBoothCategories';
import { useTrackBoothView } from '@/hooks/api/booth/useBooths';

// Types
import { Booth } from '../../../../../src/types/booth';
import { MarketFilters as MarketFiltersType } from './types/market';

export default function MarketPage() {
  const router = useRouter();
  
  // 页面搜索状态
  const {
    searchKeyword,
    handleSearch,
    handleInputChange,
    showHistory,
    searchHistory,
    handleSearchFromHistory,
    clearHistory
  } = useMarketSearch();

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
    applyFilters
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
    handleRefresh
  } = useMarketData({
    initialCategory: 'all',
    initialSortType: 'default',
    initialFilters: filters
  });

  // 分类数据
  const {
    data: categories = [],
    isLoading: isCategoriesLoading
  } = useBoothCategories();

  // 浏览埋点
  const trackViewMutation = useTrackBoothView();

  // 收藏状态（简化版，实际项目中可能需要更复杂的状态管理）
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 处理搜索
  const handleSearchSubmit = (keyword: string) => {
    handleSearch(keyword);
  };

  // 处理档口点击
  const handleBoothClick = (booth: Booth) => {
    // 埋点记录
    trackViewMutation.mutate(booth.id);
    
    // 跳转到详情页
    router.push(`/booth/${booth.id}`);
  };

  // 处理收藏切换
  const handleFavoriteToggle = (booth: Booth) => {
    setFavoriteIds(prev => {
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
              {error?.message || '网络错误，请稍后重试'}
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
            value={searchKeyword}
            onChange={handleInputChange}
            onSearch={handleSearchSubmit}
            onFilterClick={openFilters}
            className="sticky top-0 z-30"
          />

          {/* 搜索历史 */}
          {showHistory && searchHistory.length > 0 && (
            <div className="bg-white border-b border-gray-100">
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  搜索历史
                </h3>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchFromHistory(keyword)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {keyword}
                    </button>
                  ))}
                </div>
                <button
                  onClick={clearHistory}
                  className="mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  清空历史
                </button>
              </div>
            </div>
          )}

          {/* 分类标签 */}
          <MarketCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            loading={isCategoriesLoading}
            className="sticky top-16 z-20"
          />

          {/* 排序选项 */}
          <MarketSortOptions
            sortType={sortType}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            className="sticky top-24 z-10"
          />

          {/* 结果统计 */}
          {!isLoading && (
            <div className="px-4 py-2 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  找到 {totalCount} 个档口
                  {hasActiveFilters && (
                    <span className="ml-2 text-orange-600">
                      (已应用 {activeFiltersCount} 个筛选条件)
                    </span>
                  )}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-orange-500 hover:text-orange-600"
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
        
        <Footer />
      </MobileLayout>
    </ErrorBoundary>
  );
}