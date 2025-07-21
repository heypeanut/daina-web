"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Package 
} from "lucide-react";
import { 
  useFavoriteProducts,
  useRemoveProductFromFavorites,
  type FavoriteProduct 
} from "@/hooks/api/favorites/useFavoriteProducts";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";
import { toast } from "sonner";

export default function FavoriteProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  // 检查登录状态
  const isUserLoggedIn = isLoggedIn();
  if (!isUserLoggedIn) {
    redirectToLogin("/profile/favorites/products");
  }

  // 使用React Query获取收藏商品数据
  const productsQuery = useFavoriteProducts({
    page,
    pageSize: 20,
    enabled: isUserLoggedIn,
  });

  // 删除收藏的mutation
  const removeFromFavoritesMutation = useRemoveProductFromFavorites({
    onError: (error) => {
      toast.error("取消收藏失败，请重试");
    },
  });

  // 计算分页数据
  const { products = [], totalCount = 0, hasMore = false } = useMemo(() => {
    if (!productsQuery.data) {
      return { products: [], totalCount: 0, hasMore: false };
    }

    const data = productsQuery.data;
    return {
      products: data.items,
      totalCount: data.total,
      hasMore: page < data.totalPages,
    };
  }, [productsQuery.data, page]);

  const handleRemoveFavorite = async (productId: string) => {
    await removeFromFavoritesMutation.mutateAsync(productId);
  };

  const handleLoadMore = () => {
    if (!productsQuery.isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleProductClick = (productId: string) => {
    // 跳转到商品详情页
    router.push(`/products/${productId}`);
  };

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
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
            收藏商品 ({totalCount})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {productsQuery.isLoading && products.length === 0 ? (
          // 初始加载状态
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="flex space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : products.length === 0 ? (
          // 空状态
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              暂无收藏商品
            </h3>
            <p className="text-gray-500 text-center mb-6">
              快去收藏您喜欢的商品吧
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          // 商品列表
          <div className="p-4 space-y-4">
            {products.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="p-4">
                  <div className="flex space-x-4">
                    {/* 商品图片 */}
                    <button
                      onClick={() => handleProductClick(item.productId)}
                      className="flex-shrink-0"
                    >
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </button>

                    {/* 商品信息 */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => handleProductClick(item.productId)}
                        className="block w-full text-left"
                      >
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {item.product.boothName}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-semibold text-orange-500">
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.originalPrice && 
                             item.product.originalPrice > item.product.price && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(item.product.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          收藏于 {formatDate(item.createdAt)}
                        </p>
                      </button>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={() => handleRemoveFavorite(item.productId)}
                        disabled={removeFromFavoritesMutation.isPending}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
                      >
                        {removeFromFavoritesMutation.isPending ? (
                          <div className="w-5 h-5 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleProductClick(item.productId)}
                        className="flex items-center space-x-1 px-3 py-1 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        <span>查看</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={productsQuery.isFetching}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {productsQuery.isFetching ? "加载中..." : "加载更多"}
                </button>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                已显示全部商品
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}