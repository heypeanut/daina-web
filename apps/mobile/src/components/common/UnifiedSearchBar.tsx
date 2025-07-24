"use client";

import React, { useState } from 'react';
import { Search, Filter, Camera, X, ArrowLeft, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface UnifiedSearchBarProps {
  // 基础配置
  variant?: 'home' | 'market' | 'search' | 'booth' | 'booth-detail';
  className?: string;
  
  // Logo配置
  showLogo?: boolean;
  logoSrc?: string;
  logoSize?: number;
  
  // 搜索功能
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (keyword: string) => void;
  onSearchClick?: () => void; // 点击跳转（首页模式）
  
  // 右侧按钮
  showFilter?: boolean;
  showCamera?: boolean;
  showShare?: boolean;
  onFilterClick?: () => void;
  onCameraClick?: () => void;
  onShareClick?: () => void;
  
  // 档口页专用
  showBack?: boolean;
  onBackClick?: () => void;
  title?: string;
  
  // 搜索状态
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  
  // 清除功能
  showClearButton?: boolean;
  onClear?: () => void;
}

export function UnifiedSearchBar({
  variant = 'home',
  className = '',
  
  // Logo配置
  showLogo = true,
  logoSrc = '/logo.png',
  logoSize = 28,
  
  // 搜索功能
  placeholder = '搜索商品关键字或货号',
  value = '',
  onChange,
  onSearch,
  onSearchClick,
  
  // 右侧按钮
  showFilter = false,
  showCamera = false,
  showShare = false,
  onFilterClick,
  onCameraClick,
  onShareClick,
  
  // 档口页专用
  showBack = false,
  onBackClick,
  title,
  
  // 搜索状态
  isFocused: externalFocused,
  onFocus: externalOnFocus,
  onBlur: externalOnBlur,
  
  // 清除功能
  showClearButton = true,
  onClear,
}: UnifiedSearchBarProps) {
  const router = useRouter();
  const [internalFocused, setInternalFocused] = useState(false);
  
  // 使用外部或内部的焦点状态
  const isFocused = externalFocused !== undefined ? externalFocused : internalFocused;
  
  // 搜索框样式 - 提前定义，避免在booth-detail variant中使用时出现初始化错误
  const searchBoxClass = `flex items-center bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 transition-all duration-300 shadow-sm ${
    isFocused ? 'bg-white ring-1 ring-white/50 shadow-lg' : 'hover:bg-white'
  }`;
  
  const handleFocus = () => {
    setInternalFocused(true);
    externalOnFocus?.();
  };
  
  const handleBlur = () => {
    setInternalFocused(false);
    externalOnBlur?.();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value) {
      onSearch(value.trim());
    }
  };
  
  const handleSearchAreaClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else if (variant === 'home') {
      // 首页默认跳转到搜索页面
      router.push('/search');
    } else if (variant === 'market') {
      // 市场页面跳转到档口搜索
      router.push('/search?type=booth');
    }
  };
  
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange('');
    }
  };
  
  const handleDefaultCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      router.push('/search/image');
    }
  };
  
  // 根据变体决定是否可编辑 - 只有search variant才是真正可交互的
  const isInteractive = variant === 'search';
  
  // 档口详情页面特殊处理
  if (variant === 'booth-detail') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 safe-area-inset-top ${className}`}>
        <div className="flex items-center space-x-3 px-4 py-3">
          {/* 返回按钮 */}
          {showBack && (
            <button
              onClick={onBackClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          
          {/* 搜索框 */}
          <div
            onClick={handleSearchAreaClick}
            className={`flex-1 ${searchBoxClass} cursor-pointer active:bg-white/90`}
          >
            <Search size={16} className="text-gray-400 mr-3" />
            <span className="flex-1 text-sm text-gray-500">
              {placeholder}
            </span>
          </div>
          
          {/* 分享按钮 */}
          {showShare && (
            <button
              onClick={onShareClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Share2 size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // 档口页面特殊处理（保留原有booth variant用于兼容）
  if (variant === 'booth') {
    return (
      <div className={`bg-white border-b border-gray-100 ${className}`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* 返回按钮 */}
          {showBack && (
            <button
              onClick={onBackClick}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          
          {/* 标题 */}
          <h1 className="text-lg font-medium text-gray-900 truncate px-4 flex-1 text-center">
            {title || '档口详情'}
          </h1>
          
          {/* 分享按钮 */}
          {showShare && (
            <button
              onClick={onShareClick}
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={20} />
            </button>
          )}
        </div>
      </div>
    );
  }
  
  // 统一的容器样式
  const containerClass = `bg-gradient-to-r from-orange-500 to-red-500 safe-area-inset-top ${className}`;
  
  return (
    <div className={containerClass}>
      <div className="flex items-center space-x-3 px-4 py-3">
        {/* Logo或返回按钮 */}
        {showBack ? (
          <button
            onClick={onBackClick}
            className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
        ) : showLogo && (
          <Image 
            src={logoSrc} 
            alt="logo" 
            width={logoSize} 
            height={logoSize} 
            className="rounded-full bg-white flex-shrink-0" 
          />
        )}
        
        {/* 搜索框 */}
        {isInteractive ? (
          // 可交互的搜索框（搜索页）
          <form onSubmit={handleSubmit} className="flex-1">
            <div className={searchBoxClass}>
              <Search 
                size={16} 
                className={`mr-3 transition-colors duration-200 ${
                  isFocused ? 'text-orange-500' : 'text-gray-400'
                }`} 
              />
              <input
                type="text"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500 text-sm"
              />
              {showClearButton && value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="ml-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        ) : (
          // 点击跳转的搜索框（首页、市场页）
          <div
            onClick={handleSearchAreaClick}
            className={`flex-1 ${searchBoxClass} cursor-pointer active:bg-white/90`}
          >
            <Search size={16} className="text-gray-400 mr-3" />
            <span className="flex-1 text-sm text-gray-500">
              {placeholder}
            </span>
          </div>
        )}
        
        {/* 右侧按钮 */}
        <div className="flex items-center space-x-2">
          {/* 筛选按钮 */}
          {showFilter && onFilterClick && (
            <button
              onClick={onFilterClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Filter size={16} className="text-white" />
            </button>
          )}
          
          {/* 拍照搜索按钮 */}
          {showCamera && (
            <button
              onClick={handleDefaultCameraClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Camera size={16} className="text-white" />
            </button>
          )}
          
          {/* 分享按钮 */}
          {showShare && (
            <button
              onClick={onShareClick}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <Share2 size={16} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}