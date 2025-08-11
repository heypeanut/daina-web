import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

// API响应的标准格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 分页请求参数
export interface PaginationParams {
  page: number;
  pageSize: number;
}

// 分页响应数据
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 查询选项类型（简化版）
export type QueryOptions<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError>,
  'queryKey' | 'queryFn'
>;

// 变更选项类型（简化版）
export type MutationOptions<TData, TError = Error, TVariables = void> = Omit<
  UseMutationOptions<TData, TError, TVariables>,
  'mutationFn'
>;

// 错误响应类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}

// 查询键类型定义
export type QueryKey = readonly string[];

// 认证相关的查询键
export const AUTH_QUERY_KEYS = {
  user: ['auth', 'user'] as const,
  status: ['auth', 'status'] as const,
} as const;

// 收藏相关的查询键
export const FAVORITES_QUERY_KEYS = {
  products: (params?: PaginationParams) => 
    ['favorites', 'products', params] as const,
  productStatus: (productId: string) => 
    ['favorites', 'products', productId] as const,
  booths: (params?: PaginationParams) => 
    ['favorites', 'booths', params] as const,
  boothStatus: (boothId: string) => 
    ['favorites', 'booths', boothId] as const,
} as const;

// 浏览记录相关的查询键
export const FOOTPRINTS_QUERY_KEYS = {
  list: (type?: 'product' | 'booth', params?: PaginationParams) => 
    ['footprints', { type, ...params }] as const,
} as const;