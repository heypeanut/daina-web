"use client";

import React, { useState, useEffect } from 'react';

interface DebugInfo {
  timestamp: string;
  type: 'scroll' | 'loadmore' | 'data' | 'query';
  message: string;
  data?: any;
}

interface DebugConsoleProps {
  searchKeyword: string;
  activeTab: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  totalProducts: number;
  totalBooths: number;
}

/**
 * 调试控制台组件（仅用于开发调试）
 * 在修复无限滚动问题时使用，生产环境中应移除
 */
export function DebugConsole({
  searchKeyword,
  activeTab,
  hasNextPage,
  isFetchingNextPage,
  totalProducts,
  totalBooths,
}: DebugConsoleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [debugLogs, setDebugLogs] = useState<DebugInfo[]>([]);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  // 监听控制台日志
  useEffect(() => {
    const originalConsoleLog = console.log;
    
    console.log = (...args) => {
      originalConsoleLog(...args);
      
      // 过滤调试相关的日志
      const message = args.join(' ');
      if (message.includes('[无限滚动调试]') || message.includes('[搜索逻辑调试]') || message.includes('[产品搜索调试]') || message.includes('[档口搜索调试]')) {
        setDebugLogs(prev => {
          const newLog: DebugInfo = {
            timestamp: new Date().toLocaleTimeString(),
            type: message.includes('Scroll') ? 'scroll' : 
                  message.includes('handleLoadMore') ? 'loadmore' :
                  message.includes('数据扁平化') ? 'data' : 'query',
            message,
            data: args.length > 1 ? args.slice(1) : undefined,
          };
          
          // 保留最近50条日志
          const newLogs = [...prev, newLog].slice(-50);
          return newLogs;
        });
      }
    };

    return () => {
      console.log = originalConsoleLog;
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (isAutoScroll) {
      const container = document.getElementById('debug-logs');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [debugLogs, isAutoScroll]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 text-white px-3 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          🐛 调试
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-green-400 text-xs font-mono z-50 max-h-80 border-t-2 border-green-500">
      {/* 工具栏 */}
      <div className="bg-gray-900 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-4">
          <span className="text-green-400">🔧 无限滚动调试控制台</span>
          <div className="flex gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${activeTab === 'product' ? 'bg-blue-600' : 'bg-gray-600'}`}>
              产品: {totalProducts}
            </span>
            <span className={`px-2 py-1 rounded ${activeTab === 'booth' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              档口: {totalBooths}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={isAutoScroll}
              onChange={(e) => setIsAutoScroll(e.target.checked)}
              className="w-3 h-3"
            />
            <span className="text-xs">自动滚动</span>
          </label>
          <button
            onClick={() => setDebugLogs([])}
            className="px-2 py-1 bg-yellow-600 text-black rounded text-xs"
          >
            清空
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 bg-red-600 text-white rounded text-xs"
          >
            关闭
          </button>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-gray-800 px-4 py-1 text-xs flex items-center gap-4">
        <span>搜索词: <span className="text-yellow-400">{searchKeyword || '无'}</span></span>
        <span>当前标签: <span className="text-blue-400">{activeTab}</span></span>
        <span>有下一页: <span className={hasNextPage ? 'text-green-400' : 'text-red-400'}>{hasNextPage ? '是' : '否'}</span></span>
        <span>正在加载: <span className={isFetchingNextPage ? 'text-yellow-400' : 'text-gray-400'}>{isFetchingNextPage ? '是' : '否'}</span></span>
      </div>

      {/* 日志区域 */}
      <div id="debug-logs" className="overflow-y-auto max-h-60 p-2">
        {debugLogs.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            等待调试日志...
            <br />
            <span className="text-xs">请尝试搜索商品并滚动页面</span>
          </div>
        ) : (
          debugLogs.map((log, index) => (
            <div key={index} className={`mb-1 pl-2 border-l-2 ${
              log.type === 'scroll' ? 'border-blue-500 text-blue-300' :
              log.type === 'loadmore' ? 'border-yellow-500 text-yellow-300' :
              log.type === 'data' ? 'border-purple-500 text-purple-300' :
              'border-green-500 text-green-300'
            }`}>
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs min-w-20">{log.timestamp}</span>
                <span className="flex-1 break-words">{log.message}</span>
              </div>
              {log.data && (
                <div className="text-gray-400 text-xs ml-22 mt-1">
                  {JSON.stringify(log.data, null, 2)}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/**
 * 快速测试按钮组件
 */
export function QuickTestButtons({ onLoadMore, onScrollToBottom }: {
  onLoadMore: () => void;
  onScrollToBottom: () => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
      <button
        onClick={onLoadMore}
        className="bg-blue-600 text-white px-3 py-2 rounded text-xs shadow-lg"
      >
        手动加载更多
      </button>
      <button
        onClick={onScrollToBottom}
        className="bg-green-600 text-white px-3 py-2 rounded text-xs shadow-lg"
      >
        滚动到底部
      </button>
    </div>
  );
}