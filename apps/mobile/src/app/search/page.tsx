"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Search, Camera, ArrowLeft, X } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [productKeyword, setProductKeyword] = useState('');
  const [boothKeyword, setBoothKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'product' | 'booth'>('product');
  const [productId, setProductId] = useState('');
  const [boothId, setBoothId] = useState('');

  useEffect(() => {
    // 从URL参数获取初始搜索词
    const q = searchParams.get('q');
    const type = searchParams.get('type');
    if (q) {
      if (type === 'booth') {
        setBoothKeyword(q);
        setActiveTab('booth');
      } else {
        setProductKeyword(q);
        setActiveTab('product');
      }
    }
    
    // 加载搜索历史
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, [searchParams]);

  const handleSearch = () => {
    const currentKeyword = activeTab === 'product' ? productKeyword : boothKeyword;
    if (currentKeyword.trim()) {
      // 保存到搜索历史
      const newHistory = [currentKeyword.trim(), ...searchHistory.filter(item => item !== currentKeyword.trim())].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      // 执行搜索逻辑
      console.log(`搜索${activeTab === 'product' ? '商品' : '档口'}:`, currentKeyword.trim());
      router.push(`/search/results?type=${activeTab}&q=${encodeURIComponent(currentKeyword.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (item: string) => {
    if (activeTab === 'product') {
      setProductKeyword(item);
    } else {
      setBoothKeyword(item);
    }
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const removeHistoryItem = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const handleImageSearch = () => {
    router.push('/search/image');
  };

  const handleProductIdSearch = () => {
    if (productId.trim()) {
      console.log('商品ID查询:', productId.trim());
      router.push(`/search/results?type=product&mode=id&q=${encodeURIComponent(productId.trim())}`);
    }
  };

  const handleBoothIdSearch = () => {
    if (boothId.trim()) {
      console.log('档口ID查询:', boothId.trim());
      router.push(`/search/results?type=booth&mode=id&q=${encodeURIComponent(boothId.trim())}`);
    }
  };

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索栏 - 参考首页样式 */}
        <div className="px-3 py-2 bg-red-500">
          <div className="flex items-center space-x-2">
            {/* 返回按钮 */}
            <button
              onClick={() => router.back()}
              className="w-8 h-8 flex items-center justify-center text-white mr-1"
            >
              <ArrowLeft size={20} />
            </button>
            
            {/* 搜索输入框 */}
            <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={activeTab === 'product' ? productKeyword : boothKeyword}
                onChange={(e) => {
                  if (activeTab === 'product') {
                    setProductKeyword(e.target.value);
                  } else {
                    setBoothKeyword(e.target.value);
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder={activeTab === 'product' ? '搜索商品关键字或货号' : '搜索档口名称'}
                className="flex-1 text-sm text-gray-700 outline-none"
                autoFocus
              />
              {(activeTab === 'product' ? productKeyword : boothKeyword) && (
                <button
                  onClick={() => {
                    if (activeTab === 'product') {
                      setProductKeyword('');
                    } else {
                      setBoothKeyword('');
                    }
                  }}
                  className="ml-2 text-gray-400"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            
            {/* 拍照搜索按钮 */}
            <button
              onClick={handleImageSearch}
              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center active:bg-red-700 transition-all shadow-sm"
            >
              <Camera size={16} className="text-white" />
            </button>
            
            {/* 搜索按钮 */}
            <button
              onClick={handleSearch}
              className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-medium active:bg-red-700 transition-colors shadow-sm"
            >
              搜索
            </button>
          </div>
        </div>

        {/* 搜索内容 */}
        <div className="bg-white">
          {/* 搜索类型切换 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('product')}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === 'product'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600'
              }`}
            >
              商品
            </button>
            <button
              onClick={() => setActiveTab('booth')}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                activeTab === 'booth'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600'
              }`}
            >
              档口
            </button>
          </div>

          {/* ID查询功能 */}
          <div className="p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">ID查询:</span>
              <div className="flex-1 flex items-center bg-white rounded-full px-3 py-2 border border-gray-200">
                <input
                  type="text"
                  value={activeTab === 'product' ? productId : boothId}
                  onChange={(e) => {
                    if (activeTab === 'product') {
                      setProductId(e.target.value);
                    } else {
                      setBoothId(e.target.value);
                    }
                  }}
                  placeholder={activeTab === 'product' ? '请输入商品id' : '请输入档口id'}
                  className="flex-1 text-sm text-gray-700 outline-none"
                />
              </div>
              <button
                onClick={activeTab === 'product' ? handleProductIdSearch : handleBoothIdSearch}
                className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium active:bg-red-700 transition-colors"
              >
                快速查找
              </button>
            </div>
          </div>

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">搜索历史</h3>
                <button 
                  onClick={clearHistory}
                  className="text-xs text-gray-500"
                >
                  清空
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((item, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded-full">
                    <button
                      onClick={() => handleHistoryClick(item)}
                      className="flex-1 px-3 py-2 text-sm text-gray-700"
                    >
                      {item}
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item)}
                      className="pr-2 text-gray-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}