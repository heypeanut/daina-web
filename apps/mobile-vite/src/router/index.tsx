import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/common';

// 懒加载页面组件
const HomePage = lazy(() => import('@/pages/home/home-page'));
const MarketPage = lazy(() => import('@/pages/market/market-page'));
const CooperationPage = lazy(() => import('@/pages/cooperation/cooperation-page'));
const ProfilePage = lazy(() => import('@/pages/profile/profile-page'));
const BoothDetailPage = lazy(() => import('@/pages/booth/booth-detail-page'));
const ProductDetailPage = lazy(() => import('@/pages/product/product-detail-page'));
const LoginPage = lazy(() => import('@/pages/auth/login-page'));
const RegisterPage = lazy(() => import('@/pages/auth/register-page'));

// Profile子页面
const FavoritesPage = lazy(() => import('@/pages/profile/favorites/favorites-page'));
const FollowedBoothsPage = lazy(() => import('@/pages/profile/favorites/followed-booths-page'));
const ProductHistoryPage = lazy(() => import('@/pages/profile/history/ProductHistoryPage'));
const BoothHistoryPage = lazy(() => import('@/pages/profile/history/BoothHistoryPage'));
const SettingsPage = lazy(() => import('@/pages/profile/settings/settings-page'));

// 档口管理页面
const BoothApplyPage = lazy(() => import('@/pages/booth-management/apply/booth-apply-page'));
const BoothManagementPage = lazy(() => import('@/pages/booth-management/management/booth-management-page'));
const ProductsManagementPage = lazy(() => import('@/pages/booth-management/products/products-management-page'));
const AddProductPage = lazy(() => import('@/pages/booth-management/products/add-product-page'));
const BoothEditPage = lazy(() => import('@/pages/booth-management/edit/booth-edit-page'));
const SearchPage = lazy(() => import('@/pages/search/search-page'));
const ImageSearchPage = lazy(() => import('@/pages/search/image-search-page'));
const SearchResultsPage = lazy(() => import('@/pages/search/search-results-page'));
const BoothSelectPage = lazy(() => import('@/pages/booth-management/select/booth-select-page'));
const EditProductPage = lazy(() => import('@/pages/booth-management/products/edit-product-page'));
const PrivacyPolicyPage = lazy(() => import('@/pages/legal/privacy-policy-page'));
const UserAgreementPage = lazy(() => import('@/pages/legal/user-agreement-page'));

// 加载组件包装器
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/market',
    element: (
      <SuspenseWrapper>
        <MarketPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/cooperation',
    element: (
      <SuspenseWrapper>
        <CooperationPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile',
    element: (
      <SuspenseWrapper>
        <ProfilePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/search',
    element: (
      <SuspenseWrapper>
        <SearchPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/search/results',
    element: (
      <SuspenseWrapper>
        <SearchResultsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/search/image',
    element: (
      <SuspenseWrapper>
        <ImageSearchPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/:id',
    element: (
      <SuspenseWrapper>
        <BoothDetailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/product/:id',
    element: (
      <SuspenseWrapper>
        <ProductDetailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/apply',
    element: (
      <SuspenseWrapper>
        <BoothApplyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/edit',
    element: (
      <SuspenseWrapper>
        <BoothEditPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/management',
    element: (
      <SuspenseWrapper>
        <BoothManagementPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/select',
    element: (
      <SuspenseWrapper>
        <BoothSelectPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/products',
    element: (
      <SuspenseWrapper>
        <ProductsManagementPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/products/add',
    element: (
      <SuspenseWrapper>
        <AddProductPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/booth/products/edit',
    element: (
      <SuspenseWrapper>
        <EditProductPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/favorites',
    element: (
      <SuspenseWrapper>
        <FavoritesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/favorites/products',
    element: (
      <SuspenseWrapper>
        <FavoritesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/favorites/booths',
    element: (
      <SuspenseWrapper>
        <FollowedBoothsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/product-history',
    element: (
      <SuspenseWrapper>
        <ProductHistoryPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/booth-history',
    element: (
      <SuspenseWrapper>
        <BoothHistoryPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/profile/settings',
    element: (
      <SuspenseWrapper>
        <SettingsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/privacy-policy',
    element: (
      <SuspenseWrapper>
        <PrivacyPolicyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/user-agreement',
    element: (
      <SuspenseWrapper>
        <UserAgreementPage />
      </SuspenseWrapper>
    ),
  },
]);
