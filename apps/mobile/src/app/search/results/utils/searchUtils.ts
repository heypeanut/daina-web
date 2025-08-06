import type { ProductSearchResponse, BoothSearchResponse } from '@/hooks/api/search';

/**
 * 搜索工具函数集合
 */

/**
 * 检查是否有更多数据可加载
 */
export function hasMoreData(data: ProductSearchResponse | BoothSearchResponse | undefined): boolean {
  if (!data) return false;
  return data.rows.length < data.total;
}

/**
 * 获取搜索结果总数
 */
export function getSearchResultsCount(
  activeTab: 'product' | 'booth',
  productData?: ProductSearchResponse,
  boothData?: BoothSearchResponse
): number {
  if (activeTab === 'product') {
    return productData?.total || 0;
  }
  return boothData?.total || 0;
}

/**
 * 检查搜索是否正在加载中
 */
export function isSearchLoading(
  activeTab: 'product' | 'booth',
  productLoading: boolean,
  boothLoading: boolean
): boolean {
  return activeTab === 'product' ? productLoading : boothLoading;
}

/**
 * 获取搜索错误
 */
export function getSearchError(
  activeTab: 'product' | 'booth',
  productError: Error | null,
  boothError: Error | null
): Error | null {
  return activeTab === 'product' ? productError : boothError;
}

/**
 * 格式化搜索时间显示
 */
export function formatSearchTime(searchTime?: number): string {
  if (!searchTime) return '';
  
  if (searchTime < 1000) {
    return `${searchTime}ms`;
  }
  
  return `${(searchTime / 1000).toFixed(2)}s`;
}

/**
 * 生成搜索结果的日志信息
 */
export function generateSearchLog(
  type: 'product' | 'booth',
  item: { id: string; name?: string; boothName?: string },
  index: number,
  searchKeyword: string
): void {
  console.log(`${type === 'product' ? '商品' : '档口'}点击:`, {
    item,
    position: index,
    searchKeyword,
    timestamp: new Date().toISOString(),
  });
}

/**
 * 验证搜索关键词
 */
export function validateSearchKeyword(keyword: string): boolean {
  return keyword.trim().length > 0;
}

/**
 * 清理搜索关键词
 */
export function cleanSearchKeyword(keyword: string): string {
  return keyword.trim().replace(/\s+/g, ' ');
}

/**
 * 生成搜索结果的缓存键
 */
export function generateCacheKey(
  type: 'product' | 'booth',
  keyword: string,
  sortBy: string,
  page: number
): string {
  return `search_${type}_${keyword}_${sortBy}_${page}`;
}