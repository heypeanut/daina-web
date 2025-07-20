// 缓存时间配置（毫秒）
export const CACHE_TIMES = {
  // 用户信息缓存30分钟
  USER_INFO: 30 * 60 * 1000,
  // 收藏列表缓存5分钟
  FAVORITES_LIST: 5 * 60 * 1000,
  // 收藏状态缓存15分钟
  FAVORITE_STATUS: 15 * 60 * 1000,
  // 浏览记录缓存1分钟
  FOOTPRINTS: 1 * 60 * 1000,
  // 短期缓存30秒
  SHORT_TERM: 30 * 1000,
  // 长期缓存1小时
  LONG_TERM: 60 * 60 * 1000,
} as const;

// 重试配置
export const RETRY_CONFIG = {
  // 默认重试次数
  DEFAULT_RETRY_COUNT: 3,
  // 认证相关不重试
  AUTH_RETRY_COUNT: 0,
  // 变更操作重试一次
  MUTATION_RETRY_COUNT: 1,
  // 重试延迟计算函数
  RETRY_DELAY: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// 查询配置
export const QUERY_CONFIG = {
  // 默认分页大小
  DEFAULT_PAGE_SIZE: 20,
  // 窗口聚焦时是否重新获取
  REFETCH_ON_WINDOW_FOCUS: false,
  // 网络重连时是否重新获取
  REFETCH_ON_RECONNECT: true,
  // 组件挂载时是否重新获取
  REFETCH_ON_MOUNT: true,
} as const;

// 错误码常量
export const ERROR_CODES = {
  // 未认证
  UNAUTHORIZED: 401,
  // 禁止访问
  FORBIDDEN: 403,
  // 未找到
  NOT_FOUND: 404,
  // 服务器错误
  INTERNAL_SERVER_ERROR: 500,
  // 网络错误
  NETWORK_ERROR: 0,
} as const;

// 成功响应码
export const SUCCESS_CODE = 200;