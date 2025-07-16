/**
 * 设备检测工具函数
 */

/**
 * 检测当前设备是否为移动设备
 * @param userAgent - 用户代理字符串
 * @returns 是否为移动设备
 */
export function isMobileDevice(userAgent?: string): boolean {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

  return mobileRegex.test(ua);
}

/**
 * 获取设备类型
 * @param userAgent - 用户代理字符串
 * @returns 设备类型
 */
export function getDeviceType(
  userAgent?: string
): "mobile" | "tablet" | "desktop" {
  const ua =
    userAgent || (typeof navigator !== "undefined" ? navigator.userAgent : "");

  // 检测平板设备
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }

  // 检测移动设备
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }

  // 默认桌面设备
  return "desktop";
}
