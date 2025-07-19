"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crown, TrendingUp } from 'lucide-react';

interface BoothItem {
  id: string;
  boothName: string;
  description?: string;
  imageUrl: string;
  score?: number;
  market?: string;
  address?: string;
  rank?: number;
  isHot?: boolean;
}

interface BoothRecommendProps {
  title: string;
  booths: BoothItem[];
  type?: 'hot' | 'ranking' | 'latest';
  showMore?: boolean;
  onBoothClick?: (booth: BoothItem, index: number) => void;
}

export function BoothRecommend({ 
  title, 
  booths, 
  type = 'hot',
  showMore = true,
  onBoothClick 
}: BoothRecommendProps) {
  const handleBoothClick = (booth: BoothItem, index: number) => {
    if (onBoothClick) {
      onBoothClick(booth, index);
    }
  };

  if (booths.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          {type === 'ranking' && <Crown size={18} className="text-yellow-500 mr-2" />}
          {type === 'hot' && <TrendingUp size={18} className="text-orange-500 mr-2" />}
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        {showMore && (
          <Link 
            href="/market" 
            className="text-sm text-orange-500 font-medium"
          >
            更多 &gt;
          </Link>
        )}
      </div>

      {/* 档口列表 */}
      {type === 'ranking' ? (
        // 排行榜样式 - 横向滚动
        <div className="px-4 py-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {booths.slice(0, 5).map((booth, index) => (
              <div
                key={booth.id}
                className="flex-shrink-0 text-center cursor-pointer"
                onClick={() => handleBoothClick(booth, index)}
              >
                <div className="relative pt-2 pr-2">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100">
                    <Image
                      src={booth.imageUrl}
                      alt={booth.boothName}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  {/* 排名标识 */}
                  <div className={`absolute top-0 right-0 w-6 h-6 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-2 w-20 truncate">{booth.boothName}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // 列表样式
        <div className="px-4 py-2">
          {booths.slice(0, 6).map((booth, index) => (
            <div
              key={booth.id}
              className="flex items-center py-3 border-b border-gray-50 last:border-b-0 cursor-pointer active:bg-gray-50"
              onClick={() => handleBoothClick(booth, index)}
            >
              {/* 档口头像 */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 mr-3">
                <Image
                  src={booth.imageUrl}
                  alt={booth.boothName}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              
              {/* 档口信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {booth.boothName}
                  </h4>
                  {booth.isHot && (
                    <span className="ml-2 px-1 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                      热门
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {booth.description || `${booth.market} ${booth.address}`}
                </p>
              </div>
              
              {/* 评分 */}
              {booth.score && (
                <div className="text-right">
                  <span className="text-sm font-medium text-orange-500">
                    {booth.score.toFixed(1)}
                  </span>
                  <p className="text-xs text-gray-400">分</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}