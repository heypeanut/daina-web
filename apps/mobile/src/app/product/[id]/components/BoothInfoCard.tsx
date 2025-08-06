"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';
import { ProductBooth } from '../types';

interface BoothInfoCardProps {
  booth: ProductBooth;
  onBoothClick?: (boothId: string) => void;
  onFollowClick?: (boothId: string) => void;
  className?: string;
}

export function BoothInfoCard({
  booth,
  onBoothClick,
  onFollowClick,
  className = ''
}: BoothInfoCardProps) {
  const handleBoothClick = () => {
    onBoothClick?.(booth.id);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFollowClick?.(booth.id);
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* 店铺基本信息 */}
      <div className="px-4 py-4">
        <div className="flex gap-3">
          {/* 店铺头像 */}
          <div className="w-24 h-24 flex-shrink-0">
            <ImageLazyLoader
              src={booth.coverImg || ''}
              alt={booth.boothName}
              width={96}
              height={96}
              className="rounded-lg"
            />
          </div>

          {/* 店铺名称和状态 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
              {booth.boothName}
            </h3>
            <span className="inline-block text-white text-xs font-medium bg-black/20 backdrop-blur-sm px-1.5 py-0.5 rounded-md">
              {booth.mainBusiness}
            </span>
            {/* <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                状态: {booth.status === '1' ? '营业中' : '休息中'}
              </span>
            </div> */}
          </div>

          {/* 关注按钮 */}
          <button
            onClick={handleFollowClick}
            className="bg-red-500 h-10 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
          >
            关注
          </button>
        </div>

        {/* 店铺操作按钮 */}
        {/* <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleBoothClick}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>进店逛逛</span>
            <ChevronRight size={16} />
          </button>
          <button
            onClick={handleBoothClick}
            className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>全部宝贝</span>
            <ChevronRight size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
}