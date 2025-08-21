// ==================== 基础档口类型 ====================

export interface Booth {
  id: string;
  boothName: string;
  avatar?: string;
  coverImg: string;
  imageUrl?: string;
  description?: string;
  location?: string;
  category?: string;
  rating?: number;
  followers?: number;
  view?: number;
  productsCount?: number;
  rank?: number;
  market?: string;
  phone?: string;
  wx?: string;
  qq?: string;
  wxQrCode?: string;
  qqQrCode?: string;
  address?: string;
  mainBusiness?: string;
  businessHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

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

// ==================== 档口详情相关类型 ====================

export interface BoothDetail {
  id: string;
  boothName: string;
  boothNumber: string;
  market: string;
  address: string;
  phone: string;
  wx?: string;
  qq?: string;
  mainBusiness: string;
  profile?: string;
  coverImg: string;
  wxQrcode?: string;
  qqQrcode?: string;
  categoryIds: string[];
  businessLicense?: string;
  status: "0" | "1" | "2";
  statusText: string;
  auditTime: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  // 统计数据（如果后端提供）
  stats?: {
    totalProducts: number;
    totalViews: number;
    totalOrders: number;
    rating: number;
    followers: number;
  };
}

export interface BoothManagementInfo {
  id: string;
  boothName: string;
  boothNumber: string;
  market: string;
  address: string;
  mainBusiness: string;
  phone: string;
  wx?: string;
  qq?: string;
  coverImg: string;
  status: "active" | "pending" | "rejected";
  statusText: string;
  stats: {
    totalProducts: number;
    totalViews: number;
    totalOrders: number;
    rating: number;
    followers: number;
  };
  createdAt: string;
  productsCount: number;
}

// ==================== 档口申请相关类型 ====================

export interface BoothApplicationForm {
  boothNumber: string;
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  coverImage: File | null;
  wx?: string;
  qq?: string;
  description?: string;
  wxQrCode?: File | null;
  qqQrCode?: File | null;
  categoryIds: string[];
}

export interface BoothApplicationRequest {
  boothName: string;
  boothNumber: string;
  market: string;
  address: string;
  phone: string;
  wx?: string;
  qq?: string;
  mainBusiness: string;
  profile?: string;
  coverImg: string;
  wxQrcode?: string;
  qqQrcode?: string;
  categoryIds: string[];
}

export interface BoothApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

// ==================== 档口状态相关类型 ====================

export interface MyBoothItem {
  id: string;
  boothName: string;
  status: "0" | "1" | "2"; // "0"=待审核, "1"=通过审核, "2"=审核拒绝
  statusText: string; // "待审核", "审核通过", "审核拒绝"
  auditTime: string | null;
  rejectReason: string | null;
  lastSubmitTime: string;
  createdAt: string;
  updatedAt: string;
  coverImg: string; // 新增字段
  boothNumber: "string";
  market: "string";
  address: "string";
  phone: "string";
  mainBusiness: "string";
  wx: "string";
  qq: "string";
  wxQrcode: "string";
  qqQrcode: "string";
  _count: {
    products: number;
  };
}

export interface MyBoothResponse {
  rows: MyBoothItem[];
  total: number;
}

export interface UserBoothStatusItem {
  id: string;
  boothName: string;
  status: "active" | "pending" | "rejected";
  statusText: string;
  market?: string;
  rejectReason?: string;
  auditTime?: string;
  lastSubmitTime?: string;
  coverImg?: string; // 新增字段
}

export interface UserBoothStatus {
  hasBooths: boolean;
  hasActiveBooths: boolean;
  hasPendingBooths: boolean;
  hasRejectedBooths: boolean;
  booths: UserBoothStatusItem[];
  totalBooths: number;
  activeBoothsCount: number;
  pendingBoothsCount: number;
  rejectedBoothsCount: number;
}

// ==================== 档口选择相关类型 ====================

export interface BoothSelectItem {
  id: string;
  boothName: string;
  boothNumber: string;
  market: string;
  status: "active" | "pending" | "rejected";
  statusText: string;
  coverImg?: string;
  rejectReason?: string;
  auditTime?: string;
  lastSubmitTime?: string;
}

export interface BoothSelectFilter {
  status: "all" | "active" | "pending" | "rejected";
}

// ==================== 档口统计相关类型 ====================

export interface BoothStats {
  totalProducts: number;
  totalViews: number;
  totalOrders: number;
  rating: number;
  followers: number;
}

export interface BoothContactInfo {
  phone: string;
  wx?: string;
  qq?: string;
  wxQrcode?: string;
  qqQrcode?: string;
}

// ==================== 档口编辑相关类型 ====================

export interface BoothEditForm {
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  coverImage: File | string | null; // File=新上传, string=现有URL, null=保持原样
  wx?: string;
  qq?: string;
  wxQrCode?: File | string | null;
  qqQrCode?: File | string | null;
  description?: string;
}

export interface BoothEditInfo {
  id: string;
  boothNumber: string; // 只读显示
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  coverImg: string;
  wx?: string;
  qq?: string;
  wxQrcode?: string;
  qqQrcode?: string;
  profile?: string; // 对应description字段
}

// ==================== 产品管理相关类型 ====================

export interface ProductManagementFilter {
  status: "all" | "0" | "1";
  sortBy: "created_time" | "price" | "views";
  sortOrder: "asc" | "desc";
}

export interface ProductActionResponse {
  success: boolean;
  message: string;
  updatedCount?: number;
}

export interface ProductListItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: {
    url: string;
  }[];
  status: string; // 商品状态：上架/下架
  views: number;
  stock?: number;
  createdAt: string;
  updatedAt?: string;
}

