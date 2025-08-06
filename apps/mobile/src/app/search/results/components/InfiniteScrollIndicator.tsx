"use client";

import React, { memo } from 'react';
import { Loader2, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';

interface InfiniteScrollIndicatorProps {
  /**
   * 是否正在加载下一页
   */
  isLoading: boolean;
  
  /**
   * 是否有更多数据
   */
  hasMore: boolean;
  
  /**
   * 错误信息
   */
  error?: Error | null;
  
  /**
   * 重试回调函数
   */
  onRetry?: () => void;
  
  /**
   * 总数据量
   */
  totalCount?: number;
  
  /**
   * 当前已加载数量
   */
  loadedCount?: number;
  
  /**
   * 数据类型（用于显示文本）
   */
  itemType?: '商品' | '档口' | '结果';
  
  /**
   * 自定义类名
   */
  className?: string;
}

/**
 * 无限滚动指示器组件
 * 
 * 显示加载状态、完成状态、错误状态等，提供良好的用户体验
 * 支持重试功能和进度显示
 * 使用 React.memo 优化性能，减少不必要的重新渲染
 */
export const InfiniteScrollIndicator = memo(function InfiniteScrollIndicator({
  isLoading,
  hasMore,
  error,
  onRetry,
  totalCount,
  loadedCount,
  itemType = '结果',
  className = '',
}: InfiniteScrollIndicatorProps) {
  // 如果没有数据且没有错误，不显示指示器
  if (!isLoading && !hasMore && !error && !loadedCount) {
    return null;
  }

  return (
    <div className={`py-6 px-4 ${className}`}>
      {/* 加载中状态 */}
      {isLoading && (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            <span className="text-sm text-gray-600">正在加载更多{itemType}...</span>
          </div>
          
          {/* 进度指示（如果有总数） */}
          {totalCount && loadedCount && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>已加载 {loadedCount}</span>
                <span>共 {totalCount} 个</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-red-500 h-1 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${Math.min((loadedCount / totalCount) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* 错误状态 */}
      {error && !isLoading && (
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">加载失败</span>
          </div>
          
          <p className="text-xs text-gray-400 text-center max-w-xs">
            {error.message || '网络连接异常，请检查网络后重试'}
          </p>
          
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center space-x-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm active:bg-red-600 transition-colors hover:bg-red-600"
            >
              <RotateCcw className="w-4 h-4" />
              <span>点击重试</span>
            </button>
          )}
        </div>
      )}

      {/* 完成状态（无更多数据） */}
      {!hasMore && !isLoading && !error && loadedCount && loadedCount > 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-2 text-gray-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">加载完成</span>
          </div>
          
          <p className="text-xs text-gray-400">
            {totalCount ? (
              `已加载全部 ${totalCount} 个${itemType}`
            ) : (
              `已加载全部${itemType}`
            )}
          </p>
          
          {/* 分隔线 */}
          <div className="w-12 h-px bg-gray-200 mt-2" />
        </div>
      )}
    </div>
  );
});

/**
 * 简化版无限滚动指示器
 * 适用于只需要基本加载状态的场景
 * 使用 React.memo 优化性能
 */
export const SimpleInfiniteScrollIndicator = memo(function SimpleInfiniteScrollIndicator({
  isLoading,
  hasMore,
  itemType = '内容',
}: {
  isLoading: boolean;
  hasMore: boolean;
  itemType?: string;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin text-red-500 mr-2" />
        <span className="text-sm text-gray-600">加载中...</span>
      </div>
    );
  }

  if (!hasMore) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-gray-400">没有更多{itemType}了</p>
      </div>
    );
  }

  return null;
});

/**
 * 加载错误重试组件
 * 专门用于处理加载错误的场景
 * 使用 React.memo 优化性能
 */
export const LoadingErrorRetry = memo(function LoadingErrorRetry({
  error,
  onRetry,
  itemType = '数据',
}: {
  error: Error;
  onRetry: () => void;
  itemType?: string;
}) {
  return (
    <div className="text-center py-6 px-4">
      <div className="flex items-center justify-center space-x-2 text-red-500 mb-2">
        <AlertCircle className="w-5 h-5" />
        <span className="text-sm font-medium">加载{itemType}失败</span>
      </div>
      
      <p className="text-xs text-gray-400 mb-4 max-w-xs mx-auto">
        {error.message || '网络连接异常'}
      </p>
      
      <button
        onClick={onRetry}
        className="inline-flex items-center space-x-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm active:bg-red-600 transition-colors hover:bg-red-600"
      >
        <RotateCcw className="w-4 h-4" />
        <span>重新加载</span>
      </button>
    </div>
  );
});