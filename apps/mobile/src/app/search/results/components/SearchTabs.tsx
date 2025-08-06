"use client";

import React from 'react';

interface SearchTabsProps {
  activeTab: 'product' | 'booth';
  onTabChange: (tab: 'product' | 'booth') => void;
  productCount: number;
  boothCount: number;
  isImageSearch: boolean;
  searchKeyword: string;
}

export function SearchTabs({
  activeTab,
  onTabChange,
  productCount,
  boothCount,
  isImageSearch,
  searchKeyword,
}: SearchTabsProps) {
  // 图片搜索或没有关键词时不显示Tab
  if (isImageSearch || !searchKeyword) {
    return null;
  }

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="flex">
        <button
          onClick={() => onTabChange('product')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'product'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-600'
          }`}
        >
          商品 ({productCount})
        </button>
        <button
          onClick={() => onTabChange('booth')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'booth'
              ? 'text-red-500 border-b-2 border-red-500'
              : 'text-gray-600'
          }`}
        >
          档口 ({boothCount})
        </button>
      </div>
    </div>
  );
}