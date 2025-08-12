import { useQuery } from "@tanstack/react-query";
import { getBoothDetail, getBoothProducts } from "@/lib/api/booth";
import { useInfiniteData } from "@/hooks/api/useInfiniteData";
import type { BoothProduct } from "@/types/booth";

export function useGetDetail(boothId: string) {
  const data = useQuery({
    queryKey: ['booth-detail', boothId],
    queryFn: () => getBoothDetail(boothId),
    select: (data) => data
  });
  return data
}

export function useGetProducts(boothId: string, pageNum: number, pageSize: number) {
  const data = useQuery({
    queryKey: ['booth-products', boothId],
    queryFn: () => getBoothProducts(boothId, { pageNum, pageSize }),
    select: (data) => data
  });
  return data
}

/**
 * 无限滚动加载档口商品
 */
export function useInfiniteProducts(boothId: string, pageSize: number = 12) {
  return useInfiniteData<BoothProduct, { boothId: string; pageNum: number; pageSize: number }>({
    queryKey: ['infinite-booth-products', boothId, pageSize],
    queryFn: async ({ boothId, pageNum, pageSize }) => {
      const response = await getBoothProducts(boothId, { pageNum, pageSize });
      return {
        data: response,
        code: 200,
        message: 'success'
      };
    },
    baseParams: { boothId, pageSize },
    enabled: !!boothId,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}
