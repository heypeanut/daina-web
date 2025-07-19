"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Camera, ArrowLeft, Upload, ImageIcon, X } from "lucide-react";
import { useImageSearch } from "@/hooks/useApi";

export default function ImageSearchPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { searching, searchResult, error, searchBooths, clearResults } =
    useImageSearch();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小和类型
      if (file.size > 10 * 1024 * 1024) {
        // 10MB
        alert("图片文件不能超过10MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        alert("请选择图片文件");
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
    const cameraInput = document.createElement('input');
    cameraInput.type = 'file';
    cameraInput.accept = 'image/*';
    cameraInput.capture = 'environment'; // 调用后置摄像头
    cameraInput.style.display = 'none';
    
    cameraInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 使用相同的处理逻辑
        handleFileSelect({ target: { files: [file] } } as any);
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
        const result = await searchBooths({
          image: selectedFile,
          limit: 20,
          minSimilarity: 0.3,
        });

        if (result && result.success) {
          // 将搜索结果保存到sessionStorage，传递给结果页面
          sessionStorage.setItem("imageSearchResults", JSON.stringify(result));
          sessionStorage.setItem("searchImage", selectedImage || "");
          router.push("/search/results?type=image-booth");
        }
      } catch (error) {
        console.error("搜索失败:", error);
      }
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSelectedFile(null);
    clearResults();
  };

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 头部 */}
        <div className="bg-red-500 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center text-white"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-white font-medium">以图搜图</h1>
            <div className="w-8"></div>
          </div>
        </div>

        {/* 主内容 */}
        <div className="p-4">
          {/* 使用说明 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <ImageIcon
                size={20}
                className="text-blue-500 mt-0.5 mr-3 flex-shrink-0"
              />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  拍照搜索档口
                </h3>
                <p className="text-xs text-blue-700">
                  上传商品图片，快速找到相似的档口信息
                </p>
              </div>
            </div>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <X
                  size={20}
                  className="text-red-500 mt-0.5 mr-3 flex-shrink-0"
                />
                <div>
                  <h3 className="text-sm font-medium text-red-900 mb-1">
                    搜索失败
                  </h3>
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 图片上传区域 */}
          {!selectedImage ? (
            <div className="space-y-4">
              {/* 拍照按钮 */}
              <button
                onClick={handleCameraClick}
                className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center active:bg-gray-50 transition-colors"
              >
                <Camera size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  拍照搜索
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  打开相机拍摄商品照片
                </p>
              </button>

              {/* 相册选择按钮 */}
              <button
                onClick={handleUploadClick}
                className="w-full bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center active:bg-gray-50 transition-colors"
              >
                <Upload size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  从相册选择
                </h3>
                <p className="text-sm text-gray-500 text-center">
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
            <div className="space-y-4">
              {/* 图片预览 */}
              <div className="relative bg-white rounded-lg p-4">
                <button
                  onClick={clearImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white z-10"
                >
                  <X size={16} />
                </button>
                <img
                  src={selectedImage}
                  alt="选择的图片"
                  className="w-full h-64 object-contain rounded-lg"
                />
              </div>

              {/* 搜索按钮 */}
              <button
                onClick={handleSearch}
                disabled={searching || !selectedFile}
                className={`w-full py-4 rounded-lg font-medium text-white transition-colors ${
                  searching || !selectedFile
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 active:bg-red-600"
                }`}
              >
                {searching ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    搜索中...
                  </div>
                ) : (
                  "开始搜索档口"
                )}
              </button>

              {/* 重新选择 */}
              <button
                onClick={clearImage}
                className="w-full py-3 text-gray-600 text-sm"
              >
                重新选择图片
              </button>
            </div>
          )}

          {/* 搜索技巧 */}
          <div className="mt-8 bg-gray-100 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">搜索技巧</h3>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• 确保商品在图片中清晰可见</li>
              <li>• 避免背景过于复杂</li>
              <li>• 正面拍摄效果更佳</li>
              <li>• 光线充足，避免模糊</li>
            </ul>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
