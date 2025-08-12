import type {
  Banner,
  HomepageData,
  MixedRecommendation,
  PersonalizedRecommendation,
  Product,
  ImageSearchResponse,
  ImageSearchParams,
} from "@/types/api";
import type { Booth } from "@/types/booth";

// API 服务端地址，仅使用环境变量或默认值，不依赖 window
const BASE_URL =
  import.meta.env.API_BASE_URL || "http://localhost:3000";

console.log("API Base URL:", BASE_URL);

interface ApiResponse<T = unknown> {
  code: number;
  msg?: string;        // 后端实际使用的字段
  message?: string;    // 保持兼容性
  data: T;
  timestamp?: string;
  fromCache?: boolean;
}

interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  hasMore: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getAuthHeaders(): HeadersInit {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        return {
          ...this.defaultHeaders,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return this.defaultHeaders;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = options.headers || this.defaultHeaders;

    console.log("API Request:", url);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
        },
        // mode: 'cors', // 明确指定CORS模式
      });

      console.log("API Response status:", response.status, response.statusText);

      const data = await response.json();
      console.log("API Response data:", data);

      // 统一处理业务逻辑错误码
      if (data.code && data.code !== 200) {
        throw new Error(data.msg || data.message || "操作失败");
      }

      // 处理HTTP错误
      if (!response.ok) {
        throw new Error(data.msg || data.message || `请求失败 (${response.status})`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  }

  private async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...this.getAuthHeaders(),
      },
    });
  }

  // 公开接口 - 无需认证
  public async getHomepageData(
    userId?: number
  ): Promise<ApiResponse<HomepageData>> {
    const query = userId ? `?userId=${userId}` : "";
    return this.request<HomepageData>(`/api/tenant/homepage/data${query}`);
  }

  public async getBanners(limit: number = 5): Promise<ApiResponse<Banner[]>> {
    return this.request<Banner[]>(`/api/tenant/homepage/banners?limit=${limit}`);
  }

  public async getBoothRecommendations(params: {
    type?: "booth_hot" | "booth_new";
    pageNum?: number;
    pageSize?: number;
    limit?: number;
    userId?: number;
  }): Promise<ApiResponse<PaginatedResponse<Booth> | Booth[]>> {
    const searchParams = new URLSearchParams();

    if (params.type) searchParams.append("type", params.type);
    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.userId) searchParams.append("userId", params.userId.toString());

    return this.request(
      `/api/tenant/homepage/booth-recommendations?${searchParams}`
    );
  }

  public async getProductRecommendations(params: {
    type?: "product_hot" | "product_new";
    pageNum?: number;
    pageSize?: number;
    limit?: number;
    userId?: number;
  }): Promise<ApiResponse<PaginatedResponse<Product> | Product[]>> {
    const searchParams = new URLSearchParams();

    if (params.type) searchParams.append("type", params.type);
    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.userId) searchParams.append("userId", params.userId.toString());

    return this.request(
      `/api/tenant/homepage/product-recommendations?${searchParams}`
    );
  }

  public async getLatestBoothsWithNewProducts(params: {
    pageNum?: number;
    pageSize?: number;
    userId?: number;
  }): Promise<ApiResponse<PaginatedResponse<Booth>>> {
    const searchParams = new URLSearchParams();

    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.userId) searchParams.append("userId", params.userId.toString());

    return this.request(
      `/api/tenant/homepage/latest-booths-with-new-products?${searchParams}`
    );
  }

  // 个性化推荐接口 - 需要认证
  public async getPersonalizedBooths(params: {
    pageNum?: number;
    pageSize?: number;
    limit?: number;
    days?: number;
  }): Promise<
    ApiResponse<PaginatedResponse<PersonalizedRecommendation<Booth>>>
  > {
    const searchParams = new URLSearchParams();

    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.days) searchParams.append("days", params.days.toString());

    return this.authenticatedRequest(
      `/api/tenant/homepage/personalized-booths?${searchParams}`
    );
  }

  public async getPersonalizedProducts(params: {
    pageNum?: number;
    pageSize?: number;
    limit?: number;
    days?: number;
  }): Promise<
    ApiResponse<PaginatedResponse<PersonalizedRecommendation<Product>>>
  > {
    const searchParams = new URLSearchParams();

    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.days) searchParams.append("days", params.days.toString());

    return this.authenticatedRequest(
      `/api/tenant/homepage/personalized-products?${searchParams}`
    );
  }

  public async getMixedRecommendations(params: {
    targetType: "booth" | "product";
    pageNum?: number;
    pageSize?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<MixedRecommendation>>> {
    const searchParams = new URLSearchParams();

    searchParams.append("targetType", params.targetType);
    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    return this.authenticatedRequest(
      `/api/tenant/homepage/mixed-recommendations?${searchParams}`
    );
  }

  // 用户行为记录
  public async recordBehavior(behaviorData: {
    userId: number;
    behaviorType: "view" | "click" | "favorite" | "share";
    targetType: "booth" | "product" | "banner";
    targetId: string;
    sessionId?: string;
    metadata?: {
      source?: string;
      platform?: "pc" | "mobile";
      position?: number;
      algorithm?: string;
      pageNum?: number;
      scrollPosition?: number;
    };
  }): Promise<ApiResponse<void>> {
    return this.authenticatedRequest("/api/behavior/record", {
      method: "POST",
      body: JSON.stringify(behaviorData),
    });
  }

  // 获取热门内容
  public async getPopularContent(params: {
    targetType: "booth" | "product";
    pageNum?: number;
    pageSize?: number;
    days?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Booth | Product>>> {
    const searchParams = new URLSearchParams();

    if (params.pageNum)
      searchParams.append("pageNum", params.pageNum.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.days) searchParams.append("days", params.days.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());

    return this.request(
      `/api/behavior/popular/${params.targetType}?${searchParams}`
    );
  }

  // 获取档口排行榜
  public async getBoothRanking(params: {
    limit?: number;
    userId?: number;
  }): Promise<ApiResponse<Booth[]>> {
    const searchParams = new URLSearchParams();

    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.userId) searchParams.append("userId", params.userId.toString());

    return this.request(
      `/api/tenant/homepage/booth-ranking?${searchParams}`
    );
  }

  // 图片搜索接口
  public async searchImageBooth(
    params: ImageSearchParams
  ): Promise<ImageSearchResponse> {
    const formData = new FormData();
    formData.append("image", params.image);

    if (params.limit) formData.append("limit", params.limit.toString());
    if (params.minSimilarity)
      formData.append("minSimilarity", params.minSimilarity.toString());

    // 构建请求头，如果有token就添加，没有就用空对象
    const headers: HeadersInit = {};
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}/api/tenant/search/image/booth`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  public async searchImageProduct(
    params: ImageSearchParams
  ): Promise<ImageSearchResponse> {
    const formData = new FormData();
    formData.append("image", params.image);

    if (params.limit) formData.append("limit", params.limit.toString());
    if (params.minSimilarity)
      formData.append("minSimilarity", params.minSimilarity.toString());
    if (params.boothId) formData.append("boothId", params.boothId);
    if (params.minPrice)
      formData.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      formData.append("maxPrice", params.maxPrice.toString());

    // 构建请求头，如果有token就添加，没有就用空对象
    const headers: HeadersInit = {};
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${this.baseURL}/api/tenant/search/image/product`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// 导出API客户端实例
export const apiClient = new ApiClient();
export type { ApiResponse, PaginatedResponse };