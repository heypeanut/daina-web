import { useMutation, useQuery, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { getUserInfo, logout, type UserInfo } from '@/lib/api/auth';
import { AUTH_QUERY_KEYS } from '@/lib/react-query/types';
import { CACHE_TIMES } from '@/lib/react-query/constants';
import type { QueryOptions } from '@/lib/react-query/types';
import { getFavorites, getFootprints } from '@/lib/api/user-behavior';


interface UseUserInfoOptions extends QueryOptions<UserInfo> {
  enabled?: boolean;
}

export function useUserInfo(options?: UseUserInfoOptions) {
  const queryClient = useQueryClient();
  
  // 使用状态管理登录状态，确保能响应变化
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem("auth_token") : null;
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));
  
  // 监听登录状态变化事件
  useEffect(() => {
    const handleLoginStatusChange = () => {
      console.log('🔄 loginStatusChange event received');
      const currentToken = getToken();
      const newIsLoggedIn = Boolean(currentToken);
      
      console.log('🔑 Current token:', currentToken ? 'exists' : 'null');
      console.log('📊 New login status:', newIsLoggedIn);
      
      setIsLoggedIn(newIsLoggedIn);
      
      if (!newIsLoggedIn) {
        console.log('🚪 Logging out - clearing queries');
        // 如果没有token，清除查询数据并设置为undefined
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
        queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
      } else {
        console.log('🔐 Logging in - invalidating queries');
        // 如果有token，重新获取用户信息
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    };

    window.addEventListener('loginStatusChange', handleLoginStatusChange);
    return () => {
      window.removeEventListener('loginStatusChange', handleLoginStatusChange);
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      console.log('🌐 Fetching user info from API');
      const userInfo = await getUserInfo();
      console.log('✅ User info fetched:', userInfo);
      return userInfo;
    },
    enabled: isLoggedIn && (options?.enabled !== false),
    staleTime: 0, // 暂时设置为0，确保总是重新获取
    gcTime: CACHE_TIMES.USER_INFO,
    // 暂时不使用initialData，确保总是从API获取最新数据
    // initialData: isLoggedIn ? getCachedUserInfo() : undefined,
    retry: (failureCount, error) => {
      // 如果是认证错误，不重试
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('登录已过期'))) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });

  return query;
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


export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // 立即清除用户信息查询数据
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
      
      // 清除所有React Query缓存
      import('@/lib/react-query/client').then(({ clearAllQueries }) => {
        clearAllQueries();
      });
      
      // 触发登录状态变化事件，让其他组件知道用户已退出登录
      window.dispatchEvent(new Event("loginStatusChange"));
    },
    onError: (error) => {
      console.error('退出登录失败:', error);
      
      // 即使退出登录失败，也清除本地存储和缓存
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      
      // 立即清除用户信息查询数据
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
      
      // 清除所有React Query缓存
      import('@/lib/react-query/client').then(({ clearAllQueries }) => {
        clearAllQueries();
      });
      
      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));
    },
    retry: 0, // 退出登录失败不重试
  });
}


export function useGetFavoriteProducts(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['favoriteProducts'],
    queryFn: () => getFavorites('product', page, pageSize),
  });
}

export function useGetFollowedBooths(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['followedBooths'],
    queryFn: () => getFavorites('booth', page, pageSize),
  });
}

// 添加浏览历史hooks
export function useGetHistory(type: 'product' | 'booth' = 'product', page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ['trafficHistory', type, page, pageSize],
    queryFn: () => getFootprints(type, page, pageSize),
  });
}

// 无限滚动版本的浏览历史hook
export function useInfiniteHistory(type: 'product' | 'booth' = 'product', pageSize: number = 20) {
  return useInfiniteQuery({
    queryKey: ['trafficHistory', 'infinite', type],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getFootprints(type, pageParam, pageSize);
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // 检查是否有更多数据
      if (lastPage.rows.length === 0) {
        return undefined;
      }
      
      // 如果当前页数据少于pageSize，说明已经是最后一页
      if (lastPage.rows.length < pageSize) {
        return undefined;
      }
      
      // 如果有totalPages字段，检查是否已到最后一页
      if (lastPage.totalPages && allPages.length >= lastPage.totalPages) {
        return undefined;
      }
      
      // 如果有total字段，检查是否已加载完所有数据
      if (lastPage.total !== undefined) {
        const loadedCount = allPages.reduce((count, page) => count + page.rows.length, 0);
        if (loadedCount >= lastPage.total) {
          return undefined;
        }
      }
      
      // 返回下一页页码
      return allPages.length + 1;
    },
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });
}
