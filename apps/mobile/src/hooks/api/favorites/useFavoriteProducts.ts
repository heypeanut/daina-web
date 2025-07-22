import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFavoriteProducts,
  addProductToFavorites,
  removeProductFromFavorites,
  isProductFavorited,
  type FavoriteProduct,
} from '@/lib/api/user-behavior';

// Query Keys
export const FAVORITE_PRODUCTS_QUERY_KEYS = {
  all: ['favorite-products'] as const,
  lists: () => [...FAVORITE_PRODUCTS_QUERY_KEYS.all, 'list'] as const,
  list: (page?: number) => [...FAVORITE_PRODUCTS_QUERY_KEYS.lists(), { page }] as const,
  checks: () => [...FAVORITE_PRODUCTS_QUERY_KEYS.all, 'check'] as const,
  check: (productId: string) => [...FAVORITE_PRODUCTS_QUERY_KEYS.checks(), productId] as const,
};

// Cache times
const CACHE_TIMES = {
  FAVORITE_PRODUCTS: 5 * 60 * 1000, // 5分钟
  FAVORITE_CHECK: 10 * 60 * 1000, // 10分钟
};

// useFavoriteProducts Hook
interface UseFavoriteProductsOptions {
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useFavoriteProducts(options: UseFavoriteProductsOptions = {}) {
  const { page = 1, pageSize = 20, enabled = true } = options;

  return useQuery({
    queryKey: FAVORITE_PRODUCTS_QUERY_KEYS.list(page),
    queryFn: async () => await getFavoriteProducts(page, pageSize),
    staleTime: CACHE_TIMES.FAVORITE_PRODUCTS,
    enabled,
  });
}

// useProductFavoriteStatus Hook
interface UseProductFavoriteStatusOptions {
  enabled?: boolean;
}

export function useProductFavoriteStatus(
  productId: string,
  options: UseProductFavoriteStatusOptions = {}
) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: FAVORITE_PRODUCTS_QUERY_KEYS.check(productId),
    queryFn: async () => await isProductFavorited(productId),
    staleTime: CACHE_TIMES.FAVORITE_CHECK,
    enabled: enabled && !!productId,
  });
}

// useAddProductToFavorites Hook
interface UseAddProductToFavoritesOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useAddProductToFavorites(options: UseAddProductToFavoritesOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (productId: string) => await addProductToFavorites(productId),
    onSuccess: (_, productId) => {
      // 更新收藏状态
      queryClient.setQueryData(
        FAVORITE_PRODUCTS_QUERY_KEYS.check(productId),
        true
      );
      
      // 使收藏列表查询失效，触发重新获取
      queryClient.invalidateQueries({ 
        queryKey: FAVORITE_PRODUCTS_QUERY_KEYS.lists() 
      });
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('添加收藏失败:', error);
      onError?.(error);
    },
  });
}

// useRemoveProductFromFavorites Hook
interface UseRemoveProductFromFavoritesOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useRemoveProductFromFavorites(options: UseRemoveProductFromFavoritesOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options;

  return useMutation({
    mutationFn: async (productId: string) => await removeProductFromFavorites(productId),
    onSuccess: (_, productId) => {
      // 更新收藏状态
      queryClient.setQueryData(
        FAVORITE_PRODUCTS_QUERY_KEYS.check(productId),
        false
      );
      
      // 从收藏列表中移除该商品
      queryClient.setQueryData(
        FAVORITE_PRODUCTS_QUERY_KEYS.lists(),
        (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.filter(
              (item: FavoriteProduct) => item.productId !== productId
            ),
            total: oldData.total - 1,
          };
        }
      );
      
      // 使相关查询失效
      queryClient.invalidateQueries({ 
        queryKey: FAVORITE_PRODUCTS_QUERY_KEYS.lists() 
      });
      
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error('取消收藏失败:', error);
      onError?.(error);
    },
  });
}