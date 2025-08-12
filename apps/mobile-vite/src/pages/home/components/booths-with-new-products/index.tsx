import { useCallback } from "react";
import Masonry from "react-masonry-css";
import {
  useInfiniteLatestBoothsWithNewProducts,
} from "../../hooks";
import { BoothCard } from "./booth-card";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";

interface BoothsWithNewProductsProps {
  title: string;
  pageSize?: number;
}

export function BoothsWithNewProducts({
  title,
  pageSize = 12,
}: BoothsWithNewProductsProps) {
  const { 
    allData: allBooths,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  } = useInfiniteLatestBoothsWithNewProducts(pageSize);
  
  // 无限滚动处理
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    loadMore,
    {
      hasMore,
      isLoading: isLoadingMore,
    }
  );

  // 瀑布流列数配置 - 移动端固定2列
  const breakpointColumnsObj = {
    default: 2,
    768: 2,
    640: 2,
    480: 2
  };

  const handleBoothClick = useCallback(
    () => {
     
    },
    []
  );

  const handleFavoriteClick = useCallback(
    () => {
      
      // TODO: 实现收藏功能
      console.log("收藏档口:");
    },
    []
  );



  if (error) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>加载失败，请稍后重试</p>
        </div>
      </div>
    );
  }

  // 初始加载状态
  if (allBooths.length === 0 && isLoadingInitial) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="flex justify-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-600 font-medium">
              正在加载...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (allBooths.length === 0 && !isLoadingInitial) {
    return (
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>暂无新品档口</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      </div>

      {/* react-masonry-css 瀑布流布局 */}
      <div className="px-4">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-3 w-auto"
          columnClassName="pl-3 bg-clip-padding"
        >
          {allBooths.map((booth) => (
            <BoothCard 
              key={booth.id} 
              booth={booth} 
              handleBoothClick={handleBoothClick} 
              handleFavoriteClick={handleFavoriteClick} 
            />
          ))}
        </Masonry>
      </div>

      {/* 无限滚动触发器 */}
      {shouldShowTrigger && (
        <div 
          ref={triggerRef}
          className="py-2"
        />
      )}

      {/* 加载状态提示 */}
      {isLoadingMore && (
        <div className="w-full flex justify-center py-4">
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            <span className="text-sm text-gray-600 font-medium">
              加载更多...
            </span>
          </div>
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && allBooths.length > 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          已加载全部档口
        </div>
      )}
    </div>
  );
}

export default BoothsWithNewProducts;
