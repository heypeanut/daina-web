// 新版档口API - 使用tenant端接口
import { tenantApi, PaginatedResponse } from './config';

// 接口类型定义
export interface Booth {
  id: string;
  boothName: string;
  avatar?: string;
  coverImg?: string;
  description?: string;
  location?: string;
  category?: string;
  rating?: number;
  followers?: number;
  productsCount?: number;
  verified?: boolean;
  tags?: string[];
  phone?: string;
  wx?: string;
  qq?: string;
  wxQrCode?: string;
  qqQrCode?: string;
  address?: string;
  businessHours?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoothDetail extends Booth {
  mainBusiness: string;
  phone: string;
  wx: string;
  address: string;
  market: string;
  isOnline: boolean;
  certification: {
    isVerified: boolean;
    verificationType: string;
  };
  statistics: {
    viewCount: number;
    favoriteCount: number;
    contactCount: number;
    rating: number;
    reviewCount: number;
  };
  products: BoothProduct[];
  relatedBooths: BoothDetail[];
}

export interface BoothProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  sales?: number;
  rating?: number;
  stock?: number;
  createdAt: string;
  updatedAt: string;
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
  sortBy?: 'latest' | 'popular' | 'rating';
  location?: string;
}

export interface GetBoothsResponse extends PaginatedResponse<Booth> {
  page: number;
  size: number;
  hasNext: boolean;
}

// ==================== 档口列表相关API ====================

/**
 * 获取档口列表
 */
export async function getBooths(params: GetBoothsParams): Promise<GetBoothsResponse> {
  const queryParams = {
    ...params,
    pageNum: params.pageNum.toString(),
    size: params.size.toString()
  };
  const response = await tenantApi.get('/booth', { params: queryParams });
  return response.data;
}

/**
 * 获取档口分类
 */
export async function getBoothCategories(): Promise<BoothCategory[]> {
  const response = await tenantApi.get('/booth/categories');
  return response.data;
}

/**
 * 搜索档口
 */
export async function searchBooths(
  keyword: string,
  pageNum: number = 1,
  size: number = 20
): Promise<GetBoothsResponse> {
  return getBooths({ pageNum, size, keyword });
}

/**
 * 获取热门档口
 */
export async function getHotBooths(limit: number = 10): Promise<Booth[]> {
  const response = await getBooths({
    pageNum: 1,
    size: limit,
    sortBy: 'popular'
  });
  return response.rows;
}

// ==================== 档口详情相关API ====================

/**
 * 获取档口详情
 */
export async function getBoothDetail(id: string): Promise<BoothDetail> {
  const response = await tenantApi.get(`/booth/${id}`);
  return response.data;
}

/**
 * 获取档口商品列表
 */
export async function getBoothProducts(
  boothId: string,
  pageNum: number = 1,
  size: number = 12
): Promise<PaginatedResponse<BoothProduct>> {
  const response = await tenantApi.get(`/booth/${boothId}/products`, {
    params: {
      pageNum: pageNum.toString(),
      size: size.toString()
    }
  });
  return response.data;
}

// ==================== 行为记录相关API ====================

/**
 * 记录档口浏览
 */
export async function trackBoothView(boothId: string): Promise<void> {
  try {
    await tenantApi.post('/user/history', {
      type: 'booth',
      targetId: boothId
    });
  } catch (error) {
    console.warn('Failed to track booth view:', error);
  }
}

/**
 * 记录档口联系行为
 */
export async function trackBoothContact(
  boothId: string,
  contactType: 'phone' | 'wechat' | 'qq'
): Promise<void> {
  try {
    await tenantApi.post('/analytics/contact', {
      boothId,
      contactType,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Failed to track booth contact:', error);
  }
}

/**
 * 记录档口分享行为
 */
export async function trackBoothShare(boothId: string): Promise<void> {
  try {
    await tenantApi.post('/analytics/share', {
      boothId,
      shareType: 'booth',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Failed to track booth share:', error);
  }
}