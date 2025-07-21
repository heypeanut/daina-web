import { 
  Booth, 
  BoothDetail, 
  BoothCategory, 
  BoothProduct 
} from '../../../../../src/types/booth';
import { 
  GetBoothsParams, 
  GetBoothsResponse,
  MarketFilters 
} from '@/app/market/types/market';
import { GetBoothDetailResponse } from '@/app/booth/[id]/types/detail';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// API response wrapper
interface APIResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// 档口列表相关 API
export async function getBooths(params: GetBoothsParams): Promise<GetBoothsResponse> {
  // TODO: 实际 API 调用
  console.log('Fetching booths with params:', params);
  
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: [],
        total: 0,
        page: params.page,
        size: params.size,
        hasNext: false
      });
    }, 1000);
  });
}

export async function getBoothCategories(): Promise<BoothCategory[]> {
  // TODO: 实际 API 调用
  console.log('Fetching booth categories');
  
  // Mock response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'all', name: '全部', count: 1234 },
        { id: 'electronics', name: '电子产品', count: 456 },
        { id: 'accessories', name: '手机配件', count: 789 },
        { id: 'computers', name: '电脑数码', count: 321 },
      ]);
    }, 500);
  });
}

export async function searchBooths(keyword: string): Promise<Booth[]> {
  // TODO: 实际 API 调用
  console.log('Searching booths with keyword:', keyword);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 800);
  });
}

export async function getHotBooths(limit: number = 10): Promise<Booth[]> {
  // TODO: 实际 API 调用
  console.log('Fetching hot booths, limit:', limit);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 600);
  });
}

// 档口详情相关 API
export async function getBoothDetail(id: string): Promise<GetBoothDetailResponse> {
  // TODO: 实际 API 调用
  console.log('Fetching booth detail for id:', id);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id || id === 'error') {
        reject(new Error('档口不存在'));
        return;
      }
      
      resolve({
        id,
        title: `档口 ${id}`,
        avatar: '/cover.png',
        main_business: ['电子产品', '手机配件'],
        phone: '13800138000',
        wx: 'booth_wx_' + id,
        address: '华强北电子市场A座101',
        market: '华强北商业区',
        description: '这是一个示例档口的详细描述...',
        isOnline: true,
        businessHours: {
          weekdays: '9:00-18:00',
          weekends: '10:00-17:00'
        },
        certification: {
          isVerified: true,
          verificationType: 'business'
        },
        statistics: {
          viewCount: 1234,
          favoriteCount: 89,
          contactCount: 45,
          rating: 4.5,
          reviewCount: 67
        },
        products: [],
        relatedBooths: []
      });
    }, 1000);
  });
}

export async function getBoothProducts(
  boothId: string, 
  page: number = 1, 
  size: number = 12
): Promise<BoothProduct[]> {
  // TODO: 实际 API 调用
  console.log('Fetching booth products for:', boothId, page, size);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 800);
  });
}

export async function getRelatedBooths(
  boothId: string, 
  limit: number = 6
): Promise<BoothDetail[]> {
  // TODO: 实际 API 调用
  console.log('Fetching related booths for:', boothId, limit);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 600);
  });
}

// 行为记录相关 API
export async function trackBoothView(boothId: string): Promise<void> {
  // TODO: 实际埋点 API 调用
  console.log('Tracking booth view:', boothId);
  
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

export async function trackBoothContact(
  boothId: string, 
  contactType: 'phone' | 'wechat' | 'qq'
): Promise<void> {
  // TODO: 实际埋点 API 调用
  console.log('Tracking booth contact:', boothId, contactType);
  
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}

export async function trackBoothShare(boothId: string): Promise<void> {
  // TODO: 实际埋点 API 调用
  console.log('Tracking booth share:', boothId);
  
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  });
}