"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, Share2, MapPin } from "lucide-react";
import { Booth } from "@/types/booth";

interface CompetitorStyleHeaderProps {
  booth: Booth;
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
  className = "",
}: CompetitorStyleHeaderProps) {
  // 图片状态管理，处理类型安全和错误处理
  const [imageSrc, setImageSrc] = useState<string>(
    booth.coverImg || "/logo.png"
  );

  // const getRankingBadge = (rank?: string) => {
  //   if (!rank) return null;

  //   const rankNum = parseInt(rank);
  //   let bgColor = "bg-orange-500";
  //   let crownColor = "text-yellow-300";

  //   if (rankNum === 1) {
  //     bgColor = "bg-gradient-to-r from-yellow-400 to-yellow-600";
  //     crownColor = "text-yellow-100";
  //   } else if (rankNum === 2) {
  //     bgColor = "bg-gradient-to-r from-gray-300 to-gray-500";
  //     crownColor = "text-gray-100";
  //   } else if (rankNum === 3) {
  //     bgColor = "bg-gradient-to-r from-orange-400 to-orange-600";
  //     crownColor = "text-orange-100";
  //   }

  //   return (
  //     <div
  //       className={`inline-flex items-center px-3 py-1.5 rounded-full ${bgColor} shadow-sm`}
  //     >
  //       <Crown size={14} className={`mr-1.5 ${crownColor}`} />
  //       <span className="text-sm font-bold text-white">排名第 {rank} 名</span>
  //     </div>
  //   );
  // };

  const getBusinessTags = () => {
    const businesses = booth.mainBusiness?.split("、") || [];
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
          {/* <div className="mb-4">
            {getRankingBadge('1')}
          </div> */}

          {/* Main booth info */}
          <div className="flex items-start gap-4 mb-2">
            {/* Avatar */}
            <div className="relative">
              <Image
                src={imageSrc}
                alt={booth?.boothName || ""}
                width={96}
                height={96}
                className="rounded-lg border-2 border-gray-200 shadow-sm"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onError={() => setImageSrc("/logo.png")}
                priority={false}
              />
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
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isFavorited ? "fill-current" : ""}
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
              <div className="text-sm mb-2">
                {/* 第一行：图标 + 市场名称 */}
                <div className="flex items-center mb-1">
                  <MapPin
                    size={14}
                    className="mr-1.5 text-gray-500 flex-shrink-0"
                  />
                  <span className="font-semibold text-gray-800">
                    {booth.marketLabel}
                  </span>
                </div>

                {/* 第二行：地址信息（与图标对齐） */}
                {booth.address && (
                  <div className="ml-5.5 text-gray-500">{booth.address}</div>
                )}
              </div>

              {/* Business tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {getBusinessTags()}
              </div>

              {/* Rating and stats */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <span>{booth.followers || 0} 关注</span>
                <span>{booth.view || 0} 浏览</span>

                {/* 近期上新和人气值 */}
                {/* <span className="text-green-600">36 近期上新</span> */}
                {/* <span className="text-purple-600">25605 人气值</span> */}
              </div>
            </div>
          </div>

          {/* Service promises */}
          {/* <div className="bg-green-50 rounded-lg p-3 border border-green-100">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
