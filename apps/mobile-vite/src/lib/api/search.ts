/**
 * 搜索功能API服务
 * 
 * 提供商品搜索、档口搜索、搜索建议等功能的API接口封装
 * 所有搜索API都通过tenant端接口调用，支持分页、排序、筛选等功能
 * 
 * @author Claude Code  
 * @version 1.0.0
 */
import { tenantApi, PaginatedResponse } from "./config";
import { Product } from "@/types/api";
import { Booth } from "@/types/booth";

// 商品搜索参数接口
export interface ProductSearchParams {
  keyword: string;
  pageNum?: number;
  pageSize?: number;
  boothId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'relevance' | 'price' | 'sales' | 'latest';
}

// 档口搜索参数接口
export interface BoothSearchParams {
  keyword: string;
  pageNum?: number;
  pageSize?: number;
  location?: string;
  categoryId?: string;
  sortBy?: 'relevance' | 'popular' | 'rating';
}

// 商品搜索响应接口
export interface ProductSearchResponse extends PaginatedResponse<Product> {
  searchTime?: number;
  suggestions?: string[];
}

// 档口搜索响应接口
export interface BoothSearchResponse extends PaginatedResponse<Booth> {
  searchTime?: number;
  suggestions?: string[];
}

// ==================== 商品搜索API ====================

/**
 * 搜索商品 - 调用 /api/tenant/product/search 接口
 * @param params 搜索参数
 * @param signal 取消信号，支持请求取消
 */
export async function searchProducts(
  params: ProductSearchParams,
  signal?: AbortSignal
): Promise<ProductSearchResponse> {
  const queryParams: Record<string, string> = {
    keyword: params.keyword,
    pageNum: (params.pageNum || 1).toString(),
    pageSize: (params.pageSize || 20).toString(),
  };

  // 添加可选参数
  if (params.boothId) {
    queryParams.boothId = params.boothId;
  }
  if (params.categoryId) {
    queryParams.categoryId = params.categoryId;
  }
  if (params.minPrice !== undefined) {
    queryParams.minPrice = params.minPrice.toString();
  }
  if (params.maxPrice !== undefined) {
    queryParams.maxPrice = params.maxPrice.toString();
  }
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
  }

  const response = await tenantApi.get("/product/search", {
    params: queryParams,
    signal, // 支持请求取消
  });
  return response.data;
}

// ==================== 档口搜索API ====================

/**
 * 搜索档口 - 调用 /api/tenant/booth/search 接口
 * @param params 搜索参数
 * @param signal 取消信号，支持请求取消
 */
export async function searchBooths(
  params: BoothSearchParams,
  signal?: AbortSignal
): Promise<BoothSearchResponse> {
  const queryParams: Record<string, string> = {
    keyword: params.keyword,
    pageNum: (params.pageNum || 1).toString(),
    pageSize: (params.pageSize || 20).toString(),
  };

  // 添加可选参数
  if (params.location) {
    queryParams.location = params.location;
  }
  if (params.categoryId) {
    queryParams.categoryId = params.categoryId;
  }
  if (params.sortBy) {
    queryParams.sortBy = params.sortBy;
  }

  const response = await tenantApi.get("/booth/search", {
    params: queryParams,
    signal, // 支持请求取消
  });
  return response.data;
}

// ==================== 搜索建议API ====================

/**
 * 获取搜索建议
 */
export async function getSearchSuggestions(
  keyword: string,
  type: 'product' | 'booth' | 'all' = 'all'
): Promise<string[]> {
  try {
    const response = await tenantApi.get("/search/suggestions", {
      params: {
        keyword,
        type,
      },
    });
    return response.data || [];
  } catch (error) {
    console.warn("Failed to get search suggestions:", error);
    return [];
  }
}

/**
 * 获取热门搜索词
 */
export async function getTrendingSearches(
  type: 'product' | 'booth' | 'all' = 'all'
): Promise<string[]> {
  try {
    const response = await tenantApi.get("/search/trending", {
      params: {
        type,
      },
    });
    return response.data || [];
  } catch (error) {
    console.warn("Failed to get trending searches:", error);
    return [];
  }
}