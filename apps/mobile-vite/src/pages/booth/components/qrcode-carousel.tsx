import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ImageLazyLoader } from "@/components/common";

interface QRCodeCarouselProps {
  wxQrCode?: string;
  qqQrCode?: string;
}

interface QRCodeItem {
  url: string;
  type: 'wx' | 'qq';
  label: string;
}

export function QRCodeCarousel({ wxQrCode, qqQrCode }: QRCodeCarouselProps) {
  const qrCodes: QRCodeItem[] = [
    ...(wxQrCode ? [{ url: wxQrCode, type: 'wx' as const, label: '微信二维码' }] : []),
    ...(qqQrCode ? [{ url: qqQrCode, type: 'qq' as const, label: 'QQ二维码' }] : [])
  ];

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  });

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

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (qrCodes.length === 0) {
    return null;
  }

  if (qrCodes.length === 1) {
    // 单个二维码直接显示，无轮播
    const qrCode = qrCodes[0];
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="text-sm font-medium text-gray-700 mb-2">
          {qrCode.label}
        </div>
        <ImageLazyLoader
          src={qrCode.url}
          alt={qrCode.label}
          width={150}
          height={150}
          className="rounded-xl"
        />
      </div>
    );
  }

  // 多个二维码使用轮播
  return (
    <div className="relative w-full">
      {/* 当前二维码类型标题 */}
      <div className="text-sm font-medium text-gray-700 mb-2 text-center">
        {qrCodes[selectedIndex]?.label}
      </div>

      {/* 轮播容器 */}
      <div
        className="overflow-hidden"
        ref={emblaRef}
      >
        <div className="flex">
          {qrCodes.map((qrCode, index) => (
            <div
              key={`${qrCode.type}-${index}`}
              className="flex-[0_0_100%] min-w-0 flex justify-center"
            >
              <ImageLazyLoader
                src={qrCode.url}
                alt={qrCode.label}
                width={150}
                height={150}
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 指示器 */}
      <div className="flex justify-center space-x-2 mt-3">
        {qrCodes.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === selectedIndex ? "bg-gray-800 scale-125" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}