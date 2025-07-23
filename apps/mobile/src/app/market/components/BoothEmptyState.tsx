"use client";

import React from 'react';
import { Search, Store, Compass } from 'lucide-react';

interface BoothEmptyStateProps {
  type?: 'search' | 'noData' | 'location';
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

export function BoothEmptyState({
  type = 'noData',
  title,
  description,
  onAction,
  actionLabel,
  className = ''
}: BoothEmptyStateProps) {
  const configs = {
    search: {
      icon: Search,
      defaultTitle: '没有找到相关档口',
      defaultDescription: '试试调整搜索关键词或浏览其他分类',
      iconBgColor: 'bg-blue-50',
      iconColor: 'text-blue-400',
      actionColor: 'bg-blue-500 hover:bg-blue-600'
    },
    noData: {
      icon: Store,
      defaultTitle: '暂无档口信息',
      defaultDescription: '这里还没有档口入驻，请稍后再来看看',
      iconBgColor: 'bg-orange-50',
      iconColor: 'text-orange-400',
      actionColor: 'bg-orange-500 hover:bg-orange-600'
    },
    location: {
      icon: Compass,
      defaultTitle: '该区域暂无档口',
      defaultDescription: '试试切换到其他区域或扩大搜索范围',
      iconBgColor: 'bg-green-50',
      iconColor: 'text-green-400',
      actionColor: 'bg-green-500 hover:bg-green-600'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
      {/* 图标背景圆圈 */}
      <div className={`w-24 h-24 ${config.iconBgColor} rounded-full flex items-center justify-center mb-6 shadow-sm`}>
        <Icon size={40} className={config.iconColor} />
      </div>
      
      {/* 标题 */}
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title || config.defaultTitle}
      </h3>
      
      {/* 描述 */}
      <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-xs">
        {description || config.defaultDescription}
      </p>
      
      {/* 操作按钮 */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className={`px-6 py-3 ${config.actionColor} text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg`}
        >
          {actionLabel}
        </button>
      )}
      
      {/* 装饰性元素 */}
      <div className="mt-8 flex space-x-2 opacity-30">
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}