// ==================== 商品创建相关类型 ====================

export interface ProductCreateForm {
  name: string;
  price?: number;
  originalPrice?: number;
  images: File[]; // 商品图片数组，第一张为封面图
  description?: string;
  categoryId?: string;
  stock?: number;
  status?: string; // 商品状态
  // 规格参数（可选）
  style?: string; // 风格
  phoneModel?: string; // 适用机型
  productType?: string; // 产品类型
  trend?: string; // 流行元素
  imageType?: string; // 图片类型
  copyright?: string; // 版权
  biodegradable?: string; // 生物降解
  ecoMaterial?: string; // 环保材料
}

export interface ProductCreateRequest {
  name: string;
  price?: number;
  originalPrice?: number;
  images: string[]; // 上传后的图片URLs数组，第一张为封面图
  description?: string;
  categoryId?: string;
  stock?: number;
  status?: string;
  boothId: string;
  // 规格参数（可选）
  style?: string; // 风格
  phoneModel?: string; // 适用机型
  productType?: string; // 产品类型
  trend?: string; // 流行元素
  imageType?: string; // 图片类型
  copyright?: string; // 版权
  biodegradable?: string; // 生物降解
  ecoMaterial?: string; // 环保材料
}

export interface ProductCreateResponse {
  success: boolean;
  message: string;
  productId?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  sort: number;
}

// ==================== 商品详情相关类型 ====================

export interface ProductImage {
  id: number;
  url: string;
  alt?: string;
}

export interface ProductBooth {
  id: string;
  boothName: string;
  mainBusiness: string;
  market: string;
  followers: number;
  view: number;
  phone?: string;
  wx?: string;
  coverImg?: string;
}

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  maxPrice?: number;
  originalPrice?: number;
  stock: number;
  status: number;
  features: string;
  boothId: string;
  video: string;
  views: number;
  collects: number;
  itemNo: string;
  imageType: string;
  copyright: string;
  category: string;
  style: string;
  phoneModel: string;
  productType: string;
  trend: string;
  biodegradable: string;
  ecoMaterial: string;
  services: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  booth: ProductBooth;
}
