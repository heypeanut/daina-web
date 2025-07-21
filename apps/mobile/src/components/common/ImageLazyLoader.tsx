"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ImageLazyLoaderProps {
  src: string;
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
  className = '',
  fallbackSrc = '/cover.png',
  placeholder,
  onLoad,
  onError
}: ImageLazyLoaderProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
      onError?.();
    }
  };

  const defaultPlaceholder = (
    <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
      <ImageIcon size={32} className="text-gray-400" />
    </div>
  );

  return (
    <div ref={imgRef} className={className}>
      {!isInView ? (
        placeholder || defaultPlaceholder
      ) : (
        <>
          {isLoading && (placeholder || defaultPlaceholder)}
          <Image
            src={imgSrc}
            alt={alt}
            width={width}
            height={height}
            className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              display: isLoading ? 'none' : 'block'
            }}
          />
        </>
      )}
    </div>
  );
}