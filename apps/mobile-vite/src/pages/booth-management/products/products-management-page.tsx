import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Package,
  CheckSquare,
  Square,
  Loader2,
} from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import {
  useBoothProductsManagement,
  useToggleProductStatus,
  useDeleteProduct,
  useBatchUpdateProducts,
} from "../hooks/use-product-management";
import { useDictionary } from "@/hooks/api/useDictionary";
import { DictType } from "@/types/dictionary";

// 本地定义字典翻译函数（暂未使用，保留备用）
// const translateDictValue = (
//   value: string | undefined,
//   dictMap: DictMap | undefined
// ): string => {
//   if (!value || !dictMap) return value || "";
//   return dictMap[value] || value;
// };

// 商品状态
type ProductStatus = "1" | "0" | "all"; // 1: 上架, 0: 下架, all: 全部

export default function ProductsManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = searchParams.get("id") || "";

  // 如果没有boothId，返回错误页面
  if (!boothId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">参数错误</h2>
          <p className="text-gray-600 mb-4">缺少档口ID参数</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            返回
          </button>
        </div>
      </div>
    );
  }

  // 状态管理
  const [searchInput, setSearchInput] = useState("");      // 输入框的值
  const [searchQuery, setSearchQuery] = useState("");     // 实际搜索的关键词
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [filter, setFilter] = useState<ProductStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState<{
    [key: string]: boolean;
  }>({});
  const pageSize = 12;

  // 字典Hooks
  // const productStatusDictMap = useDictMap(DictType.PRODUCT_STATUS); // 暂未使用
  const { data: productStatusDict } = useDictionary(DictType.PRODUCT_STATUS);

  // 构建API参数
  const apiParams = {
    pageNum: currentPage,
    pageSize,
    keyword: searchQuery || undefined,
    status: filter === "all" ? undefined : filter,
    sortBy: "created_time" as const,
    sortOrder: "desc" as const,
  };

  // API Hooks
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
  } = useBoothProductsManagement(boothId, apiParams);

  const toggleStatusMutation = useToggleProductStatus();
  const deleteProductMutation = useDeleteProduct();
  const batchUpdateMutation = useBatchUpdateProducts();

  // 从API数据中获取产品列表
  const products = productsData?.rows || [];
  const totalProducts = productsData?.total || 0;

  // 搜索处理
  const handleSearch = useCallback(() => {
    setSearchQuery(searchInput);  // 将输入框的值设为搜索关键词
    setCurrentPage(1);            // 重置到第一页
  }, [searchInput]);

  // 清除搜索
  const handleClearSearch = useCallback(() => {
    setSearchInput("");     // 清空输入框
    setSearchQuery("");     // 清空搜索关键词
    setShowSearch(false);
    setCurrentPage(1);
  }, []);

  // 筛选处理
  const handleFilterChange = useCallback((newFilter: ProductStatus) => {
    setFilter(newFilter);
    setCurrentPage(1); // 重置到第一页
  }, []);

  const handleBack = () => {
    // 返回到档口管理页面，而不是使用浏览器历史记录
    navigate(`/booth/management?id=${boothId}`);
  };

  const handleAddProduct = () => {
    navigate(`/booth/products/add?boothId=${boothId}`);
  };

  const handleProductClick = (productId: string) => {
    if (bulkMode) {
      // 批量模式下切换选择状态
      setSelectedProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } else {
      // 档口所有者可以预览所有商品（包括下架商品）
      // 添加查询参数标识来自档口管理
      navigate(`/product/${productId}?from=booth-management`);
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/booth/products/edit?productId=${productId}&boothId=${boothId}`);
  };

  const handleToggleStatus = async (
    productId: string,
    currentStatus: string
  ) => {
    // 设置该商品为loading状态
    setLoadingProducts((prev) => ({ ...prev, [productId]: true }));

    try {
      await toggleStatusMutation.mutateAsync({
        boothId,
        productId,
        status: currentStatus,
      });

      const newStatus = currentStatus === "1" ? "下架" : "上架";
      console.log(`商品${productId}已${newStatus}`);
      // 依赖 mutation 的 onSuccess 自动失效缓存，无需手动 refetch
    } catch (error: any) {
      console.error("状态切换失败:", error);
      alert(error.message || "操作失败，请重试");
    } finally {
      // 清除该商品的loading状态
      setLoadingProducts((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("确定要删除这个商品吗？此操作不可恢复。")) {
      return;
    }

    // 设置该商品为loading状态
    setLoadingProducts((prev) => ({ ...prev, [`delete_${productId}`]: true }));

    try {
      await deleteProductMutation.mutateAsync(productId);
      console.log(`商品${productId}已删除`);
      // 依赖 mutation 的 onSuccess 自动失效缓存，无需手动 refetch
    } catch (error: any) {
      console.error("删除失败:", error);
      alert(error.message || "删除失败，请重试");
    } finally {
      // 清除该商品的loading状态
      setLoadingProducts((prev) => {
        const newState = { ...prev };
        delete newState[`delete_${productId}`];
        return newState;
      });
    }
  };

  const handleBulkAction = async (action: "delete" | "on" | "off") => {
    if (selectedProducts.length === 0) {
      alert("请先选择商品");
      return;
    }

    const actionText =
      action === "delete" ? "删除" : action === "on" ? "上架" : "下架";

    if (
      !confirm(`确定要${actionText}选中的${selectedProducts.length}个商品吗？`)
    ) {
      return;
    }

    try {
      const batchAction =
        action === "delete"
          ? "delete"
          : action === "on"
          ? "activate"
          : "deactivate";

      await batchUpdateMutation.mutateAsync({
        boothId,
        productIds: selectedProducts,
        action: batchAction,
      });

      setSelectedProducts([]);
      setBulkMode(false);

      console.log(`批量${actionText}操作完成`);
      // 依赖 mutation 的 onSuccess 自动失效缓存，无需手动 refetch
    } catch (error: any) {
      console.error("批量操作失败:", error);
      alert(error.message || "操作失败，请重试");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
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
            商品管理
          </h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        {showSearch && (
          <div className="px-4 pb-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                placeholder="搜索商品名称..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                搜索
              </button>
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  清除
                </button>
              )}
            </div>
          </div>
        )}

        {/* 筛选和批量操作 */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* 状态筛选 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {/* 全部标签 */}
            <button
              onClick={() => handleFilterChange("all")}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              全部
            </button>

            {/* 动态渲染字典状态标签 */}
            {productStatusDict?.map((statusItem) => (
              <button
                key={statusItem.value}
                onClick={() =>
                  handleFilterChange(statusItem.value as ProductStatus)
                }
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  filter === statusItem.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {statusItem.label}
              </button>
            ))}
          </div>

          {/* 批量操作 */}
          <div className="flex items-center">
            {!bulkMode ? (
              <button
                onClick={() => setBulkMode(true)}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                批量管理
              </button>
            ) : (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-gray-600">
                  已选 {selectedProducts.length} 项
                </span>
                <button
                  onClick={() => {
                    setBulkMode(false);
                    setSelectedProducts([]);
                  }}
                  className="ml-2 text-orange-500 hover:text-orange-600"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className={`pb-6 ${bulkMode ? "pb-24" : ""}`}>
        {/* 错误状态 */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-600 text-center mb-2">加载失败</p>
            <p className="text-gray-500 text-sm text-center mb-4">
              {error.message}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-4" />
            <p className="text-gray-500">加载中...</p>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              {searchQuery ? "未找到相关商品" : "暂无商品"}
            </p>
            <p className="text-gray-400 text-sm text-center mb-4">
              {searchQuery ? "试试其他关键词" : "发布您的第一个商品吧"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                发布商品
              </button>
            )}
          </div>
        )}

        {/* 商品列表 */}
        {!error && products.length > 0 && (
          /* 商品列表 */
          <div className="p-4">
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-shadow duration-200 hover:shadow-md"
                >
                  <div className="flex p-3 gap-3">
                    {/* 商品内容区域包装 */}
                    <div
                      className={`flex gap-3 flex-1 ${
                        product.status !== "1" ? "opacity-60" : ""
                      }`}
                    >
                      {/* 批量选择框 */}
                      {bulkMode && (
                        <button
                          onClick={() => handleProductClick(product.id)}
                          className="flex items-center justify-center w-6 h-6 mt-1"
                        >
                          {selectedProducts.includes(product.id) ? (
                            <CheckSquare className="w-5 h-5 text-orange-500" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      )}

                      {/* 商品图片 */}
                      <div
                        className={`relative w-20 h-20 flex-shrink-0 ${
                          !bulkMode
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                        onClick={() =>
                          !bulkMode && handleProductClick(product.id)
                        }
                      >
                        <ImageLazyLoader
                          src={
                            Array.isArray(product.images) &&
                            product.images.length > 0
                              ? typeof product.images[0] === "string"
                                ? product.images[0]
                                : product.images[0]?.url ||
                                  "/placeholder-product.jpg"
                              : "/placeholder-product.jpg"
                          }
                          alt={product.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover rounded-lg"
                        />

                        {/* 已下架遮罩 */}
                        {product.status !== "1" && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xs font-medium px-2 py-1 bg-gray-600 rounded">
                              已下架
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 商品信息 */}
                      <div
                        className={`flex-1 min-w-0 ${
                          !bulkMode
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                        onClick={() =>
                          !bulkMode && handleProductClick(product.id)
                        }
                      >
                        <h3
                          className={`text-sm font-semibold mb-1 line-clamp-2 leading-tight ${
                            product.status === "1"
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          {product.name}
                        </h3>

                        {product.price !== null &&
                          product.price !== undefined && (
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-red-500 font-bold text-lg">
                                ¥{product.price.toFixed(2)}
                              </span>
                              {product.originalPrice !== null &&
                                product.originalPrice !== undefined && (
                                  <span className="text-gray-400 text-xs line-through">
                                    ¥{product.originalPrice.toFixed(2)}
                                  </span>
                                )}
                            </div>
                          )}

                        <div className="space-y-1">
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                              库存 {product.stock || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full"></span>
                              浏览 {product.views || 0}
                            </span>
                          </div>

                          <div className="text-xs text-gray-400">
                            更新于{" "}
                            {product.updatedAt
                              ? formatDate(product.updatedAt)
                              : "未知"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 - 平铺在底部 */}
                  {!bulkMode && (
                    <div className="px-3 pb-3">
                      <div className="flex gap-2 pt-2 border-t border-gray-50">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProduct(product.id);
                          }}
                          className="flex-1 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition-colors"
                        >
                          编辑
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(product.id, product.status);
                          }}
                          disabled={loadingProducts[product.id]}
                          className={`flex-1 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            product.status === "1"
                              ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {loadingProducts[product.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : product.status === "1" ? (
                            "下架"
                          ) : (
                            "上架"
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(product.id);
                          }}
                          disabled={loadingProducts[`delete_${product.id}`]}
                          className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingProducts[`delete_${product.id}`] ? (
                            <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                          ) : (
                            "删除"
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 简洁版分页 */}
            {products.length > 0 && totalProducts > pageSize && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  上一页
                </button>
                
                <span className="text-sm text-gray-600">
                  第 {currentPage} 页 / 共 {Math.ceil(totalProducts / pageSize)} 页
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(totalProducts / pageSize), prev + 1))}
                  disabled={currentPage >= Math.ceil(totalProducts / pageSize) || isLoading}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  下一页
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* 批量操作底部栏 */}
      {bulkMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb">
          <div className="flex gap-3">
            <button
              onClick={() => handleBulkAction("on")}
              disabled={
                selectedProducts.length === 0 || batchUpdateMutation.isPending
              }
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {batchUpdateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              上架
            </button>

            <button
              onClick={() => handleBulkAction("off")}
              disabled={
                selectedProducts.length === 0 || batchUpdateMutation.isPending
              }
              className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {batchUpdateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              下架
            </button>

            <button
              onClick={() => handleBulkAction("delete")}
              disabled={
                selectedProducts.length === 0 || batchUpdateMutation.isPending
              }
              className="flex-1 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
            >
              {batchUpdateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : null}
              删除
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
