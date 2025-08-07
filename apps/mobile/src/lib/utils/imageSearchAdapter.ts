/**
 * 图片搜索工具函数
 * 用于检测和处理图片搜索特有的相似度字段
 */

// 检查对象是否包含图片搜索特有字段
export function hasImageSearchData(item: any): boolean {
  // 检查标准相似度字段
  return item && typeof item.similarity === 'number';
}

// 获取相似度数值
export function getSimilarityScore(item: any): number {
  return item?.similarity ?? 0;
}