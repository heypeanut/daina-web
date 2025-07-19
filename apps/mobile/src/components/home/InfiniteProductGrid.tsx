"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, TrendingUp } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  boothId?: string;
  boothName?: string;
  score?: number;
  sales?: number;
  isHot?: boolean;
}

interface InfiniteProductGridProps {
  title: string;
  initialProducts: ProductItem[];
  loadMore?: (page: number) => Promise<{products: ProductItem[], hasMore: boolean}>;
  onProductClick?: (product: ProductItem, index: number) => void;
}

export function InfiniteProductGrid({ 
  title, 
  initialProducts,
  loadMore,
  onProductClick 
}: InfiniteProductGridProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const handleProductClick = (product: ProductItem, index: number) => {
    if (onProductClick) {
      onProductClick(product, index);
    }
  };

  const loadMoreProducts = useCallback(async () => {
    if (loading || !hasMore || !loadMore) return;

    setLoading(true);
    try {
      const result = await loadMore(page + 1);
      setProducts(prev => [...prev, ...result.products]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('加载更多商品失败:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, loadMore]);

  // 无限滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreProducts]);

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-2">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <TrendingUp size={18} className="text-orange-500 mr-2" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        <span className="text-sm text-gray-500">共{products.length}件商品</span>
      </div>

      {/* 商品网格 */}
      <div className="grid grid-cols-2 gap-3 p-4">
        {products.map((product, index) => (
          <Link
            key={`${product.id}-${index}`}
            href={`/product/${product.id}`}
            onClick={() => handleProductClick(product, index)}
            className="bg-white border border-gray-100 rounded-lg overflow-hidden active:bg-gray-50 transition-colors"
          >
            {/* 商品图片 */}
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
              {product.isHot && (
                <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                  热销
                </div>
              )}
            </div>
            
            {/* 商品信息 */}
            <div className="p-3">
              <h3 className="text-sm text-gray-900 font-medium truncate mb-1">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                  {product.description}
                </p>
              )}
              
              {/* 价格和评分 */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-orange-500">
                  ¥{product.price.toFixed(2)}
                </span>
                {product.score && (
                  <div className="flex items-center">
                    <Star size={12} className="text-yellow-400 fill-current mr-1" />
                    <span className="text-xs text-gray-600">
                      {product.score.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* 档口信息 */}
              {product.boothName && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {product.boothName}
                </p>
              )}
              
              {/* 销量 */}
              {product.sales && (
                <p className="text-xs text-gray-400 mt-1">
                  {product.sales}人已买
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="flex items-center text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
            <span className="text-sm">加载中...</span>
          </div>
        </div>
      )}

      {/* 没有更多数据 */}
      {!hasMore && products.length > initialProducts.length && (
        <div className="text-center py-6 text-sm text-gray-500">
          已加载全部商品
        </div>
      )}
    </div>
  );
}