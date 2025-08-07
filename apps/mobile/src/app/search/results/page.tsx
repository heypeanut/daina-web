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
import { useSearchLogic } from "./hooks/useSearchLogic";
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
    isBoothInternalSearch,
  } = useSearchLogic();


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
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={productSearch.hasNextPage}
          onLoadMore={handleLoadMore}
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
        onLoadMore={handleLoadMore}
      />
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
          isBoothInternalSearch={isBoothInternalSearch}
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
        <div className="py-2 pb-6">
          {renderSearchResults()}
        </div>

      </div>
    </MobileLayout>
  );
}