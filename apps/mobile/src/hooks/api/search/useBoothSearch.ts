/**
 * 档口搜索相关的React Query Hooks
 * 
 * 提供档口搜索的状态管理、缓存、错误处理等功能
 * 支持基础搜索和无限滚动搜索两种模式
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  searchBooths,
  BoothSearchParams,
  BoothSearchResponse,
} from "@/lib/api/search";

// Query Keys
export const BOOTH_SEARCH_QUERY_KEYS = {
  all: ["boothSearch"] as const,
  search: () => [...BOOTH_SEARCH_QUERY_KEYS.all, "search"] as const,
  searchQuery: (params: BoothSearchParams) =>
    [...BOOTH_SEARCH_QUERY_KEYS.search(), params] as const,
  infinite: (params: Omit<BoothSearchParams, "pageNum">) =>
    [...BOOTH_SEARCH_QUERY_KEYS.all, "infinite", params] as const,
};

// Cache times and performance settings
const CACHE_TIMES = {
  BOOTH_SEARCH: 2 * 60 * 1000, // 2分钟
};

const PERFORMANCE_CONFIG = {
  MAX_PAGES: 10, // 最多缓存10页数据，防止内存泄漏
  RETRY_COUNT: 2, // 重试次数
  RETRY_DELAY: 1000, // 重试延迟（毫秒）
  GC_TIME: 10 * 60 * 1000, // 10分钟后清理未使用的缓存
};

// useBoothSearch Hook - 基础档口搜索
interface UseBoothSearchOptions {
  enabled?: boolean;
  keepPreviousData?: boolean;
}

export function useBoothSearch(
  params: BoothSearchParams,
  options: UseBoothSearchOptions = {}
) {
  const { enabled = true, keepPreviousData = true } = options;

  return useQuery({
    queryKey: BOOTH_SEARCH_QUERY_KEYS.searchQuery(params),
    queryFn: async ({ signal }): Promise<BoothSearchResponse> => await searchBooths(params, signal),
    staleTime: CACHE_TIMES.BOOTH_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME,
    enabled: enabled && !!params.keyword?.trim(),
    keepPreviousData,
    retry: PERFORMANCE_CONFIG.RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error', 'isError', 'isLoading'],
  });
}

// useInfiniteBoothSearch Hook - 无限滚动档口搜索
export function useInfiniteBoothSearch(
  params: Omit<BoothSearchParams, "pageNum">,
  options: UseBoothSearchOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery({
    queryKey: BOOTH_SEARCH_QUERY_KEYS.infinite(params),
    queryFn: async ({ pageParam = 1, signal }): Promise<BoothSearchResponse> => {
      const searchParams = {
        ...params,
        pageNum: pageParam,
      };
      return await searchBooths(searchParams, signal);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      // 修复页面计算逻辑：API使用 1-based 的页码
      // pages.length 表示已加载的页数，下一页就是 pages.length + 1
      const currentPageNumber = pages.length; // 当前已加载页数
      const nextPageNumber = currentPageNumber + 1; // 下一页的页码
      const pageSize = lastPage.pageSize || 20;
      const totalPages = lastPage.totalPages || Math.ceil(lastPage.total / pageSize);
      
      console.log('🏪 [档口搜索调试] getNextPageParam 修复后:', {
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
        console.log('⚠️ [档口搜索调试] 达到最大页数限制');
        return undefined;
      }
      
      // 检查是否还有下一页
      const hasNextPage = nextPageNumber <= totalPages;
      console.log('🔄 [档口搜索调试] hasNextPage:', hasNextPage, 'nextPage:', hasNextPage ? nextPageNumber : undefined);
      
      return hasNextPage ? nextPageNumber : undefined;
    },
    // 性能优化配置
    staleTime: CACHE_TIMES.BOOTH_SEARCH,
    gcTime: PERFORMANCE_CONFIG.GC_TIME,
    enabled: enabled && !!params.keyword?.trim(),
    retry: PERFORMANCE_CONFIG.RETRY_COUNT,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    notifyOnChangeProps: ['data', 'error', 'isError', 'isLoading', 'isFetchingNextPage'],
  });
}