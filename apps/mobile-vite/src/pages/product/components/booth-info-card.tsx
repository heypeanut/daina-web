import { ChevronRight } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { ProductBooth } from "@/types/booth";
interface BoothInfoCardProps {
  booth: ProductBooth;
  onFollowClick?: (boothId: string) => void;
  onBoothClick?: (boothId: string) => void;
  className?: string;
}

export function BoothInfoCard({
  booth,
  // onFollowClick,
  onBoothClick,
  className = "",
}: BoothInfoCardProps) {
  return (
    <div className={`bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">档口信息</h3>

      <div
        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onBoothClick?.(booth.id)}
      >
        {/* 档口头像 */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <ImageLazyLoader
            src={booth.coverImg || "/logo.png"}
            alt={booth.boothName}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 档口信息 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {booth.boothName}
          </h4>

          {/* 位置信息 */}
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <span className="truncate">{booth.mainBusiness}</span>
          </div>
        </div>

        {/* 箭头图标 */}
        <div className="flex-shrink-0">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
