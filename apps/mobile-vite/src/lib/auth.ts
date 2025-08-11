import { getUserInfo as apiGetUserInfo, logout as apiLogout } from '@/lib/api/auth';

// 认证状态管理
export interface User {
  userId: string;
  username: string;
  nickname: string;
  phone: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

// 获取认证token
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// 设置认证token
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth_token', token);
};

// 移除认证token
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
};

// 检查是否已登录
export const isLoggedIn = (): boolean => {
  return !!getAuthToken();
};

// 获取用户信息（从localStorage缓存）
export const getUserInfo = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user_info');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// 获取最新用户信息（从API）
export const fetchUserInfo = async (): Promise<User | null> => {
  try {
    const userInfo = await apiGetUserInfo();
    localStorage.setItem('user_info', JSON.stringify(userInfo));
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 如果是认证错误，清除本地存储
    if (error instanceof Error && error.message.includes('登录已过期')) {
      removeAuthToken();
    }
    return null;
  }
};

// 设置用户信息
export const setUserInfo = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user_info', JSON.stringify(user));
};

// 退出登录
export const logout = async (): Promise<void> => {
  try {
    await apiLogout();
  } catch (error) {
    console.warn('退出登录API调用失败:', error);
  } finally {
    removeAuthToken();
  }
};

// 跳转到登录页面
export const redirectToLogin = (returnUrl?: string): void => {
  if (typeof window === 'undefined') return;
  
  const loginUrl = returnUrl 
    ? `/login?returnUrl=${encodeURIComponent(returnUrl)}`
    : '/login';
  
  window.location.href = loginUrl;
};