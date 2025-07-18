"use client";

import React from 'react';
import { Banner } from './Banner';
import { StaticBanner } from './StaticBanner';

interface BannerItem {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkType?: 'product' | 'booth' | 'external';
  targetId?: string;
}

interface InteractiveBannerProps {
  banners: BannerItem[];
  autoPlay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerItem) => void;
  enableInteraction?: boolean;
}

// 混合组件：服务端渲染静态内容，客户端添加交互
export function InteractiveBanner({ 
  banners, 
  autoPlay = true, 
  interval = 4000,
  onBannerClick,
  enableInteraction = true
}: InteractiveBannerProps) {
  // 在客户端环境下使用交互式轮播图
  if (typeof window !== 'undefined' && enableInteraction) {
    return (
      <Banner
        banners={banners}
        autoPlay={autoPlay}
        interval={interval}
        onBannerClick={onBannerClick}
      />
    );
  }
  
  // 在服务端或禁用交互时使用静态轮播图
  return <StaticBanner banners={banners} />;
}