"use client";

import React from 'react';
import { Heart, Star, Shield, Clock, Eye } from 'lucide-react';
import { BoothDetail } from '../../../../../../../src/types/booth';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';

interface BoothDetailHeaderProps {
  booth: BoothDetail;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  className?: string;
}

export function BoothDetailHeader({
  booth,
  isFavorited,
  onFavoriteToggle,
  className = ''
}: BoothDetailHeaderProps) {
  const statistics = booth.statistics;
  const certification = booth.certification;

  return (
    <div className={`bg-white px-4 py-6 ${className}`}>
      {/* 头像和基本信息 */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <ImageLazyLoader
            src={booth.avatar}
            alt={booth.title}
            width={80}
            height={80}
            className="w-20 h-20 rounded-xl object-cover shadow-sm"
            fallbackSrc="/cover.png"
          />
          
          {/* 在线状态指示 */}
          {booth.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {booth.title}
              </h1>
              
              {/* 认证标识 */}
              {certification?.isVerified && (
                <div className="flex items-center mt-1">
                  <Shield 
                    size={14} 
                    className="text-blue-500 mr-1" 
                  />
                  <span className="text-xs text-blue-600 font-medium">
                    {certification.verificationType === 'premium' && '高级认证'}
                    {certification.verificationType === 'business' && '企业认证'}
                    {certification.verificationType === 'personal' && '个人认证'}
                  </span>
                </div>
              )}
            </div>

            {/* 收藏按钮 */}
            <button
              onClick={onFavoriteToggle}
              className="ml-3 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Heart 
                size={20} 
                className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'} 
              />
            </button>
          </div>

          {/* 主营业务 */}
          <div className="mb-3">
            <p className="text-sm text-orange-600 font-medium">
              主营: {booth.main_business?.join('、') || '暂无信息'}
            </p>
          </div>

          {/* 评分和统计信息 */}
          {statistics && (
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              {statistics.rating > 0 && (
                <div className="flex items-center">
                  <Star size={14} className="text-yellow-500 mr-1 fill-current" />
                  <span className="font-medium text-gray-900">
                    {statistics.rating.toFixed(1)}
                  </span>
                  <span className="ml-1">
                    ({statistics.reviewCount}评价)
                  </span>
                </div>
              )}
              
              <div className="flex items-center">
                <Eye size={14} className="mr-1" />
                <span>{statistics.viewCount}浏览</span>
              </div>
              
              <div className="flex items-center">
                <Heart size={14} className="mr-1" />
                <span>{statistics.favoriteCount}收藏</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          {booth.isOnline ? (
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium">在线</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-400">
              <Clock size={14} className="mr-2" />
              <span className="text-sm">离线</span>
            </div>
          )}
          
          {booth.businessHours && (
            <div className="text-sm text-gray-500">
              <span>营业时间: {booth.businessHours.weekdays}</span>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-400">
          {booth.rank && `排名 #${booth.rank}`}
        </div>
      </div>
    </div>
  );
}