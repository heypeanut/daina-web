import { useQuery } from '@tanstack/react-query';
import { getDictData } from '@/lib/api/dictionary';
import { DictType, DictItem } from '@/types/dictionary';

// ==================== 稳定的常量定义 ====================

// 完全静态的查询键
const PRODUCT_STATUS_QUERY_KEY = ['dictionary', 'product_status'] as const;
const MARKET_QUERY_KEY = ['dictionary', 'market'] as const;

// 稳定的排序函数（模块级别，不会重新创建）
const sortDictItemsStable = (data: DictItem[]): DictItem[] => {
  if (!Array.isArray(data)) {
    return [];
  }
  return [...data].sort((a, b) => (a.sort || 0) - (b.sort || 0));
};

// ==================== 核心Hook实现 ====================

/**
 * 获取商品状态字典的hook
 * 使用稳定的queryKey和select函数，确保状态稳定性
 */
export function useProductStatusDict() {
  return useQuery({
    queryKey: PRODUCT_STATUS_QUERY_KEY,
    queryFn: async () => {
      const response = await getDictData(DictType.PRODUCT_STATUS);
      return response;
    },
    staleTime: 0, // 始终认为数据已过期，每次都会发起请求
    gcTime: 30 * 60 * 1000, // 30分钟
    retry: 2,
    select: sortDictItemsStable, // 稳定的函数引用
    refetchOnWindowFocus: false, // 避免不必要的重新获取
    refetchOnReconnect: true,
  });
}

/**
 * 获取市场字典的hook
 */
export function useMarketDict() {
  return useQuery({
    queryKey: MARKET_QUERY_KEY,
    queryFn: async () => {
      const response = await getDictData(DictType.MARKET);
      return response || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
    select: sortDictItemsStable,
    refetchOnWindowFocus: false,
  });
}

// ==================== 辅助函数 ====================

/**
 * 预加载商品状态字典
 */
export async function prefetchProductStatusDict(queryClient: any) {
  await queryClient.prefetchQuery({
    queryKey: PRODUCT_STATUS_QUERY_KEY,
    queryFn: async () => {
      const response = await getDictData(DictType.PRODUCT_STATUS);
      return response;
    },
    staleTime: 0,
  });
}

/**
 * 使商品状态字典缓存失效
 */
export function invalidateProductStatusDict(queryClient: any) {
  queryClient.invalidateQueries({
    queryKey: PRODUCT_STATUS_QUERY_KEY,
  });
}