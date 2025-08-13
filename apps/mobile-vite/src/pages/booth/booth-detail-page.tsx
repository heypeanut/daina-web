import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Phone, QrCode } from "lucide-react";
import { MobileLayout } from "@/components/layout";
import { UnifiedSearchBar } from "@/components/common";
import {
  BoothHeader,
  ProductShowcase,
  ContactSheet,
  AgentContactSheet,
} from "./components";
import { useGetDetail } from "./hooks";

export default function BoothDetailPage() {
  const { id: boothId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const {
    data: booth,
    isLoading,
    isError,
    error,
    refetch: handleRefresh,
  } = useGetDetail(boothId || "");

  // Handle search click - jump to search page with booth context
  const handleSearchClick = () => {
    // 跳转到搜索页面，限制在当前档口内搜索商品，传递档口名称
    navigate(
      `/search?type=product&boothId=${boothId}&boothName=${encodeURIComponent(
        booth?.boothName || ""
      )}`
    );
  };

  // Handle product click
  const handleProductClick = (product: any) => {
    navigate(`/product/${product.id}`);
  };

  // Back button handler
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/market");
    }
  };

  // Error state
  if (isError) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              加载失败
            </h2>
            <p className="text-gray-600 mb-4">
              {error?.message || "网络错误，请稍后重试"}
            </p>
            <button
              onClick={() => handleRefresh()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // Loading state
  if (isLoading || !booth) {
    return (
      <MobileLayout showTabBar={false}>
        <div className="min-h-screen bg-gray-50">
          <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 h-16"></div>
          <div className="pt-16">
            <div className="animate-pulse">
              {/* Header skeleton */}
              <div className="bg-white p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              {/* Products skeleton */}
              <div className="bg-white mt-2 p-4">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="grid grid-cols-2 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-200"></div>
                      <div className="p-3">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        <UnifiedSearchBar
          variant="booth-detail"
          showBack={true}
          onBackClick={handleBack}
          placeholder={`搜索 ${booth?.boothName} 的商品...`}
          onSearchClick={handleSearchClick}
          showShare={true}
          className="fixed top-0 left-0 right-0 z-50"
        />

        <div className="pt-16">
          <div className="pb-24 space-y-2">
            <BoothHeader
              booth={booth}
              isFavorited={false}
              onFavoriteToggle={() => {}}
              onShareClick={() => {}}
            />

            <ProductShowcase onProductClick={handleProductClick} />

            <div className="h-4" />
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t-lg border-gray-200 p-2 z-50">
          <div className="flex gap-3">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex-1 bg-white border-2 border-red-500 text-red-500 py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colorsh-[32px] touch-manipulation"
            >
              <Phone size={20} />
              联系商家
            </button>

            <button
              onClick={() => setIsAgentModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-orange-600 active:from-red-700 active:to-orange-700 transition-all shadow-sm touch-manipulation"
            >
              <QrCode size={20} />
              联系代拿
            </button>
          </div>
        </div>

        {/* 联系商家弹窗 */}
        <ContactSheet
          booth={booth}
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

        {/* 代拿服务弹窗 */}
        <AgentContactSheet
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
        />
      </div>
    </MobileLayout>
  );
}
