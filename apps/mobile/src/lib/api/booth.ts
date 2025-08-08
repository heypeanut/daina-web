// 新版档口API - 使用tenant端接口
import { Booth } from "@/types/booth";
import { tenantApi, PaginatedResponse } from "./config";
import { isLoggedIn } from "@/lib/auth";
import { ProductDetail } from "@/app/product/[id]/types";
import { searchBooths as searchBoothsAPI } from "./search";
import { uploadImage } from ".";

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

// 前端表单数据接口
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
  maxProducts: number;
  sortOrder: number;
  wxQrCode?: File | null;
  qqQrCode?: File | null;
  description?: string;
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
  sortBy?: "latest" | "popular" | "rating";
  location?: string;
}

export interface GetBoothsResponse extends PaginatedResponse<Booth> {
  page: number;
  size: number;
  hasNext: boolean;
}

export interface GetBoothProductsParams {
  pageNum: number;
  pageSize: number;
  keyword?: string;
  categoryId?: string;
  sortBy?: "latest" | "popular" | "price" | "sales";
}

export interface BoothApplicationResponse {
  success: boolean;
  message: string;
  applicationId?: string;
}

// 后端API请求接口（匹配后端字段）
export interface BoothApplicationRequest {
  boothName: string;
  boothNumber: string;
  wxQrcode?: string; // 文件上传后的URL
  qqQrcode?: string; // 文件上传后的URL
  wx?: string;
  qq?: string;
  address: string;
  market: string;
  phone: string;
  rank: string; // 对应前端的 sortOrder
  mainBusiness: string;
  maxProducts: number;
  coverImg: string; // 文件上传后的URL
  profile?: string; // 对应前端的 description
}

// 后端审核状态接口响应
export interface BoothApplyStatusItem {
  id: string;
  boothName: string;
  status: string; // "0"=待审核, "1"=通过审核, "2"=审核拒绝
  statusText: string; // "待审核", "审核通过", "审核拒绝"
  auditTime: string;
  rejectReason: string;
  lastSubmitTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoothApplyStatusResponse {
  rows: BoothApplyStatusItem[];
  total: number;
}

// 前端使用的用户档口状态
export interface UserBoothStatus {
  hasBooths: boolean;
  booths: {
    id: string;
    boothName: string;
    status: "active" | "pending" | "rejected";
    statusText: string;
    market?: string;
    rejectReason?: string;
    auditTime?: string;
  }[];
  totalBooths: number;
}

// ==================== 档口列表相关API ====================

/**
 * 获取档口列表
 */
export async function getBooths(
  params: GetBoothsParams
): Promise<GetBoothsResponse> {
  const queryParams = {
    ...params,
    pageNum: params.pageNum.toString(),
    size: params.size.toString(),
  };
  const response = await tenantApi.get("/booth", { params: queryParams });
  return response.data;
}

/**
 * 获取档口分类
 */
export async function getBoothCategories(): Promise<BoothCategory[]> {
  const response = await tenantApi.get("/booth/categories");
  return response.data;
}

/**
 * 搜索档口 - 使用专门的搜索接口
 */
export async function searchBooths(
  keyword: string,
  pageNum: number = 1,
  size: number = 20
): Promise<GetBoothsResponse> {
  const searchResponse = await searchBoothsAPI({
    keyword,
    pageNum,
    pageSize: size,
  });

  // 转换响应格式以保持兼容性
  return {
    rows: searchResponse.rows,
    total: searchResponse.total,
    page: pageNum,
    size: size,
    hasNext: pageNum * size < searchResponse.total,
  };
}

/**
 * 获取热门档口
 */
export async function getHotBooths(limit: number = 10): Promise<Booth[]> {
  const response = await getBooths({
    pageNum: 1,
    size: limit,
    sortBy: "popular",
  });
  return response.rows;
}

// ==================== 档口详情相关API ====================

/**
 * 获取档口详情 - 使用 /api/tenant/booth/{id} 接口
 */
export async function getBoothDetail(id: string): Promise<Booth> {
  const response = await tenantApi.get(`/booth/${id}`);
  return response.data;
}

/**
 * 获取档口商品列表 - 使用 /api/tenant/product/booth/{boothId} 接口（支持分页）
 */
export async function getBoothProducts(
  boothId: string,
  params: GetBoothProductsParams = { pageNum: 1, pageSize: 12 }
): Promise<PaginatedResponse<BoothProduct>> {
  const queryParams = {
    pageNum: params.pageNum.toString(),
    pageSize: params.pageSize.toString(),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.sortBy && { sortBy: params.sortBy }),
  };

  const response = await tenantApi.get(`/product/booth/${boothId}`, {
    params: queryParams,
  });
  return response.data;
}

// ==================== 行为记录相关API ====================

/**
 * 记录档口浏览
 */
export async function trackBoothView(boothId: string): Promise<void> {
  // 如果未登录，直接返回，不执行埋点
  if (!isLoggedIn()) {
    return;
  }

  try {
    await tenantApi.post("/user/history", {
      type: "booth",
      targetId: boothId,
    });
  } catch (error) {
    console.warn("Failed to track booth view:", error);
  }
}

/**
 * 记录档口联系行为
 */
