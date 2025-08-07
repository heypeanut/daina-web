"use client";

import React from 'react';

interface SearchTabsProps {
  activeTab: 'product' | 'booth';
  onTabChange: (tab: 'product' | 'booth') => void;
  productCount: number;
  boothCount: number;
  isImageSearch: boolean;
  searchKeyword: string;
  isBoothInternalSearch?: boolean; // 新增：是否为档口内搜索
}

export function SearchTabs({
  activeTab,
  onTabChange,
  productCount,
  boothCount,
  isImageSearch,
  searchKeyword,
  isBoothInternalSearch = false,
}: SearchTabsProps) {
  // 图片搜索、没有关键词或档口内搜索时不显示Tab
  if (isImageSearch || !searchKeyword || isBoothInternalSearch) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="flex">
        <button
          onClick={() => onTabChange('product')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'product'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          商品 ({productCount})
        </button>
        <button
          onClick={() => onTabChange('booth')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'booth'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          档口 ({boothCount})
        </button>
      </div>
    </div>
  );
}