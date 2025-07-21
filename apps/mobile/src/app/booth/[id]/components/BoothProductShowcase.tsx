"use client";

import React, { useState } from 'react';
import { ChevronRight, Grid, List } from 'lucide-react';
import { BoothProduct } from '../../../../../../../src/types/booth';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface BoothProductShowcaseProps {
  products: BoothProduct[];
  onProductClick: (product: BoothProduct) => void;
  loading?: boolean;
  maxDisplay?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export function BoothProductShowcase({
  products,
  onProductClick,
  loading = false,
  maxDisplay = 6,
  showViewAll = true,
  onViewAll,
  className = ''
}: BoothProductShowcaseProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const displayProducts = products.slice(0, maxDisplay);
  const hasMore = products.length > maxDisplay;

  if (loading) {
    return (
      <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">商品展示</h3>
        </div>
        <LoadingSpinner text="加载商品中..." className="py-12" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">商品展示</h3>
        </div>
        <div className="px-4 py-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Grid size={32} className="text-gray-400" />
          </div>
          <p className="text-gray-500">暂无商品信息</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">
          商品展示 ({products.length})
        </h3>
        
        <div className="flex items-center space-x-2">
          {/* 视图切换 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-400'
              }`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-400'
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <ImageLazyLoader
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={120}
                  className="w-full h-24 object-cover"
                  fallbackSrc="/cover.png"
                />
                <div className="p-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                    {product.name}
                  </h4>
                  {product.price ? (
                    <p className="text-orange-600 font-semibold text-sm">
                      ¥{product.price}
                    </p>
                  ) : product.priceRange ? (
                    <p className="text-orange-600 font-semibold text-sm">
                      ¥{product.priceRange[0]}-{product.priceRange[1]}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">价格面议</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {displayProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ImageLazyLoader
                  src={product.image}
                  alt={product.name}
                  width={60}
                  height={60}
                  className="w-12 h-12 rounded-lg object-cover"
                  fallbackSrc="/cover.png"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500 truncate">
                    {product.category || '未分类'}
                  </p>
                </div>
                <div className="text-right">
                  {product.price ? (
                    <p className="text-orange-600 font-semibold text-sm">
                      ¥{product.price}
                    </p>
                  ) : product.priceRange ? (
                    <p className="text-orange-600 font-semibold text-sm">
                      ¥{product.priceRange[0]}-{product.priceRange[1]}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">面议</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 查看更多 */}
        {hasMore && showViewAll && onViewAll && (
          <button
            onClick={onViewAll}
            className="w-full mt-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <span>查看全部商品</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        )}
      </div>
    </div>
  );
}