import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

// 懒加载页面组件
const HomePage = lazy(() => import('@/pages/HomePage'));
const MarketPage = lazy(() => import('@/pages/MarketPage'));
const CooperationPage = lazy(() => import('@/pages/CooperationPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// 导入占位页面
import {
  LoginPage,
  RegisterPage,
  SearchPage,
  SearchResultsPage,
  ImageSearchPage,
  BoothDetailPage,
  ProductDetailPage,
  BoothApplyPage,
  BoothEditPage,
  BoothManagementPage,
  BoothSelectPage,
  BoothProductsPage,
  BoothProductAddPage,
  FavoritesProductsPage,
  FavoritesBoothsPage,
  HistoryPage,
  PrivacyPolicyPage,
  UserAgreementPage,
} from '@/pages/stub-pages';

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
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/search',
    element: <SearchPage />,
  },
  {
    path: '/search/results',
    element: <SearchResultsPage />,
  },
  {
    path: '/search/image',
    element: <ImageSearchPage />,
  },
  {
    path: '/booth/:id',
    element: <BoothDetailPage />,
  },
  {
    path: '/product/:id',
    element: <ProductDetailPage />,
  },
  {
    path: '/booth/apply',
    element: <BoothApplyPage />,
  },
  {
    path: '/booth/edit',
    element: <BoothEditPage />,
  },
  {
    path: '/booth/management',
    element: <BoothManagementPage />,
  },
  {
    path: '/booth/select',
    element: <BoothSelectPage />,
  },
  {
    path: '/booth/products',
    element: <BoothProductsPage />,
  },
  {
    path: '/booth/products/add',
    element: <BoothProductAddPage />,
  },
  {
    path: '/profile/favorites/products',
    element: <FavoritesProductsPage />,
  },
  {
    path: '/profile/favorites/booths',
    element: <FavoritesBoothsPage />,
  },
  {
    path: '/profile/history',
    element: <HistoryPage />,
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/user-agreement',
    element: <UserAgreementPage />,
  },
]);
