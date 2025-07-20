import { useMutation } from '@tanstack/react-query';
import { logout } from '@/lib/api/auth';
import { clearAllQueries } from '@/lib/react-query/client';
import type { MutationOptions } from '@/lib/react-query/types';

interface UseLogoutOptions extends MutationOptions<void, Error, void> {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogout(options?: UseLogoutOptions) {
  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: (data, variables, context) => {
      // 清除所有查询缓存
      clearAllQueries();
      
      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));
      
      // 调用外部的成功回调
      options?.onSuccess?.();
    },
    onError: (error, variables, context) => {
      console.error('退出登录失败:', error);
      
      // 即使退出登录失败，也清除本地存储和缓存
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      clearAllQueries();
      
      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));
      
      // 调用外部的错误回调
      options?.onError?.(error);
    },
    retry: 0, // 退出登录失败不重试
    ...options,
  });
}