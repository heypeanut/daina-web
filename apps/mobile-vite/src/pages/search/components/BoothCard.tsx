import { MapPin } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

interface Booth {
  id: string;
  boothName: string;
  market: string;
  imageUrl: string;
  similarity?: number;
  productsCount: number;
  followers?: number;
  views?: number;
}

interface BoothCardProps {
  booth: Booth;
  onClick: () => void;
  viewMode: "grid" | "list";
  showSimilarity?: boolean;
}

export default function BoothCard({
  booth,
  onClick,
  viewMode,
  showSimilarity,
}: BoothCardProps) {
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex space-x-3">
          <ImageLazyLoader
            src={booth.imageUrl}
            alt={booth.boothName}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {booth.boothName}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {booth.market}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {booth.productsCount} 个商品
              </span>
              {showSimilarity && booth.similarity && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {Math.round(booth.similarity * 100)}% 相似
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative">
        <ImageLazyLoader
          src={booth.imageUrl}
          alt={booth.boothName}
          width={200}
          height={120}
          className="w-full h-20 object-cover rounded-t-lg"
        />
        {showSimilarity && booth.similarity && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {Math.round(booth.similarity * 100)}%
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm">
          {booth.boothName}
        </h3>
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          {booth.market}
        </div>
      </div>
    </div>
  );
}

export type { Booth, BoothCardProps };