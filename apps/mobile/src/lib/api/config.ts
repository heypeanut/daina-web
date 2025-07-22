// API配置文件 - Tenant端

// API基础URL配置
const API_BASE_URLS = {
  TENANT: '/api/tenant', // 客户端
  SYSTEM: '/api/system', // 管理后台（如需要）
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// 获取认证token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// 创建统一的fetch请求函数
class TenantApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = BASE_URL + API_BASE_URLS.TENANT;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 准备请求头
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 自动添加认证头
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // 处理HTTP错误
      if (!response.ok) {
        if (response.status === 401) {
          // Token过期，清除本地存储
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_info");
          // 跳转到登录页
          window.location.href = '/login';
          throw new Error('登录已过期，请重新登录');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查业务状态码
      if (data.code && data.code !== 200) {
        throw new Error(data.message || data.msg || '请求失败');
      }

      return { data: data.data || data };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('网络请求失败');
    }
  }

  async get<T = any>(endpoint: string, options?: RequestInit & { params?: Record<string, string> }): Promise<{ data: T }> {
    let url = endpoint;
    if (options?.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, { ...options, method: 'GET' });
  }

  async post<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any, options?: RequestInit): Promise<{ data: T }> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, data?: any, options?: RequestInit & { params?: Record<string, string> }): Promise<{ data: T }> {
    let url = endpoint;
    if (options?.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }
    return this.request<T>(url, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // FormData上传专用方法
  async postFormData<T = any>(endpoint: string, formData: FormData, options?: RequestInit): Promise<{ data: T }> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 准备请求头，不设置Content-Type让浏览器自动设置FormData边界
    const headers: HeadersInit = {
      ...options?.headers,
    };

    // 自动添加认证头
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        headers,
        body: formData,
      });

      // 处理HTTP错误
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user_info");
          window.location.href = '/login';
          throw new Error('登录已过期，请重新登录');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // 检查业务状态码
      if (data.code && data.code !== 200) {
        throw new Error(data.message || data.msg || '请求失败');
      }

      return { data: data.data || data };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('网络请求失败');
    }
  }
}

// 导出API客户端实例
export const tenantApi = new TenantApiClient();

// 导出API基础URLs供直接使用
export { API_BASE_URLS, BASE_URL };

// 导出工具函数
export { getAuthToken };

// 统一响应格式接口
export interface ApiResponse<T = any> {
  code: number;
  message?: string;
  msg?: string;
  data: T;
}

// 分页响应格式接口
export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}