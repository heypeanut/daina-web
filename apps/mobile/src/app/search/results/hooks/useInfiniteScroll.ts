import { useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  /**
   * 距离底部的触发距离（像素）
   * @default 200
   */
  threshold?: number;
  
  /**
   * 是否启用滑动加载
   * @default true
   */
  enabled?: boolean;
  
  /**
   * 防抖延迟时间（毫秒）
   * @default 100
   */
  debounceMs?: number;
  
  /**
   * 根元素选择器，默认为 window
   * @default null (使用 window)
   */
  rootSelector?: string | null;
}

/**
 * 无限滚动Hook
 * 
 * 监听页面滚动，当接近底部时自动触发加载更多
 * 支持防抖、可配置触发距离、防重复加载等功能
 * 
 * @param hasNextPage 是否有下一页数据
 * @param isFetching 是否正在加载中
 * @param onLoadMore 加载更多的回调函数
 * @param options 配置选项
 * 
 * @example
 * ```typescript
 * useInfiniteScroll(
 *   hasNextPage,
 *   isFetchingNextPage,
 *   handleLoadMore,
 *   { threshold: 300, enabled: !isImageSearch }
 * );
 * ```
 */
export function useInfiniteScroll(
  hasNextPage: boolean,
  isFetching: boolean,
  onLoadMore: () => void,
  options: UseInfiniteScrollOptions = {}
) {
  const {
    threshold = 200,
    enabled = true,
    debounceMs = 100,
    rootSelector = null,
  } = options;

  // 防抖定时器引用
  const debounceTimer = useRef<NodeJS.Timeout>();
  
  // 上次触发时间，防止频繁触发
  const lastTriggerTime = useRef<number>(0);
  
  // 最小触发间隔（毫秒）
  const MIN_TRIGGER_INTERVAL = 1000;

  /**
   * 检查是否应该触发加载更多
   */
  const shouldTriggerLoadMore = useCallback((): boolean => {
    // 基础条件检查
    if (!enabled || !hasNextPage || isFetching) {
      console.log('⚠️ [无限滚动调试] 不满足触发条件:', { enabled, hasNextPage, isFetching });
      return false;
    }

    // 防止频繁触发
    const now = Date.now();
    if (now - lastTriggerTime.current < MIN_TRIGGER_INTERVAL) {
      console.log('⏰ [无限滚动调试] 触发过于频繁，已跳过');
      return false;
    }

    return true;
  }, [enabled, hasNextPage, isFetching]);

  /**
   * 计算滚动位置并判断是否触发加载（增强版）
   */
  const checkScrollPosition = useCallback(() => {
    if (!shouldTriggerLoadMore()) return;

    let scrollTop: number;
    let scrollHeight: number;
    let clientHeight: number;
    let elementInfo: string;

    if (rootSelector) {
      // 使用指定的根元素
      const rootElement = document.querySelector(rootSelector) as HTMLElement;
      if (!rootElement) {
        console.warn('⚠️ [无限滚动调试] 找不到指定的滚动容器:', rootSelector);
        return;
      }
      
      scrollTop = rootElement.scrollTop;
      scrollHeight = rootElement.scrollHeight;
      clientHeight = rootElement.clientHeight;
      elementInfo = `Custom element: ${rootSelector}`;
    } else {
      // 使用 window，采用更健壮的方法获取滚动位置
      scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      clientHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
      );
      elementInfo = 'Window';
    }

    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    // 计算滚动百分比
    const scrollPercentage = scrollHeight > 0 ? ((scrollTop + clientHeight) / scrollHeight) * 100 : 0;
    
    console.log('🔍 [无限滚动调试] Scroll position (增强版):', {
      elementInfo,
      scrollTop: Math.round(scrollTop),
      scrollHeight,
      clientHeight,
      distanceFromBottom: Math.round(distanceFromBottom),
      scrollPercentage: Math.round(scrollPercentage),
      threshold,
      shouldTrigger: distanceFromBottom <= threshold,
      enabled,
      hasNextPage,
      isFetching
    });

    // 增强的触发条件：距离底部小于阈值或滚动超过 85%
    const shouldTriggerByDistance = distanceFromBottom <= threshold;
    const shouldTriggerByPercentage = scrollPercentage >= 85; // 85%
    const shouldTriggerLoad = shouldTriggerByDistance || shouldTriggerByPercentage;

    if (shouldTriggerLoad) {
      console.log('🚀 [无限滚动调试] 触发自动加载更多', {
        triggerReason: shouldTriggerByDistance ? '距离阈值' : '百分比阈值',
        distanceFromBottom: Math.round(distanceFromBottom),
        scrollPercentage: Math.round(scrollPercentage)
      });
      lastTriggerTime.current = Date.now();
      onLoadMore();
    }
  }, [shouldTriggerLoadMore, threshold, onLoadMore, rootSelector]);

  /**
   * 防抖的滚动处理函数
   */
  const debouncedScrollHandler = useCallback(() => {
    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 设置新的定时器
    debounceTimer.current = setTimeout(() => {
      checkScrollPosition();
    }, debounceMs);
  }, [checkScrollPosition, debounceMs]);

  /**
   * 立即检查滚动位置（不防抖）
   * 用于初始化时或数据变化时的检查
   */
  const immediateCheck = useCallback(() => {
    // 延迟一帧执行，确保DOM已更新
    requestAnimationFrame(() => {
      checkScrollPosition();
    });
  }, [checkScrollPosition]);

  // 设置和清理滚动监听器
  useEffect(() => {
    if (!enabled) return;

    const scrollElement = rootSelector 
      ? document.querySelector(rootSelector) 
      : window;

    if (!scrollElement) return;

    // 添加滚动监听器
    scrollElement.addEventListener('scroll', debouncedScrollHandler, { passive: true });

    // 初始检查（延迟执行，确保组件已渲染）
    const initialCheckTimer = setTimeout(immediateCheck, 100);

    // 清理函数
    return () => {
      scrollElement.removeEventListener('scroll', debouncedScrollHandler);
      clearTimeout(initialCheckTimer);
      
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [enabled, debouncedScrollHandler, immediateCheck, rootSelector]);

  // 当 hasNextPage 或 isFetching 状态变化时，重新检查
  useEffect(() => {
    if (enabled && hasNextPage && !isFetching) {
      // 延迟检查，给组件时间完成渲染
      const timer = setTimeout(immediateCheck, 200);
      return () => clearTimeout(timer);
    }
  }, [hasNextPage, isFetching, enabled, immediateCheck]);

  // 返回一些有用的状态和方法（可选）
  return {
    /**
     * 手动触发位置检查
     */
    checkScrollPosition: immediateCheck,
    
    /**
     * 重置触发时间限制
     */
    resetTriggerTime: () => {
      lastTriggerTime.current = 0;
    },
  };
}

/**
 * 检测元素是否在视窗中可见的工具函数
 */
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 获取元素距离视窗底部的距离
 */
export function getDistanceFromViewportBottom(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return viewportHeight - rect.bottom;
}