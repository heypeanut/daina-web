// 新版档口API - 使用tenant端接口
import { tenantApi, PaginatedResponse } from "./config";
import { isLoggedIn } from "@/lib/auth";
import { ProductDetail } from "@/app/product/[id]/types";
import { searchBooths as searchBoothsAPI } from "./search";
import { uploadImage } from ".";

// 导入类型定义
import {
  Booth,
  BoothProduct,
  BoothApplicationForm,
  BoothCategory,
  BoothApplicationResponse,
  BoothApplicationRequest,
  MyBoothResponse,
  UserBoothStatus,
  BoothDetail,
  BoothManagementInfo,
  BoothEditForm,
  BoothEditInfo,
  MyBoothItem,
  ProductManagementFilter,
  ProductActionResponse,
  ProductListItem,
  ProductCreateForm,
  ProductCreateRequest,
  ProductCreateResponse,
  ProductCategory
} from "@/types/booth";

import {
  GetBoothsParams,
  GetBoothsResponse,
  GetBoothProductsParams
} from "@/types/booth-api";

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
      coverImg: coverImageUrl, // 前端coverImage -> 后端coverImg
      wx: formData.wx,
      qq: formData.qq,
      wxQrcode: wxQrCodeUrl, // 前端wxQrCode -> 后端wxQrcode
      qqQrcode: qqQrCodeUrl, // 前端qqQrCode -> 后端qqQrcode
      profile: formData.description, // 前端description -> 后端profile
      categoryIds: formData.categoryIds
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
 * 获取用户的所有档口列表
 */
