/**
 * 首页相关API封装
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface HomepageData {
  banners: Array<{
    id: number;
    title: string;
    imageUrl: string;
    linkUrl: string;
    sortOrder: number;
  }>;
  recommendations: {
    hotBooths: Array<unknown>;
    latestBooths: Array<unknown>;
    hotProducts: Array<unknown>;
    latestProducts: Array<unknown>;
    personalizedBooths?: Array<unknown>;
    personalizedProducts?: Array<unknown>;
  };
  metadata: {
    hasPersonalization: boolean;
    userType: string;
    generatedAt: string;
  };
  timestamp: string;
  fromCache: boolean;
}

export interface RecommendationsResponse {
  recommendations: Array<{
    id: string;
    score: number;
    reason: string;
    type: string;
    algorithm?: string;
  }>;
  userId?: number;
  total: number;
  algorithm: string;
}

/**
 * 首页API
 */
export const homepageApi = {
  /**
   * 获取完整首页数据 - 公共
   */
  getHomepageData: async (userId?: number): Promise<HomepageData> => {
    const url = userId
      ? `${BASE_URL}/api/public/homepage/data?userId=${userId}`
      : `${BASE_URL}/api/public/homepage/data`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch homepage data");
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * PC专用，获取完整的首页数据
   */
  getPCHomepageData: async (userId?: number): Promise<HomepageData> => {
    return homepageApi.getHomepageData(userId);
  },

  /**
   * 移动端专用，获取带分页的首页数据
   */
  getMobileHomepageData: async (
    page: number = 1,
    limit: number = 10
  ): Promise<unknown> => {
    const url = `${BASE_URL}/api/public/homepage/product-recommendations?type=product_hot&limit=${limit}&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch mobile homepage data");
    }
    const data = await response.json();
    return data.data;
  },

  /**
   * 获取个性化推荐 - 需要登录
   */
  getPersonalizedRecommendations: async (
    targetType: "booth" | "product",
    limit: number = 15
  ): Promise<RecommendationsResponse> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const url = `${BASE_URL}/api/recommendations/mixed?targetType=${targetType}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch personalized recommendations");
    }

    const data = await response.json();
    return data.data;
  },
};
