"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchHeaderProps {
  keyword: string;
}

export function SearchHeader({ keyword }: SearchHeaderProps) {
  const router = useRouter();

  return (
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
  );
}