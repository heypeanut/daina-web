import React from "react";
import { Heart, MapPin, Star } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Booth } from "@/types/api";

interface BoothCardProps {
  booth: Booth;
  onClick: () => void;
  viewMode: "grid" | "list";
  showSimilarity?: boolean;
  onFavoriteClick?: (booth: Booth) => void;
  isFavorited?: boolean;
}

export default function BoothCard({
  booth,
  onClick,
  viewMode,
  showSimilarity,
  onFavoriteClick,
  isFavorited = false,
}: BoothCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavoriteClick?.(booth);
  };

  if (viewMode === "list") {
    return (
      <div
        className="bg-white p-4 cursor-pointer transition-all hover:bg-gray-50"
        onClick={onClick}
      >
        <div className="flex space-x-3">
          {/* 档口图片 */}
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
            <ImageLazyLoader
              src={booth.imageUrl || booth.coverImg || ""}
              alt={booth.boothName}
              className="w-full h-full object-cover"
              fallbackSrc="/placeholder.png"
            />
          </div>

          {/* 档口信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
                  {booth.boothName}
                </h3>
                {booth.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {booth.description}
                  </p>
                )}

                {/* 评分和位置 */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {booth.rating && (
                    <div className="flex items-center">
                      <Star
                        size={12}
                        className="text-yellow-400 mr-1"
                        fill="currentColor"
                      />
                      <span>{booth.rating}</span>
                    </div>
                  )}
                  {booth.market && (
                    <div className="flex items-center">
                      <MapPin size={12} className="mr-1" />
                      <span className="truncate">{booth.market}</span>
                    </div>
                  )}
                </div>

                {/* 相似度显示 */}
                {showSimilarity && booth.similarity && (
                  <div className="mt-2">
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      {Math.round(booth.similarity * 100)}% 相似
                    </span>
                  </div>
                )}
              </div>

              {/* 收藏按钮 */}
              {onFavoriteClick && (
                <button
                  onClick={handleFavoriteClick}
                  className="ml-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <Heart
                    size={18}
                    className={
                      isFavorited ? "text-red-500 fill-current" : "text-gray-400"
                    }
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid layout (default)
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={onClick}
    >
      {/* 档口图片 */}
      <div className="relative">
        <ImageLazyLoader
          src={booth.imageUrl || booth.coverImg || ""}
          alt={booth.boothName}
          className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
          fallbackSrc="/placeholder.png"
        />

        {/* 相似度显示 */}
        {showSimilarity && booth.similarity && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {Math.round(booth.similarity * 100)}%
          </div>
        )}

        {/* 收藏按钮 */}
        {onFavoriteClick && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all duration-200"
          >
            <Heart
              size={14}
              className={
                isFavorited ? "text-red-500 fill-current" : "text-gray-400"
              }
            />
          </button>
        )}
      </div>

      {/* 档口信息 */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-tight">
          {booth.boothName}
        </h3>

        {/* 评分和位置 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {booth.rating && (
            <div className="flex items-center">
              <Star
                size={11}
                className="text-yellow-400 mr-1"
                fill="currentColor"
              />
              <span>{booth.rating}</span>
            </div>
          )}

          {booth.market && (
            <div className="flex items-center flex-1 min-w-0 ml-2">
              <MapPin size={11} className="mr-1 flex-shrink-0" />
              <span className="truncate text-xs">{booth.market}</span>
            </div>
          )}
        </div>

        {/* 描述信息 */}
        {booth.description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
            {booth.description}
          </p>
        )}
      </div>
    </div>
  );
}

export type { Booth, BoothCardProps };