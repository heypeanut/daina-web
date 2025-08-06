"use client";

import React, { useState } from 'react';
import { Phone, QrCode, X, Copy } from 'lucide-react';
import { ProductDetail } from '../types';

interface ProductActionBarProps {
  product: ProductDetail;
  onContactSuccess?: (type: string, value: string) => void;
  className?: string;
}

export function ProductActionBar({
  product,
  onContactSuccess,
  className = ''
}: ProductActionBarProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`已复制: ${text}`);
      onContactSuccess?.('copy', text);
    }).catch(() => {
      console.error('复制失败');
    });
  };

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const handleAgentClick = () => {
    setIsAgentModalOpen(true);
  };

  return (
    <>
      {/* 底部操作栏 */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 safe-area-bottom ${className}`}>
        <div className="flex gap-3">
          <button
            onClick={handleContactClick}
            className="flex-1 bg-white border-2 border-red-500 text-red-500 py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors min-h-[48px] touch-manipulation"
          >
            <Phone size={20} />
            联系商家
          </button>

          <button
            onClick={handleAgentClick}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-orange-600 active:from-red-700 active:to-orange-700 transition-all shadow-sm min-h-[48px] touch-manipulation"
          >
            <QrCode size={20} />
            联系代拿
          </button>
        </div>
      </div>

      {/* 联系商家弹窗 */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">联系商家</h3>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* 档口信息 */}
              <div className="text-center mb-6">
                <h4 className="text-base font-medium text-gray-900 mb-1">
                  {product.booth.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {product.name}
                </p>
              </div>

              {/* 联系方式 - 模拟数据 */}
              <div className="space-y-3">
                <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-red-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">电话</div>
                    <div className="font-medium">138****8888</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('13888888888')}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
                  <QrCode className="w-5 h-5 text-green-500 mr-3" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">微信</div>
                    <div className="font-medium">shop_****888</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard('shop_wx888')}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 二维码 */}
              <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm border flex justify-center items-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode size={48} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 代拿服务弹窗 */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-t-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">联系代拿</h3>
              <button
                onClick={() => setIsAgentModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center">
              <h4 className="text-base font-medium text-gray-900 mb-2">
                专业代拿服务
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                扫描下方二维码联系代拿服务
              </p>

              {/* 二维码 */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border flex justify-center items-center">
                <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCode size={56} className="text-gray-400" />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                代拿服务费用根据商品价值和数量收取
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}