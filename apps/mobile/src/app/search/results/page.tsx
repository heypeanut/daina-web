"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ProductRecommend } from '@/components/home/ProductRecommend';
import { BoothRecommend } from '@/components/home/BoothRecommend';
import { Search, ArrowLeft, Filter, SlidersHorizontal, Image } from 'lucide-react';
import type { ImageSearchResponse } from '@/types/api';

export default function SearchResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'product' | 'booth'>('product');
  const [sortBy, setSortBy] = useState<'relevance' | 'price' | 'sales'>('relevance');
  const [imageSearchResults, setImageSearchResults] = useState<ImageSearchResponse | null>(null);
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [isImageSearch, setIsImageSearch] = useState(false);
  
  // 模拟搜索结果数据
  const [searchResults] = useState({
    products: [
      {
        id: '1',
        name: 'iPhone15 Pro 钛合金',
        description: '256GB 原色钛金属',
        price: 8999,
        imageUrl: 'https://picsum.photos/200/200?random=10',
        boothName: '星辉通讯',
        score: 4.8,
        sales: 156,
        isHot: true,
      },
      {
        id: '2',
        name: 'iPhone15 透明手机壳',
        description: '防摔保护套',
        price: 39,
        imageUrl: 'https://picsum.photos/200/200?random=11',
        boothName: '舒克',
        score: 4.6,
        sales: 2341,
      },
      {
        id: '3',
        name: 'iPhone15 钢化膜',
        description: '全屏覆盖防蓝光',
        price: 25,
        imageUrl: 'https://picsum.photos/200/200?random=12',
        boothName: '永承',
        score: 4.7,
        sales: 892,
      },
      {
        id: '4',
        name: 'iPhone15 无线充电器',
        description: '15W快充磁吸',
        price: 128,
        imageUrl: 'https://picsum.photos/200/200?random=13',
        boothName: '星辉通讯',
        score: 4.5,
        sales: 445,
      },
    ],
    booths: [
      {
        id: '1',
        boothName: '星辉通讯',
        description: '专营苹果产品及配件',
        imageUrl: 'https://picsum.photos/60/60?random=14',
        score: 96.5,
        market: '康乐',
        address: '5A60-61',
        isHot: true,
      },
      {
        id: '2',
        boothName: '舒克',
        description: '手机保护套壳专家',
        imageUrl: 'https://picsum.photos/60/60?random=15',
        score: 95.2,
        market: '工业',
        address: 'A2005',
        isHot: true,
      },
    ]
  });

  useEffect(() => {
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    
    if (q) {
      setKeyword(q);
    }
    
    if (type === 'image-booth') {
      // 图片搜索结果
      setKeyword('以图搜档口');
      setActiveTab('booth');
      setIsImageSearch(true);
      
      // 从sessionStorage获取搜索结果
      const results = sessionStorage.getItem('imageSearchResults');
      const image = sessionStorage.getItem('searchImage');
      
      if (results) {
        try {
          const parsedResults = JSON.parse(results);
          setImageSearchResults(parsedResults);
        } catch (error) {
          console.error('解析搜索结果失败:', error);
        }
      }
      
      if (image) {
        setSearchImage(image);
      }
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/search/results?q=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const handleProductClick = (product: any, index: number) => {
    console.log('商品点击:', product, 'position:', index);
    // 跳转到商品详情页
    router.push(`/product/${product.id}`);
  };

  const handleBoothClick = (booth: any, index: number) => {
    console.log('档口点击:', booth, 'position:', index);
    // 跳转到档口详情页
    router.push(`/booth/${booth.id}`);
  };

  const sortOptions = [
    { value: 'relevance', label: '综合排序' },
    { value: 'price', label: '价格' },
    { value: 'sales', label: '销量' },
  ];

  // 图片搜索结果卡片组件
  const ImageSearchResultCard = ({ result, index }: { result: any; index: number }) => (
    <div 
      className="bg-white rounded-lg p-4 mb-4 cursor-pointer active:bg-gray-50"
      onClick={() => {
        if (result.booth) {
          router.push(`/booth/${result.booth.id}`);
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={result.matchedImage.url}
            alt="匹配图片"
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {result.booth?.boothName || '未知档口'}
            </h3>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              {Math.round(result.similarity * 100)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {result.booth?.address || '地址未知'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {result.booth?.phone && (
                <span className="text-xs text-gray-500">
                  {result.booth.phone}
                </span>
              )}
              {result.booth?.productCount && (
                <span className="text-xs text-gray-500">
                  {result.booth.productCount}种商品
                </span>
              )}
            </div>
            {result.booth?.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">评分</span>
                <span className="text-xs font-medium text-orange-500">
                  {result.booth.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索栏 */}
        <div className="bg-red-500 px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center text-white"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div 
              onClick={() => router.push('/search')}
              className="flex-1 flex items-center bg-white rounded-full px-4 py-3 cursor-pointer"
            >
              <Search size={18} className="text-gray-400 mr-3" />
              <span className="flex-1 text-sm text-gray-700 truncate">
                {keyword || '搜索商品关键字或货号'}
              </span>
            </div>
          </div>
        </div>

        {/* 搜索结果统计 */}
        <div className="bg-white px-4 py-3 border-b border-gray-100">
          {isImageSearch && searchImage && (
            <div className="flex items-center space-x-3 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={searchImage}
                  alt="搜索图片"
                  className="w-12 h-12 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  基于此图片搜索到 <span className="text-red-500 font-medium">
                    {imageSearchResults?.results?.length || 0}
                  </span> 个相似档口
                </p>
                {imageSearchResults?.searchTime && (
                  <p className="text-xs text-gray-500">
                    搜索用时: {imageSearchResults.searchTime}ms
                  </p>
                )}
              </div>
            </div>
          )}
          {!isImageSearch && (
            <p className="text-sm text-gray-600">
              找到 <span className="text-red-500 font-medium">
                {activeTab === 'product' ? searchResults.products.length : searchResults.booths.length}
              </span> 个结果
            </p>
          )}
        </div>

        {/* Tab切换 - 图片搜索时不显示 */}
        {!isImageSearch && (
          <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
            <div className="flex">
              <button
                onClick={() => setActiveTab('product')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'product'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600'
                }`}
              >
                商品 ({searchResults.products.length})
              </button>
              <button
                onClick={() => setActiveTab('booth')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'booth'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600'
                }`}
              >
                档口 ({searchResults.booths.length})
              </button>
            </div>
          </div>
        )}

        {/* 筛选栏 */}
        {activeTab === 'product' && (
          <div className="bg-white px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700">排序:</span>
              </div>
              <div className="flex space-x-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      sortBy === option.value
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        <div className="pb-4">
          {isImageSearch && imageSearchResults ? (
            <div className="px-4 mt-4">
              {imageSearchResults.results.map((result, index) => (
                <ImageSearchResultCard
                  key={`${result.booth?.id || index}-${index}`}
                  result={result}
                  index={index}
                />
              ))}
              {imageSearchResults.results.length === 0 && (
                <div className="text-center py-8">
                  <Image size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">未找到相似的档口</p>
                  <p className="text-sm text-gray-400 mt-2">
                    请尝试上传更清晰的图片或调整搜索条件
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'product' ? (
            <ProductRecommend
              title=""
              products={searchResults.products}
              layout="grid"
              showMore={false}
              onProductClick={handleProductClick}
            />
          ) : (
            <BoothRecommend
              title=""
              booths={searchResults.booths}
              type="hot"
              showMore={false}
              onBoothClick={handleBoothClick}
            />
          )}
        </div>

        {/* 加载更多 */}
        <div className="px-4 py-8 text-center">
          <button className="px-6 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-600 active:bg-gray-50">
            加载更多
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}