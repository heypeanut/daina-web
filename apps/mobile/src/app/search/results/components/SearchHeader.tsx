"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchHeaderProps {
  keyword: string;
  isImageSearch?: boolean;
  searchType?: 'booth' | 'product';
}

export function SearchHeader({ keyword, isImageSearch, searchType }: SearchHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 sticky top-0 z-50 safe-area-inset-top">
      <div className="flex items-center space-x-3">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        
        {isImageSearch ? (
          <h1 className="flex-1 text-white font-medium text-lg text-center">
            {searchType === 'product' ? '以图搜商品' : '以图搜档口'}
          </h1>
        ) : (
          <div 
            onClick={() => router.push('/search')}
            className="flex-1 flex items-center bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 cursor-pointer transition-all duration-300 shadow-sm hover:bg-white active:bg-white/90"
          >
            <Search size={16} className="text-gray-400 mr-3" />
            <span className="flex-1 text-sm text-gray-700 truncate">
              {keyword || '搜索商品关键字或货号'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}