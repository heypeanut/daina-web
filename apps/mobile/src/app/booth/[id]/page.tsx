"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";

// 页面组件
import { BoothDetailHeader } from "./components/BoothDetailHeader";
import { BoothBasicInfo } from "./components/BoothBasicInfo";
import { BoothContactInfo } from "./components/BoothContactInfo";
import { BoothProductShowcase } from "./components/BoothProductShowcase";
import { BoothDescription } from "./components/BoothDescription";
import { RelatedBooths } from "./components/RelatedBooths";
import { BoothActionBar } from "./components/BoothActionBar";

// Hooks
import { useBoothDetail } from "./hooks/useBoothDetail";
import { useRelatedBooths } from "./hooks/useRelatedBooths";

// Types
import { BoothProduct, BoothDetail } from "../../../../../../src/types/booth";

export default function BoothDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boothId = params.id as string;

  // 档口详情数据和操作
  const {
    booth,
    products,
    isFavorited,
    isLoading,
    isProductsLoading,
    isError,
    error,
    handleFavoriteToggle,
    handleContactClick,
    handleShareClick,
    handleRefresh,
  } = useBoothDetail({
    boothId,
    autoTrackView: true,
    onContactSuccess: (type, value) => {
      console.log(`联系成功: ${type} - ${value}`);
    },
    onShareSuccess: () => {
      console.log("分享成功");
    },
  });

  // 相关推荐
  const { data: relatedBooths = [], isLoading: isRelatedLoading } =
    useRelatedBooths(boothId, { limit: 4 });

  // 处理商品点击
  const handleProductClick = (product: BoothProduct) => {
    router.push(`/product/${product.id}`);
  };

  // 处理相关档口点击
  const handleRelatedBoothClick = (relatedBooth: BoothDetail) => {
    router.push(`/booth/${relatedBooth.id}`);
  };

  // 处理查看更多商品
  const handleViewAllProducts = () => {
    // TODO: 跳转到档口商品列表页或展开所有商品
    console.log("查看全部商品");
  };

  // 处理查看更多推荐
  const handleViewAllRelated = () => {
    router.push(`/market?related=${boothId}`);
  };

  // 返回按钮处理
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/market");
    }
  };

  // 错误状态
  if (isError) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          {/* 导航栏 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-medium text-gray-900">档口详情</h1>
            <div className="w-8 h-8" />
          </div>

          {/* 错误内容 */}
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center px-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                加载失败
              </h2>
              <p className="text-gray-600 mb-6">
                {error?.message || "档口信息加载失败，请稍后重试"}
              </p>
              <div className="space-x-3">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  重试
                </button>
                <button
                  onClick={handleBack}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  返回
                </button>
              </div>
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
          {/* 导航栏 */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
            <button
              onClick={handleBack}
              className="w-8 h-8 flex items-center justify-center text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-medium text-gray-900">档口详情</h1>
            <div className="w-8 h-8" />
          </div>

          <LoadingSpinner text="加载档口信息..." className="py-20" />
        </div>
      </MobileLayout>
    );
  }

  if (!booth) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gradient-to-b from-orange-50/30 to-white">
          <UnifiedSearchBar
            variant="home"
            className="fixed top-0 left-0 right-0 z-50"
            placeholder="搜索商品关键字或货号"
            showLogo={true}
            showCamera={true}
            logoSize={32}
          />

          {/* 为固定搜索栏留出空间 */}
          <div className="pt-16">
            {/* 内容区域 */}
            <div className="pb-20">
              {/* 档口头部信息 */}
              <BoothDetailHeader
                booth={booth}
                isFavorited={isFavorited}
                onFavoriteToggle={handleFavoriteToggle}
                className="mb-2"
              />

              {/* 基本信息 */}
              <BoothBasicInfo booth={booth} className="mb-2" />

              {/* 联系信息 */}
              <BoothContactInfo
                booth={booth}
                onContactClick={handleContactClick}
                className="mb-2"
              />

              {/* 档口介绍 */}
              {(booth.description || booth.text) && (
                <BoothDescription booth={booth} className="mb-2" />
              )}

              {/* 商品展示 */}
              <BoothProductShowcase
                products={products}
                onProductClick={handleProductClick}
                loading={isProductsLoading}
                maxDisplay={6}
                showViewAll={true}
                onViewAll={handleViewAllProducts}
                className="mb-2"
              />

              {/* 相关推荐 */}
              <RelatedBooths
                booths={relatedBooths}
                onBoothClick={handleRelatedBoothClick}
                onViewAll={handleViewAllRelated}
                loading={isRelatedLoading}
                className="mb-2"
              />

              {/* 底部间距 */}
              <div className="h-4" />
            </div>

            {/* 底部操作栏 */}
            <BoothActionBar
              booth={booth}
              isFavorited={isFavorited}
              onFavoriteToggle={handleFavoriteToggle}
              onContactClick={() => {
                // 滚动到联系信息区域
                const contactSection = document.querySelector(
                  "[data-contact-section]"
                );
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                }
              }}
              onShareClick={handleShareClick}
            />
          </div>
        </div>
      </MobileLayout>
    </ErrorBoundary>
  );
}
