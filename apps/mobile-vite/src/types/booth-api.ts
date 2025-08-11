import { 
  MyBoothResponse, 
  BoothApplicationResponse,
  UserBoothStatus,
  BoothDetail,
  BoothManagementInfo,
  BoothSelectItem,
  BoothProduct 
} from "./booth";

// ==================== 通用API响应类型 ====================

export interface ApiResponse<T> {
  code: number;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page?: number;
  size?: number;
  hasNext?: boolean;
}

// ==================== 档口API请求参数 ====================

export interface GetBoothsParams {
  pageNum: number;
  size: number;
  categoryId?: string;
  keyword?: string;
  sortBy?: "latest" | "popular" | "rating";
  location?: string;
}

export interface GetBoothProductsParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  categoryId?: string;
  sortBy?: "latest" | "popular" | "price" | "sales";
}

// ==================== 档口API响应类型 ====================

export interface GetBoothsResponse extends PaginatedResponse<import("./booth").Booth> {
  page: number;
  size: number;
  hasNext: boolean;
}

export type BoothDetailApiResponse = ApiResponse<BoothDetail>;

export type MyBoothApiResponse = ApiResponse<MyBoothResponse>;

export type UserBoothStatusApiResponse = ApiResponse<UserBoothStatus>;

export type BoothManagementInfoApiResponse = ApiResponse<BoothManagementInfo>;

export type BoothSelectListApiResponse = ApiResponse<BoothSelectItem[]>;

export type BoothProductsApiResponse = ApiResponse<PaginatedResponse<BoothProduct>>;

export type BoothApplicationApiResponse = ApiResponse<BoothApplicationResponse>;

// ==================== 档口管理API相关 ====================

export type BoothStatsApiResponse = ApiResponse<{
  totalProducts: number;
  totalViews: number;
  totalOrders: number;
  rating: number;
  followers: number;
  monthlyViews: number[];
  monthlyOrders: number[];
  categoryDistribution: {
    category: string;
    count: number;
    percentage: number;
  }[];
}>;

// ==================== 档口分析API相关 ====================

export interface BoothAnalyticsParams {
  boothId: string;
  startDate?: string;
  endDate?: string;
  granularity?: "daily" | "weekly" | "monthly";
}

export type BoothAnalyticsResponse = ApiResponse<{
  overview: {
    totalViews: number;
    totalOrders: number;
    totalRevenue: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  trends: {
    date: string;
    views: number;
    orders: number;
    revenue: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    views: number;
    orders: number;
    revenue: number;
  }[];
  customerInsights: {
    newCustomers: number;
    returningCustomers: number;
    topLocations: string[];
  };
}>;

// ==================== 错误响应类型 ====================

export interface ApiError {
  code: number;
  message: string;
  details?: string;
  timestamp: string;
}

export interface ValidationError extends ApiError {
  fields: {
    field: string;
    message: string;
  }[];
}

// ==================== 文件上传相关 ====================

export type FileUploadResponse = ApiResponse<{
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}>;

export type MultiFileUploadResponse = ApiResponse<{
  files: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }[];
}>;

// ==================== 档口搜索API相关 ====================

export interface BoothSearchApiParams {
  keyword: string;
  pageNum?: number;
  pageSize?: number;
  location?: string;
  categoryId?: string;
  sortBy?: "relevance" | "popular" | "rating";
}

export type BoothSearchApiResponse = ApiResponse<{
  rows: import("./booth").Booth[];
  total: number;
  page: number;
  pageSize: number;
  searchTime: number;
  suggestions?: string[];
}>;

// ==================== 联系行为跟踪API ====================

export interface ContactTrackingParams {
  boothId: string;
  contactType: "phone" | "wechat" | "qq";
}

export interface ShareTrackingParams {
  boothId: string;
  shareType: "booth";
}

export interface ViewTrackingParams {
  type: "booth" | "product";
  targetId: string;
}