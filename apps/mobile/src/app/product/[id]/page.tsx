"use client";

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 头部 */}
        <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center text-gray-600 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-medium text-gray-900">商品详情</h1>
        </div>

        <div className="p-4">
          <div className="bg-white rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              商品详情页
            </h2>
            <p className="text-gray-600 mb-4">
              商品ID: {productId}
            </p>
            <p className="text-sm text-gray-500">
              这里将显示商品的详细信息、图片、价格、规格等
            </p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}