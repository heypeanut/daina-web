"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageLazyLoaderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
}

export function ImageLazyLoader({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  fallbackSrc = "/cover.png",
  placeholder,
  onLoad,
  onError,
}: ImageLazyLoaderProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackSrc) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      setIsLoading(true); // Reset loading state for fallback image
    } else {
      setIsLoading(false);
      onError?.();
    }
  };

  const defaultPlaceholder = (
    <div
      className={`bg-gray-100 flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <ImageIcon size={32} className="text-gray-400" />
    </div>
  );

  // If there's no valid image source, show placeholder
  if (!imgSrc) {
    return placeholder || defaultPlaceholder;
  }

  return (
    <div className="relative">
      {isLoading && (placeholder || defaultPlaceholder)}
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${
          isLoading ? "opacity-0 absolute inset-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        priority={false}
        loading="lazy"
      />
    </div>
  );
}
