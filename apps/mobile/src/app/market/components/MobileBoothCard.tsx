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
        className={`bg-white mx-3 mb-3 rounded-xl p-4 shadow-md hover:shadow-lg active:scale-98 transition-all duration-200 cursor-pointer border border-gray-100/50 ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex items-center space-x-4">
          {/* 档口头像 */}
          <div className="relative">
            <ImageLazyLoader
              src={booth.avatar}
              alt={booth.title}
              width={60}
              height={60}
              className="w-16 h-16 rounded-xl object-cover shadow-sm"
              fallbackSrc="/cover.png"
            />
            {booth.rank && (
              <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                {booth.rank}
              </div>
            )}
            {booth.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* 档口信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-gray-900 truncate pr-2 text-base">
                {booth.title}
              </h3>
              <button
                data-favorite-btn
                onClick={handleFavoriteClick}
                className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 hover:scale-110 transition-all duration-200 group"
              >
                <Heart 
                  size={18} 
                  className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400'} 
                />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-2">
              {booth.main_business?.slice(0, 2).map((business, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-md font-medium border border-orange-100"
                >
                  {business}
                </span>
              )) || (
                <span className="text-sm text-gray-500">暂无信息</span>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={13} className="mr-1.5 text-gray-400" />
                <span className="truncate font-medium">{booth.address || booth.market}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {booth.phone && (
                  <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                    <Phone size={12} className="text-blue-500" />
                  </div>
                )}
                {booth.wx && (
                  <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                    <MessageCircle size={12} className="text-green-500" />
                  </div>
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
      className={`bg-white rounded-2xl shadow-lg border-0 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group ${className}`}
      onClick={handleCardClick}
    >
      {/* 档口头像 */}
      <div className="relative overflow-hidden">
        <ImageLazyLoader
          src={booth.avatar}
          alt={booth.title}
          width={200}
          height={150}
          className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-110"
          fallbackSrc="/cover.png"
        />
        
        {/* 遮罩渐变 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* 收藏按钮 */}
        <button
          data-favorite-btn
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <Heart 
            size={18} 
            className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'} 
          />
        </button>
        
        {/* 排名标识 */}
        {booth.rank && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
            NO.{booth.rank}
          </div>
        )}
        
        {/* 在线状态 */}
        {booth.isOnline && (
          <div className="absolute bottom-3 left-3 flex items-center px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-full">
            <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
            <span className="text-white text-xs font-medium">在线</span>
          </div>
        )}
      </div>

      {/* 档口信息 */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 truncate mb-2 text-base">
          {booth.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {booth.main_business?.slice(0, 3).map((business, index) => (
            <span 
              key={index}
              className="px-2 py-1 bg-orange-50 text-orange-600 text-xs rounded-md font-medium border border-orange-100"
            >
              {business}
            </span>
          )) || (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
              暂无信息
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={13} className="mr-1.5 text-gray-400" />
            <span className="truncate font-medium">{booth.market || '华强北'}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {booth.phone && (
              <div className="w-6 h-6 bg-blue-50 rounded-full flex items-center justify-center">
                <Phone size={12} className="text-blue-500" />
              </div>
            )}
            {booth.wx && (
              <div className="w-6 h-6 bg-green-50 rounded-full flex items-center justify-center">
                <MessageCircle size={12} className="text-green-500" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}