import React, { useState, useEffect } from 'react';
import { Banner } from './banner';
import { StaticBanner } from './static-banner';
import type { Banner as BannerType } from '@/types/api';

interface HybridBannerProps {
  banners: BannerType[];
  autoPlay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerType) => void;
}

// 混合轮播组件：首次渲染静态内容，客户端激活后启用轮播
export function HybridBanner({ 
  banners, 
  autoPlay = true, 
  interval = 4000,
  onBannerClick
}: HybridBannerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleBannerClick = (banner: BannerType) => {
    if (onBannerClick) {
      onBannerClick(banner);
    }
    
    // 默认导航逻辑
    if (banner.linkUrl) {
      if (banner.linkType === 'external') {
        window.open(banner.linkUrl, '_blank');
      } else {
        window.location.href = banner.linkUrl;
      }
    }
  };

  // 服务端和初始客户端渲染使用静态轮播图
  if (!isClient) {
    return <StaticBanner banners={banners} />;
  }

  // 客户端激活后使用交互式轮播图
  return (
    <Banner
      banners={banners}
      autoPlay={autoPlay}
      interval={interval}
      onBannerClick={handleBannerClick}
    />
  );
}
