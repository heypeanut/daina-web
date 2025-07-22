"use client";

import React, { useRef, useEffect } from 'react';
import { BoothCategory } from '../../../../../src/types/booth';

interface MarketCategoryTabsProps {
  categories: BoothCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  loading?: boolean;
  className?: string;
}

export function MarketCategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  loading = false,
  className = ''
}: MarketCategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 默认分类数据（如果没有加载到分类）
  const defaultCategories: BoothCategory[] = [
    { id: 'all', name: '全部' },
    { id: 'hot', name: '热门' },
    { id: 'recommend', name: '推荐' },
    { id: 'new', name: '最新' }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;

  // 滚动到激活的分类
  useEffect(() => {
    if (scrollRef.current && activeCategory) {
      const activeElement = scrollRef.current.querySelector(`[data-category="${activeCategory}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
      }
    }
  }, [activeCategory]);

  if (loading) {
    return (
      <div className={`bg-white ${className}`}>
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-16 h-8 bg-gray-200 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/80 backdrop-blur-sm shadow-sm ${className}`}>
      <div 
        ref={scrollRef}
        className="flex gap-3 px-5 py-4 overflow-x-auto scrollbar-hide"
      >
        {displayCategories.map((category) => {
          const isActive = activeCategory === category.id;
          
          return (
            <button
              key={category.id}
              data-category={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-105 border border-gray-200'
              }`}
            >
              <span>{category.name}</span>
              {category.count !== undefined && (
                <span className="ml-2 text-xs opacity-75 bg-white/20 px-1.5 py-0.5 rounded-full">
                  {category.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}