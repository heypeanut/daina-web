import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, QrCode } from 'lucide-react';
import { MobileLayout } from '@/components/layout';
import { ContactSheet, AgentContactSheet } from '../booth/components';
import {
  ProductHeader,
  ProductImageViewer,
  ProductBasicInfo,
  ProductSpecs,
  BoothInfoCard
} from './components';
import { useProductDetail } from './hooks/use-product-detail';

export default function ProductDetailPage() {
  const { id: productId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
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
    productId: productId || '',
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
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCart = () => {
    // TODO: 实现购物车功能
    console.log('添加到购物车:', productId);
  };

  const handleBoothClick = (boothId: string) => {
    navigate(`/booth/${boothId}`);
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
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="bg-white border-b border-gray-100 h-14"></div>
            
            {/* Image skeleton */}
            <div className="bg-white">
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            
            {/* Content skeleton */}
            <div className="bg-white p-4 mt-2">
              <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            {/* Specs skeleton */}
            <div className="bg-white p-4 mt-2">
              <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // 如果没有产品数据，返回null
  if (!product) {
    return null;
  }

  return (
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
              itemNo={product.itemNo}
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
              className="flex-1 bg-white border-2 border-red-500 text-red-500 py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-red-50 active:bg-red-100 transition-colors min-h-[48px] touch-manipulation"
            >
              <Phone size={20} />
              联系商家
            </button>

            <button
              onClick={() => setIsAgentModalOpen(true)}
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:from-red-600 hover:to-orange-600 active:from-red-700 active:to-orange-700 transition-all shadow-sm min-h-[48px] touch-manipulation"
            >
              <QrCode size={20} />
              联系代拿
            </button>
          </div>
        </div>

        {/* 联系商家弹窗 */}
        {product.booth && (
          <ContactSheet
            booth={product.booth}
            isOpen={isContactModalOpen}
            onClose={() => setIsContactModalOpen(false)}
          />
        )}

        {/* 代拿服务弹窗 */}
        <AgentContactSheet
          isOpen={isAgentModalOpen}
          onClose={() => setIsAgentModalOpen(false)}
        />
      </div>
    </MobileLayout>
  );
}
