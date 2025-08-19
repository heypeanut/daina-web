import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Trash2 } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFavoriteProducts,
  removeProductFromFavorites,
} from "@/lib/api/user-behavior";
import type { FavoriteProduct } from "@/lib/api/user-behavior";
import type { PaginatedResponse } from "@/lib/api/config";

export default function FavoritesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState<string | null>(null);

  // 获取收藏商品列表
  const { data: favoriteProducts, isLoading } = useQuery<
    PaginatedResponse<FavoriteProduct>
  >({
    queryKey: ["favoriteProducts"],
    queryFn: () => getFavoriteProducts(1, 20),
    staleTime: 0, // 数据立即过期，确保每次都重新获取
    refetchOnWindowFocus: true, // 窗口重新获得焦点时刷新
    refetchOnMount: true, // 组件挂载时刷新
  });

  // 取消收藏mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: removeProductFromFavorites,
    onSuccess: () => {
      // 刷新收藏列表
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
    },
    onError: (error) => {
      console.error("取消收藏失败:", error);
      alert("取消收藏失败，请重试");
    },
  });

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  const handleRemoveFavorite = useCallback(
    async (productId: string) => {
      setRemoving(productId);
      try {
        await removeFavoriteMutation.mutateAsync(productId);
      } finally {
        setRemoving(null);
      }
    },
    [removeFavoriteMutation]
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

  const formatPrice = useCallback((price: number) => {
    return `¥${price.toFixed(2)}`;
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
            我的收藏 ({favoriteProducts?.rows?.length || 0})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {isLoading && !favoriteProducts?.rows?.length ? (
          /* 加载状态 */
          <div className="flex justify-center py-20">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-600 font-medium">
                正在加载...
              </span>
            </div>
          </div>
        ) : !favoriteProducts || favoriteProducts.rows.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">暂无收藏商品</p>
            <p className="text-gray-400 text-sm text-center">
              去逛逛喜欢的商品，点击♡收藏吧
            </p>
            <button
              onClick={() => navigate("/market")}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          /* 商品列表 */
          <div className="p-4">
            <div className="space-y-3">
              {favoriteProducts?.rows?.map((product: FavoriteProduct) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex gap-3">
                      {/* 商品图片 */}
                      <div
                        className="relative w-20 h-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => handleProductClick(product.productId)}
                      >
                        <ImageLazyLoader
                          src={product.coverImg}
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          fallbackSrc="/product-placeholder.png"
                        />
                      </div>

                      {/* 商品信息 */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => handleProductClick(product.productId)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 line-clamp-2">
                            {product.name}
                          </h3>

                          {/* 取消收藏按钮 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFavorite(product.productId);
                            }}
                            disabled={removing === product.productId}
                            className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                          >
                            {removing === product.productId ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* 价格 */}
                        <div className="text-lg font-bold text-orange-500 mb-2">
                          {formatPrice(product.price)}
                        </div>

                        {/* 收藏时间 */}
                        <div className="text-xs text-gray-400">
                          收藏于 {formatDate(product.createdAt)}
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
