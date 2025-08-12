import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Banner as BannerType } from '@/types/api';

interface BannerProps {
  banners: BannerType[];
  autoPlay?: boolean;
  interval?: number;
  onBannerClick?: (banner: BannerType) => void;
}

export function Banner({
  banners,
  autoPlay = true,
  interval = 4000,
  onBannerClick,
}: BannerProps) {
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      skipSnaps: false,
      dragFree: false,
    },
    autoPlay ? [Autoplay({ delay: interval, stopOnInteraction: false })] : []
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleBannerClick = (banner: BannerType) => {
    if (onBannerClick) {
      onBannerClick(banner);
    }
    // 这里可以添加导航逻辑
    if (banner.linkUrl) {
      // 根据linkType处理不同的跳转
      console.log("Navigate to:", banner.linkUrl);
    }
  };

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (!banners || banners.length === 0) {
    return (
      <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">暂无轮播图</span>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video overflow-hidden p-2">
      {/* Embla轮播容器 */}
      <div
        className="overflow-hidden h-full relative z-10 rounded-lg shadow-lg"
        ref={emblaRef}
      >
        <div className="flex h-full touch-pan-y">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="flex-[0_0_100%] min-w-0 relative cursor-pointer"
              onClick={() => handleBannerClick(banner)}
            >
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              {/* 图片上的渐变遮罩 */}
              <div className="absolute inset-0 from-black/30 via-transparent rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* 指示器 */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}