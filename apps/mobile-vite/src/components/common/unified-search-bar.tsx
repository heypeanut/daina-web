import React, { useState } from 'react';
import { Search, Filter, Camera, X, ArrowLeft, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
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
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && value.trim()) {
      onSearch(value.trim());
    }
  };
  
  const handleSearchAreaClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else if (variant === 'home') {
      // 首页默认跳转到搜索页面
      navigate('/search');
    } else if (variant === 'market') {
      // 市场页面跳转到档口搜索
      navigate('/search?type=booth');
    }
  };
  
  const handleCameraClick = () => {
    if (onCameraClick) {
      onCameraClick();
    } else {
      navigate('/search/image');
    }
  };
  
  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
    if (onClear) {
      onClear();
    }
  };

  // 首页样式
  if (variant === 'home') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
        <div className="flex items-center space-x-3">
          {/* Logo */}
          {showLogo && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">代拿</span>
              </div>
            </div>
          )}
          
          {/* 搜索框 */}
          <div 
            className={searchBoxClass + ' flex-1 cursor-pointer'}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">
              {placeholder}
            </span>
          </div>
          
          {/* 相机按钮 */}
          {showCamera && (
            <button
              onClick={handleCameraClick}
              className="flex-shrink-0 bg-white/20 rounded-full p-2.5 transition-colors hover:bg-white/30"
            >
              <Camera size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // market variant和home variant使用相同的样式
  if (variant === 'market' || variant === 'home') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
        <div className="flex items-center space-x-3">
          {/* Logo */}
          {showLogo && (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-sm">代拿</span>
              </div>
            </div>
          )}
          
          {/* 搜索框 */}
          <div 
            className={searchBoxClass + ' flex-1 cursor-pointer'}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">
              {placeholder}
            </span>
          </div>
          
          {/* 相机按钮 */}
          {showCamera && (
            <button
              onClick={handleCameraClick}
              className="flex-shrink-0 bg-white/20 rounded-full p-2.5 transition-colors hover:bg-white/30"
            >
              <Camera size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // booth-detail variant - 带返回按钮和搜索功能
  if (variant === 'booth-detail') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
        <div className="flex items-center space-x-3">
          {/* 返回按钮 */}
          {showBack && (
            <button
              onClick={onBackClick}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          
          {/* 搜索框 */}
          <div 
            className={searchBoxClass + ' flex-1 cursor-pointer'}
            onClick={onSearchClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">
              {placeholder}
            </span>
          </div>
          
          {/* 分享按钮 */}
          {/* {showShare && (
            <button
              onClick={onShareClick}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Share2 size={20} className="text-white" />
            </button>
          )} */}
        </div>
      </div>
    );
  }

  // booth variant - 档口页面搜索栏
  if (variant === 'booth') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
        <div className="flex items-center space-x-3">
          {/* 返回按钮 */}
          {showBack && (
            <button
              onClick={onBackClick}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          
          {/* 搜索框 */}
          <div 
            className={searchBoxClass + ' flex-1 cursor-pointer'}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">
              {placeholder}
            </span>
          </div>
          
          {/* 筛选按钮 */}
          {showFilter && (
            <button
              onClick={onFilterClick}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Filter size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // search variant - 搜索页面的交互式搜索栏
  if (variant === 'search') {
    return (
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-3">
          {/* 返回按钮 */}
          {showBack && (
            <button
              type="button"
              onClick={onBackClick}
              className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
          
          {/* 搜索输入框 */}
          <div className={`${searchBoxClass} flex-1`}>
            <Search size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-gray-900 text-sm placeholder-gray-500 border-0 outline-none"
              autoFocus
            />
            {/* 清除按钮 */}
            {showClearButton && value && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors"
              >
                <X size={12} className="text-white" />
              </button>
            )}
          </div>
          
          {/* 搜索按钮 */}
          <button
            type="submit"
            className="flex-shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-white text-sm font-medium transition-colors"
          >
            搜索
          </button>
        </form>
      </div>
    );
  }

  // 默认样式 - 兜底方案
  return (
    <div className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="text-white">搜索栏 ({variant})</div>
      </div>
    </div>
  );
}
