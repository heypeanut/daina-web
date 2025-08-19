import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Store,
  MapPin,
  Star,
  Users,
  Trash2,
  ShoppingBag,
  Eye,
} from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import { useGetFollowedBooths } from "../hooks";

// Mock关注档口数据
interface FavoriteBooth {
  id: string;
  boothName: string;
  marketLabel: string;
  address: string;
  coverImg: string;
  followers: number;
  view: number;
  productCount: number;
  rating: number;
  followedAt: string;
  mainBusiness: string;
}

export default function FollowedBoothsPage() {
  const navigate = useNavigate();
  const [unfollowing, setUnfollowing] = useState<string | null>(null);
  const { data: followedBooths, isLoading } = useGetFollowedBooths();

  const handleBack = () => {
    navigate(-1);
  };

  const handleBoothClick = (boothId: string) => {
    navigate(`/booth/${boothId}`);
  };

  const handleUnfollow = async (boothId: string) => {};

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

  const formatNumber = (num: number) => {
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
            关注档口 ({followedBooths?.total || 0})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {followedBooths?.rows.length === 0 ? (
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
              {followedBooths?.rows.map((booth) => (
                <div
                  key={booth.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* 档口头像 */}
                      <div
                        className="relative w-16 h-16 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => handleBoothClick(booth.id)}
                      >
                        <ImageLazyLoader
                          src={booth.coverImg}
                          alt={booth.boothName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 档口信息 */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleBoothClick(booth.id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                            {booth.boothName}
                          </h3>

                          {/* 取消关注按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUnfollow(booth.id);
                            }}
                            disabled={unfollowing === booth.id}
                            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            {unfollowing === booth.id ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* 位置信息 */}
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{booth.marketLabel}</span>
                        </div>

                        {/* 主营业务 */}
                        <div className="text-sm text-gray-600 mb-2 line-clamp-1">
                          主营：{booth.mainBusiness}
                        </div>

                        {/* 统计信息 */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center">
                            <Users size={10} className="mr-1" />
                            <span>{formatNumber(booth.followers)} 关注</span>
                          </div>
                          <div className="flex items-center">
                            <Eye size={10} className="mr-1" />
                            <span>{formatNumber(booth.view)} 浏览</span>
                          </div>
                          <div className="flex items-center">
                            <ShoppingBag size={10} className="mr-1" />
                            <span>{booth.productCount} 商品</span>
                          </div>
                          <div className="flex items-center">
                            <Star size={10} className="mr-1" />
                            <span>{booth.rating}</span>
                          </div>
                        </div>

                        {/* 关注时间 */}
                        <div className="text-xs text-gray-400 mt-2">
                          关注于 {formatDate(booth.followedAt)}
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