export async function trackBoothContact(
  boothId: string,
  contactType: "phone" | "wechat" | "qq"
): Promise<void> {
  try {
    await tenantApi.post("/analytics/contact", {
      boothId,
      contactType,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track booth contact:", error);
  }
}

/**
 * 记录档口分享行为
 */
export async function trackBoothShare(boothId: string): Promise<void> {
  try {
    await tenantApi.post("/analytics/share", {
      boothId,
      shareType: "booth",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track booth share:", error);
  }
}

// ==================== 产品详情相关API ====================

/**
 * 获取产品详情 - 使用 /api/tenant/product/{id} 接口
 */
export async function getProductDetail(id: string): Promise<ProductDetail> {
  const response = await tenantApi.get(`/product/${id}`);
  return response.data;
}

/**
 * 记录产品浏览
 */
export async function trackProductView(productId: string): Promise<void> {
  // 如果未登录，直接返回，不执行埋点
  if (!isLoggedIn()) {
    return;
  }

  try {
    await tenantApi.post("/user/history", {
      type: "product",
      targetId: productId,
    });
  } catch (error) {
    console.warn("Failed to track product view:", error);
  }
}

/**
 * 记录产品分享行为
 */
export async function trackProductShare(productId: string): Promise<void> {
  try {
    await tenantApi.post("/analytics/share", {
      productId,
      shareType: "product",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.warn("Failed to track product share:", error);
  }
}

/**
 * 提交档口入驻申请
 */
export async function submitBoothApplication(
  formData: BoothApplicationForm
): Promise<BoothApplicationResponse> {
  try {
    // 1. 先上传所有文件
    const coverImageUrl = await uploadFileIfExists(formData.coverImage);
    if (!coverImageUrl) {
      throw new Error("封面图片为必填项");
    }

    const wxQrCodeUrl = await uploadFileIfExists(formData.wxQrCode ?? null);
    const qqQrCodeUrl = await uploadFileIfExists(formData.qqQrCode ?? null);

    // 2. 构建API请求数据，映射字段名
    const requestData: BoothApplicationRequest = {
      boothName: formData.boothName,
      boothNumber: formData.boothNumber,
      market: formData.market,
      mainBusiness: formData.mainBusiness,
      address: formData.address,
      phone: formData.phone,
      rank: formData.sortOrder.toString(), // 前端sortOrder -> 后端rank
      maxProducts: formData.maxProducts,
      coverImg: coverImageUrl, // 前端coverImage -> 后端coverImg
      wx: formData.wx,
      qq: formData.qq,
      wxQrcode: wxQrCodeUrl, // 前端wxQrCode -> 后端wxQrcode
      qqQrcode: qqQrCodeUrl, // 前端qqQrCode -> 后端qqQrcode
      profile: formData.description, // 前端description -> 后端profile
    };

    // 3. 调用后端API
    const response = await tenantApi.post<BoothApplicationResponse>(
      "/booth/apply",
      requestData
    );

    return {
      success: true,
      message:
        response.data.message ||
        "档口入驻申请提交成功！我们将在3-5个工作日内审核。",
      applicationId: response.data.applicationId,
    };
  } catch (error: any) {
    console.error("Error submitting booth application:", error);

    // 处理不同类型的错误
    if (error.message?.includes("文件上传失败")) {
      throw error; // 直接抛出文件上传错误
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("提交申请失败，请重试");
  }
}

/**
 * 上传文件并返回URL（如果文件存在）
 */
async function uploadFileIfExists(
  file: File | null
): Promise<string | undefined> {
  if (!file) return undefined;

  try {
    const uploadResult = await uploadImage(file);
    return uploadResult.url;
  } catch (error) {
    console.error("文件上传失败:", error);
    throw new Error("文件上传失败，请重试");
  }
}

/**
 * 映射后端状态码为前端状态
 */
function mapBoothStatus(
  backendStatus: string
): "active" | "pending" | "rejected" {
  switch (backendStatus) {
    case "0":
      return "pending"; // 待审核
    case "1":
      return "active"; // 审核通过
    case "2":
      return "rejected"; // 审核拒绝
    default:
      return "pending"; // 默认为待审核
  }
}

/**
 * 获取用户档口申请状态
 */
export async function getBoothApplyStatus(): Promise<BoothApplyStatusResponse> {
  const response = await tenantApi.get<BoothApplyStatusResponse>(
    "/booth/apply/status"
  );
  console.log("response.data", response.data);
  return response.data;
}

/**
 * 获取用户档口状态（前端格式化）
 */
export async function getUserBoothStatus(): Promise<UserBoothStatus> {
  try {
    const statusResponse = await getBoothApplyStatus();
    const { rows, total } = statusResponse;

    // 将后端状态映射为前端状态
    const booths = rows.map((item) => ({
      id: item.id,
      boothName: item.boothName,
      status: mapBoothStatus(item.status),
      statusText: item.statusText,
      rejectReason: item.rejectReason,
      auditTime: item.auditTime,
    }));

    // 判断是否有已通过审核的档口
    const hasActiveBooths = booths.some((booth) => booth.status === "active");
    return {
      hasBooths: hasActiveBooths,
      booths,
      totalBooths: total,
    };
  } catch (error) {
    console.error("Error fetching user booth status:", error);
    throw new Error("获取档口状态失败");
  }
}
