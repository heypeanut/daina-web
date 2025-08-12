import React, { useState, useEffect, useRef } from "react";
import Masonry from "react-masonry-css";
import { Grid, List, ChevronDown, Package, Loader2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  views: number;
  createdAt: string;
  description?: string;
}

interface ProductShowcaseProps {
  products: Product[];
  total?: number;
  onProductClick: (product: Product) => void;
  loading?: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
}

type SortOption = "default" | "price_low" | "price_high" | "newest";
type ViewMode = "grid" | "list";

const sortOptions = [
  { value: "default", label: "默认排序" },
  { value: "newest", label: "上新优先" },
  { value: "price_low", label: "价格从低到高" },
  { value: "price_high", label: "价格从高到低" },
];

export function ProductShowcase({
  products = [],
  total = 0,
  onProductClick,
  loading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  className = "",
}: ProductShowcaseProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // 瀑布流列数配置 - 移动端固定2列
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    640: 2,
    480: 2
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore && onLoadMore) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Sort products based on selected option
  const sortedProducts = React.useMemo(() => {
    const sorted = [...products];

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
  }, [products, sortBy]);

  const ProductCard = ({
    product,
    isGridView,
  }: {
    product: Product;
    isGridView: boolean;
  }) => {
    // 判断是否为新品（7天内的商品）
    const isNewProduct = () => {
      const now = new Date();
      const createdDate = new Date(product.createdAt);
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 7;
    };

    // 判断是否有特价（有原价且原价高于现价）
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const hasNewTag = isNewProduct();

    if (isGridView) {
      return (
        <div
          onClick={() => onProductClick(product)}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Product image */}
          <div className="relative aspect-square">
            <ImageLazyLoader
              src={product.coverImage || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Tags */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasNewTag && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  新品
                </span>
              )}
              {hasDiscount && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  特价
                </span>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h4>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 font-bold text-lg">
                ¥{product.price?.toFixed(2) || "0.00"}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Views info */}
            <div className="text-xs text-gray-500">
              <span>浏览 {product.views || 0}</span>
            </div>
          </div>
        </div>
      );
    }

    // List view
    return (
      <div
        onClick={() => onProductClick(product)}
        className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3">
          {/* Product image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <ImageLazyLoader
              src={product.coverImage || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
            {hasNewTag && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                新
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              {product.name}
            </h4>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500 font-bold">
                ¥{product.price?.toFixed(2) || "0.00"}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-xs line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              <span>浏览 {product.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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
            {total > products.length && (
              <p className="text-xs text-gray-500 mt-1">
                已加载 {products.length} 个，共 {total} 个商品
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
        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-gray-100 text-gray-700 py-2 px-3 pr-8 rounded text-sm border-0 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>
        </div>
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
              />
            ))}
          </div>
        )}

        {/* 加载更多 */}
        {sortedProducts.length > 0 && (
          <>
            {/* 无限滚动触发区域 */}
            <div ref={loadMoreRef} className="h-6 flex items-center justify-center">
              {isLoadingMore && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">加载中...</span>
                </div>
              )}
            </div>

            {/* 已加载完成提示 */}
            {!hasMore && products.length > 0 && (
              <div className="text-center mt-4 text-gray-500 text-sm">
                已显示全部 {products.length} 个商品
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
