"use client";

import React, { useEffect } from 'react';
import { ClientSearchBar } from './ClientSearchBar';
import { ClientQuickActions } from './ClientQuickActions';
import { HybridBanner } from './HybridBanner';
import { RankingBooths } from './RankingBooths';
import { StaticBooths } from './StaticBooths';
import { InfiniteProductRecommend } from './InfiniteProductRecommend';
import { useBanners, useBehaviorTracking } from '@/hooks/useApi';
import type { Banner } from '@/types/api';

export function ClientHomepage() {
  const { banners, loading: bannersLoading } = useBanners(5);
  const { recordBehavior } = useBehaviorTracking();

  const handleBannerClick = (banner: Banner) => {
    recordBehavior('click', 'banner', banner.id.toString(), {
      source: 'homepage',
      linkUrl: banner.linkUrl,
      linkType: banner.linkType,
    });
  };

  return (
    <div className="mobile-homepage">
      {/* 网站标题 - SEO */}
      <header className="sr-only">
        <h1>代拿网 - 专业的档口批发代发平台</h1>
        <p>提供优质的档口商品推荐、以图搜图、批发代发等服务</p>
      </header>

      {/* 搜索栏 - 客户端组件 */}
      <ClientSearchBar />
      
      {/* 轮播图 - 混合渲染 */}
      {!bannersLoading && banners.length > 0 && (
        <HybridBanner 
          banners={banners} 
          onBannerClick={handleBannerClick}
        />
      )}
      
      {/* 快捷功能入口 - 客户端组件 */}
      <ClientQuickActions />
      
      {/* 档口排行榜 - 横向滑动显示 */}
      <RankingBooths
        title="排行榜"
        type="booth_hot"
        limit={25}
      />
      
      {/* 最新档口 - 静态显示，不滚动加载 */}
      <StaticBooths
        title="最新档口"
        type="booth_new"
        limit={10}
      />
      
      {/* 近期上新 - 无限滚动 */}
      <InfiniteProductRecommend
        title="近期上新"
        type="product_new"
        layout="grid"
      />
    </div>
  );
}