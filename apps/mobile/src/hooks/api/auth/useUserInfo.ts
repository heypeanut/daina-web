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

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const userInfo = await getUserInfo();
      return userInfo;
    },
    enabled: isLoggedIn && (options?.enabled !== false),
    staleTime: CACHE_TIMES.USER_INFO,
    gcTime: CACHE_TIMES.USER_INFO,
    retry: (failureCount, error) => {
      // 如果是401错误（未认证），不重试
      if (error instanceof Error && error.message.includes('401')) {
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