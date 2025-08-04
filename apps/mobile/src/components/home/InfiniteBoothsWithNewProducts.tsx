"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Heart, MapPin } from "lucide-react";
import {
  useLatestBoothsWithNewProducts,
  useBehaviorTracking,
} from "@/hooks/useApi";
import { ImageLazyLoader } from "@/components/common/ImageLazyLoader";
import type { Booth } from "@/types/booth";

interface InfiniteBoothsWithNewProductsProps {
  title: string;
  pageSize?: number;
}

export function InfiniteBoothsWithNewProducts({
  title,
  pageSize = 12,
}: InfiniteBoothsWithNewProductsProps) {
  const { items, loading, hasMore, loadMore, error } =
    useLatestBoothsWithNewProducts(pageSize);
  const { recordBehavior } = useBehaviorTracking();
  const observerRef = useRef<HTMLDivElement>(null);

  const handleBoothClick = useCallback(
    (booth: Booth, index: number) => {
      recordBehavior("click", "booth", booth.id!, {
        source: "homepage",
        section: "latest_booths_with_new_products",
        position: index,
        algorithm: "latest_booths_with_new_products",
      });
    },
    [recordBehavior]
  );

  const handleFavoriteClick = (booth: Booth, index: number) => {
    recordBehavior("click", "booth", booth.id!, {
      source: "homepage",
      section: "latest_booths_with_new_products_favorite",
      position: index,
      algorithm: "latest_booths_with_new_products",
    });
    // TODO: 实现收藏功能
    console.log("收藏档口:", booth.boothName);
  };

  // 无限滚动监听
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  if (error) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>加载失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>暂无新品档口</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>

      {/* 垂直瀑布流布局 */}
      <div className="columns-2 gap-2">
        {items.map((booth, index) => (
          <div
            key={booth.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-lg hover:scale-102 transition-all duration-200 cursor-pointer group break-inside-avoid mb-3"
            onClick={(e) => {
              // 防止点击收藏按钮时触发卡片点击
              if ((e.target as Element).closest("[data-favorite-btn]")) {
                return;
              }
              handleBoothClick(booth, index);
            }}
          >
            {/* 档口头像 */}
            <div className="relative">
              <ImageLazyLoader
                src={booth.coverImg}
                alt={booth.boothName}
                width={200}
                height={200}
                className="w-full aspect-auto object-cover transition-transform duration-200 group-hover:scale-105"
                fallbackSrc="/cover.png"
              />

              {/* 收藏按钮 */}
              <button
                data-favorite-btn
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteClick(booth, index);
                }}
                className="absolute top-1.5 right-1.5 size-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all duration-200"
              >
                <Heart size={16} className="text-gray-400" />
              </button>
            </div>

            {/* 档口信息 */}
            <div className="p-3">
              <h3 className="font-bold text-gray-900 text-base mb-2 leading-tight">
                {booth.boothName}
              </h3>

              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1.5 text-gray-400" />
                <span className="truncate font-medium">
                  {booth.market || "批发市场"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={observerRef} className="py-2">
          {loading && (
            <div className="w-full flex justify-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-sm text-gray-600 font-medium">
                  加载更多...
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部档口
        </div>
      )}
    </div>
  );
}

export default InfiniteBoothsWithNewProducts;
