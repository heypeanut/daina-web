"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useBoothRanking, useBehaviorTracking } from "@/hooks/useApi";
import type { Booth } from "@/types/api";

interface RankingBoothsProps {
  title: string;
  limit?: number;
}

// 皇冠图标组件
const CrownIcon = ({ rank }: { rank: number }) => {
  const getCrownStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          fill: "#FFD700", // 金色
          gems: [
            { cx: 12, cy: 11, r: 2.5, fill: "#FF4444" }, // 红宝石
            { cx: 8, cy: 13, r: 1.5, fill: "#4444FF" }, // 蓝宝石
            { cx: 16, cy: 13, r: 1.5, fill: "#44FF44" }, // 绿宝石
          ],
        };
      case 2:
        return {
          fill: "#C0C0C0", // 银色
          gems: [
            { cx: 12, cy: 11, r: 2, fill: "#4444FF" }, // 蓝宝石
            { cx: 9, cy: 13, r: 1, fill: "#FFF" }, // 白色装饰
            { cx: 15, cy: 13, r: 1, fill: "#FFF" }, // 白色装饰
          ],
        };
      case 3:
        return {
          fill: "#CD7F32", // 铜色
          gems: [
            { cx: 12, cy: 11, r: 1.5, fill: "#FF8844" }, // 橙色宝石
            { cx: 10, cy: 13, r: 0.8, fill: "#FFF" }, // 白色装饰
            { cx: 14, cy: 13, r: 0.8, fill: "#FFF" }, // 白色装饰
          ],
        };
      default:
        return {
          fill: "#9CA3AF", // 灰色
          gems: [
            { cx: 12, cy: 11, r: 1, fill: "#FFF" }, // 白色装饰
          ],
        };
    }
  };

  const style = getCrownStyle(rank);

  return (
    <svg
      width="32"
      height="26"
      viewBox="0 0 24 20"
      fill="none"
      className="absolute -top-2.5 -left-2.5 transform -rotate-[42deg] drop-shadow-lg"
    >
      {/* 皇冠主体 */}
      <path
        d="M5 16L3 7L6 9L12 3L18 9L21 7L19 16H5Z"
        fill={style.fill}
        stroke="#FFF"
        strokeWidth="1.5"
      />
      {/* 皇冠底座 */}
      <rect
        x="5"
        y="16"
        width="14"
        height="2"
        fill={style.fill}
        stroke="#FFF"
        strokeWidth="1"
      />
      {/* 宝石装饰 */}
      {style.gems.map((gem, index) => (
        <circle
          key={index}
          cx={gem.cx}
          cy={gem.cy}
          r={gem.r}
          fill={gem.fill}
          stroke="#FFF"
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
};

export function RankingBooths({
  title = "排行榜",
  limit = 25,
}: RankingBoothsProps) {
  const { items, loading, error } = useBoothRanking(limit);
  const { recordBehavior } = useBehaviorTracking();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // 将数据按每5个为一组分组
  const groupedItems = React.useMemo(() => {
    const groups = [];
    for (let i = 0; i < items.length; i += 5) {
      groups.push(items.slice(i, i + 5));
    }
    return groups;
  }, [items]);

  // 轮播配置：轮播分组而不是单个项目
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps",
    slidesToScroll: 1,
  });

  // 监听滚动状态
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // 初始化和监听事件
  useEffect(() => {
    if (!emblaApi) return;

    // 设置滚动快照点
    const snaps = emblaApi.scrollSnapList();
    setScrollSnaps(snaps);

    // 监听选中变化
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleBoothClick = useCallback(
    (booth: Booth, groupIndex: number, itemIndex: number) => {
      const overallIndex = groupIndex * 5 + itemIndex;
      recordBehavior("click", "booth", booth.id, {
        source: "homepage",
        section: "ranking",
        position: overallIndex,
        algorithm: "ranking",
      });
    },
    [recordBehavior]
  );

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">更多排行</span>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>加载失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  if (groupedItems.length === 0 && !loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <span className="text-sm text-gray-500">更多排行</span>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>暂无排行榜数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="text-sm text-gray-500">更多排行</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg py-4 shadow-sm">
          {/* Embla轮播容器 */}
          <div className="overflow-hidden pt-1.5" ref={emblaRef}>
            <div className="flex">
              {groupedItems.map((group, groupIndex) => (
                <div
                  key={`group-${groupIndex}`}
                  className="flex-[0_0_100%] min-w-0 px-2"
                >
                  {/* 每组显示5个档口 */}
                  <div
                      className={`flex`}
                  >
                    {group.map((booth, itemIndex) => {
                      const overallIndex = groupIndex * 5 + itemIndex;
                      return (
                        <div key={booth.id}>
                          <div
                            onClick={() =>
                              handleBoothClick(booth, groupIndex, itemIndex)
                            }
                            className="cursor-pointer transition-all active:scale-95"
                          >
                            {/* 档口头像容器 */}
                            <div className="mb-1">
                              {/* 相对定位容器，不裁剪皇冠 */}
                              <div className="relative w-16 h-16 mx-auto">
                                {/* 皇冠图标 - 只显示前4名 */}
                                {overallIndex < 4 && (
                                  <CrownIcon rank={overallIndex + 1} />
                                )}
                                {/* 头像 */}
                                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-4 border-white shadow-lg">
                                  {booth.coverImg ? (
                                    <Image
                                      src={booth.coverImg}
                                      alt={booth.boothName || "name"}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-400 text-xs">
                                        无图
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* 档口名称 */}
                            <p className="text-xs text-center text-gray-600 font-medium truncate px-1">
                              {booth.boothName}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 轮播指示器 - 显示分组数量 */}
          {groupedItems.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === selectedIndex
                      ? "bg-orange-500 scale-125"
                      : "bg-gray-300"
                  }`}
                  onClick={() => scrollTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
