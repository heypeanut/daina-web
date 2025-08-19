import React, { useState } from "react";
import { Search, Filter, Camera, X, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  searchProductsByImageBase64,
  type ImageSearchOptions,
} from "@/lib/api/upload-search";
import { toast } from "sonner";

export interface UnifiedSearchBarProps {
  // 基础配置
  variant?: "home" | "market" | "search" | "booth" | "booth-detail";
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
  boothId?: string; // 档口ID，用于图片搜索时限制范围

  // 搜索状态
  isFocused?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;

  // 清除功能
  showClearButton?: boolean;
  onClear?: () => void;
}

export function UnifiedSearchBar({
  variant = "home",
  className = "",

  // Logo配置
  showLogo = true,

  // 搜索功能
  placeholder = "搜索商品关键字或货号",
  value = "",
  onChange,
  onSearch,
  onSearchClick,

  // 右侧按钮
  showFilter = false,
  showCamera = false,
  onFilterClick,
  onCameraClick,

  // 档口页专用
  showBack = false,
  onBackClick,
  boothId,

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
  const isFocused =
    externalFocused !== undefined ? externalFocused : internalFocused;

  // 搜索框样式 - 提前定义，避免在booth-detail variant中使用时出现初始化错误
  const searchBoxClass = `flex items-center bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 transition-all duration-300 shadow-sm ${
    isFocused ? "bg-white ring-1 ring-white/50 shadow-lg" : "hover:bg-white"
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
    } else if (variant === "home") {
      // 首页默认跳转到搜索页面
      navigate("/search");
    } else if (variant === "market") {
      // 市场页面跳转到档口搜索
      navigate("/search?type=booth");
    }
  };

  const handleCameraClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (onCameraClick) {
      onCameraClick();
    } else {
      // 直接触发图片选择
      // 创建文件输入元素
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      // 不使用capture属性，这样用户可以选择从相机拍照或从图库选择图片
      // 移动端浏览器会自动提供这两个选项

      input.style.display = "none";

      input.onchange = async (e) => {
        e.preventDefault(); // 阻止默认行为

        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          try {
            // 检查文件大小和类型
            if (file.size > 10 * 1024 * 1024) {
              toast.error("图片文件不能超过10MB");
              document.body.removeChild(input);
              return;
            }

            if (!file.type.startsWith("image/")) {
              toast.error("请选择图片文件");
              document.body.removeChild(input);
              return;
            }

            // 显示加载提示
            toast.loading("正在搜索中...", { id: "image-search" });

            // 转换为base64并调用搜索API
            const reader = new FileReader();
            reader.onload = async (e) => {
              if (e) e.preventDefault(); // 阻止可能的默认行为

              try {
                const base64Image = reader.result as string;
                console.log(
                  "[UnifiedSearchBar] 图片加载成功，长度:",
                  base64Image.length
                );

                const searchOptions: ImageSearchOptions = {
                  limit: 20,
                  minSimilarity: 0.75,
                };

                // 如果是档口详情页，限制搜索范围
                if (variant === "booth-detail" && boothId) {
                  searchOptions.boothId = boothId;
                }

                const result = await searchProductsByImageBase64(
                  base64Image,
                  searchOptions
                );

                toast.dismiss("image-search");

                // tenantApi已经处理了响应，直接返回的就是data部分：{rows: [...], total: n}
                if (result && result.rows && result.rows.length > 0) {
                  // 将搜索结果保存到sessionStorage，传递给结果页面
                  sessionStorage.setItem(
                    "imageSearchResults",
                    JSON.stringify(result)
                  );
                  sessionStorage.setItem("searchImage", base64Image);

                  // 如果有boothId，也保存到sessionStorage
                  if (variant === "booth-detail" && boothId) {
                    sessionStorage.setItem("searchBoothId", boothId);
                  } else {
                    sessionStorage.removeItem("searchBoothId");
                  }

                  // 使用window.location直接跳转，避免react-router导航可能被拦截
                  window.location.href = "/search/results?type=image-product";
                } else {
                  toast.error("未找到相似的结果，请尝试其他图片");
                }
              } catch (error) {
                toast.dismiss("image-search");
                console.error("[UnifiedSearchBar] 图片搜索失败:", error);
                toast.error("搜索失败，请重试");
              }
            };

            reader.onerror = (error) => {
              toast.dismiss("image-search");
              console.error("[UnifiedSearchBar] 图片读取失败:", error);
              toast.error("图片处理失败，请重试");
            };

            reader.readAsDataURL(file);
          } catch (error) {
            toast.dismiss("image-search");
            console.error("[UnifiedSearchBar] 图片处理失败:", error);
            toast.error("图片处理失败，请重试");
          }
        }
        // 清理元素
        document.body.removeChild(input);
      };

      document.body.appendChild(input);
      // 使用setTimeout避免可能的浏览器安全策略问题
      setTimeout(() => input.click(), 100);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange("");
    }
    if (onClear) {
      onClear();
    }
  };

  // 首页样式
  if (variant === "home") {
    return (
      <div
        className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
      >
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
            className={searchBoxClass + " flex-1 cursor-pointer"}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">{placeholder}</span>
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

  // market variant也使用相同的样式
  if (variant === "market") {
    return (
      <div
        className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
      >
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
            className={searchBoxClass + " flex-1 cursor-pointer"}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">{placeholder}</span>
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
  if (variant === "booth-detail") {
    return (
      <div
        className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
      >
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
            className={searchBoxClass + " flex-1 cursor-pointer"}
            onClick={onSearchClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">{placeholder}</span>
          </div>

          {/* 分享按钮 */}
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

  // booth variant - 档口页面搜索栏
  if (variant === "booth") {
    return (
      <div
        className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
      >
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
            className={searchBoxClass + " flex-1 cursor-pointer"}
            onClick={handleSearchAreaClick}
          >
            <Search size={18} className="text-gray-400 mr-2" />
            <span className="text-gray-500 flex-1 text-sm">{placeholder}</span>
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
  if (variant === "search") {
    return (
      <div
        className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center space-x-3"
        >
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
    <div
      className={`bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3 ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="text-white">搜索栏 ({variant})</div>
      </div>
    </div>
  );
}
