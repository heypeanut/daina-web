// 新版档口API - 使用tenant端接口
import { Booth } from "@/types/booth";
import { tenantApi, PaginatedResponse } from "./config";
import { isLoggedIn } from "@/lib/auth";
import { ProductDetail } from "@/app/product/[id]/types";
import { searchBooths as searchBoothsAPI } from "./search";

export interface BoothProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  description?: string;
  category?: string;
  views?: number;
  rating?: number;
  stock?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface BoothCategory {
  id: string;
  name: string;
  count: number;
}

export interface GetBoothsParams {
  pageNum: number;
  size: number;
  categoryId?: string;
  keyword?: string;
  sortBy?: "latest" | "popular" | "rating";
  location?: string;
}

export interface GetBoothsResponse extends PaginatedResponse<Booth> {
  page: number;
  size: number;
  hasNext: boolean;
}

export interface GetBoothProductsParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  categoryId?: string;
  sortBy?: "latest" | "popular" | "price" | "sales";
}

// ==================== 档口列表相关API ====================

/**
 * 获取档口列表
 */
export async function getBooths(
  params: GetBoothsParams
): Promise<GetBoothsResponse> {
  const queryParams = {
    ...params,
    pageNum: params.pageNum.toString(),
    size: params.size.toString(),
  };
  const response = await tenantApi.get("/booth", { params: queryParams });
  return response.data;
}

/**
 * 获取档口分类
 */
export async function getBoothCategories(): Promise<BoothCategory[]> {
  const response = await tenantApi.get("/booth/categories");
  return response.data;
}

/**
 * 搜索档口 - 使用专门的搜索接口
 */
export async function searchBooths(
  keyword: string,
  pageNum: number = 1,
  size: number = 20
): Promise<GetBoothsResponse> {
  const searchResponse = await searchBoothsAPI({
    keyword,
    pageNum,
    pageSize: size,
  });
  
  // 转换响应格式以保持兼容性
  return {
    rows: searchResponse.rows,
    total: searchResponse.total,
    page: pageNum,
    size: size,
    hasNext: pageNum * size < searchResponse.total,
  };
}

/**
 * 获取热门档口
 */
export async function getHotBooths(limit: number = 10): Promise<Booth[]> {
  const response = await getBooths({
    pageNum: 1,
    size: limit,
    sortBy: "popular",
  });
  return response.rows;
}

// ==================== 档口详情相关API ====================

/**
 * 获取档口详情 - 使用 /api/tenant/booth/{id} 接口
 */
export async function getBoothDetail(id: string): Promise<Booth> {
  const response = await tenantApi.get(`/booth/${id}`);
  return response.data;
}

/**
 * 获取档口商品列表 - 使用 /api/tenant/product/booth/{boothId} 接口（支持分页）
 */
export async function getBoothProducts(
  boothId: string,
  params: GetBoothProductsParams = { pageNum: 1, pageSize: 12 }
): Promise<PaginatedResponse<BoothProduct>> {
  const queryParams = {
    pageNum: params.pageNum.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.sortBy && { sortBy: params.sortBy }),
  };

  const response = await tenantApi.get(`/product/booth/${boothId}`, {
    params: queryParams,
  });
  return response.data;
}

// ==================== 行为记录相关API ====================

/**
 * 记录档口浏览
 */
export async function trackBoothView(boothId: string): Promise<void> {
  // 如果未登录，直接返回，不执行埋点
  if (!isLoggedIn()) {
    return;
  }

  try {
    await tenantApi.post("/user/history", {
      type: "booth",
      targetId: boothId,
    });
  } catch (error) {
    console.warn("Failed to track booth view:", error);
  }
}

/**
 * 记录档口联系行为
 */
export async function trackBoothContact(
  boothId: string,
  contactType: "phone" | "wechat" | "qq"
): Promise<void> {
  try {
    await tenantApi.post("/analytics/contact", {
      boothId,
      contactType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track booth contact:", error);
  }
}

/**
 * 记录档口分享行为
 */
export async function trackBoothShare(boothId: string): Promise<void> {
  try {
    await tenantApi.post("/analytics/share", {
      boothId,
      shareType: "booth",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track booth share:", error);
  }
}

// ==================== 产品详情相关API ====================

/**
 * 获取产品详情 - 使用 /api/tenant/product/{id} 接口
 */
export async function getProductDetail(id: string): Promise<ProductDetail> {
  const response = await tenantApi.get(`/product/${id}`);
  return response.data;
}

/**
 * 记录产品浏览
 */
export async function trackProductView(productId: string): Promise<void> {
  // 如果未登录，直接返回，不执行埋点
  if (!isLoggedIn()) {
    return;
  }

  try {
    await tenantApi.post("/user/history", {
      type: "product",
      targetId: productId,
    });
  } catch (error) {
    console.warn("Failed to track product view:", error);
  }
}

/**
 * 记录产品分享行为
 */
export async function trackProductShare(productId: string): Promise<void> {
  try {
    await tenantApi.post("/analytics/share", {
      productId,
      shareType: "product",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track product share:", error);
  }
}
