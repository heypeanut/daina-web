import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteBooths,
  followBooth,
  unfollowBooth,
  isBoothFollowed,
  type FavoriteBooth,
} from '@/lib/api/user-behavior';
import { isLoggedIn } from '@/lib/auth';

// Query Keys
export const FAVORITE_BOOTHS_QUERY_KEYS = {
  all: ['favorite-booths'] as const,
  lists: () => [...FAVORITE_BOOTHS_QUERY_KEYS.all, 'list'] as const,
  list: (page?: number) => [...FAVORITE_BOOTHS_QUERY_KEYS.lists(), { page }] as const,
  checks: () => [...FAVORITE_BOOTHS_QUERY_KEYS.all, 'check'] as const,
  check: (boothId: string) => [...FAVORITE_BOOTHS_QUERY_KEYS.checks(), boothId] as const,
};

// Cache times
const CACHE_TIMES = {
  FAVORITE_BOOTHS: 5 * 60 * 1000, // 5分钟
  FOLLOW_CHECK: 10 * 60 * 1000, // 10分钟
};

// useFavoriteBooths Hook
interface UseFavoriteBoothsOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useFavoriteBooths(options: UseFavoriteBoothsOptions = {}) {
  const { page = 1, pageSize = 20, enabled = true } = options;

  return useQuery({
    queryKey: FAVORITE_BOOTHS_QUERY_KEYS.list(page),
    queryFn: async () => await getFavoriteBooths(page, pageSize),
    staleTime: CACHE_TIMES.FAVORITE_BOOTHS,
    enabled,
  });
}

// useBoothFollowStatus Hook
interface UseBoothFollowStatusOptions {
  enabled?: boolean;
}

export function useBoothFollowStatus(
  boothId: string,
  options: UseBoothFollowStatusOptions = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: FAVORITE_BOOTHS_QUERY_KEYS.check(boothId),
    queryFn: async () => await isBoothFollowed(boothId),
    staleTime: CACHE_TIMES.FOLLOW_CHECK,
    enabled: enabled && !!boothId && isLoggedIn(),
  });
}

// useFollowBooth Hook
interface UseFollowBoothOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useFollowBooth(options: UseFollowBoothOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (boothId: string) => await followBooth(boothId),
    onSuccess: (_, boothId) => {
      // 更新关注状态
      queryClient.setQueryData(
        FAVORITE_BOOTHS_QUERY_KEYS.check(boothId),
        true
      );
      
      // 使关注列表查询失效，触发重新获取
      queryClient.invalidateQueries({ 
        queryKey: FAVORITE_BOOTHS_QUERY_KEYS.lists() 
      });
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('关注档口失败:', error);
      onError?.(error);
    },
  });
}

// useUnfollowBooth Hook
interface UseUnfollowBoothOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUnfollowBooth(options: UseUnfollowBoothOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (boothId: string) => await unfollowBooth(boothId),
    onSuccess: (_, boothId) => {
      // 更新关注状态
      queryClient.setQueryData(
        FAVORITE_BOOTHS_QUERY_KEYS.check(boothId),
        false
      );
      
      // 从关注列表中移除该档口
      queryClient.setQueryData(
        FAVORITE_BOOTHS_QUERY_KEYS.lists(),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.filter(
              (item: FavoriteBooth) => item.boothId !== boothId
            ),
            total: oldData.total - 1,
          };
        }
      );
      
      // 使相关查询失效
      queryClient.invalidateQueries({ 
        queryKey: FAVORITE_BOOTHS_QUERY_KEYS.lists() 
      });
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('取消关注失败:', error);
      onError?.(error);
    },
  });
}