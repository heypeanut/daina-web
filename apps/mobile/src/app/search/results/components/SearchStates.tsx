"use client";

import React from 'react';
import { Loader2, Search, Image } from 'lucide-react';

// 加载状态组件
export function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="w-6 h-6 animate-spin text-red-500 mr-2" />
      <span className="text-gray-600">搜索中...</span>
    </div>
  );
}

// 错误状态组件
interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">搜索出错了</p>
      <p className="text-sm text-gray-400 mb-4">
        {error?.message || '网络连接异常'}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm active:bg-red-600"
      >
        重试
      </button>
    </div>
  );
}

// 空结果状态组件
interface EmptyStateProps {
  type: 'product' | 'booth';
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <Search size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500 mb-2">
        没有找到相关{type === 'product' ? '商品' : '档口'}
      </p>
      <p className="text-sm text-gray-400">
        尝试更换关键词或浏览其他内容
      </p>
    </div>
  );
}

// 图片搜索空结果状态组件
export function ImageSearchEmptyState() {
  return (
    <div className="text-center py-8">
      <Image size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-gray-500">未找到相似的档口</p>
      <p className="text-sm text-gray-400 mt-2">
        请尝试上传更清晰的图片或调整搜索条件
      </p>
    </div>
  );
}