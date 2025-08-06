"use client";

import React from 'react';
import { ProductRecommend } from '@/components/home/ProductRecommend';
import { LoadingState, ErrorState, EmptyState } from './SearchStates';
import { InfiniteScrollIndicator } from './InfiniteScrollIndicator';
import type { ProductSearchResponse, Product } from '@/types/api';

interface ProductSearchResultsProps {
  productSearchData?: ProductSearchResponse;
  productLoading: boolean;
  productError: Error | null;
  onProductClick: (product: Product, index: number) => void;
  onRefetch: () => void;
  searchKeyword: string;
  // 新增：无限滚动相关属性
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
}

/**
 * 商品搜索结果组件
 * 重构版本：支持无限滚动，显示底部加载状态
 */
export function ProductSearchResults({
  productSearchData,
  productLoading,
  productError,
  onProductClick,
  onRefetch,
  searchKeyword,
  isFetchingNextPage = false,
  hasNextPage = false,
}: ProductSearchResultsProps) {
  // 初始加载状态
  if (productLoading && !productSearchData?.rows?.length) {
    return <LoadingState />;
  }

  // 错误状态
  if (productError) {
    return <ErrorState error={productError} onRetry={onRefetch} />;
  }

  // 有数据时显示商品列表
  if (productSearchData?.rows?.length) {
    return (
      <>
        <ProductRecommend
          title=""
          products={productSearchData.rows}
          layout="grid"
          showMore={false}
          onProductClick={onProductClick}
        />
        
        {/* 无限滚动指示器 */}
        <InfiniteScrollIndicator
          isLoading={isFetchingNextPage}
          hasMore={hasNextPage}
          totalCount={productSearchData.total}
          loadedCount={productSearchData.rows.length}
          itemType="商品"
          className="bg-white"
        />
      </>
    );
  }

  // 空结果状态
  if (searchKeyword) {
    return <EmptyState type="product" />;
  }

  // 默认状态
  return null;
}