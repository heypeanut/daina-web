"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import { useBoothRecommendations, useBehaviorTracking } from "@/hooks/useApi";
import type { Booth } from "@/types/api";

interface StaticBoothsProps {
  title: string;
  subtitle?: string;
  type: "booth_hot" | "booth_new";
  limit?: number;
}

export function StaticBooths({
  title,
  subtitle,
  type,
  limit = 10,
}: StaticBoothsProps) {
  const { items, loading, error } = useBoothRecommendations(type, limit);
  const { recordBehavior } = useBehaviorTracking();

  // 只取前limit个项目，不使用无限滚动
  const displayItems = items.slice(0, limit);

  const handleBoothClick = useCallback(
    (booth: Booth, index: number) => {
      recordBehavior("click", "booth", booth.id, {
        source: "homepage",
        section: "hot_booths",
        position: index,
        algorithm: "hot",
      });
    },
    [recordBehavior]
  );

  if (error) {
    return (
      <div className="px-4 pt-0 pb-2">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white mr-3">{title}</h2>
              {subtitle && (
                <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full backdrop-blur-sm">
                  {subtitle}
                </span>
              )}
            </div>
            <button className="bg-white text-orange-500 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
              去抢购 →
            </button>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-gray-500">加载失败，请稍后重试</p>
          </div>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0 && !loading) {
    return (
      <div className="px-4 pt-0 pb-2">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <h2 className="text-xl font-bold text-white mr-3">{title}</h2>
              {subtitle && (
                <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full backdrop-blur-sm">
                  {subtitle}
                </span>
              )}
            </div>
            <button className="bg-white text-orange-500 text-sm font-medium px-4 py-2 rounded-full shadow-sm">
              去抢购 →
            </button>
          </div>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 text-center">
            <p className="text-gray-500">暂无推荐内容</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-0 pb-2">
      {/* 主容器 - 橙色渐变背景 */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-3 shadow-lg">
        {/* 顶部标题区域 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white mr-3">{title}</h2>
            {subtitle && (
              <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full backdrop-blur-sm">
                {subtitle}
              </span>
            )}
          </div>
          <button className="bg-white text-orange-500 text-sm font-medium px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
            去选品 →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : (
          /* 商品展示区域 */
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-1">
            <div className="flex items-start">
              {/* 左侧促销信息 */}
              <div className="flex-shrink-0 w-24 mr-2 text-center">
                <div className="bg-gradient-to-b from-orange-500 to-red-500 text-white h-[5.2rem] flex flex-col justify-center rounded-lg shadow-sm">
                  <div className="text-base font-bold mb-0.5">最新档口</div>
                  <div className="text-xs">好物推荐</div>
                </div>
              </div>

              {/* 右侧商品滚动列表 */}
              <div className="flex-1 overflow-x-auto scrollbar-hide">
                <div
                  className="flex space-x-2"
                  style={{ width: "max-content" }}
                >
                  {displayItems.map((booth, index) => (
                    <div
                      key={booth.id}
                      onClick={() => handleBoothClick(booth, index)}
                      className="flex-shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95"
                    >
                      {/* 商品卡片 */}
                      <div className="w-20 bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                        {/* 商品图片 */}
                        <div className="w-20 h-20 bg-gray-100 relative overflow-hidden">
                          <Image
                            src={booth.coverImage}
                            alt={booth.boothName}
                            fill
                            sizes="80px"
                            className="object-cover"
                            unoptimized
                          />
                          {/* 档口名称叠加 */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent">
                            <span className="block text-xs font-medium text-white px-1 py-0.5 text-center truncate leading-tight">
                              {booth.boothName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
