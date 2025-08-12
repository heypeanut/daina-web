import { useInfiniteQuery } from "@tanstack/react-query";

// 通用的分页响应类型
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
  hasNext?: boolean;
}

// 通用的分页请求参数
export interface PaginatedParams {
  pageNum: number;
  pageSize: number;
  [key: string]: any;
}

// API 响应格式
export interface ApiResponse<T> {
  data: T;
  code?: number;
  message?: string;
}

// 无限滚动hook的选项
export interface UseInfiniteDataOptions<TData, TParams extends PaginatedParams> {
  queryKey: (string | number)[];
  queryFn: (params: TParams) => Promise<ApiResponse<PaginatedResponse<TData>>>;
  baseParams: Omit<TParams, 'pageNum'>;
  enabled?: boolean;
  staleTime?: number;
  onError?: (error: Error) => void;
}

/**
 * 通用的无限滚动数据hook
 * @param options 配置选项
 * @returns react-query无限查询结果 + 处理后的数据
 */
export function useInfiniteData<TData, TParams extends PaginatedParams>({
  queryKey,
  queryFn,
  baseParams,
  enabled = true,
  staleTime = 2 * 60 * 1000, // 2分钟
  onError,
}: UseInfiniteDataOptions<TData, TParams>) {
  const infiniteQuery = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await queryFn({
          ...baseParams,
          pageNum: pageParam,
        } as TParams);
        return response.data;
      } catch (error) {
        onError?.(error as Error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // 1. 检查是否有明确的hasNext字段
      if (lastPage.hasNext === false) {
        return undefined;
      }
      
      // 2. 检查当前页是否有数据
      if (!lastPage.rows || lastPage.rows.length === 0) {
        return undefined;
      }
      
      // 3. 优先使用hasNext字段判断，而不是基于pageSize
      if (lastPage.hasNext === true) {
        return allPages.length + 1;
      }
      
      // 4. 如果hasNext未定义，则使用传统逻辑
      // 如果当前页数据少于请求的pageSize，说明已经是最后一页
      const pageSize = (baseParams as any).pageSize;
      if (pageSize && lastPage.rows.length < pageSize) {
        return undefined;
      }
      
      // 5. 如果有total字段，检查是否已加载完所有数据
      if (lastPage.total !== undefined) {
        const loadedCount = allPages.reduce((count, page) => count + (page.rows?.length || 0), 0);
        if (loadedCount >= lastPage.total) {
          return undefined;
        }
      }
      
      // 6. 返回下一页页码
      return allPages.length + 1;
    },
    initialPageParam: 1,
    staleTime,
    enabled,
  });

  // 合并所有页面的数据
  const allData = infiniteQuery.data?.pages?.flatMap(page => page.rows || []) || [];
  
  // 获取总数（取最后一页的total，因为它是最新的）
  const total = infiniteQuery.data?.pages?.[infiniteQuery.data.pages.length - 1]?.total || 0;

  return {
    ...infiniteQuery,
    // 扩展的便利属性
    allData,
    total,
    isEmpty: allData.length === 0,
    isLoadingInitial: infiniteQuery.isLoading && !infiniteQuery.isFetchingNextPage,
    // 重新命名以提高语义化
    isLoadingMore: infiniteQuery.isFetchingNextPage,
    hasMore: infiniteQuery.hasNextPage,
    loadMore: infiniteQuery.fetchNextPage,
  };
}

// 特定类型的hook工厂函数，用于创建类型安全的hook
export function createInfiniteDataHook<TData, TParams extends PaginatedParams>() {
  return (options: UseInfiniteDataOptions<TData, TParams>) => {
    return useInfiniteData<TData, TParams>(options);
  };
}
