import { useMutation } from "@tanstack/react-query";
import { smsLogin, type SmsLoginRequest, type LoginResponse } from "@/lib/api/auth";
import { invalidateQueries } from "@/lib/react-query/client";
import { AUTH_QUERY_KEYS } from "@/lib/react-query/types";
import type { MutationOptions } from "@/lib/react-query/types";

interface UseSmsLoginOptions
  extends MutationOptions<LoginResponse, Error, SmsLoginRequest> {
  onSuccess?: (data: LoginResponse) => void;
  onError?: (error: Error) => void;
}

export function useSmsLogin(options?: UseSmsLoginOptions) {
  return useMutation({
    mutationFn: async (credentials: SmsLoginRequest) => {
      const response = await smsLogin(credentials);
      return response;
    },
    onSuccess: (data) => {
      // 存储认证信息
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_info", JSON.stringify(data.user));

      // 使用户信息查询失效，强制重新获取
      invalidateQueries(AUTH_QUERY_KEYS.user);

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      // 调用外部的成功回调
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error("短信登录失败:", error);

      // 调用外部的错误回调
      options?.onError?.(error);
    },
    retry: 0, // 短信登录失败不重试
    ...options,
  });
}
