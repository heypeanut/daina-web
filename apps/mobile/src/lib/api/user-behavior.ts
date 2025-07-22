// 新版用户行为API - 收藏、历史记录等
import { tenantApi, PaginatedResponse } from './config';

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

export interface Footprint {
  id: string;
  userId: string;
  type: "product" | "booth";
  targetId: string;
  product?: Product;
  booth?: Booth;
  visitedAt: string;
}

// ==================== 收藏相关API ====================

/**
 * 添加/取消收藏（商品或档口）
 */
export async function toggleFavorite(
  type: 'product' | 'booth', 
  targetId: string, 
  action: 'add' | 'remove'
): Promise<void> {
  const data = type === 'product' ? { productId: targetId } : { boothId: targetId };
  
  if (action === 'add') {
    await tenantApi.post('/user/favorites', data);
  } else {
    await tenantApi.delete('/user/favorites', data);
  }
}

/**
 * 收藏商品
 */
export async function addProductToFavorites(productId: string): Promise<void> {
  await toggleFavorite('product', productId, 'add');
}

/**
 * 取消收藏商品
 */
export async function removeProductFromFavorites(productId: string): Promise<void> {
  await toggleFavorite('product', productId, 'remove');
}

/**
 * 关注档口
 */
export async function followBooth(boothId: string): Promise<void> {
  await toggleFavorite('booth', boothId, 'add');
}

/**
 * 取消关注档口
 */
export async function unfollowBooth(boothId: string): Promise<void> {
  await toggleFavorite('booth', boothId, 'remove');
}

/**
 * 获取收藏列表
 */
export async function getFavorites(
  type: 'product' | 'booth',
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteProduct | FavoriteBooth>> {
  const response = await tenantApi.get('/user/favorites', {
    params: { type, page, pageSize }
  });
  return response.data;
}

/**
 * 获取收藏的商品列表
 */
export async function getFavoriteProducts(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteProduct>> {
  return getFavorites('product', page, pageSize) as Promise<PaginatedResponse<FavoriteProduct>>;
}

/**
 * 获取关注的档口列表
 */
export async function getFavoriteBooths(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<FavoriteBooth>> {
  return getFavorites('booth', page, pageSize) as Promise<PaginatedResponse<FavoriteBooth>>;
}

/**
 * 检查是否已收藏/关注
 */
export async function checkFavoriteStatus(
  type: 'product' | 'booth',
  targetId: string
): Promise<boolean> {
  const params = type === 'product' 
    ? { productId: targetId } 
    : { boothId: targetId };
    
  try {
    const response = await tenantApi.get('/user/favorites/check', { params });
    return response.data?.isFavorited || false;
  } catch {
    return false;
  }
}

/**
 * 检查商品是否已收藏
 */
export async function isProductFavorited(productId: string): Promise<boolean> {
  return checkFavoriteStatus('product', productId);
}

/**
 * 检查档口是否已关注
 */
export async function isBoothFollowed(boothId: string): Promise<boolean> {
  return checkFavoriteStatus('booth', boothId);
}

// ==================== 浏览历史API ====================

/**
 * 添加浏览记录
 */
export async function addFootprint(
  type: "product" | "booth",
  targetId: string
): Promise<void> {
  await tenantApi.post('/user/history', { type, targetId });
}

/**
 * 获取浏览记录
 */
export async function getFootprints(
  type?: "product" | "booth",
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<Footprint>> {
  const params: any = { page, pageSize };
  if (type) params.type = type;
  
  const response = await tenantApi.get('/user/history', { params });
  return response.data;
}

/**
 * 清除浏览记录
 */
export async function clearFootprints(type?: "product" | "booth"): Promise<void> {
  const params = type ? { type } : undefined;
  await tenantApi.delete('/user/history', undefined, { params });
}

/**
 * 删除单个浏览记录
 */
export async function removeFootprint(footprintId: string): Promise<void> {
  await tenantApi.delete(`/user/history/${footprintId}`);
}