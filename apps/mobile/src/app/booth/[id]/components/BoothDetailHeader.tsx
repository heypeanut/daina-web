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
    <div className={`bg-gradient-to-br from-white to-gray-50 px-6 py-8 ${className}`}>
      {/* 头像和基本信息 */}
      <div className="flex items-start space-x-5 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl ring-4 ring-white/50">
            <ImageLazyLoader
              src={booth.avatar}
              alt={booth.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              fallbackSrc="/cover.png"
            />
          </div>
          
          {/* 在线状态指示 */}
          {booth.isOnline && (
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900 truncate mb-2">
                {booth.title}
              </h1>
              
              {/* 认证标识 */}
              {certification?.isVerified && (
                <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                  <Shield 
                    size={16} 
                    className="text-blue-500 mr-2" 
                  />
                  <span className="text-sm text-blue-700 font-semibold">
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
              className="ml-4 w-12 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-200 group"
            >
              <Heart 
                size={24} 
                className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-red-400 group-hover:scale-110'} 
              />
            </button>
          </div>

          {/* 主营业务 */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {booth.main_business?.map((business, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-orange-100 text-orange-700 text-sm rounded-lg font-semibold border border-orange-200"
                >
                  {business}
                </span>
              )) || (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-500 text-sm rounded-lg">
                  暂无信息
                </span>
              )}
            </div>
          </div>

          {/* 评分和统计信息 */}
          {statistics && (
            <div className="flex items-center space-x-6 text-sm">
              {statistics.rating > 0 && (
                <div className="flex items-center px-3 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Star size={16} className="text-yellow-500 mr-2 fill-current" />
                  <span className="font-bold text-gray-900">
                    {statistics.rating.toFixed(1)}
                  </span>
                  <span className="ml-1 text-gray-600">
                    ({statistics.reviewCount})
                  </span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600">
                <Eye size={16} className="mr-2 text-gray-400" />
                <span className="font-medium">{statistics.viewCount}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Heart size={16} className="mr-2 text-gray-400" />
                <span className="font-medium">{statistics.favoriteCount}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
        <div className="flex items-center space-x-6">
          {booth.isOnline ? (
            <div className="flex items-center px-4 py-2 bg-green-100 rounded-full border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
              <span className="text-sm font-bold text-green-700">在线</span>
            </div>
          ) : (
            <div className="flex items-center px-4 py-2 bg-gray-100 rounded-full">
              <Clock size={16} className="mr-3 text-gray-400" />
              <span className="text-sm font-medium text-gray-500">离线</span>
            </div>
          )}
          
          {booth.businessHours && (
            <div className="text-sm text-gray-600 font-medium">
              <span>营业时间: {booth.businessHours.weekdays}</span>
            </div>
          )}
        </div>

        {booth.rank && (
          <div className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full font-bold border border-orange-200">
            第 {booth.rank} 名
          </div>
        )}
      </div>
    </div>
  );
}