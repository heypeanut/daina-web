// API数据类型定义

// 轮播图数据
interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  linkType: 'product' | 'booth' | 'external';
  targetId?: string;
  sortOrder: number;
}

// 档口数据
interface Booth {
  id: string;
  boothName: string;
  description?: string;
  coverImage: string;
  score: number;
  market: string;
  address: string;
  phone?: string;
  rank?: number;
  isHot?: boolean;
}

// 商品数据
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  boothId: string;
  boothName: string;
  score: number;
  sales?: number;
  isHot?: boolean;
}

// 个性化推荐数据
interface PersonalizedRecommendation<T> {
  id: string;
  score: number;
  reason: string;
  type: 'booth' | 'product';
  algorithm: string;
  data: T;
}

// 混合推荐数据
interface MixedRecommendation {
  id: string;
  type: 'booth' | 'product';
  algorithm: 'personalized' | 'collaborative' | 'trending';
  score: number;
  reason?: string;
  data: Booth | Product;
}

// 首页完整数据
interface HomepageData {
  banners: Banner[];
  recommendations: {
    hotBooths: Booth[];
    latestBooths: Booth[];
    hotProducts: Product[];
    latestProducts: Product[];
    personalizedBooths?: PersonalizedRecommendation<Booth>[];
    personalizedProducts?: PersonalizedRecommendation<Product>[];
  };
  metadata: {
    hasPersonalization: boolean;
    userType: 'guest' | 'user';
    generatedAt: string;
  };
  timestamp: string;
  fromCache: boolean;
}

// 用户行为记录数据
interface BehaviorRecord {
  userId: number;
  behaviorType: 'view' | 'click' | 'favorite' | 'share';
  targetType: 'booth' | 'product' | 'banner';
  targetId: string;
  sessionId?: string;
  metadata?: {
    source?: string;
    platform?: 'pc' | 'mobile';
    position?: number;
    algorithm?: string;
    pageNum?: number;
    scrollPosition?: number;
  };
}

// 搜索结果数据
interface SearchResult {
  id: string;
  type: 'booth' | 'product';
  title: string;
  description: string;
  imageUrl: string;
  score: number;
  metadata: {
    boothName?: string;
    price?: number;
    market?: string;
    address?: string;
  };
}

// 用户状态
interface UserState {
  isLoggedIn: boolean;
  userId?: number;
  token?: string;
  profile?: {
    id: number;
    username: string;
    avatar?: string;
    preferences?: {
      categories: string[];
      priceRange: [number, number];
      markets: string[];
    };
  };
}

// 无限滚动状态
interface InfiniteScrollState<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  currentPage: number;
  error?: string;
}

// 搜索页面状态
interface SearchPageState {
  activeTab: 'product' | 'booth';
  productKeyword: string;
  boothKeyword: string;
  productId: string;
  boothId: string;
  searchHistory: string[];
  searchResults: SearchResult[];
  loading: boolean;
  error?: string;
}

// 首页组件Props
interface HomepageProps {
  banners: Banner[];
  hotBooths: Booth[];
  latestBooths: Booth[];
  hotProducts: Product[];
  latestProducts: Product[];
  personalizedRecommendations?: (PersonalizedRecommendation<Booth> | PersonalizedRecommendation<Product>)[];
  onBannerClick: (banner: Banner) => void;
  onBoothClick: (booth: Booth, index: number) => void;
  onProductClick: (product: Product, index: number) => void;
}

// 推荐组件Props
interface RecommendationSectionProps<T> {
  title: string;
  items: T[];
  type: 'booth' | 'product';
  layout?: 'list' | 'grid';
  onItemClick: (item: T, index: number) => void;
  onLoadMore?: () => void;
  loading?: boolean;
  hasMore?: boolean;
}

// 轮播图组件Props
interface BannerSectionProps {
  banners: Banner[];
  autoPlay?: boolean;
  interval?: number;
  onBannerClick: (banner: Banner) => void;
}

// 搜索组件Props
interface SearchBarProps {
  placeholder?: string;
  onSearch?: (keyword: string) => void;
  onImageSearch?: () => void;
}

// 无限滚动组件Props
interface InfiniteScrollProps<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

// 导出所有类型
export type {
  Banner,
  Booth,
  Product,
  PersonalizedRecommendation,
  MixedRecommendation,
  HomepageData,
  BehaviorRecord,
  SearchResult,
  UserState,
  InfiniteScrollState,
  SearchPageState,
  HomepageProps,
  RecommendationSectionProps,
  BannerSectionProps,
  SearchBarProps,
  InfiniteScrollProps,
};