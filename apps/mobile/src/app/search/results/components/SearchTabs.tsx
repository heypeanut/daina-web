"use client";

import React from 'react';
import { ImageIcon } from 'lucide-react';

interface SearchTabsProps {
  activeTab: 'product' | 'booth';
  onTabChange: (tab: 'product' | 'booth') => void;
  productCount?: number;
  boothCount?: number;
  isImageSearch?: boolean;
  searchKeyword?: string;
  isBoothInternalSearch?: boolean; // 是否为档口内搜索
  // 新增：图片搜索结果计数
  imageProductCount?: number;
  imageBoothCount?: number;
}

export function SearchTabs({
  activeTab,
  onTabChange,
  productCount,
  boothCount,
  isImageSearch,
  searchKeyword,
  isBoothInternalSearch = false,
  imageProductCount,
  imageBoothCount,
}: SearchTabsProps) {
  // 档口内搜索、图片搜索或非图片搜索且无关键词时隐藏标签页
  if (isBoothInternalSearch || isImageSearch || (!isImageSearch && !searchKeyword)) {
    return null;
  }


  // 普通关键词搜索的标签页（保持原有逻辑）
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
          商品 ({productCount || 0})
        </button>
        <button
          onClick={() => onTabChange('booth')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'booth'
              ? 'text-orange-500 border-b-2 border-orange-500'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          档口 ({boothCount || 0})
        </button>
      </div>
    </div>
  );
}