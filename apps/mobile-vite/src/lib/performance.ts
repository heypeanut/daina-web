/**
 * 性能优化工具函数
 * 
 * 提供防抖、节流、缓存、懒加载等性能优化相关工具
 * 用于提升应用整体性能和用户体验
 * 
 * @author Claude Code
 * @version 1.0.0
 */

/**
 * 防抖函数
 * 在指定时间内，如果函数被频繁调用，只执行最后一次调用
 * 
 * @param func 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * 节流函数
 * 在指定时间内，函数最多只能执行一次
 * 
 * @param func 需要节流的函数
 * @param delay 时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCallTime >= delay) {
      lastCallTime = now;
      func.apply(this, args);
    }
  };
}

/**
 * 简单的内存缓存类
 * 用于缓存函数执行结果，避免重复计算
 */
export class MemoryCache<T = any> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private maxSize: number;
  private ttl: number; // 生存时间（毫秒）
  
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 默认5分钟TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  /**
   * 获取缓存值
   */
  get(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) return undefined;
    
    // 检查是否过期
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    return item.value;
  }
  
  /**
   * 设置缓存值
   */
  set(key: string, value: T): void {
    // 如果缓存满了，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }
  
  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * 带缓存的函数执行器
 * 自动缓存函数执行结果
 */
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return,
  keyGenerator?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new MemoryCache<Return>();
  
  return (...args: Args): Return => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    let result = cache.get(key);
    if (result === undefined) {
      result = fn(...args);
      cache.set(key, result);
    }
    
    return result;
  };
}

/**
 * 图片懒加载工具
 * 使用 Intersection Observer API 实现高性能图片懒加载
 */
export class LazyImageLoader {
  private observer: IntersectionObserver;
  private images = new Set<HTMLImageElement>();
  
  constructor(options: IntersectionObserverInit = {}) {
    const defaultOptions: IntersectionObserverInit = {
      rootMargin: '50px 0px', // 提前50px开始加载
      threshold: 0.1,
      ...options,
    };
    
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), defaultOptions);
  }
  
  /**
   * 添加需要懒加载的图片
   */
  observe(img: HTMLImageElement): void {
    this.images.add(img);
    this.observer.observe(img);
  }
  
  /**
   * 移除观察的图片
   */
  unobserve(img: HTMLImageElement): void {
    this.images.delete(img);
    this.observer.unobserve(img);
  }
  
  /**
   * 处理交叉观察回调
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          this.unobserve(img);
        }
      }
    });
  }
  
  /**
   * 销毁观察器
   */
  destroy(): void {
    this.observer.disconnect();
    this.images.clear();
  }
}

/**
 * 虚拟滚动计算工具
 * 用于大列表的性能优化
 */
export class VirtualScrollCalculator {
  private itemHeight: number;
  private containerHeight: number;
  private overscan: number; // 预渲染项目数
  
  constructor(itemHeight: number, containerHeight: number, overscan = 5) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.overscan = overscan;
  }
  
  /**
   * 计算可见范围
   */
  calculateVisibleRange(scrollTop: number, totalItems: number): {
    startIndex: number;
    endIndex: number;
    visibleItems: number;
  } {
    const visibleItems = Math.ceil(this.containerHeight / this.itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.overscan);
    const endIndex = Math.min(totalItems - 1, startIndex + visibleItems + this.overscan * 2);
    
    return {
      startIndex,
      endIndex,
      visibleItems,
    };
  }
  
  /**
   * 计算偏移量
   */
  calculateOffset(startIndex: number): number {
    return startIndex * this.itemHeight;
  }
  
  /**
   * 计算总高度
   */
  calculateTotalHeight(totalItems: number): number {
    return totalItems * this.itemHeight;
  }
}

/**
 * 请求空闲时执行任务
 * 利用浏览器空闲时间执行非关键任务
 */
export function runInIdle(callback: () => void, timeout = 5000): void {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // 降级方案：使用 setTimeout
    setTimeout(callback, 0);
  }
}

/**
 * 批量执行任务
 * 将大量任务分批执行，避免阻塞主线程
 */
export async function batchExecute<T>(
  tasks: (() => T)[],
  batchSize = 10,
  delay = 0
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, i + batchSize);
    const batchResults = batch.map(task => task());
    results.push(...batchResults);
    
    // 给浏览器一些时间处理其他任务
    if (delay > 0 && i + batchSize < tasks.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
}