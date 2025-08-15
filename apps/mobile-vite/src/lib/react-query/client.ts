import { QueryClient } from '@tanstack/react-query';

// 默认配置常量
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5分钟
const DEFAULT_CACHE_TIME = 10 * 60 * 1000; // 10分钟
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY = (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000);

// 创建QueryClient实例
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 数据被认为是新鲜的时间
      staleTime: DEFAULT_STALE_TIME,
      // 缓存时间（数据在内存中保留的时间）
      gcTime: DEFAULT_CACHE_TIME,
      // 重试次数
      retry: DEFAULT_RETRY_COUNT,
      // 重试延迟
      retryDelay: DEFAULT_RETRY_DELAY,
      // 窗口重新获得焦点时不自动重新获取
      refetchOnWindowFocus: false,
      // 网络重连时自动重新获取
      refetchOnReconnect: true,
      // 组件挂载时不自动重新获取（除非数据过期）
      refetchOnMount: true,
    },
    mutations: {
      // 变更重试次数
      retry: 1,
      // 变更重试延迟
      retryDelay: DEFAULT_RETRY_DELAY,
    },
  },
});

// 全局错误处理 - 通过React Query Provider在应用层处理
// 这里不设置默认的mutation配置，避免类型错误

// 清除所有缓存的辅助函数
export const clearAllQueries = () => {
  queryClient.clear();
};

// 清除特定key的缓存
export const invalidateQueries = (queryKey: string[]) => {
  queryClient.invalidateQueries({ queryKey });
};

// 手动设置查询数据
export const setQueryData = <T>(queryKey: string[], data: T) => {
  queryClient.setQueryData(queryKey, data);
};

// 获取查询数据
export const getQueryData = <T>(queryKey: string[]): T | undefined => {
  return queryClient.getQueryData<T>(queryKey);
};