// 新版用户行为API - 收藏、历史记录等
import { tenantApi, type PaginatedResponse } from "./config";
import { isLoggedIn } from "@/lib/auth";

// 接口类型定义
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  boothId: string;
  boothName: string;
  sales?: number;
  rating?: number;
  stock?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booth {
  id: string;
  name: string;
  avatar?: string;
  coverImage?: string;
  description?: string;
  location?: string;
  category?: string;
  rating?: number;
  followers?: number;
  productsCount?: number;
  verified?: boolean;
  tags?: string[];
  contact?: {
    phone?: string;
    wechat?: string;
    qq?: string;
  };
  businessHours?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteProduct {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface FavoriteBooth {
  id: string;
  userId: string;
  boothId: string;
  booth: Booth;
  createdAt: string;
}

// 历史记录中的Booth信息（来自接口返回）
export interface HistoryBooth {
  id: string;
  boothName: string;
  boothNumber: string;
  coverImg: string;
  market: string;
  createdAt: string;
}

// 历史记录中的Product信息（来自接口返回）
export interface HistoryProduct {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
  image: string;
  boothName: string;
  boothId: string;
  views?: number;
  createdAt: string;
}

export interface Footprint {
  id: string;
  userId?: string;
  type: "product" | "booth";
  targetId: string;
  // 根据接口返回格式，直接包含完整的booth或product信息
  boothName?: string;
  boothNumber?: string;
  coverImg?: string;
  market?: string;
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  views?: number;
  createdAt: string;
  visitedAt?: string; // 兼容旧格式
}

// ==================== 收藏相关API ====================

/**
 * 添加/取消收藏（商品或档口）
 */
export async function toggleFavorite(
  type: "product" | "booth",
  targetId: string,
  action: "add" | "remove"
): Promise<void> {
  const data = {
    type: type === "product" ? "product" : "booth",
    itemId: targetId, // 使用实际的商品ID或档口ID
  };

  if (action === "add") {
    await tenantApi.post("/user/favorites", data);
  } else {
    await tenantApi.delete("/user/favorites", { data });
  }
}

/**
 * 收藏商品
 */
export async function addProductToFavorites(productId: string): Promise<void> {
  await toggleFavorite("product", productId, "add");
}

/**
 * 取消收藏商品
 */
export async function removeProductFromFavorites(
  productId: string
): Promise<void> {
  await toggleFavorite("product", productId, "remove");
}

/**
 * 关注档口
 */
export async function followBooth(boothId: string): Promise<void> {
  await toggleFavorite("booth", boothId, "add");
}

/**
 * 取消关注档口
 */
export async function unfollowBooth(boothId: string): Promise<void> {
  await toggleFavorite("booth", boothId, "remove");
}

/**
 * 获取收藏列表
 */
export async function getFavorites(
  type: "product" | "booth",
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteProduct | FavoriteBooth>> {
  const response = await tenantApi.get("/user/favorites", {
    params: {
      type,
      page: page.toString(),
      pageSize: pageSize.toString(),
    },
  });
  return response.data;
}

/**
 * 获取收藏商品列表
 */
export async function getFavoriteProducts(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteProduct>> {
  return getFavorites("product", page, pageSize) as Promise<
    PaginatedResponse<FavoriteProduct>
  >;
}

/**
 * 获取收藏档口列表
 */
export async function getFavoriteBooths(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteBooth>> {
  return getFavorites("booth", page, pageSize) as Promise<
    PaginatedResponse<FavoriteBooth>
  >;
}

/**
 * 检查是否已收藏/关注
 */
export async function checkFavoriteStatus(
  type: "product" | "booth",
  targetId: string
): Promise<boolean> {
  const params = {
    type: type === "product" ? "product" : "booth",
    itemId: targetId, // 使用实际的商品ID或档口ID
  };

  try {
    const response = await tenantApi.get("/user/favorites/check", { params });
    return response.data?.isFavorited || false;
  } catch {
    return false;
  }
}

/**
 * 检查商品是否已收藏
 */
export async function isProductFavorited(productId: string): Promise<boolean> {
  return checkFavoriteStatus("product", productId);
}

/**
 * 检查档口是否已关注
 */
export async function isBoothFollowed(boothId: string): Promise<boolean> {
  return checkFavoriteStatus("booth", boothId);
}

// ==================== 浏览历史API ====================

/**
 * 添加浏览记录
 */
export async function addFootprint(
  type: "product" | "booth",
  targetId: string
): Promise<void> {
  // 如果未登录，直接返回，不执行埋点
  if (!isLoggedIn()) {
    return;
  }

  try {
    await tenantApi.post("/user/history", { type, targetId });
  } catch (error) {
    console.warn("Failed to add footprint:", error);
  }
}

/**
 * 获取浏览记录
 */
export async function getFootprints(
  type?: "product" | "booth",
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Footprint>> {
  // 如果未登录，返回空结果
  if (!isLoggedIn()) {
    return {
      rows: [],
      total: 0,
      page,
      pageNum: page,
      pageSize,
      hasNext: false,
    };
  }

  const params: { page: string; pageSize: string; type?: string } = {
    page: page.toString(),
    pageSize: pageSize.toString(),
  };
  if (type) params.type = type;

  const response = await tenantApi.get("/user/history", { params });

  console.log("=== getFootprints API原始响应 ===");
  console.log("API路径: /user/history");
  console.log("请求参数:", params);
  console.log("原始数据:", response.data);
  console.log("数据结构:", response.data.rows ? "包含rows数组" : "不包含rows");
  if (response.data.rows && response.data.rows[0]) {
    console.log("第一条原始记录:", response.data.rows[0]);
    console.log("第一条记录字段:", Object.keys(response.data.rows[0]));
  }

  // 数据转换逻辑（根据实际API结构调整）
  const transformedData = {
    ...response.data,
    rows: response.data.rows.map((item) => {
      const transformedItem = {
        ...item,
        // 尝试将不同的ID字段映射到targetId
        targetId:
          (item as any).targetId ||
          (item as any).productId ||
          (item as any).boothId ||
          (item as any).objectId ||
          (item as any).product?.id ||
          (item as any).booth?.id ||
          (item as any).id, // 最后尝试用记录自身的id
      };

      // 调试转换结果
      if ((item as any).targetId !== transformedItem.targetId) {
        console.log("字段映射:", {
          original: (item as any).targetId,
          mapped: transformedItem.targetId,
          source: "productId/boothId/objectId/product.id/booth.id/id",
        });
      }

      return transformedItem;
    }),
  };

  console.log("转换后数据:", transformedData);
  console.log("转换后第一条记录:", transformedData.rows[0]);

  return transformedData;
}

/**
 * 清除浏览记录
 */
export async function clearFootprints(
  type?: "product" | "booth"
): Promise<void> {
  // 如果未登录，直接返回
  if (!isLoggedIn()) {
    return;
  }

  // 使用DELETE方法，将type参数放在请求体中
  const data = type ? { type } : {};
  await tenantApi.delete("/user/history", data);
}

/**
 * 删除单个浏览记录
 */
export async function removeFootprint(footprintId: string): Promise<void> {
  // 如果未登录，直接返回
  if (!isLoggedIn()) {
    return;
  }

  await tenantApi.delete(`/user/history/${footprintId}`);
}
