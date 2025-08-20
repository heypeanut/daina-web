import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout";
import { ArrowLeft, Search } from "lucide-react";
import ProductSearchResults from "@/pages/search/components/ProductSearchResults";
import BoothSearchResults from "@/pages/search/components/BoothSearchResults";
import ProductCard from "@/pages/search/components/ProductCard";
import { searchProductsByImageBase64 } from "@/lib/api/upload-search";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import { IMAGE_SEARCH_MIN_SIMILARITY } from "@/lib/constants/search";

import type { Product, Booth } from "@/types/api";

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>("");

  // 图片搜索结果状态
  const [imageProducts, setImageProducts] = useState<Product[]>([]);
  const [imageBooths, setImageBooths] = useState<Booth[]>([]);
  const [imageProductTotal, setImageProductTotal] = useState(0);
  const [imageBoothTotal, setImageBoothTotal] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchImage, setSearchImage] = useState<string>("");

  // 获取搜索参数
  const keyword = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const searchType = useMemo(
    () => searchParams.get("type") || "",
    [searchParams]
  );
  const isImageSearch = useMemo(
    () => searchType.startsWith("image-"),
    [searchType]
  );

  // 计算当前搜索模式
  const currentSearchMode = useMemo(() => {
    if (isImageSearch) {
      return searchType === "image-product" ? "product" : "booth";
    }
    return searchType === "booth" ? "booth" : "product";
  }, [isImageSearch, searchType]);

  // 图片搜索结果加载
  useEffect(() => {
    if (isImageSearch) {
      const loadImageResults = async () => {
        setError("");
        try {
          const imageResults = sessionStorage.getItem("imageSearchResults");
          const searchImageData = sessionStorage.getItem("searchImage");

          if (imageResults && searchImageData) {
            const results = JSON.parse(imageResults);
            setSearchImage(searchImageData);

            if (searchType === "image-product") {
              // 转换API返回的数据格式为Product格式
              const products = (results.rows || []).map(
                (item: { product: Product }) => ({
                  id: item.product.id,
                  name: item.product.name,
                  price: item.product.price,
                  images: item.product.images,
                  category: item.product.category,
                  views: item.product.views,
                  createdAt: item.product.createdAt,
                  // similarity: item.similarity, // 添加相似度信息
                })
              );
              setImageProducts(products);
              setImageProductTotal(results.total || 0);
              setCurrentPage(1); // 重置页码
            } else {
              setImageBooths(results.rows || []);
              setImageBoothTotal(results.total || 0);
              setCurrentPage(1); // 重置页码
            }
          }
        } catch (error) {
          console.error("图片搜索结果加载失败:", error);
          setError(error instanceof Error ? error.message : "加载搜索结果失败");
        }
      };
      loadImageResults();
    }
  }, [searchType, isImageSearch]);

  // 加载更多图片搜索结果
  const handleLoadMoreImageResults = async () => {
    if (isLoadingMore || !searchImage) return;

    const nextPage = currentPage + 1;
    const hasMoreData =
      currentSearchMode === "product"
        ? imageProducts.length < imageProductTotal
        : imageBooths.length < imageBoothTotal;

    if (!hasMoreData) return;

    try {
      setIsLoadingMore(true);

      if (currentSearchMode === "product") {
        const result = await searchProductsByImageBase64(searchImage, {
          pageNum: nextPage,
          limit: 20,
          minSimilarity: IMAGE_SEARCH_MIN_SIMILARITY,
        });

        if (result && result.rows && result.rows.length > 0) {
          const newProducts = result.rows.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            images: item.product.images || [{ url: item.url }],
            category: item.product.category,
            views: item.product.views,
            createdAt: item.product.createdAt,
            similarity: item.similarity,
          }));

          setImageProducts((prev) => [...prev, ...newProducts]);
          setCurrentPage(nextPage);
        }
      }
      // TODO: 添加booth的分页加载逻辑
    } catch (error) {
      console.error("加载更多图片搜索结果失败:", error);
      setError("加载更多结果失败");
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 无限滚动hook - 只在图片搜索时使用
  const hasMoreImageData =
    isImageSearch &&
    (currentSearchMode === "product"
      ? imageProducts.length < imageProductTotal
      : imageBooths.length < imageBoothTotal);

  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    handleLoadMoreImageResults,
    {
      hasMore: hasMoreImageData,
      isLoading: isLoadingMore,
      threshold: 0.1,
      rootMargin: "100px",
    }
  );

  const handleBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleBoothClick = (boothId: string) => {
    navigate(`/booth/${boothId}`);
  };

  const getSearchTitle = () => {
    if (isImageSearch) {
      return searchType === "image-product" ? "以图搜商品" : "以图搜档口";
    }
    return `搜索 "${keyword}"`;
  };

  const getCurrentTotal = () => {
    if (isImageSearch) {
      return currentSearchMode === "product"
        ? imageProductTotal
        : imageBoothTotal;
    }
    return 0; // 普通搜索的总数由子组件管理
  };

  // 渲染内容
  const renderContent = () => {
    if (isImageSearch) {
      // 图片搜索结果
      const currentResults =
        currentSearchMode === "product" ? imageProducts : imageBooths;

      if (error) {
        return (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">搜索出错</div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              重试
            </button>
          </div>
        );
      }

      if (currentResults.length === 0) {
        return (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              没有找到相关结果
            </h3>
            <p className="text-gray-600">请尝试其他图片或调整筛选条件</p>
          </div>
        );
      }

      // 渲染图片搜索的结果
      return (
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            已找到 {getCurrentTotal()} 个
            {currentSearchMode === "product" ? "商品" : "档口"}
            {getCurrentTotal() > currentResults.length && (
              <span className="text-gray-500">
                （已显示 {currentResults.length} 个）
              </span>
            )}
          </p>
          {currentSearchMode === "product" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                {imageProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode="grid"
                    onClick={() => handleProductClick(product.id)}
                  />
                ))}
              </div>

              {/* 无限滚动触发器 */}
              {shouldShowTrigger && (
                <div ref={triggerRef} className="mt-6 py-4 flex justify-center">
                  {isLoadingMore && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" />
                      <span className="text-sm text-gray-600">
                        加载更多商品...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-4">
                {imageBooths.map((booth, index) => (
                  <div
                    key={booth.id || index}
                    onClick={() => booth.id && handleBoothClick(booth.id)}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-orange-200 active:scale-[0.98]"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {booth.boothName}
                    </h3>
                    {booth.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {booth.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span>点击查看详情</span>
                      <span className="text-orange-500">→</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 无限滚动触发器 */}
              {shouldShowTrigger && (
                <div ref={triggerRef} className="mt-6 py-4 flex justify-center">
                  {isLoadingMore && (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" />
                      <span className="text-sm text-gray-600">
                        加载更多档口...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    // 普通搜索：根据type渲染对应组件
    if (currentSearchMode === "product") {
      return <ProductSearchResults />;
    } else {
      return <BoothSearchResults />;
    }
  };

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50 ">
        {/* 搜索头部 */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4 sticky top-0">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 mx-3">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                {getSearchTitle()}
              </h1>
              {isImageSearch && keyword && (
                <p className="text-sm text-gray-500">
                  共找到 {getCurrentTotal()} 个结果
                </p>
              )}
            </div>
            {/* <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-600" />
            </button> */}
          </div>

          {/* 图片搜索预览 */}
          {isImageSearch && searchImage && (
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-lg p-3 flex items-center">
                <img
                  src={searchImage}
                  alt="搜索图片"
                  className="w-12 h-12 object-cover rounded-lg mr-3"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    以图搜{currentSearchMode === "product" ? "商品" : "档口"}
                  </p>
                  <p className="text-xs text-gray-500">
                    共找到 {getCurrentTotal()} 个相似结果
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 搜索结果内容 */}
        {renderContent()}
      </div>
    </MobileLayout>
  );
}
