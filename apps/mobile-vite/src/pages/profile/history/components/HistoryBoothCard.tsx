import React from "react";
import { MapPin, Store, Trash2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Footprint } from "@/lib/api/user-behavior";

interface HistoryBoothCardProps {
  footprint: Footprint;
  onCardClick: (footprint: Footprint) => void;
  onRemove: (footprintId: string) => void;
  isRemoving: boolean;
  formatDate: (dateString: string) => string;
}

export function HistoryBoothCard({
  footprint,
  onCardClick,
  onRemove,
  isRemoving,
  formatDate,
}: HistoryBoothCardProps) {
  const handleCardClick = () => {
    onCardClick(footprint);
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(footprint.id);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex p-3 gap-3">
        {/* 档口图片 */}
        <div
          className="relative w-16 h-16 flex-shrink-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <ImageLazyLoader
            src={footprint.coverImg || "/placeholder-booth.jpg"}
            alt={footprint.boothName || "档口"}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* 类型标识 */}
          <div className="absolute top-1 left-1 bg-black/50 rounded px-1 py-0.5">
            <Store size={10} className="text-white" />
          </div>
        </div>

        {/* 档口信息 */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            {footprint.boothName}
          </h3>
          
          {footprint.boothNumber && (
            <div className="text-xs text-gray-500 mb-1">
              档口号：{footprint.boothNumber}
            </div>
          )}
          
          {footprint.market && (
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <MapPin size={10} className="mr-1" />
              <span>{footprint.market}</span>
            </div>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            浏览时间：{formatDate(footprint.visitedAt || footprint.createdAt)}
          </div>
        </div>

        {/* 删除按钮 */}
        <div className="flex items-start">
          <button
            onClick={handleRemoveClick}
            disabled={isRemoving}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
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
  );
}
