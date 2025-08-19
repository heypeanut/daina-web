import React from "react";
import { Trash2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Footprint } from "@/lib/api/user-behavior";

interface ProductHistoryCardProps {
  footprint: Footprint;
  onCardClick: (footprint: Footprint) => void;
  onRemove: (historyId: string) => void;
  isRemoving: boolean;
  formatDate: (dateString: string) => string;
}

export function ProductHistoryCard({
  footprint,
  onCardClick,
  onRemove,
  isRemoving,
  formatDate,
}: ProductHistoryCardProps) {
  const handleCardClick = () => {
    console.log("点击商品卡片:", footprint.id);
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
      onClick={handleCardClick}
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer relative"
    >
      {/* 商品图片 */}
      <div className="relative aspect-square">
        <ImageLazyLoader
          src={footprint.coverImg || "/placeholder-product.png"}
          alt={footprint.name || "商品"}
          className="w-full h-full object-cover"
        />

        {/* 删除按钮 - 右上角 */}
        <button
          onClick={handleRemoveClick}
          disabled={isRemoving}
          className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all disabled:opacity-50"
        >
          {isRemoving ? (
            <div className="w-3 h-3 border border-gray-300 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-3 h-3 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      {/* 商品信息 */}
      <div className="p-3">
        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {footprint.name}
        </h4>

        {/* 价格 */}
        {footprint.price !== null && footprint.price !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500 font-bold text-lg">
              ¥{footprint.price.toFixed(2)}
            </span>
            {footprint.originalPrice !== null &&
              footprint.originalPrice !== undefined && (
                <span className="text-gray-400 text-sm line-through">
                  ¥{footprint.originalPrice.toFixed(2)}
                </span>
              )}
          </div>
        )}
        {/* 浏览时间 */}
        <div className="text-xs text-gray-400">
          浏览时间：{formatDate(footprint.visitedAt || footprint.createdAt)}
        </div>
      </div>
    </div>
  );
}
