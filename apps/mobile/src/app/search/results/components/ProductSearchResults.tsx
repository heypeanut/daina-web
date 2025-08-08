"use client";

import React, { useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { LoadingState, ErrorState, EmptyState } from "./SearchStates";
import type { ProductSearchResponse, Product } from "@/types/api";
import {
  hasImageSearchData,
  getSimilarityScore,
} from "@/lib/utils/imageSearchAdapter";

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
  onLoadMore?: () => void;
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
  onLoadMore,
}: ProductSearchResultsProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 无限滚动触发器
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (
          target.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          onLoadMore
        ) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);
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
      <div className="bg-white">
        {/* 商品网格 */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {productSearchData.rows.map((product, index) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product, index)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* 商品图片 */}
                <div className="relative aspect-square">
                  <Image
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    priority={index < 4}
                    className="w-full h-full object-cover"
                  />
                  {product.isHot && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                      热销
                    </span>
                  )}
                  {/* 相似度标签 - 图片搜索特有 */}
                  {hasImageSearchData(product) && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      {Math.round(getSimilarityScore(product) * 100)}%
                    </div>
                  )}
                </div>

                {/* 商品信息 */}
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h4>

                  {/* 价格 */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-500 font-bold text-lg">
                      ¥{product.price?.toFixed(2) || "0.00"}
                    </span>
                  </div>

                  {/* 档口信息 */}
                  {product.boothName && (
                    <div className="text-xs text-gray-500">
                      {product.boothName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 加载更多区域 */}
          <>
            {/* 无限滚动触发区域 */}
            <div
              ref={loadMoreRef}
              className="h-6 flex items-center justify-center  my-4"
            >
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}
            </div>

            {/* 已加载完成提示 */}
            {!hasNextPage && productSearchData.rows.length > 0 && (
              <div className="text-center mt-4 text-gray-500 text-sm">
                已显示全部 {productSearchData.rows.length} 个商品
              </div>
            )}
          </>
        </div>
      </div>
    );
  }

  // 空结果状态
  if (searchKeyword) {
    return <EmptyState type="product" />;
  }

  // 默认状态
  return null;
}
