"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Camera } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "搜索商品关键字或货号"
}: SearchBarProps) {
  const router = useRouter();

  const handleSearchClick = () => {
    // 跳转到搜索页面
    router.push('/search');
  };

  const handleImageSearch = () => {
    // 跳转到拍照搜索页面
    router.push('/search/image');
  };

  return (
    <div className="sticky top-0 z-50 px-3 py-2 bg-red-500">
      <div className="flex items-center space-x-2">
        <Image src="/logo.png" alt="logo" width={32} height={32} className="rounded-full bg-white" />
        {/* 主搜索框 - 点击跳转 */}
        <div
          onClick={handleSearchClick}
          className="flex-1 flex items-center bg-white rounded-full px-3 py-2 cursor-pointer active:bg-gray-50 transition-colors"
        >
          <Search size={16} className="text-gray-400 mr-2" />
          <span className="flex-1 text-sm text-gray-500">
            {placeholder}
          </span>
        </div>

        {/* 拍照搜索按钮 */}
        <button
          onClick={handleImageSearch}
          className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center active:bg-red-700 transition-all shadow-sm"
        >
          <Camera size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
}