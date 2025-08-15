import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";
import { useInfiniteHistory } from "../hooks";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import { useQueryClient } from "@tanstack/react-query";
import { removeFootprint, clearFootprints } from "@/lib/api/user-behavior";
import { ProductHistoryCard } from "./components/ProductHistoryCard";

import type { Footprint } from "@/lib/api/user-behavior";

export default function ProductHistoryPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);
  
  // 固定为商品类型
  const filter = "product";
  
  // 使用无限滚动 hook
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteHistory(filter, 20);

  // 合并所有页面的数据
  const footprints = data?.pages?.flatMap(page => page.rows) || [];
  
  // 无限滚动触发器
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    fetchNextPage,
    {
      hasMore: hasNextPage,
      isLoading: isFetchingNextPage,
    }
  );

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleItemClick = useCallback((footprint: Footprint) => {
    // 尝试多种可能的ID字段
    const possibleId = footprint.targetId || 
                      (footprint as any).productId || 
                      (footprint as any).objectId ||
                      (footprint as any).product?.id ||
                      (footprint as any).boothProduct?.id;
    
    if (!possibleId) {
      alert('商品信息异常，无法跳转');
      return;
    }
    
    // 商品历史页面直接跳转到商品详情
    navigate(`/product/${possibleId}`);
  }, [navigate]);

  const handleRemoveFootprint = async (footprintId: string) => {
    setRemoving(footprintId);
    
    try {
      await removeFootprint(footprintId);
      
      // 刷新数据以获取最新内容
      await queryClient.invalidateQueries({
        queryKey: ['footprints', 'infinite', filter]
      });
      
      console.log(`已删除商品浏览记录: ${footprintId}`);
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请重试");
    } finally {
      setRemoving(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("确定要清空所有商品浏览记录吗？此操作不可恢复。")) {
      return;
    }
    
    setClearing(true);
    
    try {
      await clearFootprints(filter);
      
      // 刷新数据以获取最新内容
      await queryClient.invalidateQueries({
        queryKey: ['footprints', 'infinite', filter]
      });
      
      console.log('已清空商品浏览记录');
    } catch (error) {
      console.error("清空失败:", error);
      alert("清空失败，请重试");
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "刚刚";
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            商品浏览记录 ({footprints?.length || 0})
          </h1>
          <button
            onClick={handleClearAll}
            disabled={clearing || footprints.length === 0}
            className="text-sm text-red-500 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {clearing ? "清空中..." : "清空"}
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {isLoading && footprints.length === 0 ? (
          /* 初始加载状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : footprints?.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Eye className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              暂无商品浏览记录
            </p>
            <p className="text-gray-400 text-sm text-center">
              去逛逛感兴趣的商品吧
            </p>
            <button
              onClick={() => navigate('/market')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          /* 记录列表 */
          <div className="p-4">
            <div className="grid grid-cols-2 gap-3">
              {footprints?.map((footprint) => (
                <ProductHistoryCard
                  key={footprint.id}
                  footprint={footprint}
                  onCardClick={handleItemClick}
                  onRemove={handleRemoveFootprint}
                  isRemoving={removing === footprint.id}
                  formatDate={formatDate}
                />
              ))}
            </div>
            
            {/* 无限滚动触发器 */}
            {shouldShowTrigger && (
              <div ref={triggerRef} className="flex justify-center py-4">
                {isFetchingNextPage ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                    <span className="text-sm text-gray-500">加载更多...</span>
                  </div>
                ) : hasNextPage ? (
                  <div className="text-sm text-gray-400">向上滑动加载更多</div>
                ) : (
                  <div className="text-sm text-gray-400">没有更多记录了</div>
                )}
              </div>
            )}
          </div>
        )}
        
        {/* 错误状态 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-red-500 mb-2">加载失败</div>
            <button
              onClick={() => fetchNextPage()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重试
            </button>
          </div>
        )}
      </div>
    </div>
  );
}