"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import type { ImageSearchResponse, ImageSearchResult } from '@/types/api';
import { ImageSearchEmptyState } from './SearchStates';

interface ImageSearchResultsProps {
  imageSearchResults: ImageSearchResponse | null;
}

interface ImageSearchResultCardProps {
  result: ImageSearchResult;
  index: number;
}

function ImageSearchResultCard({ result, index }: ImageSearchResultCardProps) {
  const router = useRouter();
  
  return (
    <div 
      className="bg-white rounded-lg p-4 mb-4 cursor-pointer active:bg-gray-50"
      onClick={() => {
        if (result.booth) {
          router.push(`/booth/${result.booth.id}`);
        }
      }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img
            src={result.matchedImage.url}
            alt="匹配图片"
            className="w-16 h-16 object-cover rounded-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">
              {result.booth?.boothName || '未知档口'}
            </h3>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
              {Math.round(result.similarity * 100)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {result.booth?.address || '地址未知'}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {result.booth?.phone && (
                <span className="text-xs text-gray-500">
                  {result.booth.phone}
                </span>
              )}
              {result.booth?.productCount && (
                <span className="text-xs text-gray-500">
                  {result.booth.productCount}种商品
                </span>
              )}
            </div>
            {result.booth?.rating && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">评分</span>
                <span className="text-xs font-medium text-orange-500">
                  {result.booth.rating}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ImageSearchResults({ imageSearchResults }: ImageSearchResultsProps) {
  if (!imageSearchResults) {
    return null;
  }

  if (imageSearchResults.results.length === 0) {
    return (
      <div className="px-4 mt-4">
        <ImageSearchEmptyState />
      </div>
    );
  }

  return (
    <div className="px-4 mt-4">
      {imageSearchResults.results.map((result, index) => (
        <ImageSearchResultCard
          key={`${result.booth?.id || index}-${index}`}
          result={result}
          index={index}
        />
      ))}
    </div>
  );
}