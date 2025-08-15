import React from "react";
import { Package, Trash2, Eye } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Footprint } from "@/lib/api/user-behavior";

interface HistoryProductCardProps {
  footprint: Footprint;
  onCardClick: (footprint: Footprint) => void;
  onRemove: (footprintId: string) => void;
  isRemoving: boolean;
  formatDate: (dateString: string) => string;
}

export function HistoryProductCard({
  footprint,
  onCardClick,
  onRemove,
  isRemoving,
  formatDate,
}: HistoryProductCardProps) {
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
        {/* 商品图片 */}
        <div
          className="relative w-16 h-16 flex-shrink-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <ImageLazyLoader
            src={footprint.image || "/placeholder-product.jpg"}
            alt={footprint.name || "商品"}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* 类型标识 */}
          <div className="absolute top-1 left-1 bg-black/50 rounded px-1 py-0.5">
            <Package size={10} className="text-white" />
          </div>
        </div>

        {/* 商品信息 */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={handleCardClick}
        >
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {footprint.name}
          </h3>
          
          {(footprint.price !== null && footprint.price !== undefined) && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500 font-bold text-sm">
                ¥{footprint.price.toFixed(2)}
              </span>
              {(footprint.originalPrice !== null && footprint.originalPrice !== undefined) && (
                <span className="text-gray-400 text-xs line-through">
                  ¥{footprint.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-500 mb-1">
            来自：{footprint.boothName}
          </div>
          
          {footprint.views && (
            <div className="flex items-center text-xs text-gray-500 mb-1">
              <Eye size={10} className="mr-1" />
              <span>浏览 {footprint.views}</span>
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
