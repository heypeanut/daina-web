"use client";

import React from "react";

interface BoothCardSkeletonProps {
  layout?: "grid" | "list";
  className?: string;
}

export function BoothCardSkeleton({
  layout = "grid",
  className = "",
}: BoothCardSkeletonProps) {
  if (layout === "list") {
    return (
      <div
        className={`bg-white mx-3 mb-3 rounded-xl p-4 animate-pulse border border-gray-100/50 ${className}`}
      >
        <div className="flex items-center space-x-4">
          {/* 档口头像骨架 */}
          <div className="relative">
            <div className="w-16 h-16 bg-gray-200 rounded-xl" />
          </div>

          {/* 档口信息骨架 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="w-9 h-9 bg-gray-200 rounded-full" />
            </div>

            <div className="flex gap-1 mb-2">
              <div className="h-6 bg-gray-200 rounded-md w-16" />
              <div className="h-6 bg-gray-200 rounded-md w-20" />
            </div>

            <div className="flex items-center justify-between">
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
                <div className="w-6 h-6 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout 骨架屏
  return (
    <div
      className={`bg-white rounded-xl overflow-hidden border border-gray-100/50 animate-pulse ${className}`}
    >
      {/* 图片区域骨架 */}
      <div className="relative">
        <div className="w-full h-36 bg-gray-200" />

        {/* 收藏按钮骨架 */}
        <div className="absolute top-1.5 right-1.5 size-6 bg-white/90 rounded-full" />

        {/* 排名标识骨架 */}
        {/* <div className="absolute top-3 left-3 h-6 bg-white/90 rounded-full w-12" /> */}
      </div>

      {/* 信息区域骨架 */}
      <div className="p-3">
        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />

        <div className="flex gap-1.5 mb-3">
          <div className="h-6 bg-gray-200 rounded-lg w-16" />
          <div className="h-6 bg-gray-200 rounded-lg w-20" />
        </div>

        <div className="h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

interface BoothGridSkeletonProps {
  count?: number;
  layout?: "grid" | "list";
  className?: string;
}

export function BoothGridSkeleton({
  count = 6,
  layout = "grid",
  className = "",
}: BoothGridSkeletonProps) {
  const containerClassName =
    layout === "grid"
      ? `grid grid-cols-2 gap-3 px-3 ${className}`
      : `space-y-0 ${className}`;

  return (
    <div className={containerClassName}>
      {Array.from({ length: count }).map((_, index) => (
        <BoothCardSkeleton
          key={index}
          layout={layout}
          className={
            layout === "grid" ? "" : "border-b border-gray-100 last:border-b-0"
          }
        />
      ))}
    </div>
  );
}
