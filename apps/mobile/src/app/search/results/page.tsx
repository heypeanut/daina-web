"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import type { Product } from "@/types/api";
import type { Booth } from "@/types/booth";
import {
  SearchHeader,
  SearchStats,
  SearchTabs,
  SearchFilters,
  ImageSearchResults,
  ProductSearchResults,
  BoothSearchResults,
} from "./components";
import { DebugConsole, QuickTestButtons } from "./components/DebugConsole";
import { useSearchLogic } from "./hooks/useSearchLogic";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { generateSearchLog } from "./utils/searchUtils";
import type { SortOption } from "./types";

/**
 * 搜索结果页面组件
 * 重构版本：支持滑动加载更多，使用组件拆分和自定义Hook优化代码结构
 */
export default function SearchResultsPage() {
  const router = useRouter();
  
  // 使用自定义Hook管理搜索逻辑
  const {
    keyword,
    activeTab,
    sortBy,
    imageSearchResults,
    searchImage,
    isImageSearch,
    searchKeyword,
    productSearch,
    boothSearch,
    handleTabChange,
    handleSortChange,
    handleLoadMore,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchLogic();

  // 滑动加载更多Hook
  useInfiniteScroll(
    hasNextPage,
    isFetchingNextPage,
    handleLoadMore,
    {
      threshold: 200,
      enabled: !isImageSearch && !!searchKeyword,
      debounceMs: 100,
    }
  );

  // 事件处理函数
  const handleProductClick = (product: Product, index: number) => {
    generateSearchLog('product', product, index, searchKeyword);
    router.push(`/product/${product.id}`);
  };

  const handleBoothClick = (booth: Booth, index: number) => {
    generateSearchLog('booth', booth, index, searchKeyword);
    router.push(`/booth/${booth.id}`);
  };

  // 渲染搜索结果内容
  const renderSearchResults = () => {
    // 图片搜索结果
    if (isImageSearch && imageSearchResults) {
      return <ImageSearchResults imageSearchResults={imageSearchResults} />;
    }

    // 商品搜索结果
    if (activeTab === "product") {
      return (
        <ProductSearchResults
          productSearchData={productSearch.data}
          productLoading={productSearch.isLoading}
          productError={productSearch.error}
          onProductClick={handleProductClick}
          onRefetch={productSearch.refetch}
          searchKeyword={searchKeyword}
          // 新增：无限滚动相关属性
          isFetchingNextPage={productSearch.isFetchingNextPage}
          hasNextPage={productSearch.hasNextPage}
        />
      );
    }

    // 档口搜索结果
    return (
      <BoothSearchResults
        boothSearchData={boothSearch.data}
        boothLoading={boothSearch.isLoading}
        boothError={boothSearch.error}
        onBoothClick={handleBoothClick}
        onRefetch={boothSearch.refetch}
        searchKeyword={searchKeyword}
        // 新增：无限滚动相关属性
        isFetchingNextPage={boothSearch.isFetchingNextPage}
        hasNextPage={boothSearch.hasNextPage}
      />
    );
  };

  // 渲染手动加载更多按钮（作为滑动加载的备选方案）
  const renderLoadMoreButton = () => {
    // 图片搜索或没有搜索关键词时不显示
    if (isImageSearch || !searchKeyword) {
      return null;
    }

    // 没有更多数据时不显示
    if (!hasNextPage) {
      return null;
    }

    // 正在加载时不显示按钮（显示底部加载状态）
    if (isFetchingNextPage) {
      return null;
    }

    // 当前数据为空时不显示
    const currentData = activeTab === "product" ? productSearch.data : boothSearch.data;
    if (!currentData?.rows?.length) {
      return null;
    }

    return (
      <div className="px-4 py-6 text-center">
        <button
          className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-600 active:bg-gray-50 transition-colors hover:bg-gray-50 disabled:opacity-50"
          onClick={() => {
            console.log('💆 [主页面调试] 点击加载更多按钮');
            handleLoadMore();
          }}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? '加载中...' : '点击加载更多'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          也可以滑动到底部自动加载
        </p>
      </div>
    );
  };

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索头部 */}
        <SearchHeader keyword={keyword} />

        {/* 搜索统计 */}
        <SearchStats
          isImageSearch={isImageSearch}
          searchImage={searchImage}
          imageSearchResults={imageSearchResults}
          searchKeyword={searchKeyword}
          activeTab={activeTab}
          productTotal={productSearch.data?.total || 0}
          boothTotal={boothSearch.data?.total || 0}
        />

        {/* Tab切换 */}
        <SearchTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          productCount={productSearch.data?.total || 0}
          boothCount={boothSearch.data?.total || 0}
          isImageSearch={isImageSearch}
          searchKeyword={searchKeyword}
        />

        {/* 筛选栏 */}
        <SearchFilters
          activeTab={activeTab}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          isImageSearch={isImageSearch}
          searchKeyword={searchKeyword}
        />

        {/* 搜索结果 */}
        <div className="pb-4">
          {renderSearchResults()}
        </div>

        {/* 手动加载更多按钮（备选方案） */}
        {renderLoadMoreButton()}
        
        {/* 调试控制台（仅开发环境） */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <DebugConsole
              searchKeyword={searchKeyword}
              activeTab={activeTab}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              totalProducts={productSearch.data?.total || 0}
              totalBooths={boothSearch.data?.total || 0}
            />
            <QuickTestButtons
              onLoadMore={handleLoadMore}
              onScrollToBottom={() => {
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </MobileLayout>
  );
}