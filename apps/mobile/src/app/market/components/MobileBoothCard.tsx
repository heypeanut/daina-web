"use client";

import React from 'react';
import { Heart, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Booth } from '../../../../../src/types/booth';
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
  layout = 'grid',
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

  if (layout === 'list') {
    return (
      <div
        className={`bg-white p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center space-x-3">
          {/* 档口头像 */}
          <div className="relative">
            <ImageLazyLoader
              src={booth.avatar}
              alt={booth.title}
              width={60}
              height={60}
              className="w-15 h-15 rounded-lg object-cover"
              fallbackSrc="/cover.png"
            />
            {booth.rank && (
              <div className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
                {booth.rank}
              </div>
            )}
          </div>

          {/* 档口信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-900 truncate pr-2">
                {booth.title}
              </h3>
              <button
                data-favorite-btn
                onClick={handleFavoriteClick}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  size={16} 
                  className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'} 
                />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 truncate mb-1">
              主营: {booth.main_business?.join('、') || '暂无信息'}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{booth.address || booth.market}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {booth.phone && (
                  <Phone size={12} className="text-gray-400" />
                )}
                {booth.wx && (
                  <MessageCircle size={12} className="text-green-500" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      {/* 档口头像 */}
      <div className="relative">
        <ImageLazyLoader
          src={booth.avatar}
          alt={booth.title}
          width={200}
          height={150}
          className="w-full h-32 object-cover"
          fallbackSrc="/cover.png"
        />
        
        {/* 收藏按钮 */}
        <button
          data-favorite-btn
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-sm hover:bg-opacity-100 transition-colors"
        >
          <Heart 
            size={16} 
            className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'} 
          />
        </button>
        
        {/* 排名标识 */}
        {booth.rank && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            NO.{booth.rank}
          </div>
        )}
      </div>

      {/* 档口信息 */}
      <div className="p-3">
        <h3 className="font-medium text-gray-900 truncate mb-1">
          {booth.title}
        </h3>
        
        <p className="text-sm text-orange-600 truncate mb-2">
          {booth.main_business?.slice(0, 2).join('、') || '暂无信息'}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={12} className="mr-1" />
            <span className="truncate">{booth.market || '华强北'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            {booth.phone && (
              <Phone size={12} className="text-gray-400" />
            )}
            {booth.wx && (
              <MessageCircle size={12} className="text-green-500" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}