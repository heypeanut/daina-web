import React, { useState } from "react";
import Masonry from "react-masonry-css";
import { Grid, List, ChevronDown, Package } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import { useInfiniteProducts } from "../hooks";
import { useParams } from "react-router-dom";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import type { BoothProduct } from "@/types/booth";
import { InitStatus } from "./init-status";
import { FilterBar, type SortOption } from "./filter-bar";
import { ProductCard } from "./product-card";

interface ProductShowcaseProps {
  onProductClick: (product: BoothProduct) => void;
  className?: string;
}

type ViewMode = "grid" | "list";



export function ProductShowcase({
  onProductClick,
  className = "",
}: ProductShowcaseProps) {
  const { id: boothId } = useParams<{ id: string }>();
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  
  const { 
    allData: allProducts,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  } = useInfiniteProducts(boothId || '', 12);
  // 无限滚动处理
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    loadMore,
    {
      hasMore,
      isLoading: isLoadingMore,
    }
  );

  // 瀑布流列数配置 - 移动端固定2列
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    640: 2,
    480: 2
  };

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    const sorted = [...allProducts];
    switch (sortBy) {
      case "price_low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price_high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        // Assume newer products have higher IDs or use a timestamp
        return sorted.reverse();
      default:
        return sorted;
    }
  }, [allProducts, sortBy]);
  
  if (error) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="px-4 py-6">
          <div className="text-center py-8 text-gray-500">
            <p>加载失败，请稍后重试</p>
          </div>
        </div>
      </div>
    );
  }

  // 初始加载状态
  if (allProducts.length === 0 && isLoadingInitial) {
    return (
      <InitStatus className={className} />
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              商品展示
            </h3>
            {allProducts.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                已加载 {allProducts.length} 个商品
              </p>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
       <FilterBar sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* Products grid/list */}
      <div className="px-4 py-4">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>暂无商品</p>
          </div>
        ) : viewMode === "grid" ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-3 w-auto"
            columnClassName="pl-3 bg-clip-padding"
          >
            {sortedProducts.map((product) => (
              <div key={product.id} className="mb-3">
                <ProductCard
                  product={product}
                  isGridView={true}
                  onProductClick={onProductClick}
                />
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="space-y-3">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isGridView={false}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* 无限滚动触发器 */}
      {shouldShowTrigger && (
        <div 
          ref={triggerRef}
          className="py-2"
        />
      )}

      {/* 加载状态提示 */}
      {isLoadingMore && (
        <div className="w-full flex justify-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-600 font-medium">
              加载更多...
            </span>
          </div>
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部商品
        </div>
      )}
    </div>
  );
}
