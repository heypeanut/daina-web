"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BoothProduct } from "@/lib/api/booth";
import { Grid, List, ChevronDown, Star, Crown, Package } from "lucide-react";
import { ProductShowcaseSkeleton } from "./BoothDetailSkeleton";

interface CompetitorProductShowcaseProps {
  products: BoothProduct[];
  onProductClick: (product: BoothProduct) => void;
  loading?: boolean;
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

export function CompetitorProductShowcase({
  products = [],
  onProductClick,
  loading = false,
  className = "",
}: CompetitorProductShowcaseProps) {
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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
    product: BoothProduct;
    isGridView: boolean;
  }) => {
    const hasNewTag = Math.random() > 0.7; // Simulate new products
    const hasDiscount = product.price && Math.random() > 0.8;
    const originalPrice = hasDiscount ? product.price! * 1.2 : undefined;

    if (isGridView) {
      return (
        <div
          onClick={() => onProductClick(product)}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Product image */}
          <div className="relative aspect-square">
            <Image
              src={product.image || "/placeholder-product.png"}
              alt={product.name}
              fill
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

            {/* Crown for featured products */}
            {Math.random() > 0.8 && (
              <div className="absolute top-2 right-2">
                <Crown size={16} className="text-yellow-500" />
              </div>
            )}
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
              {originalPrice && (
                <span className="text-gray-400 text-sm line-through">
                  ¥{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Additional info */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>已售 {Math.floor(Math.random() * 999) + 1}</span>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span>{(4.0 + Math.random()).toFixed(1)}</span>
              </div>
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
            <Image
              src={product.image || "/placeholder-product.png"}
              alt={product.name}
              fill
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
              {originalPrice && (
                <span className="text-gray-400 text-xs line-through">
                  ¥{originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>已售 {Math.floor(Math.random() * 999) + 1}</span>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span>{(4.0 + Math.random()).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <ProductShowcaseSkeleton viewMode={viewMode} />;
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            商品展示 ({products.length})
          </h3>

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

          {/* Filter button */}
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded text-sm transition-colors"
          >
            <Filter size={14} />
            <span>筛选</span>
          </button> */}
        </div>

        {/* Expandable filters */}
        {/* {showFilters && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1 bg-white text-gray-700 rounded text-sm border hover:bg-gray-50">
                全部分类
              </button>
              <button className="px-3 py-1 bg-white text-gray-700 rounded text-sm border hover:bg-gray-50">
                手机壳
              </button>
              <button className="px-3 py-1 bg-white text-gray-700 rounded text-sm border hover:bg-gray-50">
                保护套
              </button>
              <button className="px-3 py-1 bg-white text-gray-700 rounded text-sm border hover:bg-gray-50">
                配件
              </button>
            </div>
          </div>
        )} */}
      </div>

      {/* Products grid/list */}
      <div className="px-4 py-4">
        {sortedProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>暂无商品</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"
            }
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isGridView={viewMode === "grid"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