export async function getMyBooths(): Promise<MyBoothResponse> {
  try {
    const response = await tenantApi.get<MyBoothResponse>(
      "/booth/mine"
    );
    console.log("response.data", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching my booths:", error);
    throw new Error("获取我的档口列表失败");
  }
}

/**
 * 获取用户档口状态（前端格式化）
 */
export async function getUserBoothStatus(): Promise<UserBoothStatus> {
  try {
    const statusResponse = await getMyBooths();
    const { rows, total } = statusResponse;

    // 将后端状态映射为前端状态
    const booths = rows.map((item) => ({
      id: item.id,
      boothName: item.boothName,
      status: mapBoothStatus(item.status),
      statusText: item.statusText,
      rejectReason: item.rejectReason || undefined,
      auditTime: item.auditTime || undefined,
      lastSubmitTime: item.lastSubmitTime,
      coverImg: item.coverImg, // 新增字段
    }));

    // 统计不同状态的档口数量
    const activeBooths = booths.filter((booth) => booth.status === "active");
    const pendingBooths = booths.filter((booth) => booth.status === "pending");
    const rejectedBooths = booths.filter((booth) => booth.status === "rejected");

    return {
      hasBooths: activeBooths.length > 0,
      hasActiveBooths: activeBooths.length > 0,
      hasPendingBooths: pendingBooths.length > 0,
      hasRejectedBooths: rejectedBooths.length > 0,
      booths,
      totalBooths: total,
      activeBoothsCount: activeBooths.length,
      pendingBoothsCount: pendingBooths.length,
      rejectedBoothsCount: rejectedBooths.length,
    };
  } catch (error) {
    console.error("Error fetching user booth status:", error);
    throw new Error("获取档口状态失败");
  }
}

// ==================== 多档口支持API ====================

/**
 * 获取指定档口详情 - 直接调用单个档口接口
 */
export async function getMyBoothDetailById(id: string): Promise<MyBoothItem> {
  try {
    const response = await tenantApi.get<MyBoothItem>(`/booth/mine/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booth detail for id ${id}:`, error);
    throw new Error("档口不存在或无访问权限");
  }
}

/**
 * 获取档口管理信息（包含统计数据）
 */
export async function getBoothManagementInfo(id: string): Promise<BoothManagementInfo> {
  try {
    // 直接获取单个档口详情
    const boothItem = await getMyBoothDetailById(id);
    
    // TODO: 获取统计数据（等后端提供统计接口后更新）
    // 目前使用模拟数据
    const stats = {
      totalProducts: 0,
      totalViews: 0,
      totalOrders: 0,
      rating: 5.0,
      followers: 0
    };

    // 将MyBoothItem转换为BoothManagementInfo格式
    return {
      id: boothItem.id,
      boothName: boothItem.boothName,
      boothNumber: boothItem.boothNumber,
      market: boothItem.market,
      address: boothItem.address,
      mainBusiness: boothItem.mainBusiness,
      phone: boothItem.phone,
      wx: boothItem.wx,
      qq: boothItem.qq,
      coverImg: boothItem.coverImg,
      status: mapBoothStatus(boothItem.status) as "active" | "pending" | "rejected",
      statusText: boothItem.statusText,
      stats,
      createdAt: boothItem.createdAt
    };
  } catch (error) {
    console.error(`Error fetching booth management info for id ${id}:`, error);
    throw new Error("获取档口管理信息失败");
  }
}

/**
 * 获取用户的所有档口列表（用于档口选择页面）
 */
export async function getUserBoothList(): Promise<import("@/types/booth").BoothSelectItem[]> {
  try {
    const userStatus = await getUserBoothStatus();
    
    // 将UserBoothStatus转换为BoothSelectItem格式
    return userStatus.booths.map(booth => ({
      id: booth.id,
      boothName: booth.boothName,
      boothNumber: "", // 等待后端在/booth/mine接口中添加该字段
      market: "", // 等待后端在/booth/mine接口中添加该字段
      status: booth.status,
      statusText: booth.statusText,
      coverImg: booth.coverImg,
      rejectReason: booth.rejectReason,
      auditTime: booth.auditTime,
      lastSubmitTime: booth.lastSubmitTime
    }));
  } catch (error) {
    console.error("Error fetching user booth list:", error);
    throw new Error("获取档口列表失败");
  }
}

// ==================== 档口编辑相关API ====================

/**
 * 获取档口编辑信息
 */
export async function getBoothEditInfo(boothId: string): Promise<BoothEditInfo> {
  try {
    // 获取档口详细信息
    const boothItem = await getMyBoothDetailById(boothId);
    
    // 转换为编辑表单所需的数据格式
    return {
      id: boothItem.id,
      boothNumber: boothItem.boothNumber,
      boothName: boothItem.boothName,
      market: boothItem.market,
      mainBusiness: boothItem.mainBusiness,
      address: boothItem.address,
      phone: boothItem.phone,
      coverImg: boothItem.coverImg,
      wx: boothItem.wx,
      qq: boothItem.qq,
      wxQrcode: boothItem.wxQrcode,
      qqQrcode: boothItem.qqQrcode,
      profile: "" // MyBoothItem中没有profile字段，使用空字符串
    };
  } catch (error) {
    console.error(`Error fetching booth edit info for id ${boothId}:`, error);
    throw new Error("获取档口编辑信息失败");
  }
}

/**
 * 更新档口信息
 */
export async function updateBoothInfo(
  boothId: string, 
  formData: BoothEditForm
): Promise<BoothApplicationResponse> {
  try {
    // 处理文件上传
    let coverImageUrl: string | undefined;
    let wxQrCodeUrl: string | undefined;
    let qqQrCodeUrl: string | undefined;

    // 只上传新的文件（File类型），字符串类型表示保持现有图片不变
    if (formData.coverImage instanceof File) {
      coverImageUrl = await uploadFileIfExists(formData.coverImage);
    } else if (typeof formData.coverImage === 'string') {
      coverImageUrl = formData.coverImage; // 保持原有URL
    }

    if (formData.wxQrCode instanceof File) {
      wxQrCodeUrl = await uploadFileIfExists(formData.wxQrCode);
    } else if (typeof formData.wxQrCode === 'string') {
      wxQrCodeUrl = formData.wxQrCode; // 保持原有URL
    }

    if (formData.qqQrCode instanceof File) {
      qqQrCodeUrl = await uploadFileIfExists(formData.qqQrCode);
    } else if (typeof formData.qqQrCode === 'string') {
      qqQrCodeUrl = formData.qqQrCode; // 保持原有URL
    }

    // 构建更新请求数据
    const requestData = {
      boothName: formData.boothName,
      market: formData.market,
      mainBusiness: formData.mainBusiness,
      address: formData.address,
      phone: formData.phone,
      wx: formData.wx,
      qq: formData.qq,
      profile: formData.description,
      ...(coverImageUrl && { coverImg: coverImageUrl }),
      ...(wxQrCodeUrl && { wxQrcode: wxQrCodeUrl }),
      ...(qqQrCodeUrl && { qqQrcode: qqQrCodeUrl })
    };

    // 调用后端更新接口（假设使用PUT方法）
    const response = await tenantApi.put<BoothApplicationResponse>(
      `/booth/${boothId}`,
      requestData
    );

    return {
      success: true,
      message: response.data.message || "档口信息更新成功！",
      applicationId: boothId
    };
  } catch (error: any) {
    console.error("Error updating booth info:", error);

    // 处理不同类型的错误
    if (error.message?.includes("文件上传失败")) {
      throw error; // 直接抛出文件上传错误
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("更新档口信息失败，请重试");
  }
}

// ==================== 产品管理相关API ====================

/**
 * 切换商品上下架状态
 */
export async function toggleProductStatus(
  productId: string, 
  status: 'active' | 'inactive'
): Promise<ProductActionResponse> {
  try {
    const response = await tenantApi.put<ProductActionResponse>(
      `/product/${productId}/status`,
      { status }
    );

    return {
      success: true,
      message: response.data.message || `商品已${status === 'active' ? '上架' : '下架'}`,
      updatedCount: 1
    };
  } catch (error: any) {
    console.error("Error toggling product status:", error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(`${status === 'active' ? '上架' : '下架'}商品失败，请重试`);
  }
}

/**
 * 删除商品
 */
export async function deleteBoothProduct(productId: string): Promise<ProductActionResponse> {
  try {
    const response = await tenantApi.delete<ProductActionResponse>(
      `/product/${productId}`
    );

    return {
      success: true,
      message: response.data.message || "商品删除成功",
      updatedCount: 1
    };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error("删除商品失败，请重试");
  }
}

/**
 * 批量操作商品
 */
export async function batchUpdateProducts(
  productIds: string[], 
  action: 'activate' | 'deactivate' | 'delete'
): Promise<ProductActionResponse> {
  try {
    const response = await tenantApi.post<ProductActionResponse>(
      '/product/batch',
      {
        productIds,
        action
      }
    );

    const actionNames = {
      'activate': '上架',
      'deactivate': '下架', 
      'delete': '删除'
    };

    return {
      success: true,
      message: response.data.message || `批量${actionNames[action]}成功`,
      updatedCount: response.data.updatedCount || productIds.length
    };
  } catch (error: any) {
    console.error("Error batch updating products:", error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    const actionNames = {
      'activate': '上架',
      'deactivate': '下架', 
      'delete': '删除'
    };
    
    throw new Error(`批量${actionNames[action]}失败，请重试`);
  }
}

/**
 * 获取档口商品列表（管理版，包含状态信息）
 */
export async function getBoothProductsManagement(
  boothId: string,
  params: {
    pageNum?: number;
    pageSize?: number;
    keyword?: string;
    status?: 'all' | 'active' | 'inactive';
    sortBy?: 'created_time' | 'price' | 'views';
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedResponse<ProductListItem>> {
  const queryParams = {
    pageNum: (params.pageNum || 1).toString(),
    pageSize: (params.pageSize || 12).toString(),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.status && params.status !== 'all' && { status: params.status }),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.sortOrder && { sortOrder: params.sortOrder })
  };

  try {
    const response = await tenantApi.get(`/product/booth/${boothId}/management`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching booth products for management:", error);
    throw new Error("获取商品列表失败");
  }
}

// ==================== 商品创建相关API ====================

/**
 * 获取商品分类列表
 */
export async function getProductCategories(): Promise<ProductCategory[]> {
  try {
    const response = await tenantApi.get<ProductCategory[]>('/product/categories');
    return response.data.sort((a, b) => a.sort - b.sort);
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw new Error("获取商品分类失败");
  }
}

/**
 * 创建档口商品
 */
export async function createBoothProduct(
  boothId: string,
  formData: ProductCreateForm
): Promise<ProductCreateResponse> {
  try {
    // 1. 上传封面图片（必填）
    if (!formData.coverImage) {
      throw new Error("请上传商品封面图片");
    }

    const coverImageUrl = await uploadFileIfExists(formData.coverImage);
    if (!coverImageUrl) {
      throw new Error("封面图片上传失败");
    }

    // 2. 上传附加图片（可选）
    let additionalImageUrls: string[] = [];
    if (formData.additionalImages && formData.additionalImages.length > 0) {
      try {
        additionalImageUrls = await Promise.all(
          formData.additionalImages.map(async (file) => {
            const url = await uploadFileIfExists(file);
            return url || '';
          })
        );
        // 过滤掉上传失败的图片
        additionalImageUrls = additionalImageUrls.filter(url => url !== '');
      } catch (error) {
        console.warn("部分附加图片上传失败", error);
        // 附加图片上传失败不阻断创建流程
      }
    }

    // 3. 构建 API 请求数据
    const requestData: ProductCreateRequest = {
      name: formData.name,
      price: formData.price,
      originalPrice: formData.originalPrice,
      coverImage: coverImageUrl,
      additionalImages: additionalImageUrls.length > 0 ? additionalImageUrls : undefined,
      description: formData.description,
      categoryId: formData.categoryId,
      stock: formData.stock,
      status: formData.status,
      boothId: boothId
    };

    // 4. 调用后端 API
    const response = await tenantApi.post<ProductCreateResponse>(
      `/product/booth/${boothId}/create`,
      requestData
    );

    return {
      success: true,
      message: response.data.message || "商品创建成功！",
      productId: response.data.productId
    };
  } catch (error: any) {
    console.error("Error creating booth product:", error);

    // 处理不同类型的错误
    if (error.message?.includes("文件上传失败")) {
      throw error; // 直接抛出文件上传错误
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("创建商品失败，请重试");
  }
}
