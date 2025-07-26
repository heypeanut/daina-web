import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  getBooths,
  searchBooths,
  getHotBooths,
  trackBoothView,
} from "@/lib/api/booth";
import { GetBoothsParams } from "@/app/market/types/market";

// Query Keys
export const BOOTHS_QUERY_KEYS = {
  all: ["booths"] as const,
  lists: () => [...BOOTHS_QUERY_KEYS.all, "list"] as const,
  list: (params: Partial<GetBoothsParams>) =>
    [...BOOTHS_QUERY_KEYS.lists(), params] as const,
  infinite: (params: Omit<GetBoothsParams, "pageNum">) =>
    [...BOOTHS_QUERY_KEYS.all, "infinite", params] as const,
  search: () => [...BOOTHS_QUERY_KEYS.all, "search"] as const,
  searchQuery: (keyword: string) =>
    [...BOOTHS_QUERY_KEYS.search(), keyword] as const,
  hot: () => [...BOOTHS_QUERY_KEYS.all, "hot"] as const,
};

// Cache times
const CACHE_TIMES = {
  BOOTH_LIST: 2 * 60 * 1000, // 2分钟
  BOOTH_SEARCH: 5 * 60 * 1000, // 5分钟
  HOT_BOOTHS: 10 * 60 * 1000, // 10分钟
};

// useBooths Hook - 基础档口列表
interface UseBoothsOptions {
  enabled?: boolean;
}

export function useBooths(
  params: GetBoothsParams,
  options: UseBoothsOptions = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: BOOTHS_QUERY_KEYS.list(params),
    queryFn: async () => await getBooths(params),
    staleTime: CACHE_TIMES.BOOTH_LIST,
    enabled,
  });
}

// useInfiniteBooths Hook - 无限滚动档口列表
interface UseInfiniteBoothsOptions {
  enabled?: boolean;
}

export function useInfiniteBooths(
  params: Omit<GetBoothsParams, "pageNum">,
  options: UseInfiniteBoothsOptions = {}
) {
  const { enabled = true } = options;

  return useInfiniteQuery({
    queryKey: BOOTHS_QUERY_KEYS.infinite(params),
    queryFn: async ({ pageParam = 1 }) => {
      return await getBooths({ ...params, pageNum: pageParam });
    },
    getNextPageParam: (lastPage, allPages) => {
      // 直接使用 API 返回的 hasNext 和页面数量
      if (lastPage.hasNext === false) {
        return undefined;
      }

      // 如果没有数据了，也停止分页
      if (!lastPage.rows || lastPage.rows.length === 0) {
        return undefined;
      }

      // 下一页是当前已加载页数 + 1
      const nextPage = allPages.length + 1;
      return nextPage;
    },
    initialPageParam: 1,
    staleTime: CACHE_TIMES.BOOTH_LIST,
    enabled,
  });
}

// useSearchBooths Hook - 搜索档口
interface UseSearchBoothsOptions {
  enabled?: boolean;
}

export function useSearchBooths(
  keyword: string,
  options: UseSearchBoothsOptions = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: BOOTHS_QUERY_KEYS.searchQuery(keyword),
    queryFn: async () => await searchBooths(keyword),
    staleTime: CACHE_TIMES.BOOTH_SEARCH,
    enabled: enabled && keyword.length > 0,
  });
}

// useHotBooths Hook - 热门档口
interface UseHotBoothsOptions {
  limit?: number;
  enabled?: boolean;
}

export function useHotBooths(options: UseHotBoothsOptions = {}) {
  const { limit = 10, enabled = true } = options;

  return useQuery({
    queryKey: [...BOOTHS_QUERY_KEYS.hot(), limit],
    queryFn: async () => await getHotBooths(limit),
    staleTime: CACHE_TIMES.HOT_BOOTHS,
    enabled,
  });
}

// useTrackBoothView Hook - 档口浏览埋点
interface UseTrackBoothViewOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useTrackBoothView(options: UseTrackBoothViewOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (boothId: string) => await trackBoothView(boothId),
    onSuccess,
    onError,
  });
}
