"use client";

import React, { useState } from 'react';
import { Filter, Grid } from 'lucide-react';
import { UnifiedSearchBar } from '@/components/common/UnifiedSearchBar';

interface BoothProductShowcaseProps {
  products: [];
  onProductClick: (product: any) => void;
  loading?: boolean;
  className?: string;
}

type SortOption = '默认' | '上新' | '价格' | '筛选';

export function BoothProductShowcase({
  products,
  onProductClick,
  loading,
  className = ''
}: BoothProductShowcaseProps) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeSort, setActiveSort] = useState<SortOption>('默认');

  // 过滤和排序商品
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // 关键词搜索
    if (searchKeyword.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 排序
    switch (activeSort) {
      case '价格':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case '上新':
        // 假设有更新时间字段
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchKeyword, activeSort]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleSortChange = (sort: SortOption) => {
    setActiveSort(sort);
  };

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white ${className}`}>
      {/* 商品内搜索 */}
      <div className="px-4 pt-4 pb-2">
        <UnifiedSearchBar
          variant="search"
          placeholder="搜索档口内商品..."
          value={searchKeyword}
          onChange={setSearchKeyword}
          onSearch={handleSearch}
          showClearButton={true}
          className="!bg-transparent !shadow-none"
        />
      </div>

      {/* 筛选标签栏 */}
      <div className="border-b border-gray-100">
        <div className="flex items-center">
          <div className="flex-1 flex">
            {(['默认', '上新', '价格', '筛选'] as SortOption[]).map((sort) => (
              <button
                key={sort}
                onClick={() => handleSortChange(sort)}
                className={`flex-1 py-3 px-2 text-center text-sm font-medium transition-colors relative ${
                  activeSort === sort
                    ? 'text-orange-600 bg-orange-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="flex items-center justify-center space-x-1">
                  <span>{sort}</span>
                  {sort === '筛选' && <Filter size={12} />}
                </span>
                {activeSort === sort && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-orange-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          <div className="px-3 py-3 border-l border-gray-100">
            <Grid size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* 商品网格 */}
      <div className="p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
              >
                {/* 商品图片 */}
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">暂无图片</span>
                    </div>
                  )}

                  {/* 多色可选标签 */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                      多种颜色可选
                    </div>
                  </div>

                  {/* 满意度标签 */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      满足每一个愿好
                    </div>
                  </div>
                </div>

                {/* 商品信息 */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* 退换货标签 */}
                  <div className="mb-2">
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                      退
                    </span>
                  </div>

                  {/* 价格和信息 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-red-500">
                        ¥{product.price || '8.5'}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        上新
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              {searchKeyword ? '没有找到相关商品' : '暂无商品'}
            </div>
            <div className="text-sm text-gray-500">
              {searchKeyword ? '尝试其他关键词' : '商家还未上传商品信息'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}