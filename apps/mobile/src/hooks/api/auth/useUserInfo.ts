import { useQuery } from '@tanstack/react-query';
import { getUserInfo, type UserInfo } from '@/lib/api/auth';
import { AUTH_QUERY_KEYS } from '@/lib/react-query/types';
import { CACHE_TIMES } from '@/lib/react-query/constants';
import type { QueryOptions } from '@/lib/react-query/types';

interface UseUserInfoOptions extends QueryOptions<UserInfo> {
  enabled?: boolean;
}

export function useUserInfo(options?: UseUserInfoOptions) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  const isLoggedIn = Boolean(token);
  
  // 如果localStorage中已有用户信息，优先返回缓存的数据
  const cachedUserInfo = typeof window !== 'undefined' 
    ? localStorage.getItem("user_info") 
    : null;

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const userInfo = await getUserInfo();
      return userInfo;
    },
    enabled: isLoggedIn && (options?.enabled !== false),
    staleTime: CACHE_TIMES.USER_INFO,
    gcTime: CACHE_TIMES.USER_INFO,
    // 如果有缓存的用户信息，先返回缓存数据
    initialData: cachedUserInfo ? (() => {
      try {
        return JSON.parse(cachedUserInfo);
      } catch {
        return undefined;
      }
    })() : undefined,
    retry: (failureCount, error) => {
      // 如果是认证错误，不重试
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('登录已过期'))) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

// 获取用户登录状态的hook
export function useLoginStatus() {
  const { data: userInfo, isLoading, error } = useUserInfo();
  
  const isLoggedIn = Boolean(userInfo && !error);
  
  return {
    isLoggedIn,
    isLoading,
    userInfo,
    error,
  };
}