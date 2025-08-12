import { Banner } from './banner';
import { BannerSkeleton } from './banner-skeleton';
import type { Banner as BannerType } from '@/types/api';
import { useBanners } from '../hooks';

interface HybridBannerProps {
  autoPlay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerType) => void;
}

export function HybridBanner({ 
  autoPlay = true, 
  interval = 4000,
  onBannerClick
}: HybridBannerProps) {
  const { data: banners, isLoading } = useBanners(5);
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

  // 加载状态显示骨架屏
  if (isLoading) {
    return <BannerSkeleton />;
  }
  

  return (
    <Banner
      banners={banners || []}
      autoPlay={autoPlay}
      interval={interval}
      onBannerClick={handleBannerClick}
    />
  );
}
