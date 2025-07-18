"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { Star, MapPin } from 'lucide-react';
import { useBoothRecommendations, useBehaviorTracking } from '@/hooks/useApi';
import type { Booth } from '@/types/api';

interface InfiniteBoothRecommendProps {
  title: string;
  type: 'booth_hot' | 'booth_new';
  layout: 'ranking' | 'hot';
  pageSize?: number;
}

export function InfiniteBoothRecommend({
  title,
  type,
  layout,
  pageSize = 10
}: InfiniteBoothRecommendProps) {
  const { items, loading, hasMore, loadMore, error } = useBoothRecommendations(type, pageSize);
  const { recordBehavior } = useBehaviorTracking();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleBoothClick = useCallback((booth: Booth, index: number) => {
    recordBehavior('click', 'booth', booth.id, {
      source: 'homepage',
      section: type,
      position: index,
      algorithm: type === 'booth_hot' ? 'hot' : 'new',
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
          <p>暂无推荐内容</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      <div className="space-y-3">
        {items.map((booth, index) => (
          <div
            key={booth.id}
            onClick={() => handleBoothClick(booth, index)}
            className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer transition-all active:scale-95 ${
              layout === 'ranking' ? 'pt-2 pr-2' : ''
            }`}
          >
            {/* 排名标识 */}
            {layout === 'ranking' && booth.rank && (
              <div className="absolute top-0 right-0 z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                  booth.rank === 1 ? 'bg-yellow-500' :
                  booth.rank === 2 ? 'bg-gray-400' :
                  booth.rank === 3 ? 'bg-yellow-600' :
                  'bg-gray-300'
                }`}>
                  {booth.rank}
                </div>
              </div>
            )}

            {/* Hot标识 */}
            {layout === 'hot' && booth.isHot && (
              <div className="absolute top-2 right-2 z-10">
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  HOT
                </span>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-15 h-15 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                  <img
                    src={booth.coverImage}
                    alt={booth.boothName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-medium text-gray-900 truncate">
                    {booth.boothName}
                  </h3>

                  {booth.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {booth.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {booth.score}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-500">
                        <MapPin size={14} />
                        <span className="text-sm">
                          {booth.market} {booth.address}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={observerRef} className="py-4">
          {loading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            </div>
          )}
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部档口
        </div>
      )}
    </div>
  );
}