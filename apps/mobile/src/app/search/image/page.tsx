"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Camera, ArrowLeft, Upload, ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";
import {
  searchProductsByImage,
  searchBoothsByImage,
} from "@/lib/api/upload-search";

export default function ImageSearchPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchType, setSearchType] = useState<"booth" | "product">("booth");
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小和类型
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        toast.error("图片文件不能超过10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("请选择图片文件");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    // 创建一个隐藏的文件input专门用于相机
    const cameraInput = document.createElement("input");
    cameraInput.type = "file";
    cameraInput.accept = "image/*";
    cameraInput.capture = "environment"; // 调用后置摄像头
    cameraInput.style.display = "none";

    cameraInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 使用相同的处理逻辑
        handleFileSelect({
          target: { files: [file] },
        } as React.ChangeEvent<HTMLInputElement>);
      }
      // 清理临时元素
      document.body.removeChild(cameraInput);
    };

    document.body.appendChild(cameraInput);
    cameraInput.click();
  };

  const handleSearch = async () => {
    if (selectedFile) {
      try {
        setIsSearching(true);
        setError(null);
        let result;

        if (searchType === "product") {
          result = await searchProductsByImage(selectedFile, {
            limit: 20,
            minSimilarity: 0.75,
          });
        } else {
          result = await searchBoothsByImage(selectedFile, {
            limit: 20,
            minSimilarity: 0.75,
          });
        }

        // API返回标准格式：{rows: [...], total: n}
        if (result && result.rows && result.rows.length > 0) {
          // 将搜索结果保存到sessionStorage，传递给结果页面
          sessionStorage.setItem("imageSearchResults", JSON.stringify(result));
          sessionStorage.setItem("searchImage", selectedImage || "");

          // 根据搜索类型设置URL
          const urlType =
            searchType === "product" ? "image-product" : "image-booth";
          router.push(`/search/results?type=${urlType}`);
        } else {
          // 无搜索结果
          toast.error("未找到相似的结果，请尝试其他图片");
        }
      } catch (error) {
        console.error("搜索失败:", error);
        const errorMessage =
          error instanceof Error ? error.message : "搜索失败";
        setError(errorMessage);
        toast.error("搜索失败，请重试");
      } finally {
        setIsSearching(false);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    setError(null);
  };

  // 从URL参数检测搜索类型
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get("searchType");
    if (type === "product") {
      setSearchType("product");
    }
  }, []);

  // 动态生成页面标题和按钮文本
  const pageTitle = searchType === "product" ? "以图搜商品" : "以图搜档口";
  const searchButtonText =
    searchType === "product" ? "开始搜索商品" : "开始搜索档口";
  const descriptionText =
    searchType === "product"
      ? "上传商品图片，快速找到相似的商品信息"
      : "上传商品图片，快速找到相似的档口信息";

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 头部 - 使用UnifiedSearchBar */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 safe-area-inset-top">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all shadow-sm hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <h1 className="text-white font-medium text-lg">{pageTitle}</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* 主内容 */}
        <div className="p-4">
          {/* 使用说明 */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100 rounded-2xl p-4 mb-6 shadow-sm">
            <div className="flex items-start">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                <ImageIcon size={20} className="text-orange-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  拍照搜索{searchType === "product" ? "商品" : "档口"}
                </h3>
                <p className="text-sm text-gray-600">{descriptionText}</p>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm">
                  <X size={20} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-red-900 mb-2">
                    搜索失败
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 图片上传区域 */}
          {!selectedImage ? (
            <div className="space-y-6">
              {/* 拍照按钮 */}
              <button
                onClick={handleCameraClick}
                className="w-full bg-white border-2 border-dashed border-orange-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Camera size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  拍照搜索
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  打开相机拍摄商品照片，实时识别
                </p>
              </button>

              {/* 相册选择按钮 */}
              <button
                onClick={handleUploadClick}
                className="w-full bg-white border-2 border-dashed border-orange-200 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-orange-300 hover:bg-orange-50 active:bg-orange-100 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Upload size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  从相册选择
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  选择手机相册中的商品图片
                </p>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            /* 图片预览和搜索 */
            <div className="space-y-6">
              {/* 图片预览 */}
              <div className="relative bg-white rounded-2xl p-4 shadow-sm">
                <button
                  onClick={clearImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-gray-900 bg-opacity-60 backdrop-blur-sm rounded-full flex items-center justify-center text-white z-10 hover:bg-opacity-80 transition-all"
                >
                  <X size={16} />
                </button>
                <img
                  src={selectedImage}
                  alt="选择的图片"
                  className="w-full h-64 object-contain rounded-xl"
                />
              </div>

              {/* 搜索按钮 */}
              <button
                onClick={handleSearch}
                disabled={isSearching || !selectedFile}
                className={`w-full py-4 rounded-2xl font-medium text-white transition-all shadow-sm ${
                  isSearching || !selectedFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-95 hover:shadow-md"
                }`}
              >
                {isSearching ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    搜索中...
                  </div>
                ) : (
                  searchButtonText
                )}
              </button>

              {/* 重新选择 */}
              <button
                onClick={clearImage}
                className="w-full py-3 text-gray-600 text-sm hover:text-orange-500 transition-colors font-medium"
              >
                重新选择图片
              </button>
            </div>
          )}

          {/* 搜索技巧 */}
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-medium text-gray-900 mb-4 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              搜索技巧
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 font-bold">•</span>
                <span>确保商品在图片中清晰可见</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 font-bold">•</span>
                <span>避免背景过于复杂</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 font-bold">•</span>
                <span>正面拍摄效果更佳</span>
              </li>
              <li className="flex items-start">
                <span className="text-orange-500 mr-2 font-bold">•</span>
                <span>光线充足，避免模糊</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
