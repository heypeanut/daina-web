import React from "react";
import type { Banner as BannerType } from "@/types/api";

interface StaticBannerProps {
  banners: BannerType[];
}

// 静态Banner组件 - 提供SEO友好的静态内容
export function StaticBanner({ banners }: StaticBannerProps) {
  if (banners.length === 0) {
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">暂无轮播图</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden">
      {/* 静态显示第一张图片用于SEO */}
      <div className="w-full h-full relative">
        <img
          src={banners[0].imageUrl}
          alt={banners[0].title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 代拿网品牌标识 */}
      <div className="absolute top-3 right-3 bg-black/20 text-white text-xs px-2 py-1 rounded">
        代拿网
      </div>
    </div>
  );
}
