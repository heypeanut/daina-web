import React from "react";
import { MapPin, Trash2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Footprint } from "@/lib/api/user-behavior";

interface BoothHistoryCardProps {
  footprint: Footprint;
  onCardClick: (footprint: Footprint) => void;
  onRemove: (historyId: string) => void;
  isRemoving: boolean;
  formatDate: (dateString: string) => string;
}

export function BoothHistoryCard({
  footprint,
  onCardClick,
  onRemove,
  isRemoving,
  formatDate,
}: BoothHistoryCardProps) {
  const handleCardClick = () => {
    console.log("点击档口卡片:", footprint.id);
    onCardClick(footprint);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log("点击删除按钮，historyId:", footprint.historyId);
    onRemove(footprint.historyId);
  };

  return (
    <div
      className="bg-white p-4 cursor-pointer transition-all hover:bg-gray-50"
      onClick={handleCardClick}
    >
      <div className="flex space-x-3">
        {/* 档口图片 */}
        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
          <ImageLazyLoader
            src={footprint.coverImg || "/placeholder-booth.jpg"}
            alt={footprint.boothName || "档口"}
            className="w-20 h-20 object-cover"
            fallbackSrc="/placeholder.png"
          />
        </div>

        {/* 档口信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                {footprint.boothName}
              </h3>

              {footprint.boothNumber && (
                <div className="text-sm text-gray-600 mb-1">
                  档口号：{footprint.boothNumber}
                </div>
              )}

              {footprint.market && (
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin size={12} className="mr-1" />
                  <span className="truncate">{footprint.market}</span>
                </div>
              )}

              <div className="text-xs text-gray-400">
                浏览时间：
                {formatDate(footprint.visitedAt || footprint.createdAt)}
              </div>
            </div>

            {/* 删除按钮 */}
            <button
              onClick={handleRemoveClick}
              disabled={isRemoving}
              className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            >
              {isRemoving ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
