import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, MapPin, Trash2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavoriteBooths, unfollowBooth } from "@/lib/api/user-behavior";
import type { FavoriteBooth } from "@/lib/api/user-behavior";
import type { PaginatedResponse } from "@/lib/api/config";

export default function FollowedBoothsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [unfollowing, setUnfollowing] = useState<string | null>(null);

  // 获取收藏档口列表
  const { data: followedBooths, isLoading } = useQuery<
    PaginatedResponse<FavoriteBooth>
  >({
    queryKey: ["favoriteBooths"],
    queryFn: () => getFavoriteBooths(1, 20),
    staleTime: 0, // 数据立即过期，确保每次都重新获取
    refetchOnWindowFocus: true, // 窗口重新获得焦点时刷新
    refetchOnMount: true, // 组件挂载时刷新
  });

  // 取消关注mutation
  const unfollowMutation = useMutation({
    mutationFn: unfollowBooth,
    onSuccess: () => {
      // 刷新收藏列表
      queryClient.invalidateQueries({ queryKey: ["favoriteBooths"] });
    },
    onError: (error) => {
      console.error("取消关注失败:", error);
      alert("取消关注失败，请重试");
    },
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleBoothClick = useCallback(
    (boothId: string) => {
      navigate(`/booth/${boothId}`);
    },
    [navigate]
  );

  const handleUnfollow = useCallback(
    async (boothId: string) => {
      setUnfollowing(boothId);
      try {
        await unfollowMutation.mutateAsync(boothId);
      } finally {
        setUnfollowing(null);
      }
    },
    [unfollowMutation]
  );

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString();
  }, []);

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
            关注档口 ({followedBooths?.rows?.length || 0})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {isLoading && !followedBooths?.rows?.length ? (
          /* 加载状态 */
          <div className="flex justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-600 font-medium">
                正在加载...
              </span>
            </div>
          </div>
        ) : !followedBooths?.rows?.length ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Store className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">暂无关注档口</p>
            <p className="text-gray-400 text-sm text-center">
              去发现优质档口，点击关注吧
            </p>
            <button
              onClick={() => navigate("/market")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去发现
            </button>
          </div>
        ) : (
          /* 档口列表 */
          <div className="p-4">
            <div className="space-y-3">
              {followedBooths?.rows?.map((booth: FavoriteBooth) => (
                <div
                  key={booth.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* 档口头像 */}
                      <div
                        className="relative w-16 h-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => handleBoothClick(booth.boothId)}
                      >
                        <ImageLazyLoader
                          src={booth.coverImg}
                          alt={booth.boothName}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover"
                          fallbackSrc="/cover.png"
                        />
                      </div>

                      {/* 档口信息 */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleBoothClick(booth.boothId)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                            {booth.boothName}
                          </h3>

                          {/* 取消关注按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnfollow(booth.boothId);
                            }}
                            disabled={unfollowing === booth.boothId}
                            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            {unfollowing === booth.boothId ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* 位置信息 */}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{booth.market}</span>
                        </div>

                        {/* 关注时间 */}
                        <div className="text-xs text-gray-400">
                          关注于 {formatDate(booth.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
