/**
 * 共享配置
 */

// API基础URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005";

// 域名配置
export const DOMAIN_CONFIG = {
  // PC端域名
  PC_DOMAIN: process.env.NEXT_PUBLIC_PC_DOMAIN || "yoursite.com",
  // 移动端域名
  MOBILE_DOMAIN: process.env.NEXT_PUBLIC_MOBILE_DOMAIN || "m.yoursite.com",
  // 开发环境PC域名
  DEV_PC_DOMAIN: process.env.NEXT_PUBLIC_DEV_PC_DOMAIN || "localhost:3005",
  // 开发环境移动端域名
  DEV_MOBILE_DOMAIN:
    process.env.NEXT_PUBLIC_DEV_MOBILE_DOMAIN || "localhost:3006",
};

// 缓存配置
export const CACHE_CONFIG = {
  // 首页数据缓存时间（秒）
  HOMEPAGE_DATA_TTL: 300,
  // 用户数据缓存时间（秒）
  USER_DATA_TTL: 3600,
};

// 埋点配置
export const TRACKING_CONFIG = {
  // 是否启用埋点
  ENABLED: true,
  // 埋点上报URL
  TRACKING_URL: process.env.NEXT_PUBLIC_TRACKING_URL || "/api/tracking",
  // 埋点批量上报阈值
  BATCH_SIZE: 10,
};
