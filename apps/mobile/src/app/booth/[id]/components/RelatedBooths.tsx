"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BoothDetail } from '../../../../../../../src/types/booth';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface RelatedBoothsProps {
  booths: BoothDetail[];
  onBoothClick: (booth: BoothDetail) => void;
  onViewAll?: () => void;
  loading?: boolean;
  className?: string;
}

export function RelatedBooths({
  booths,
  onBoothClick,
  onViewAll,
  loading = false,
  className = ''
}: RelatedBoothsProps) {
  if (loading) {
    return (
      <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">相关推荐</h3>
        </div>
        <LoadingSpinner text="加载推荐中..." className="py-8" />
      </div>
    );
  }

  if (booths.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">相关推荐</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors"
          >
            <span>查看更多</span>
            <ChevronRight size={16} className="ml-1" />
          </button>
        )}
      </div>

      {/* 推荐列表 */}
      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-3">
          {booths.slice(0, 4).map((booth) => (
            <div
              key={booth.id}
              onClick={() => onBoothClick(booth)}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <ImageLazyLoader
                src={booth.avatar}
                alt={booth.title}
                width={150}
                height={100}
                className="w-full h-20 object-cover"
                fallbackSrc="/cover.png"
              />
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
                  {booth.title}
                </h4>
                <p className="text-xs text-gray-500 truncate mb-2">
                  {booth.main_business?.slice(0, 2).join('、') || '暂无信息'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {booth.market || '华强北'}
                  </span>
                  {booth.statistics?.rating && (
                    <div className="flex items-center">
                      <span className="text-xs text-yellow-500">★</span>
                      <span className="text-xs text-gray-600 ml-1">
                        {booth.statistics.rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 水平滚动版本（当空间不足时的备选方案） */}
        {booths.length > 4 && (
          <div className="mt-4 -mx-4">
            <div className="flex space-x-3 px-4 overflow-x-auto scrollbar-hide">
              {booths.slice(4, 8).map((booth) => (
                <div
                  key={booth.id}
                  onClick={() => onBoothClick(booth)}
                  className="flex-shrink-0 w-32 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                >
                  <ImageLazyLoader
                    src={booth.avatar}
                    alt={booth.title}
                    width={128}
                    height={80}
                    className="w-full h-16 object-cover"
                    fallbackSrc="/cover.png"
                  />
                  <div className="p-2">
                    <h4 className="text-xs font-medium text-gray-900 truncate">
                      {booth.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {booth.market || '华强北'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}