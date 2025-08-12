import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useBanners(limit: number) {
  const data = useQuery({
    queryKey: ['banners', limit],
    queryFn: () => apiClient.getBanners(limit),
    select: (data) => data.data
  });
  return data
}

export function useBoothRanking(limit: number) {
  const data = useQuery({
    queryKey: ['booth-ranking', limit],
    queryFn: () => apiClient.getBoothRanking({ limit }),
    select: (data) => data.data
  });
  return data
}

export function useGetNewBooth(type: "booth_hot" | "booth_new", limit: number) {
  const data = useQuery({
    queryKey: ['new-booth', type, limit],
    queryFn: () => apiClient.getBoothRecommendations({ type, limit }),
    select: (data) => data.data
  });
  return data
}

export function useGetLatestBoothsWithNewProducts(pageSize: number) {
  const data = useQuery({
    queryKey: ['latest-booth-with-new-products', pageSize],
    queryFn: () => apiClient.getLatestBoothsWithNewProducts({ pageSize }),
    select: (data) => data.data
  });
  return data
}

export function useInfiniteLatestBoothsWithNewProducts(pageSize: number = 12) {
  return useInfiniteQuery({
    queryKey: ['infinite-latest-booth-with-new-products', pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await apiClient.getLatestBoothsWithNewProducts({ 
        pageNum: pageParam,
        pageSize 
      });
      return response.data;
    },
    getNextPageParam: (lastPage: any, allPages) => {
      // 检查是否有更多数据
      if (!lastPage || !lastPage.rows || lastPage.rows.length === 0) {
        return undefined;
      }
      
      // 如果当前页数据少于请求的pageSize，说明已经是最后一页
      if (lastPage.rows.length < pageSize) {
        return undefined;
      }
      
      // 如果有total字段，检查是否已加载完所有数据
      if (lastPage.total !== undefined) {
        const loadedCount = allPages.reduce((count, page) => count + (page.rows?.length || 0), 0);
        if (loadedCount >= lastPage.total) {
          return undefined;
        }
      }
      
      // 返回下一页页码
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

export function useTrackBoothView() {
  return {
    mutate: (boothId: string) => {
      console.log('Tracking booth view:', boothId);
      // TODO: 实现埋点逻辑
    }
  };
}
