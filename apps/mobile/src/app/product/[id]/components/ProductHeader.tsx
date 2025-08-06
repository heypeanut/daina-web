"use client";

import React from 'react';
import { ArrowLeft, Share2, ShoppingCart } from 'lucide-react';

interface ProductHeaderProps {
  title?: string;
  onBackClick: () => void;
  onShareClick?: () => void;
  showCart?: boolean;
  onCartClick?: () => void;
  className?: string;
}

export function ProductHeader({
  title = '商品详情',
  onBackClick,
  onShareClick,
  showCart = false,
  onCartClick,
  className = ''
}: ProductHeaderProps) {
  return (
    <div className={`bg-white px-4 py-3 flex items-center border-b border-gray-100 ${className}`}>
      {/* 返回按钮 */}
      <button
        onClick={onBackClick}
        className="w-8 h-8 flex items-center justify-center text-gray-600 mr-3 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft size={20} />
      </button>

      {/* 标题 */}
      <h1 className="flex-1 text-lg font-medium text-gray-900 text-center">
        {title}
      </h1>

      {/* 右侧按钮组 */}
      <div className="flex items-center gap-2 ml-3">
        {/* 分享按钮 */}
        {onShareClick && (
          <button
            onClick={onShareClick}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Share2 size={18} />
          </button>
        )}

        {/* 购物车按钮 */}
        {showCart && onCartClick && (
          <button
            onClick={onCartClick}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart size={18} />
          </button>
        )}
      </div>
    </div>
  );
}