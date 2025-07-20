// 收藏相关API接口

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
  specifications?: Record<string, any>;
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

export interface Footprint {
  id: string;
  userId: string;
  type: "product" | "booth";
  targetId: string;
  product?: Product;
  booth?: Booth;
  visitedAt: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 获取认证token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

// 创建认证请求头
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// 处理API响应
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Token 过期，清除本地存储
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      throw new Error("登录已过期，请重新登录");
    }

    try {
      const errorData = await response.json();
      throw new Error(errorData.message || `请求失败 (${response.status})`);
    } catch (parseError) {
      throw new Error(`请求失败 (${response.status})`);
    }
  }

  const result: ApiResponse<T> = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || "操作失败");
  }

  return result.data;
}

// ==================== 收藏商品 API ====================

// 收藏商品
export async function addProductToFavorites(productId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/profile/favorites/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId }),
  });

  await handleApiResponse<void>(response);
}

// 取消收藏商品
export async function removeProductFromFavorites(
  productId: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/favorites/products/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleApiResponse<void>(response);
}

// 检查商品是否已收藏
export async function isProductFavorited(productId: string): Promise<boolean> {
  const response = await fetch(
    `${BASE_URL}/favorites/products/${productId}/check`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return await handleApiResponse<boolean>(response);
}

// 获取收藏的商品列表
export async function getFavoriteProducts(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteProduct>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(`${BASE_URL}/api/user/favorites?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return await handleApiResponse<PaginatedResponse<FavoriteProduct>>(response);
}

// ==================== 收藏档口 API ====================

// 关注档口
export async function followBooth(boothId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/user//favorites/booths`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ boothId }),
  });

  await handleApiResponse<void>(response);
}

// 取消关注档口
export async function unfollowBooth(boothId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/favorites/booths/${boothId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleApiResponse<void>(response);
}

// 检查档口是否已关注
export async function isBoothFollowed(boothId: string): Promise<boolean> {
  const response = await fetch(
    `${BASE_URL}/favorites/booths/${boothId}/check`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  return await handleApiResponse<boolean>(response);
}

// 获取关注的档口列表
export async function getFavoriteBooths(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteBooth>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  const response = await fetch(`${BASE_URL}/favorites/booths?${params}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return await handleApiResponse<PaginatedResponse<FavoriteBooth>>(response);
}

// ==================== 足迹 API ====================

// 添加浏览记录
export async function addFootprint(
  type: "product" | "booth",
  targetId: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/user/history`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ type, targetId }),
  });

  await handleApiResponse<void>(response);
}

// 获取浏览记录
export async function getFootprints(
  type?: "product" | "booth",
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Footprint>> {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (type) {
    params.append("type", type);
  }

  const response = await fetch(`${BASE_URL}/api/user/history`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return await handleApiResponse<PaginatedResponse<Footprint>>(response);
}

// 清除浏览记录
export async function clearFootprints(
  type?: "product" | "booth"
): Promise<void> {
  const params = new URLSearchParams();
  if (type) {
    params.append("type", type);
  }

  const response = await fetch(`${BASE_URL}/footprints?${params}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleApiResponse<void>(response);
}

// 删除单个浏览记录
export async function removeFootprint(footprintId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/footprints/${footprintId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  await handleApiResponse<void>(response);
}
