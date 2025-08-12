import { MapPin, Users, Eye, ChevronRight } from 'lucide-react';
import { ImageLazyLoader } from '@/components/common';

interface BoothInfo {
  id: string;
  boothName: string;
  marketLabel: string;
  followers: number;
  view: number;
  coverImg?: string;
}

interface BoothInfoCardProps {
  booth: BoothInfo;
  onBoothClick?: (boothId: string) => void;
  onFollowClick?: (boothId: string) => void;
  className?: string;
}

export function BoothInfoCard({
  booth,
  onBoothClick,
  onFollowClick,
  className = ''
}: BoothInfoCardProps) {
  return (
    <div className={`bg-white p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">档口信息</h3>
      
      <div 
        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => onBoothClick?.(booth.id)}
      >
        {/* 档口头像 */}
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
          <ImageLazyLoader
            src={booth.coverImg || '/logo.png'}
            alt={booth.boothName}
            width={48}
            height={48}
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
            <MapPin size={12} className="mr-1" />
            <span className="truncate">{booth.marketLabel}</span>
          </div>
          
          {/* 统计信息 */}
          <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
            <div className="flex items-center">
              <Users size={10} className="mr-1" />
              <span>{booth.followers} 关注</span>
            </div>
            <div className="flex items-center">
              <Eye size={10} className="mr-1" />
              <span>{booth.view} 浏览</span>
            </div>
          </div>
        </div>
        
        {/* 关注按钮和箭头 */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFollowClick?.(booth.id);
            }}
            className="px-3 py-1 text-sm bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            关注
          </button>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
