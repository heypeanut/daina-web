"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface QrCodeImage {
  url: string;
  type: "wx" | "qq" | "other";
  label: string;
}

interface QrCodeCarouselProps {
  images: QrCodeImage[];
}

// 创建QrCodeCarousel组件
export const QrCodeCarousel: React.FC<QrCodeCarouselProps> = ({ images }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // 设置当前显示的索引
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="bg-white p-2 rounded-2xl shadow-sm border relative w-full">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "center" }}
          className="w-full"
        >
          <CarouselContent>
            {images.map((image, idx) => (
              <CarouselItem key={idx} className="flex justify-center">
                <Image
                  src={image.url}
                  alt={image.label}
                  width={150}
                  height={150}
                  className="rounded-xl"
                  priority
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`size-3 rounded-full ${
                index === current ? "bg-blue-500" : "bg-gray-300"
              }`}
              aria-label={`跳转到${image.label}`}
            />
          ))}
        </div>
      )}
      <span className="text-gray-500 mt-3 text-sm">
        {images[current].label}二维码
      </span>
    </div>
  );
};
