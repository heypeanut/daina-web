"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Star, 
  Users, 
  Trash2,
  ShoppingBag,
  Verified
} from "lucide-react";
import { 
  useFavoriteBooths,
  useUnfollowBooth,
  type FavoriteBooth 
} from "@/hooks/api/favorites/useFavoriteBooths";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";

export default function FavoriteBoothsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // 检查登录状态
  const isUserLoggedIn = isLoggedIn();
  if (!isUserLoggedIn) {
    redirectToLogin("/profile/favorites/booths");
  }

  // 使用React Query获取关注档口数据
  const boothsQuery = useFavoriteBooths({
    page,
    pageSize: 20,
    enabled: isUserLoggedIn,
  });

  // 取消关注的mutation
  const unfollowMutation = useUnfollowBooth({
    onError: (error) => {
      alert("取消关注失败，请重试");
    },
  });

  // 计算分页数据
  const { booths = [], totalCount = 0, hasMore = false } = useMemo(() => {
    if (!boothsQuery.data) {
      return { booths: [], totalCount: 0, hasMore: false };
    }

    const data = boothsQuery.data;
    return {
      booths: data.items,
      totalCount: data.total,
      hasMore: page < data.totalPages,
    };
  }, [boothsQuery.data, page]);

  const handleUnfollow = async (boothId: string) => {
    await unfollowMutation.mutateAsync(boothId);
  };

  const handleLoadMore = () => {
    if (!boothsQuery.isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleBoothClick = (boothId: string) => {
    // 跳转到档口详情页
    router.push(`/booths/${boothId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    if (num < 1000) return num.toString();
    if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
    return `${(num / 10000).toFixed(1)}w`;
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
            关注档口 ({totalCount})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {boothsQuery.isLoading && booths.length === 0 ? (
          // 初始加载状态
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : booths.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无关注档口
            </h3>
            <p className="text-gray-500 text-center mb-6">
              快去关注您喜欢的档口吧
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          // 档口列表
          <div className="p-4 space-y-4">
            {booths.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex space-x-4">
                    {/* 档口头像 */}
                    <button
                      onClick={() => handleBoothClick(item.boothId)}
                      className="flex-shrink-0"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.booth.avatar ? (
                          <img
                            src={item.booth.avatar}
                            alt={item.booth.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* 档口信息 */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleBoothClick(item.boothId)}
                        className="block w-full text-left"
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {item.booth.name}
                          </h3>
                          {item.booth.verified && (
                            <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        
                        {item.booth.description && (
                          <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                            {item.booth.description}
                          </p>
                        )}

                        {item.booth.location && (
                          <div className="flex items-center space-x-1 mb-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 truncate">
                              {item.booth.location}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {item.booth.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{item.booth.rating.toFixed(1)}</span>
                            </div>
                          )}
                          
                          {item.booth.followers && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{formatNumber(item.booth.followers)}关注</span>
                            </div>
                          )}
                          
                          {item.booth.productsCount && (
                            <div className="flex items-center space-x-1">
                              <ShoppingBag className="w-3 h-3" />
                              <span>{formatNumber(item.booth.productsCount)}商品</span>
                            </div>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 mt-2">
                          关注于 {formatDate(item.createdAt)}
                        </p>
                      </button>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => handleUnfollow(item.boothId)}
                        disabled={unfollowMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                      >
                        {unfollowMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleBoothClick(item.boothId)}
                        className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors"
                      >
                        进店
                      </button>
                    </div>
                  </div>

                  {/* 档口标签 */}
                  {item.booth.tags && item.booth.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.booth.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.booth.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{item.booth.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={boothsQuery.isFetching}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {boothsQuery.isFetching ? "加载中..." : "加载更多"}
                </button>
              </div>
            )}

            {!hasMore && booths.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                已显示全部档口
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}