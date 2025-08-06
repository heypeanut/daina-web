"use client";

import React from 'react';

interface ProductBasicInfoProps {
  name: string;
  price: number;
  maxPrice?: number;
  originalPrice?: number;
  stock: number;
  views: number;
  features?: string;
  boothName?: string;
  className?: string;
}

export function ProductBasicInfo({
  name,
  price,
  maxPrice,
  originalPrice,
  stock,
  views,
  features,
  boothName,
  className = ''
}: ProductBasicInfoProps) {
  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <div className={`bg-white p-4 ${className}`}>
      {/* 价格信息 */}
      <div className="mb-3">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-3xl font-bold text-red-500">
            ¥{formatPrice(price)} 
            {
              maxPrice && (
                <span >
                  -¥{formatPrice(maxPrice)}
                </span>
              )
            }
          </span>
          {!!(originalPrice && originalPrice > price) && (
            <span className="text-sm text-gray-400 line-through mb-1">
              ¥{formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        {/* 库存和浏览量信息 */}
        {/* <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>库存 {stock} 件</span>
          <span>浏览 {views} 次</span>
        </div> */}
      </div>

      {/* 产品标题 */}
      <div className="mb-4">
        <h1 className="text-base font-medium text-gray-900 leading-relaxed">
          {name}
        </h1>
        
        {/* 产品特性 */}
        {features && (
          <div className="text-sm text-gray-600 mt-1">
            {features}
          </div>
        )}
        
        {/* 档口名称 */}
        {boothName && (
          <div className="flex gap-4 text-sm text-gray-400">
            <span className="text-sm">
              来自：{boothName}
            </span>
            <span className="text-sm ">
              浏览 {views} 次
            </span>
          </div>
        )}
      </div>
    </div>
  );
}