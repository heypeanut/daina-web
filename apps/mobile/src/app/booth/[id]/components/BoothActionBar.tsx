"use client";

import React from 'react';
import { Heart, Phone, MessageCircle, Share2 } from 'lucide-react';
import { BoothDetail } from '../../../../../../../src/types/booth';

interface BoothActionBarProps {
  booth: BoothDetail;
  isFavorited: boolean;
  onFavoriteToggle: () => void;
  onContactClick: () => void;
  onShareClick: () => void;
  className?: string;
}

export function BoothActionBar({
  booth,
  isFavorited,
  onFavoriteToggle,
  onContactClick,
  onShareClick,
  className = ''
}: BoothActionBarProps) {
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 safe-area-inset-bottom ${className}`}>
      <div className="flex items-center space-x-3">
        {/* 收藏按钮 */}
        <button
          onClick={onFavoriteToggle}
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Heart 
            size={20} 
            className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'} 
          />
        </button>

        {/* 分享按钮 */}
        <button
          onClick={onShareClick}
          className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <Share2 size={20} className="text-gray-600" />
        </button>

        {/* 联系按钮 */}
        <button
          onClick={onContactClick}
          className="flex-1 h-12 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
        >
          {booth.phone ? (
            <>
              <Phone size={20} className="mr-2" />
              <span>立即联系</span>
            </>
          ) : booth.wx ? (
            <>
              <MessageCircle size={20} className="mr-2" />
              <span>微信联系</span>
            </>
          ) : (
            <span>查看联系方式</span>
          )}
        </button>
      </div>
    </div>
  );
}