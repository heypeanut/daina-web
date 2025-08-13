import { Heart, MapPin } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Booth } from "@/types/api";

interface BoothHeaderProps {
  booth: Booth;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onShareClick?: () => void;
  className?: string;
}

export function BoothHeader({
  booth,
  isFavorited,
  onFavoriteToggle,
  // onShareClick,
  className = "",
}: BoothHeaderProps) {
  const getBusinessTags = () => {
    const businesses = booth.mainBusiness?.split("、") || [];
    return businesses.slice(0, 3).map((business, index) => (
      <span
        key={index}
        className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
      >
        {business}
      </span>
    ));
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header with clean white background */}
      <div className="relative">
        {/* Content */}
        <div className="px-4 pt-6 pb-4">
          {/* Main booth info */}
          <div className="flex items-start gap-4 mb-2">
            {/* Avatar */}
            <div className="relative">
              <ImageLazyLoader
                src={booth.coverImg || "/logo.png"}
                alt={booth?.boothName || ""}
                width={96}
                height={96}
                className="rounded-lg border-2 border-gray-200 shadow-sm"
                // onError={() => setImageSrc("/logo.png")}
              />
            </div>

            {/* Booth details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 mb-1 truncate flex-1">
                  {booth.boothName}
                </h1>

                {/* Small favorite and share icons */}
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={onFavoriteToggle}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isFavorited
                        ? "bg-pink-100 text-pink-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isFavorited ? "fill-current" : ""}
                    />
                  </button>

                  {/* <button
                    onClick={onShareClick}
                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Share2 size={16} />
                  </button> */}
                </div>
              </div>

              {/* Location info */}
              <div className="text-sm mb-2">
                {/* 第一行：图标 + 市场名称 */}
                <div className="flex items-center mb-1">
                  <MapPin
                    size={14}
                    className="mr-1.5 text-gray-500 flex-shrink-0"
                  />
                  <span className="font-semibold text-gray-800">
                    {booth.market}
                  </span>
                </div>

                {/* 第二行：地址信息（与图标对齐） */}
                {booth.address && (
                  <div className="ml-5.5 text-gray-500">{booth.address}</div>
                )}
              </div>

              {/* Business tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {getBusinessTags()}
              </div>

              {/* Rating and stats */}
              <div className="flex items-center gap-4 text-gray-500 text-xs">
                <span>{booth.followers || 0} 关注</span>
                <span>{booth.view || 0} 浏览</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
