import type { Product, ImageSearchResult } from '@/types/api';
import type { Booth } from '@/types/booth';
import type { ProductSearchResponse, BoothSearchResponse } from '@/hooks/api/search';

/**
 * 搜索页面专用类型定义
 */

// 排序选项类型
export type SortOption = 'relevance' | 'price' | 'sales';

// 活跃标签类型
export type ActiveTab = 'product' | 'booth';

// 搜索状态类型
export interface SearchState {
  keyword: string;
  activeTab: ActiveTab;
  sortBy: SortOption;
  isImageSearch: boolean;
  searchKeyword: string;
}

// 商品点击事件类型
export type ProductClickHandler = (product: Product, index: number) => void;

// 档口点击事件类型
export type BoothClickHandler = (booth: Booth, index: number) => void;

// 搜索数据类型
export interface SearchData {
  productData?: ProductSearchResponse;
  boothData?: BoothSearchResponse;
  productLoading: boolean;
  boothLoading: boolean;
  productError: Error | null;
  boothError: Error | null;
}

// 搜索事件处理器类型
export interface SearchEventHandlers {
  onTabChange: (tab: ActiveTab) => void;
  onSortChange: (sortBy: SortOption) => void;
  onProductClick: ProductClickHandler;
  onBoothClick: BoothClickHandler;
  onProductRefetch: () => void;
  onBoothRefetch: () => void;
}

// 搜索配置类型
export interface SearchConfig {
  pageSize: number;
  defaultTab: ActiveTab;
  defaultSort: SortOption;
  enableImageSearch: boolean;
  enableInfiniteScroll: boolean;
}

// 搜索结果统计类型
export interface SearchResultStats {
  totalProducts: number;
  totalBooths: number;
  searchTime?: number;
  resultCount: number;
}

// 图片搜索状态类型
export interface ImageSearchState {
  isImageSearch: boolean;
  searchImage: string | null;
  imageResults: ImageSearchResult[] | null;
}

// 加载更多状态类型
export interface LoadMoreState {
  hasMore: boolean;
  loading: boolean;
  currentPage: number;
}

// 搜索历史项类型
export interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
  type: ActiveTab;
  resultCount: number;
}

// 搜索建议类型
export interface SearchSuggestion {
  keyword: string;
  type: 'history' | 'trending' | 'suggestion';
  count?: number;
}