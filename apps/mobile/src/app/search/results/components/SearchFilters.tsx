"use client";

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

type SortOption = 'relevance' | 'price' | 'sales';

interface SearchFiltersProps {
  activeTab: 'product' | 'booth';
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  isImageSearch: boolean;
  searchKeyword: string;
}

const sortOptions = [
  { value: 'relevance' as const, label: '综合排序' },
  { value: 'price' as const, label: '价格' },
  { value: 'sales' as const, label: '销量' },
];

export function SearchFilters({
  activeTab,
  sortBy,
  onSortChange,
  isImageSearch,
  searchKeyword,
}: SearchFiltersProps) {
  // 只在商品搜索、非图片搜索、有搜索关键词时显示
  if (activeTab !== 'product' || isImageSearch || !searchKeyword) {
    return null;
  }

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">排序:</span>
        </div>
        <div className="flex space-x-2">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
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
  );
}