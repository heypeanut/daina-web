import { useQuery } from "@tanstack/react-query";
import { useInfiniteData } from "@/hooks/api/useInfiniteData";
import { getBooths, getBoothCategories, searchBooths } from "@/lib/api/booth";
import type { Booth } from "@/types/api";
import type { GetBoothsParams, PaginatedResponse } from "@/types/booth-api";

// 获取档口分类
export function useBoothCategories() {
  return useQuery({
    queryKey: ['booth-categories'],
    queryFn: () => getBoothCategories(),
    staleTime: 5 * 60 * 1000, // 5分钟
  });
}

// 无限滚动获取档口列表
export function useInfiniteBooths(params: Omit<GetBoothsParams, 'pageNum'>) {
  return useInfiniteData<Booth, GetBoothsParams>({
    queryKey: ['infinite-booths', JSON.stringify(params)],
    queryFn: async ({ pageNum, pageSize, keyword, categoryId, sortBy, location }) => {
      // getBooths API期望size字段，需要转换参数
      const apiParams: any = { 
        pageNum, 
        size: pageSize, 
        keyword, 
        categoryId, 
        sortBy, 
        location 
      };
      const response = await getBooths(apiParams);
      
      // 标准化返回数据格式，确保与useInfiniteData期望的格式一致
      // 当API返回的分页字段为undefined时，需要手动计算
      const totalRecords = response.total || 0;
      const calculatedHasNext = response.hasNext !== undefined 
        ? response.hasNext 
        : (pageNum * pageSize < totalRecords);

      const paginatedData: PaginatedResponse<Booth> = {
        rows: response.rows,
        total: response.total,
        page: response.page || pageNum,
        size: response.size || pageSize,
        hasNext: calculatedHasNext
      };

      return {
        code: 200,
        data: paginatedData
      };
    },
    baseParams: params,
    staleTime: 2 * 60 * 1000, // 2分钟
  });
}

// 搜索档口（使用专门的搜索接口）
export function useSearchBooths(keyword: string, pageSize: number = 20) {
  return useQuery({
    queryKey: ['search-booths', keyword, pageSize],
    queryFn: () => searchBooths(keyword, 1, pageSize),
    enabled: keyword.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1分钟
  });
}

// 无限滚动搜索档口
export function useInfiniteSearchBooths(keyword: string, pageSize: number = 20) {
  return useInfiniteData<Booth, { pageNum: number; pageSize: number; keyword: string }>({
    queryKey: ['infinite-search-booths', keyword, pageSize],
    queryFn: async ({ pageNum, pageSize, keyword }) => {
      const response = await searchBooths(keyword, pageNum, pageSize);
      return { data: response };
    },
    baseParams: { pageSize, keyword },
    enabled: keyword.trim().length > 0,
    staleTime: 1 * 60 * 1000, // 1分钟
  });
}
