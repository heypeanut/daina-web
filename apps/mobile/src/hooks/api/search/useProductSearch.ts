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
import {
  searchProducts,
  ProductSearchParams,
  ProductSearchResponse,
} from "@/lib/api/search";

// Query Keys
export const PRODUCT_SEARCH_QUERY_KEYS = {
  all: ["productSearch"] as const,
  search: () => [...PRODUCT_SEARCH_QUERY_KEYS.all, "search"] as const,
  searchQuery: (params: ProductSearchParams) =>
    [...PRODUCT_SEARCH_QUERY_KEYS.search(), params] as const,
  infinite: (params: Omit<ProductSearchParams, "pageNum">) =>
    [...PRODUCT_SEARCH_QUERY_KEYS.all, "infinite", params] as const,
};

// Cache times and performance settings
const CACHE_TIMES = {
  PRODUCT_SEARCH: 2 * 60 * 1000, // 2分钟
};

const PERFORMANCE_CONFIG = {
  MAX_PAGES: 10, // 最多缓存10页数据，防止内存泄漏
  RETRY_COUNT: 2, // 重试次数
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
    queryFn: async ({ signal }): Promise<ProductSearchResponse> => await searchProducts(params, signal),
    // 性能优化配置
    staleTime: CACHE_TIMES.PRODUCT_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME,
    enabled: enabled && !!params.keyword?.trim(),
    keepPreviousData,
    retry: PERFORMANCE_CONFIG.RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    // 减少不必要的重新渲染
    notifyOnChangeProps: ['data', 'error', 'isError', 'isLoading'],
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
    queryFn: async ({ pageParam = 1, signal }): Promise<ProductSearchResponse> => {
      const searchParams = {
        ...params,
        pageNum: pageParam,
      };
      return await searchProducts(searchParams, signal);
    },
    getNextPageParam: (lastPage, pages) => {
      // 修复页面计算逻辑：API使用 1-based 的页码
      // pages.length 表示已加载的页数，下一页就是 pages.length + 1
      const currentPageNumber = pages.length; // 当前已加载页数
      const nextPageNumber = currentPageNumber + 1; // 下一页的页码
      const pageSize = lastPage.pageSize || 20;
      const totalPages = lastPage.totalPages || Math.ceil(lastPage.total / pageSize);
      
      console.log('📊 [产品搜索调试] getNextPageParam 修复后:', {
        currentPageNumber, // 当前已加载页数
        nextPageNumber,    // 下一页页码
        totalPages,
        total: lastPage.total,
        pageSize,
        pagesLength: pages.length,
        maxPages: PERFORMANCE_CONFIG.MAX_PAGES,
        lastPageData: {
          rowsCount: lastPage.rows?.length || 0,
          apiPage: lastPage.page, // API返回的页码
          apiTotalPages: lastPage.totalPages
        }
      });
      
      // 限制最大页数，防止内存泄漏
      if (pages.length >= PERFORMANCE_CONFIG.MAX_PAGES) {
        console.log('⚠️ [产品搜索调试] 达到最大页数限制');
        return undefined;
      }
      
      // 检查是否还有下一页
      const hasNextPage = nextPageNumber <= totalPages;
      console.log('🔄 [产品搜索调试] hasNextPage:', hasNextPage, 'nextPage:', hasNextPage ? nextPageNumber : undefined);
      
      return hasNextPage ? nextPageNumber : undefined;
    },
    // 性能优化配置
    staleTime: CACHE_TIMES.PRODUCT_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME, // 替代 cacheTime
    enabled: enabled && !!params.keyword?.trim(),
    retry: PERFORMANCE_CONFIG.RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // 网络空闲时重新获取数据
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // 减少不必要的重新渲染
    notifyOnChangeProps: ['data', 'error', 'isError', 'isLoading'],
  });
}