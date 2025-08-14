import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getBoothProductsManagement,
  onlineProduct,
  offlineProduct,
  deleteBoothProduct,
  batchOnlineProducts,
  batchOfflineProducts,
  batchUpdateProducts
} from "@/lib/api/booth";
import type { 
  ProductListItem,
  ProductActionResponse
} from "@/types/booth";
import type { PaginatedResponse } from "@/lib/api/config";

/**
 * 获取档口产品列表Hook（管理版）
 */
export function useBoothProductsManagement(
  boothId: string,
  params: {
    pageNum?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'all' | 'active' | 'inactive';
    sortBy?: 'created_time' | 'price' | 'views';
    sortOrder?: 'asc' | 'desc';
  } = {}
) {
  return useQuery<PaginatedResponse<ProductListItem>, Error>({
    queryKey: ["booth-products-management", boothId, params],
    queryFn: async () => await getBoothProductsManagement(boothId, params),
    staleTime: 2 * 60 * 1000, // 2分钟缓存
    gcTime: 5 * 60 * 1000, // 5分钟垃圾回收
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!boothId, // 只有在有boothId时才启用查询
  });
}

/**
 * 切换产品状态Hook（使用新的上下架接口）
 */
export function useToggleProductStatus() {
  const queryClient = useQueryClient();

  return useMutation<ProductActionResponse, Error, { boothId: string; productId: string; status: string }>({
    mutationFn: async ({ boothId, productId, status }) => {
      if (status === "1") {
        return await offlineProduct(boothId, productId);
      } else {
        return await onlineProduct(boothId, productId);
      }
    },
    onSuccess: (data) => {
      console.log("产品状态切换成功:", data);
      // 刷新产品列表缓存
      queryClient.invalidateQueries({ queryKey: ["booth-products-management"] });
    },
    onError: (error) => {
      console.error("产品状态切换失败:", error);
    },
  });
}

/**
 * 删除产品Hook
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<ProductActionResponse, Error, string>({
    mutationFn: async (productId: string) => {
      return await deleteBoothProduct(productId);
    },
    onSuccess: (data) => {
      console.log("产品删除成功:", data);
      // 刷新产品列表缓存
      queryClient.invalidateQueries({ queryKey: ["booth-products-management"] });
    },
    onError: (error) => {
      console.error("产品删除失败:", error);
    },
  });
}

/**
 * 批量操作产品Hook（使用新的上下架接口）
 */
export function useBatchUpdateProducts() {
  const queryClient = useQueryClient();

  return useMutation<ProductActionResponse, Error, { boothId: string; productIds: string[]; action: 'activate' | 'deactivate' | 'delete' }>({
    mutationFn: async ({ boothId, productIds, action }) => {
      switch (action) {
        case 'activate':
          return await batchOnlineProducts(boothId, productIds);
        case 'deactivate':
          return await batchOfflineProducts(boothId, productIds);
        case 'delete':
          return await batchUpdateProducts(productIds, action);
        default:
          throw new Error('不支持的操作类型');
      }
    },
    onSuccess: (data) => {
      console.log("批量操作成功:", data);
      // 刷新产品列表缓存
      queryClient.invalidateQueries({ queryKey: ["booth-products-management"] });
    },
    onError: (error) => {
      console.error("批量操作失败:", error);
    },
  });
}
