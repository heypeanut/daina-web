"use client";

import React from 'react';
import type { ImageSearchResponse } from '@/types/api';

interface SearchStatsProps {
  isImageSearch: boolean;
  searchImage?: string | null;
  imageSearchResults?: ImageSearchResponse | null;
  searchKeyword: string;
  activeTab: 'product' | 'booth';
  productTotal: number;
  boothTotal: number;
}

export function SearchStats({
  isImageSearch,
  searchImage,
  imageSearchResults,
  searchKeyword,
  activeTab,
  productTotal,
  boothTotal,
}: SearchStatsProps) {
  return (
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
          {searchKeyword ? (
            <>
              找到 <span className="text-red-500 font-medium">
                {activeTab === 'product' ? productTotal : boothTotal}
              </span> 个结果
            </>
          ) : (
            '请输入搜索关键词'
          )}
        </p>
      )}
    </div>
  );
}