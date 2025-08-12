// 占位页面组件，用于快速测试路由
import React from 'react';
import { MobileLayout } from '@/components/layout';

const createStubPage = (title: string, description: string) => {
  const StubPage: React.FC = () => (
    <MobileLayout showTabBar={false}>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </MobileLayout>
  );
  return StubPage;
};

export const LoginPage = createStubPage('🔐 登录', '登录页面（待迁移）');
export const RegisterPage = createStubPage('📝 注册', '注册页面（待迁移）');
export const BoothDetailPage = createStubPage('🏪 档口详情', '档口详情页面（待迁移）');
export const ProductDetailPage = createStubPage('📦 商品详情', '商品详情页面（待迁移）');
export const BoothApplyPage = createStubPage('📋 申请档口', '申请档口页面（待迁移）');
export const BoothEditPage = createStubPage('✏️ 编辑档口', '编辑档口页面（待迁移）');
export const BoothManagementPage = createStubPage('⚙️ 档口管理', '档口管理页面（待迁移）');

export const BoothProductsPage = createStubPage('📦 档口商品', '档口商品页面（待迁移）');
export const BoothProductAddPage = createStubPage('➕ 添加商品', '添加商品页面（待迁移）');
export const FavoritesProductsPage = createStubPage('❤️ 收藏商品', '收藏商品页面（待迁移）');
export const FavoritesBoothsPage = createStubPage('⭐ 收藏档口', '收藏档口页面（待迁移）');
export const HistoryPage = createStubPage('📚 浏览历史', '浏览历史页面（待迁移）');

