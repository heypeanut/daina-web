// 新版API统一导出文件 - 使用tenant端接口
// 这个文件提供了所有基于新API架构的接口调用

// ==================== 配置和工具 ====================
export * from './config';

// ==================== 认证相关 ====================
export * from './auth-new';

// ==================== 首页内容 ====================
export * from './homepage-new';

// ==================== 档口相关 ====================
export * from './booth-new';

// ==================== 用户行为 ====================
export * from './user-behavior-new';

// ==================== 图片搜索和上传 ====================
export * from './upload-search-new';

// ==================== 快捷API导出 ====================

// 认证相关快捷导出
export {
  login,
  smsLogin,
  register,
  logout,
  getUserInfo,
  sendSms,
} from './auth-new';

// 首页数据快捷导出
export {
  getHomepageData,
  getBanners,
  getBoothRecommendations,
  getProductRecommendations,
} from './homepage-new';

// 档口相关快捷导出
export {
  getBooths,
  getBoothDetail,
  getBoothCategories,
  searchBooths,
} from './booth-new';

// 用户行为快捷导出
export {
  addProductToFavorites,
  removeProductFromFavorites,
  followBooth,
  unfollowBooth,
  getFavoriteProducts,
  getFavoriteBooths,
  addFootprint,
  getFootprints,
  clearFootprints,
} from './user-behavior-new';

// 图片功能快捷导出
export {
  searchBoothsByImage,
  searchProductsByImage,
  uploadImage,
  uploadImageWithWatermark,
  uploadImagesBatch,
} from './upload-search-new';

// ==================== API版本信息 ====================
export const API_VERSION = '2.2';
export const API_DESCRIPTION = 'Tenant端API - 基于重构后的/api/tenant/*架构';
export const SUPPORTED_FEATURES = [
  '用户认证和资料管理',
  '首页内容获取',
  '档口浏览和搜索',
  '收藏和历史记录',
  '图片搜索功能',
  '文件上传功能',
] as const;