// 新版首页API - 使用tenant端接口
import { tenantApi } from './config';

// 接口类型定义
export interface HomepageBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
}

export interface BoothRecommendation {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  rating?: number;
  tags?: string[];
}

export interface ProductRecommendation {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  boothName: string;
  sales?: number;
}

export interface BoothRanking {
  id: string;
  name: string;
  avatar?: string;
  rank: number;
  score: number;
}

export interface HomepageData {
  banners: HomepageBanner[];
  boothRecommendations: BoothRecommendation[];
  productRecommendations: ProductRecommendation[];
  latestBooths: BoothRecommendation[];
  latestProducts: ProductRecommendation[];
  boothRanking: BoothRanking[];
}

// ==================== 首页内容API ====================

/**
 * 获取完整首页数据
 */
export async function getHomepageData(userId?: number): Promise<HomepageData> {
  const params = userId ? { userId: userId.toString() } : {};
  const response = await tenantApi.get('/homepage/data', { params });
  return response.data;
}

/**
 * 获取轮播图列表
 */
export async function getBanners(): Promise<HomepageBanner[]> {
  const response = await tenantApi.get('/homepage/banners');
  return response.data;
}

/**
 * 获取档口推荐
 */
export async function getBoothRecommendations(
  type: 'hot' | 'personalized' | 'latest' = 'hot', 
  limit: number = 25
): Promise<BoothRecommendation[]> {
  const response = await tenantApi.get('/homepage/booth-recommendations', {
    params: { type, limit }
  });
  return response.data;
}

/**
 * 获取商品推荐
 */
export async function getProductRecommendations(
  type: 'hot' | 'personalized' | 'latest' = 'hot', 
  limit: number = 12
): Promise<ProductRecommendation[]> {
  const response = await tenantApi.get('/homepage/product-recommendations', {
    params: { type, limit }
  });
  return response.data;
}

/**
 * 获取最新档口
 */
export async function getLatestBooths(limit: number = 10): Promise<BoothRecommendation[]> {
  const response = await tenantApi.get('/homepage/latest-booths', {
    params: { limit }
  });
  return response.data;
}

/**
 * 获取最新商品
 */
export async function getLatestProducts(limit: number = 12): Promise<ProductRecommendation[]> {
  const response = await tenantApi.get('/homepage/latest-products', {
    params: { limit }
  });
  return response.data;
}

/**
 * 获取档口排行榜
 */
export async function getBoothRanking(limit: number = 10): Promise<BoothRanking[]> {
  const response = await tenantApi.get('/homepage/booth-ranking', {
    params: { limit }
  });
  return response.data;
}

// ==================== 移动端专用API ====================

/**
 * 移动端分页获取首页数据
 */
export async function getMobileHomepageData(
  page: number = 1,
  limit: number = 10
): Promise<{
  items: ProductRecommendation[];
  hasNext: boolean;
  total: number;
}> {
  const response = await tenantApi.get('/homepage/product-recommendations', {
    params: { 
      type: 'hot', 
      limit, 
      page 
    }
  });
  return response.data;
}