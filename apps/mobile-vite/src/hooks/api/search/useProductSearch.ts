/**
 * 商品搜索相关的React Query Hooks
 *
 * 提供商品搜索的状态管理、缓存、错误处理等功能
 * 支持基础搜索和无限滚动搜索两种模式
 *
 * @author Claude Code
 * @version 1.0.0
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/search";
import type { Product } from "@/types/api";

// 类型定义
export interface ProductSearchParams {
  keyword: string;
  pageNum?: number;
  pageSize?: number;
  boothId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "relevance" | "price" | "sales" | "latest";
}

export interface ProductSearchResponse {
  rows: Product[];
  total: number;
  pageNum?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
  searchTime?: number;
  suggestions?: string[];
}

// Query Keys
export const PRODUCT_SEARCH_QUERY_KEYS = {
  all: ["productSearch"] as const,
  search: () => [...PRODUCT_SEARCH_QUERY_KEYS.all, "search"] as const,
  searchQuery: (params: ProductSearchParams) =>
    [
      ...PRODUCT_SEARCH_QUERY_KEYS.search(),
      params.keyword,
      params.pageNum,
      params.pageSize,
      params.boothId,
      params.categoryId,
      params.minPrice,
      params.maxPrice,
      params.sortBy,
    ] as const,
  infinite: (params: Omit<ProductSearchParams, "pageNum">) =>
    [
      ...PRODUCT_SEARCH_QUERY_KEYS.all,
      "infinite",
      params.keyword,
      params.pageSize,
      params.boothId,
      params.categoryId,
      params.minPrice,
      params.maxPrice,
      params.sortBy,
    ] as const,
};

// Cache times and performance settings
const CACHE_TIMES = {
  PRODUCT_SEARCH: 2 * 60 * 1000, // 2分钟
};

const PERFORMANCE_CONFIG = {
  MAX_PAGES: 10, // 最多缓存10页数据，防止内存泄漏
  RETRY_COUNT: 0, // 禁用重试避免重复请求
  RETRY_DELAY: 1000, // 重试延迟（毫秒）
  GC_TIME: 10 * 60 * 1000, // 10分钟后清理未使用的缓存
};

// useProductSearch Hook - 基础商品搜索
interface UseProductSearchOptions {
  enabled?: boolean;
  keepPreviousData?: boolean;
}

export function useProductSearch(
  params: ProductSearchParams,
  options: UseProductSearchOptions = {}
) {
  const { enabled = true, keepPreviousData = true } = options;

  return useQuery({
    queryKey: PRODUCT_SEARCH_QUERY_KEYS.searchQuery(params),
    queryFn: async ({ signal }): Promise<ProductSearchResponse> =>
      await searchProducts(params, signal),
    // 性能优化配置
    staleTime: CACHE_TIMES.PRODUCT_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME,
    enabled: enabled && !!params.keyword?.trim(),
    placeholderData: keepPreviousData
      ? (previousData) => previousData
      : undefined,
    retry: PERFORMANCE_CONFIG.RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    // 减少不必要的重新渲染
    notifyOnChangeProps: ["data", "error", "isError", "isLoading"],
  });
}

// useInfiniteProductSearch Hook - 无限滚动商品搜索
export function useInfiniteProductSearch(
  params: Omit<ProductSearchParams, "pageNum">,
  options: UseProductSearchOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery({
    queryKey: PRODUCT_SEARCH_QUERY_KEYS.infinite(params),
    queryFn: async ({
      pageParam = 1,
      signal,
    }): Promise<ProductSearchResponse> => {
      const searchParams = {
        ...params,
        pageNum: pageParam,
      };
      return await searchProducts(searchParams, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // 修复页面计算逻辑：API使用 1-based 的页码
      // pages.length 表示已加载的页数，下一页就是 pages.length + 1
      const currentPageNumber = pages.length; // 当前已加载页数
      const nextPageNumber = currentPageNumber + 1; // 下一页的页码
      const pageSize = lastPage.pageSize || 20;
      const totalPages =
        lastPage.totalPages || Math.ceil(lastPage.total / pageSize);

      // 限制最大页数，防止内存泄漏
      if (pages.length >= PERFORMANCE_CONFIG.MAX_PAGES) {
        return undefined;
      }

      // 检查是否还有下一页
      const hasNextPage = nextPageNumber <= totalPages;

      return hasNextPage ? nextPageNumber : undefined;
    },
    // 性能优化配置
    staleTime: CACHE_TIMES.PRODUCT_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME,
    enabled: enabled && !!params.keyword?.trim(),
    retry: false, // 完全禁用重试
    retryDelay: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false, // 禁用重连时重新请求
    refetchInterval: false, // 禁用定时重新请求
    refetchIntervalInBackground: false,
    // 防止重复请求的关键配置
    networkMode: "online", // 只在在线时请求
    // 减少不必要的重新渲染
    notifyOnChangeProps: [
      "data",
      "error",
      "isError",
      "isLoading",
      "isFetchingNextPage",
    ],
  });
}
