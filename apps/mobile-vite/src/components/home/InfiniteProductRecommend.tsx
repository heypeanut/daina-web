"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import { useProductRecommendations, useBehaviorTracking } from '@/hooks/useApi';
import type { Product } from '@/types/api';

interface InfiniteProductRecommendProps {
  title: string;
  type: 'product_hot' | 'product_new';
  layout: 'grid' | 'list';
  pageSize?: number;
}

export function InfiniteProductRecommend({ 
  title, 
  type, 
  layout,
  pageSize = 12 
}: InfiniteProductRecommendProps) {
  const { items, loading, hasMore, loadMore, error } = useProductRecommendations(type, pageSize);
  const { recordBehavior } = useBehaviorTracking();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleProductClick = useCallback((product: Product, index: number) => {
    recordBehavior('click', 'product', product.id.toString(), {
      source: 'homepage',
      section: type,
      position: index,
      algorithm: type === 'product_hot' ? 'hot' : 'new',
      boothId: product.boothId,
    });
  }, [recordBehavior, type]);

  // 无限滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  if (error) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>加载失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>暂无推荐商品</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      
      {layout === 'grid' ? (
        <div className="grid grid-cols-2 gap-3">
          {items.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product, index)}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all active:scale-95"
            >
              <div className="relative">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                
                {/* Hot标识 */}
                {product.isHot && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      HOT
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-orange-600">
                    ¥{product.price}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600">
                      {product.score}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="truncate">{product.boothName}</span>
                  {product.sales && (
                    <span>销量{product.sales}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((product, index) => (
            <div 
              key={product.id}
              onClick={() => handleProductClick(product, index)}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all active:scale-95"
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-gray-900 line-clamp-2 mb-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        ¥{product.price}
                      </span>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span>{product.score}</span>
                        </div>
                        
                        {product.sales && (
                          <span>销量{product.sales}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={observerRef} className="py-4">
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
          )}
        </div>
      )}
      
      {/* 已加载全部提示 */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部商品
        </div>
      )}
    </div>
  );
}