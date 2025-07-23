"use client";

import React from 'react';
import { Heart, MapPin} from 'lucide-react';
import { Booth } from '../../../../../../src/types/booth';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';

interface MobileBoothCardProps {
  booth: Booth;
  onCardClick: (booth: Booth) => void;
  onFavoriteClick: (booth: Booth) => void;
  isFavorited?: boolean;
  layout?: 'grid' | 'list';
  className?: string;
}

export function MobileBoothCard({
  booth,
  onCardClick,
  onFavoriteClick,
  isFavorited = false,
  className = ''
}: MobileBoothCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // 防止点击收藏按钮时触发卡片点击
    if ((e.target as Element).closest('[data-favorite-btn]')) {
      return;
    }
    onCardClick(booth);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick(booth);
  };


  // Grid layout
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      {/* 档口头像 */}
      <div className="relative overflow-hidden">
        <ImageLazyLoader
          src={booth.avatar || booth.coverImg}
          alt={booth.title || booth.boothName}
          width={200}
          height={150}
          className="w-full h-36 object-cover transition-transform duration-200 group-hover:scale-105"
          fallbackSrc="/cover.png"
        />


        {/* 收藏按钮 */}
        <button
          data-favorite-btn
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <Heart
            size={16}
            className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'}
          />
        </button>

        {/* 排名标识 */}
        {booth.rank && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md">
            NO.{booth.rank}
          </div>
        )}

      </div>

      {/* 档口信息 */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
          {booth.title || booth.boothName}
        </h3>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {((booth as any).main_business || booth.mainBusiness) ? (
            Array.isArray((booth as any).main_business) ? 
              (booth as any).main_business.slice(0, 2).map((business: string, index: number) => (
                <span
                  key={index}
                  className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs rounded-lg font-medium border border-orange-100"
                >
                  {business}
                </span>
              ))
            : 
              <span
                className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs rounded-lg font-medium border border-orange-100"
              >
                {(booth as any).main_business || booth.mainBusiness}
              </span>
          ) : (
            <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-lg">
              暂无信息
            </span>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <MapPin size={12} className="mr-1.5 text-gray-400" />
          <span className="truncate font-medium">{booth.market || '华强北'}</span>
        </div>
      </div>
    </div>
  );
}