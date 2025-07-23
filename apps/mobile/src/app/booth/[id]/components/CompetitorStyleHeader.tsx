"use client";

import React from 'react';
import { BoothDetail } from '@/lib/api/booth';
import {
  Star, Crown, Heart, Share2,
  MapPin
} from 'lucide-react';

interface CompetitorStyleHeaderProps {
  booth: BoothDetail;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onShareClick: () => void;
  className?: string;
}

export function CompetitorStyleHeader({
  booth,
  isFavorited,
  onFavoriteToggle,
  onShareClick,
  className = ""
}: CompetitorStyleHeaderProps) {
  const getRankingBadge = (rank?: string) => {
    if (!rank) return null;

    const rankNum = parseInt(rank);
    let bgColor = "bg-orange-500";
    let crownColor = "text-yellow-300";

    if (rankNum === 1) {
      bgColor = "bg-gradient-to-r from-yellow-400 to-yellow-600";
      crownColor = "text-yellow-100";
    } else if (rankNum === 2) {
      bgColor = "bg-gradient-to-r from-gray-300 to-gray-500";
      crownColor = "text-gray-100";
    } else if (rankNum === 3) {
      bgColor = "bg-gradient-to-r from-orange-400 to-orange-600";
      crownColor = "text-orange-100";
    }

    return (
      <div className={`inline-flex items-center px-3 py-1.5 rounded-full ${bgColor} shadow-sm`}>
        <Crown size={14} className={`mr-1.5 ${crownColor}`} />
        <span className="text-sm font-bold text-white">
          排名第 {rank} 名
        </span>
      </div>
    );
  };

  const getBusinessTags = () => {
    const businesses = booth.mainBusiness?.split('、') || [];
    return businesses.slice(0, 3).map((business, index) => (
      <span
        key={index}
        className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
      >
        {business}
      </span>
    ));
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header with clean white background */}
      <div className="relative">
        {/* Content */}
        <div className="px-4 pt-6 pb-4">
          {/* Top row - Ranking badge */}
          <div className="mb-4">
            {getRankingBadge('1')}
          </div>

          {/* Main booth info */}
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={booth.coverImg}
                alt={booth.boothName}
                className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm"
                onError={(e) => {
                  e.currentTarget.src = '/logo.png';
                }}
              />
              {booth.certification?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Crown size={12} className="text-white" />
                </div>
              )}
            </div>

            {/* Booth details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 mb-1 truncate flex-1">
                  {booth.boothName}
                </h1>

                {/* Small favorite and share icons */}
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={onFavoriteToggle}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isFavorited
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isFavorited ? 'fill-current' : ''}
                    />
                  </button>

                  <button
                    onClick={onShareClick}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
              </div>

              {/* Location info */}
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin size={14} className="mr-1" />
                <span className="font-medium">{booth.market}</span>
                {booth.address && <span className="ml-2">{booth.address}</span>}
              </div>

              {/* Business tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {getBusinessTags()}
              </div>

              {/* Rating and stats */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                {booth.statistics?.rating && (
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span>{booth.statistics.rating.toFixed(1)}</span>
                  </div>
                )}
                <span>{booth.statistics?.favoriteCount || 0} 关注</span>
                <span>{booth.statistics?.viewCount || 0} 浏览</span>

                {/* 近期上新和人气值 */}
                <span className="text-green-600">36 近期上新</span>
                <span className="text-purple-600">25605 人气值</span>
              </div>
            </div>
          </div>

          {/* Service promises */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-100">
            <h4 className="text-sm font-medium text-gray-900 mb-2">服务承诺</h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1 text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>支持退货</span>
              </div>
              <div className="flex items-center gap-1 text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>质量保证</span>
              </div>
              <div className="flex items-center gap-1 text-green-700">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span>快速发货</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}