"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { BoothDetailSkeleton } from "./components/BoothDetailSkeleton";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";
import { Phone, QrCode } from "lucide-react";

import { CompetitorStyleHeader } from "./components/CompetitorStyleHeader";
import { CompetitorProductShowcase } from "./components/CompetitorProductShowcase";
import {
  ContactSheet,
  AgentContactSheet,
} from "./components/EnhancedContactModal";

// Hooks and types
import { useBoothDetail } from "./hooks/useBoothDetail";
import { BoothProduct } from "@/types/booth";

export default function RefactoredBoothDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boothId = params.id as string;
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  // Booth detail data and operations
  const {
    booth,
    products,
    isFavorited,
    isLoading,
    isProductsLoading,
    isLoadingMore,
    hasMoreProducts,
    isError,
    error,
    handleFavoriteToggle,
    handleShareClick,
    handleRefresh,
    handleLoadMore,
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

  // Get products array from API response
  const productsArray = Array.isArray(products)
    ? products
    : products?.rows && Array.isArray(products.rows)
    ? products.rows
    : [];

  // Handle search click - jump to search page with booth context
  const handleSearchClick = () => {
    // 跳转到搜索页面，限制在当前档口内搜索商品，传递档口名称
    router.push(
      `/search?type=product&boothId=${boothId}&boothName=${encodeURIComponent(
        booth?.boothName || ""
      )}`
    );
  };

  // Handle product click
  const handleProductClick = (product: BoothProduct) => {
    router.push(`/product/${product.id}`);
  };

  // Back button handler
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/market");
    }
  };

  // Error state
  if (isError) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
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
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

  // Loading state
  if (isLoading) {
    return (
      <MobileLayout showTabBar={false}>
        <BoothDetailSkeleton />
      </MobileLayout>
    );
  }

  if (!booth) {
    return null;
  }

  return (
    <ErrorBoundary>
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          <UnifiedSearchBar
            variant="booth-detail"
            showBack={true}
            onBackClick={handleBack}
            placeholder={`搜索 ${booth?.boothName} 的商品...`}
            onSearchClick={handleSearchClick}
            showShare={true}
            onShareClick={handleShareClick}
            className="fixed top-0 left-0 right-0 z-50"
          />

          <div className="pt-16">
            <div className="pb-24 space-y-2">
              <CompetitorStyleHeader
                booth={booth}
                isFavorited={isFavorited}
                onFavoriteToggle={handleFavoriteToggle}
                onShareClick={handleShareClick}
              />

              <CompetitorProductShowcase
                products={productsArray}
                total={products?.total || 0}
                onProductClick={handleProductClick}
                loading={isProductsLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMoreProducts}
                onLoadMore={handleLoadMore}
              />

              <div className="h-4" />
            </div>
          </div>

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
          booth={booth}
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
