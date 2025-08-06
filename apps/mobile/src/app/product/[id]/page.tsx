"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Phone, QrCode } from 'lucide-react';

// 产品页面组件
import { ProductHeader } from './components/ProductHeader';
import { ProductImageViewer } from './components/ProductImageViewer';
import { ProductBasicInfo } from './components/ProductBasicInfo';
import { ProductSpecs } from './components/ProductSpecs';
import { BoothInfoCard } from './components/BoothInfoCard';

// 联系组件
import {
  ContactSheet,
  AgentContactSheet,
} from '../../booth/[id]/components/EnhancedContactModal';

// Hooks
import { useProductDetail } from './hooks/useProductDetail';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  // 使用产品详情Hook
  const {
    product,
    isLoading,
    isError,
    error,
    handleShareClick,
    handleRefresh
  } = useProductDetail({
    productId,
    autoTrackView: true,
    onShareSuccess: () => {
      console.log('产品分享成功');
    },
    onError: (error) => {
      console.error('产品详情加载失败:', error);
    }
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleCart = () => {
    // TODO: 实现购物车功能
    console.log('添加到购物车:', productId);
  };

  const handleBoothClick = (boothId: string) => {
    router.push(`/booth/${boothId}`);
  };

  const handleFollowClick = (boothId: string) => {
    // TODO: 实现关注功能
    console.log('关注档口:', boothId);
  };

  // 错误状态
  if (isError || error) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center px-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                加载失败
              </h2>
              <p className="text-gray-600 mb-6">
                {error?.message || "产品信息加载失败，请稍后重试"}
              </p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 加载状态
  if (isLoading) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          <div className="flex items-center justify-center min-h-96">
            <LoadingSpinner />
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 如果没有产品数据，返回null
  if (!product) {
    return null;
  }

  console.log('product', product);

  return (
    <ErrorBoundary>
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          {/* 头部导航 */}
          <ProductHeader
            title="商品详情"
            onBackClick={handleBack}
            onShareClick={handleShareClick}
            onCartClick={handleCart}
            className="fixed top-0 left-0 right-0 z-40"
          />

          {/* 主要内容区域 */}
          <div className="pt-14 pb-24">
            <div className="space-y-2">
              {/* 产品图片展示 */}
              <ProductImageViewer
                images={product.images}
                productName={product.name}
              />

              {/* 产品基本信息 */}
              <ProductBasicInfo
                name={product.name}
                price={product.price}
                maxPrice={product.maxPrice}
                originalPrice={product.originalPrice}
                stock={product.stock}
                views={product.views}
                features={product.features}
                boothName={product.booth.boothName}
              />

              {/* 产品规格 */}
              <ProductSpecs
                category={product.category}
                style={product.style}
                phoneModel={product.phoneModel}
                productType={product.productType}
                trend={product.trend}
                imageType={product.imageType}
                copyright={product.copyright}
                biodegradable={product.biodegradable}
                ecoMaterial={product.ecoMaterial}
              />

              {/* 档口信息 */}
              <BoothInfoCard
                booth={product.booth}
                onBoothClick={handleBoothClick}
                onFollowClick={handleFollowClick}
              />
            </div>
          </div>

          {/* 底部操作栏 */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
            <div className="flex gap-3">
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex-1 bg-white border-2 border-red-500 text-red-500 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
              >
                <Phone size={20} />
                联系商家
              </button>

              <button
                onClick={() => setIsAgentModalOpen(true)}
                className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-orange-600 transition-all shadow-sm"
              >
                <QrCode size={20} />
                联系代拿
              </button>
            </div>
          </div>
        </div>

        <ContactSheet
          booth={product.booth}
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        <AgentContactSheet
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
        />
      </MobileLayout>
    </ErrorBoundary>
  );
}