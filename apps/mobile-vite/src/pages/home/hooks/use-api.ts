import { useQuery } from "@tanstack/react-query";
import { apiClient, type PaginatedResponse } from "@/lib/api";
import { useInfiniteData } from "@/hooks/api/useInfiniteData";
import type { Booth } from "@/types/api";

export function useBanners(limit: number) {
  const data = useQuery({
    queryKey: ["banners", limit],
    queryFn: () => apiClient.getBanners(limit),
    select: (data) => data.data,
  });
  return data;
}

export function useBoothRanking(limit: number) {
  const data = useQuery({
    queryKey: ["booth-ranking", limit],
    queryFn: () => apiClient.getBoothRanking({ limit }),
    select: (data) => data.data,
  });
  return data;
}

export function useGetNewBooth(type: "booth_hot" | "booth_new", limit: number) {
  const data = useQuery({
    queryKey: ["new-booth", type, limit],
    queryFn: () => apiClient.getBoothRecommendations({ type, limit }),
    select: (data) => data.data,
  });
  return data;
}

export function useGetLatestBoothsWithNewProducts(pageSize: number) {
  const data = useQuery({
    queryKey: ["latest-booth-with-new-products", pageSize],
    queryFn: () => apiClient.getLatestBoothsWithNewProducts({ pageSize }),
    select: (data) => data.data,
  });
  return data;
}

export function useInfiniteLatestBoothsWithNewProducts(pageSize: number = 12) {
  return useInfiniteData<Booth, { pageNum: number; pageSize: number }>({
    queryKey: ["infinite-latest-booth-with-new-products", pageSize],
    queryFn: async ({ pageNum, pageSize }) => {
      const response = await apiClient.getLatestBoothsWithNewProducts({
        pageNum,
        pageSize,
      });
      // 检查响应数据类型并标准化为分页格式
      const data = response.data;
      const paginatedData: PaginatedResponse<Booth> = Array.isArray(data)
        ? {
            rows: data,
            total: data.length,
            pageNum,
            pageSize,
            hasMore: false,
          }
        : data;

      return {
        ...response,
        data: paginatedData,
      };
    },
    baseParams: { pageSize },
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

export function useTrackBoothView() {
  return {
    mutate: (boothId: string) => {
      console.log("Tracking booth view:", boothId);
      // TODO: 实现埋点逻辑
    },
  };
}
