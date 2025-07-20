import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFootprints,
  clearFootprints,
  removeFootprint,
  type Footprint,
} from '@/lib/api/favorites';

// Query Keys
export const FOOTPRINTS_QUERY_KEYS = {
  all: ['footprints'] as const,
  lists: () => [...FOOTPRINTS_QUERY_KEYS.all, 'list'] as const,
  list: (type?: 'product' | 'booth', page?: number) => 
    [...FOOTPRINTS_QUERY_KEYS.lists(), { type, page }] as const,
};

// Cache times
const CACHE_TIMES = {
  FOOTPRINTS: 2 * 60 * 1000, // 2分钟
};

// useFootprints Hook
interface UseFootprintsOptions {
  type?: 'product' | 'booth';
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useFootprints(options: UseFootprintsOptions = {}) {
  const { type, page = 1, pageSize = 20, enabled = true } = options;

  return useQuery({
    queryKey: FOOTPRINTS_QUERY_KEYS.list(type, page),
    queryFn: async () => await getFootprints(type, page, pageSize),
    staleTime: CACHE_TIMES.FOOTPRINTS,
    enabled,
  });
}

// useRemoveFootprint Hook
interface UseRemoveFootprintOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRemoveFootprint(options: UseRemoveFootprintOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (footprintId: string) => await removeFootprint(footprintId),
    onSuccess: (_, footprintId) => {
      // 从所有足迹查询中移除该项
      queryClient.setQueryData(
        FOOTPRINTS_QUERY_KEYS.lists(),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            rows: oldData.rows.filter((item: Footprint) => item.id !== footprintId),
            total: oldData.total - 1,
          };
        }
      );
      
      // 使相关查询失效
      queryClient.invalidateQueries({ queryKey: FOOTPRINTS_QUERY_KEYS.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('删除足迹失败:', error);
      onError?.(error);
    },
  });
}

// useClearFootprints Hook
interface UseClearFootprintsOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useClearFootprints(options: UseClearFootprintsOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (type?: 'product' | 'booth') => await clearFootprints(type),
    onSuccess: (_, type) => {
      // 清空相关查询缓存
      if (type) {
        // 清空特定类型
        queryClient.setQueryData(
          FOOTPRINTS_QUERY_KEYS.list(type),
          () => ({
            rows: [],
            total: 0,
            page: 1,
            pageSize: 20,
            totalPages: 0,
          })
        );
      } else {
        // 清空所有类型
        queryClient.removeQueries({ queryKey: FOOTPRINTS_QUERY_KEYS.all });
      }
      
      queryClient.invalidateQueries({ queryKey: FOOTPRINTS_QUERY_KEYS.all });
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('清空足迹失败:', error);
      onError?.(error);
    },
  });
}