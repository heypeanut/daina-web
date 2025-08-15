import { ERROR_CODES } from './constants';
import { clearAllQueries } from './client';

export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// 检查是否是API错误
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

// 通用错误处理函数
export function handleApiError(error: unknown): void {
  if (isApiError(error)) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHORIZED:
        handleUnauthorizedError();
        break;
      case ERROR_CODES.FORBIDDEN:
        console.error('访问被禁止:', error.message);
        break;
      case ERROR_CODES.NOT_FOUND:
        console.error('资源未找到:', error.message);
        break;
      case ERROR_CODES.INTERNAL_SERVER_ERROR:
        console.error('服务器内部错误:', error.message);
        break;
      default:
        console.error('API错误:', error.message);
        break;
    }
  } else if (error instanceof Error) {
    // 处理网络错误或其他Error类型
    if (error.message.includes('登录已过期') || error.message.includes('401')) {
      handleUnauthorizedError();
    } else {
      console.error('请求错误:', error.message);
    }
  } else {
    console.error('未知错误:', error);
  }
}

// 处理401未认证错误
function handleUnauthorizedError(): void {
  // 清除本地存储
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
  
  // 清除所有查询缓存
  clearAllQueries();
  
  // 触发登录状态变化事件
  window.dispatchEvent(new Event("loginStatusChange"));
  
  // 跳转到登录页面，保存当前页面作为返回地址
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname + window.location.search;
    const loginUrl = `/login?returnUrl=${encodeURIComponent(currentPath)}`;
    window.location.href = loginUrl;
  }
  
  console.warn('用户认证已过期，正在跳转到登录页面');
}

// 获取用户友好的错误消息
export function getUserFriendlyMessage(error: unknown): string {
  if (isApiError(error)) {
    switch (error.code) {
      case ERROR_CODES.UNAUTHORIZED:
        return '登录已过期，请重新登录';
      case ERROR_CODES.FORBIDDEN:
        return '您没有权限执行此操作';
      case ERROR_CODES.NOT_FOUND:
        return '请求的资源不存在';
      case ERROR_CODES.INTERNAL_SERVER_ERROR:
        return '服务器暂时不可用，请稍后重试';
      case ERROR_CODES.NETWORK_ERROR:
        return '网络连接失败，请检查网络设置';
      default:
        return error.message || '操作失败，请重试';
    }
  } else if (error instanceof Error) {
    if (error.message.includes('登录已过期') || error.message.includes('401')) {
      return '登录已过期，请重新登录';
    } else if (error.message.includes('网络')) {
      return '网络连接失败，请检查网络设置';
    } else {
      return error.message || '操作失败，请重试';
    }
  } else {
    return '操作失败，请重试';
  }
}

// React Query错误处理Hook
export function useErrorHandler() {
  return {
    handleError: (error: unknown) => {
      handleApiError(error);
      return getUserFriendlyMessage(error);
    },
    getUserFriendlyMessage,
  };
}