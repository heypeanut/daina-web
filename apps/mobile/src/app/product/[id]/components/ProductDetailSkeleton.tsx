"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const ProductHeaderSkeleton = () => (
  <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="flex space-x-3">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const ProductImageViewerSkeleton = () => (
  <div className="bg-white">
    <div className="relative">
      <Skeleton className="w-full h-96" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="w-2 h-2 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

const ProductBasicInfoSkeleton = () => (
  <div className="bg-white p-4 space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>
    
    <div className="flex items-center space-x-4">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-6 w-16" />
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-6 w-18 rounded-full" />
    </div>

    <div className="flex items-center space-x-2">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const ProductSpecsSkeleton = () => (
  <div className="bg-white p-4 space-y-3">
    <Skeleton className="h-5 w-20" />
    
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  </div>
);

const BoothInfoCardSkeleton = () => (
  <div className="bg-white p-4 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <Skeleton className="h-8 w-16 rounded" />
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-6" />
        <Skeleton className="h-6 w-6" />
      </div>
    </div>
  </div>
);

const BottomActionBarSkeleton = () => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
    <div className="flex gap-3">
      <Skeleton className="flex-1 h-12 rounded-lg" />
      <Skeleton className="flex-1 h-12 rounded-lg" />
    </div>
  </div>
);

interface ProductDetailSkeletonProps {
  className?: string;
}

export function ProductDetailSkeleton({ 
  className = "" 
}: ProductDetailSkeletonProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* 头部导航骨架屏 */}
      <ProductHeaderSkeleton />

      {/* 主要内容区域 */}
      <div className="pt-14 pb-24">
        <div className="space-y-2">
          {/* 产品图片展示骨架屏 */}
          <ProductImageViewerSkeleton />

          {/* 产品基本信息骨架屏 */}
          <ProductBasicInfoSkeleton />

          {/* 产品规格骨架屏 */}
          <ProductSpecsSkeleton />

          {/* 档口信息骨架屏 */}
          <BoothInfoCardSkeleton />
        </div>
      </div>

      {/* 底部操作栏骨架屏 */}
      <BottomActionBarSkeleton />
    </div>
  );
}