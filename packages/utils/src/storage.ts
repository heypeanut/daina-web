/**
 * 本地存储工具函数
 */

/**
 * 安全地存储值到localStorage
 * @param key - 存储键
 * @param value - 要存储的值
 */
export function setLocalStorage<T>(key: string, value: T): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("设置本地存储失败:", error);
  }
}

/**
 * 从localStorage安全获取值
 * @param key - 存储键
 * @param defaultValue - 默认值
 * @returns 存储的值或默认值
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error("获取本地存储失败:", error);
    return defaultValue;
  }
}

/**
 * 从localStorage删除键
 * @param key - 存储键
 */
export function removeLocalStorage(key: string): void {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  } catch (error) {
    console.error("删除本地存储失败:", error);
  }
}

/**
 * 安全地存储值到sessionStorage
 * @param key - 存储键
 * @param value - 要存储的值
 */
export function setSessionStorage<T>(key: string, value: T): void {
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error("设置会话存储失败:", error);
  }
}

/**
 * 从sessionStorage安全获取值
 * @param key - 存储键
 * @param defaultValue - 默认值
 * @returns 存储的值或默认值
 */
export function getSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    if (typeof window !== "undefined") {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    }
    return defaultValue;
  } catch (error) {
    console.error("获取会话存储失败:", error);
    return defaultValue;
  }
}
