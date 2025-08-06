"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ImageLazyLoader } from '@/components/common/ImageLazyLoader';
import useEmblaCarousel from 'embla-carousel-react';
import { Dialog, DialogContent, DialogTitle } from 'ui';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dialogSelectedIndex, setDialogSelectedIndex] = useState(0);

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

  // Dialog 中的 carousel 实例
  const [dialogEmblaRef, dialogEmblaApi] = useEmblaCarousel({
    loop: imageUrls.length > 1,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Dialog carousel 的选择处理
  const onDialogSelect = useCallback(() => {
    if (!dialogEmblaApi) return;
    setDialogSelectedIndex(dialogEmblaApi.selectedScrollSnap());
  }, [dialogEmblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Dialog carousel 的 useEffect
  useEffect(() => {
    if (!dialogEmblaApi) return;
    onDialogSelect();
    dialogEmblaApi.on('select', onDialogSelect);
    return () => {
      dialogEmblaApi.off('select', onDialogSelect);
    };
  }, [dialogEmblaApi, onDialogSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  // Dialog carousel 的滚动函数
  const dialogScrollTo = useCallback(
    (index: number) => {
      if (dialogEmblaApi) dialogEmblaApi.scrollTo(index);
    },
    [dialogEmblaApi]
  );


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
                onClick={() => {
                  setDialogSelectedIndex(selectedIndex);
                  setIsDialogOpen(true);
                  // 延迟设置 Dialog carousel 的索引，确保 carousel 已经初始化
                  setTimeout(() => {
                    if (dialogEmblaApi) {
                      dialogEmblaApi.scrollTo(selectedIndex);
                    }
                  }, 100);
                }}
              >
                <ImageLazyLoader
                  src={imageUrl}
                  alt={`${productName} - 图片 ${index + 1}`}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 指示器 */}
        <div className="absolute bottom-3 -right-2 transform -translate-x-1/2 flex space-x-2 z-20 bg-black/50 rounded-lg px-2 py-1">
         <span className="text-white text-sm">
          {selectedIndex + 1}/{imageUrls.length}
         </span>
        </div>
      </div>

      {/* 缩略图导航 */}
      {imageUrls.length  && (
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

      {/* Dialog 图片查看器 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTitle />
        <DialogContent aria-describedby={undefined} className="max-w-6xl p-0 bg-black/10 border-none h-screen [&>button]:hidden focus-visible:outline-none" onClick={() => {
          setIsDialogOpen(false);
        }}>
          {/* 大图展示区域 */}
          <div className="relative w-full overflow-hidden">
            <div 
              className="overflow-hidden h-full relative"
              ref={dialogEmblaRef}
            >
              <div className="flex h-full">
                {imageUrls.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 relative flex items-center justify-center"
                  >
                      <ImageLazyLoader
                        src={imageUrl}
                        width={800}
                        height={600}
                        alt={`${productName} - 图片 ${index + 1}`}
                        className="max-w-full max-h-full object-contain"
                      />
                  </div>
                ))}
              </div>
            </div>

            {/* Dialog 指示器 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-black/70 rounded-lg px-3 py-2">
              <span className="text-white text-sm">
                {dialogSelectedIndex + 1}/{imageUrls.length}
              </span>
            </div>

          
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}