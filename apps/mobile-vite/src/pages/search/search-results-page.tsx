import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout";
import { ArrowLeft, Search, Filter, Grid, List, Star, MapPin, Eye } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

// 类型定义
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  similarity?: number;
  shop: string;
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

interface SearchResults {
  products: Product[];
  booths: Booth[];
  total: number;
}

// Mock搜索函数
const searchProducts = async (keyword: string): Promise<{ rows: Product[], total: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    rows: [
      {
        id: "1",
        name: `${keyword} 透明保护壳`,
        price: 29.9,
        originalPrice: 39.9,
        imageUrl: "/placeholder-product.jpg",
        shop: "数码配件专营店"
      },
      {
        id: "2",
        name: `${keyword} 防摔保护套`,
        price: 19.9,
        originalPrice: 29.9,
        imageUrl: "/placeholder-product.jpg",
        shop: "手机配件批发"
      }
    ],
    total: 2
  };
};

const searchBooths = async (keyword: string): Promise<{ rows: Booth[], total: number }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    rows: [
      {
        id: "1",
        boothName: `${keyword}专营店`,
        market: "广州天河电脑城",
        imageUrl: "/placeholder-booth.jpg",
        productsCount: 120,
        followers: 89,
        views: 1520
      }
    ],
    total: 1
  };
};

export default function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'product' | 'booth'>('product');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [boothTotal, setBoothTotal] = useState(0);

  // 获取搜索参数
  const keyword = searchParams.get('q') || '';
  const searchType = searchParams.get('type') || 'product';
  const isImageSearch = searchType.startsWith('image-');
  const searchImage = sessionStorage.getItem('searchImage');

  useEffect(() => {
    // 设置初始tab
    if (searchType === 'booth' || searchType === 'image-booth') {
      setActiveTab('booth');
    } else {
      setActiveTab('product');
    }

    // 加载搜索结果
    loadSearchResults();
  }, [searchType, keyword]);

  const loadSearchResults = async () => {
    setLoading(true);
    try {
      // 检查是否为图片搜索结果
      if (isImageSearch) {
        const imageResults = sessionStorage.getItem('imageSearchResults');
        if (imageResults) {
          const results = JSON.parse(imageResults);
          if (searchType === 'image-product') {
            setProducts(results.rows || []);
            setProductTotal(results.total || 0);
          } else {
            setBooths(results.rows || []);
            setBoothTotal(results.total || 0);
          }
        }
      } else {
        // 普通关键词搜索
        if (keyword) {
          const [productResults, boothResults] = await Promise.all([
            searchProducts(keyword),
            searchBooths(keyword)
          ]);
          
          setProducts(productResults.rows);
          setProductTotal(productResults.total);
          setBooths(boothResults.rows);
          setBoothTotal(boothResults.total);
        }
      }
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleBoothClick = (booth: Booth) => {
    navigate(`/booth/${booth.id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getSearchTitle = () => {
    if (isImageSearch) {
      return searchType === 'image-product' ? '以图搜商品' : '以图搜档口';
    }
    return `搜索 "${keyword}"`;
  };

  const getCurrentResults = () => {
    return activeTab === 'product' ? products : booths;
  };

  const getCurrentTotal = () => {
    return activeTab === 'product' ? productTotal : boothTotal;
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
              {!isImageSearch && keyword && (
                <p className="text-sm text-gray-500">共找到 {getCurrentTotal()} 个结果</p>
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
                    以图搜{activeTab === 'product' ? '商品' : '档口'}
                  </p>
                  <p className="text-xs text-gray-500">
                    共找到 {getCurrentTotal()} 个相似结果
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab切换 */}
        {!isImageSearch && (
          <div className="bg-white border-b border-gray-100 px-4 py-2">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'product'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                商品 ({productTotal})
              </button>
              <button
                onClick={() => setActiveTab('booth')}
                className={`flex-1 py-2 text-center text-sm font-medium rounded-lg transition-colors ${
                  activeTab === 'booth'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                档口 ({boothTotal})
              </button>
            </div>
          </div>
        )}

        {/* 筛选栏 */}
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-sm text-gray-600">
                <Filter className="w-4 h-4 mr-1" />
                筛选
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-4">搜索中...</p>
            </div>
          ) : getCurrentResults().length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">没有找到相关结果</h3>
              <p className="text-gray-600">请尝试其他关键词或调整筛选条件</p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 gap-4' 
                : 'space-y-4'
            }>
              {activeTab === 'product' ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={() => handleProductClick(product)}
                    viewMode={viewMode}
                    showSimilarity={isImageSearch}
                  />
                ))
              ) : (
                booths.map((booth) => (
                  <BoothCard
                    key={booth.id}
                    booth={booth}
                    onClick={() => handleBoothClick(booth)}
                    viewMode={viewMode}
                    showSimilarity={isImageSearch}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}

// 商品卡片组件
interface ProductCardProps {
  product: Product;
  onClick: () => void;
  viewMode: 'grid' | 'list';
  showSimilarity?: boolean;
}

function ProductCard({ product, onClick, viewMode, showSimilarity }: ProductCardProps) {
  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex space-x-3">
          <ImageLazyLoader
            src={product.imageUrl}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{product.shop}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-orange-600">¥{product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">¥{product.originalPrice}</span>
                )}
              </div>
              {showSimilarity && product.similarity && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {Math.round(product.similarity * 100)}% 相似
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative">
        <ImageLazyLoader
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {showSimilarity && product.similarity && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {Math.round(product.similarity * 100)}%
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">{product.name}</h3>
        <p className="text-xs text-gray-500 mb-2">{product.shop}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-bold">¥{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">¥{product.originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// 档口卡片组件
interface BoothCardProps {
  booth: Booth;
  onClick: () => void;
  viewMode: 'grid' | 'list';
  showSimilarity?: boolean;
}

function BoothCard({ booth, onClick, viewMode, showSimilarity }: BoothCardProps) {
  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex space-x-3">
          <ImageLazyLoader
            src={booth.imageUrl}
            alt={booth.boothName}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">{booth.boothName}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              {booth.market}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{booth.productsCount} 个商品</span>
              {showSimilarity && booth.similarity && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {Math.round(booth.similarity * 100)}% 相似
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClick} className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
      <div className="relative">
        <ImageLazyLoader
          src={booth.imageUrl}
          alt={booth.boothName}
          width={200}
          height={120}
          className="w-full h-24 object-cover rounded-t-lg"
        />
        {showSimilarity && booth.similarity && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            {Math.round(booth.similarity * 100)}%
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm">{booth.boothName}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {booth.market}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{booth.productsCount} 商品</span>
          {booth.followers && (
            <div className="flex items-center">
              <Star className="w-3 h-3 mr-1" />
              {booth.followers}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
