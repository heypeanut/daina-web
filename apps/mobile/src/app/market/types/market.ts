import { Booth, SortType } from '../../../../../../src/types/booth';

export interface GetBoothsParams {
  page: number;
  size: number;
  keyword?: string;
  category?: string;
  sort?: SortType;
  order?: 'asc' | 'desc';
  priceMin?: number;
  priceMax?: number;
  areas?: string[];
}

export interface GetBoothsResponse {
  items: Booth[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
}

export interface MarketPageState {
  // 搜索相关
  searchKeyword: string;
  searchHistory: string[];
  
  // 筛选相关
  activeCategory: string;
  sortType: SortType;
  sortOrder: 'asc' | 'desc';
  priceRange: [number, number];
  areaFilter: string[];
  
  // 分页相关
  currentPage: number;
  hasNextPage: boolean;
  
  // UI状态
  isFiltersOpen: boolean;
  isSearching: boolean;
}

export interface MarketFilters {
  categories: string[];
  priceRange: [number, number];
  areas: string[];
  rating: number;
  isVerifiedOnly: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'booth' | 'category' | 'keyword';
  count?: number;
}