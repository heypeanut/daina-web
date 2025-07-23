"use client";

import React from 'react';

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const BoothHeaderSkeleton = () => (
  <div className="bg-white p-4 space-y-4">
    {/* 档口名称和徽章 */}
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>

    {/* 档口信息 */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-8" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
    </div>

    {/* 主营业务 */}
    <div className="space-y-2">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-full" />
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  <div className="bg-white p-4">
    {/* 筛选和排序栏 */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>

    {/* 商品网格 */}
    <div className="grid grid-cols-2 gap-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProductListSkeleton = () => (
  <div className="bg-white p-4">
    {/* 筛选和排序栏 */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>

    {/* 商品列表 */}
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex space-x-3 p-3 border border-gray-100 rounded-lg">
          <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

interface BoothDetailSkeletonProps {
  showProductGrid?: boolean;
  className?: string;
}

export function BoothDetailSkeleton({ 
  showProductGrid = true, 
  className = "" 
}: BoothDetailSkeletonProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* 搜索栏骨架屏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="pt-20 pb-24 space-y-2">
        {/* 档口头部信息骨架屏 */}
        <BoothHeaderSkeleton />
        
        {/* 商品展示区域骨架屏 */}
        {showProductGrid ? <ProductGridSkeleton /> : <ProductListSkeleton />}
      </div>

      {/* 底部按钮骨架屏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-12 rounded-lg" />
          <Skeleton className="flex-1 h-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// 商品展示区域专用骨架屏（用于商品数据单独加载时）
export function ProductShowcaseSkeleton({ 
  viewMode = 'grid' 
}: { 
  viewMode?: 'grid' | 'list' 
}) {
  return viewMode === 'grid' ? <ProductGridSkeleton /> : <ProductListSkeleton />;
}