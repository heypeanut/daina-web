"use client";

import React from 'react';
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

interface ProductRecommendProps {
  title: string;
  products: ProductItem[];
  layout?: 'grid' | 'list';
  showMore?: boolean;
  onProductClick?: (product: ProductItem, index: number) => void;
}

export function ProductRecommend({ 
  title, 
  products, 
  layout = 'grid',
  showMore = true,
  onProductClick 
}: ProductRecommendProps) {
  const handleProductClick = (product: ProductItem, index: number) => {
    if (onProductClick) {
      onProductClick(product, index);
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-2">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <TrendingUp size={18} className="text-red-500 mr-2" />
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        {showMore && (
          <Link 
            href="/products" 
            className="text-sm text-orange-500 font-medium"
          >
            更多 &gt;
          </Link>
        )}
      </div>

      {/* 商品列表 */}
      {layout === 'grid' ? (
        // 网格布局 - 2列
        <div className="grid grid-cols-2 gap-3 p-4">
          {products.slice(0, 6).map((product, index) => (
            <div
              key={product.id}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer active:bg-gray-50 transition-colors"
              onClick={() => handleProductClick(product, index)}
            >
              {/* 商品图片 */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.isHot && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                    热销
                  </div>
                )}
              </div>
              
              {/* 商品信息 */}
              <div className="p-3">
                <h4 className="text-sm text-gray-900 font-medium truncate mb-1">
                  {product.name}
                </h4>
                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}
                
                {/* 价格和评分 */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-red-500">
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
            </div>
          ))}
        </div>
      ) : (
        // 列表布局
        <div className="px-4 py-2">
          {products.slice(0, 8).map((product, index) => (
            <div
              key={product.id}
              className="flex items-center py-3 border-b border-gray-50 last:border-b-0 cursor-pointer active:bg-gray-50"
              onClick={() => handleProductClick(product, index)}
            >
              {/* 商品图片 */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-3">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              
              {/* 商品信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  {product.isHot && (
                    <span className="ml-2 px-1 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                      热销
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-red-500">
                    ¥{product.price.toFixed(2)}
                  </span>
                  {product.boothName && (
                    <span className="text-xs text-gray-400">
                      {product.boothName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}