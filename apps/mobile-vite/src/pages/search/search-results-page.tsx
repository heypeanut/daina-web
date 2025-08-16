import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout";
import { ArrowLeft, Search, Filter } from "lucide-react";
import ProductSearchResults from "@/pages/search/components/ProductSearchResults";
import BoothSearchResults from "@/pages/search/components/BoothSearchResults";

// 图片搜索结果类型
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  similarity?: number;
  shop: string;
  views?: number;
}

interface Booth {
  id: string;
  boothName: string;
  market: string;
  imageUrl: string;
  similarity?: number;
  productsCount: number;
  followers?: number;
  views?: number;
}

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>("");

  // 图片搜索结果状态
  const [imageProducts, setImageProducts] = useState<Product[]>([]);
  const [imageBooths, setImageBooths] = useState<Booth[]>([]);
  const [imageProductTotal, setImageProductTotal] = useState(0);
  const [imageBoothTotal, setImageBoothTotal] = useState(0);

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
  const searchImage = sessionStorage.getItem("searchImage");

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
          if (imageResults) {
            const results = JSON.parse(imageResults);
            if (searchType === "image-product") {
              setImageProducts(results.rows || []);
              setImageProductTotal(results.total || 0);
            } else {
              setImageBooths(results.rows || []);
              setImageBoothTotal(results.total || 0);
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

  const handleBack = () => {
    navigate(-1);
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

      // 这里可以渲染图片搜索的结果，暂时简化处理
      return (
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            已找到 {currentResults.length} 个
            {currentSearchMode === "product" ? "商品" : "档口"}
          </p>
          {/* 图片搜索结果的具体渲染逻辑可以后续添加 */}
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
      <div className="min-h-screen bg-gray-50">
        {/* 搜索头部 */}
        <div className="bg-white border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
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
            <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
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

        {/* 筛选栏 */}
        {!isImageSearch && (
          <div className="bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex items-center">
              <button className="flex items-center text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-1" />
                筛选
              </button>
            </div>
          </div>
        )}

        {/* 搜索结果内容 */}
        {renderContent()}
      </div>
    </MobileLayout>
  );
}
