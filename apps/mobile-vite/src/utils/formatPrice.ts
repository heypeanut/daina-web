/**
 * 格式化价格显示
 * @param price 价格数字
 * @returns 格式化后的价格字符串，价格为空时返回空字符串
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '';
  return `¥${price.toFixed(2)}`;
}

/**
 * 格式化数字显示（如关注数、商品数等）
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number | undefined): string {
  if (!num) return "0";
  if (num < 1000) return num.toString();
  if (num < 10000) return `${(num / 1000).toFixed(1)}k`;
  return `${(num / 10000).toFixed(1)}w`;
}