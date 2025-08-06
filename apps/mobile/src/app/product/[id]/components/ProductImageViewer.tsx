"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';
import useEmblaCarousel from 'embla-carousel-react';
import { ProductImage } from '../types';

interface ProductImageViewerProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

export function ProductImageViewer({
  images,
  productName,
  className = ''
}: ProductImageViewerProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 确保至少有一张图片，转换为URL数组
  const imageUrls = images.length > 0 
    ? images.map(img => img.url) 
    : ['/cover.png'];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: imageUrls.length > 1,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className={`relative bg-white -mb-2 ${className}`}>
      {/* 主图片展示区域 */}
      <div className="relative aspect-square overflow-hidden">
        <div 
          className="overflow-hidden h-full relative z-10"
          ref={emblaRef}
        >
          <div className="flex h-full touch-pan-y">
            {imageUrls.map((imageUrl, index) => (
              <div
                key={index}
                className="flex-[0_0_100%] min-w-0 relative cursor-pointer"
                onClick={toggleZoom}
              >
                <ImageLazyLoader
                  src={imageUrl}
                  alt={`${productName} - 图片 ${index + 1}`}
                  width={400}
                  height={400}
                  className={`w-full h-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 指示器 */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
            {imageUrls.map((_, index) => (
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

      {/* 缩略图导航 */}
      {imageUrls.length > 1 && imageUrls.length <= 5 && (
        <div className="flex gap-2 p-4 overflow-x-auto">
          {imageUrls.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index 
                  ? 'border-red-500 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ImageLazyLoader
                src={imageUrl}
                alt={`${productName} - 缩略图 ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* 缩放提示 */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 touch-pan-x touch-pan-y">
          <div className="text-white text-center p-4 max-w-full max-h-full">
            <p className="text-sm mb-4 opacity-80">点击退出放大</p>
            <div className="overflow-auto max-h-[80vh] flex items-center justify-center">
              <ImageLazyLoader
                src={imageUrls[selectedIndex]}
                alt={`${productName} - 放大图`}
                width={400}
                height={400}
                className="max-w-full max-h-full object-contain select-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}