import React from "react";
import Image from "next/image";
import type { Banner as BannerType } from "@/types/api";

interface StaticBannerProps {
  banners: BannerType[];
}

// Server Component - 提供SEO友好的静态内容
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
        <Image
          src={banners[0].imageUrl}
          alt={banners[0].title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* 结构化数据用于SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: "代拿网轮播图",
              description: "代拿网移动端首页轮播图展示",
              image: banners.map((banner) => ({
                "@type": "ImageObject",
                url: banner.imageUrl,
                name: banner.title,
                contentUrl: banner.linkUrl,
              })),
            }),
          }}
        />
      </div>

      {/* 代拿网品牌标识 */}
      <div className="absolute top-3 right-3 bg-black/20 text-white text-xs px-2 py-1 rounded">
        代拿网
      </div>
    </div>
  );
}
