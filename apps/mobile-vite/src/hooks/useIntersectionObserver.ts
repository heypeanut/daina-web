import { useEffect, useRef, useCallback } from 'react';

export interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * 通用的IntersectionObserver hook
 * 用于检测元素是否进入视口
 */
export function useIntersectionObserver(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    enabled = true,
  } = options;

  const targetRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 使用useCallback确保callback引用稳定
  const stableCallback = useCallback(callback, [callback]);

  useEffect(() => {
    const target = targetRef.current;
    
    if (!target || !enabled) {
      return;
    }

    // 创建观察器
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stableCallback();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    // 开始观察
    observerRef.current.observe(target);

    // 清理函数
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [stableCallback, threshold, rootMargin, enabled]);

  return targetRef;
}

/**
 * 无限滚动专用的hook
 * 结合了IntersectionObserver和加载状态管理
 */
export function useInfiniteScroll(
  loadMore: () => void,
  options: {
    hasMore?: boolean;
    isLoading?: boolean;
    threshold?: number;
    rootMargin?: string;
  } = {}
) {
  const {
    hasMore = true,
    isLoading = false,
    threshold = 0.1,
    rootMargin = '50px',
  } = options;

  // 只有在有更多数据且不在加载中时才触发加载
  const shouldLoad = hasMore && !isLoading;

  const triggerRef = useIntersectionObserver(
    loadMore,
    {
      threshold,
      rootMargin,
      enabled: shouldLoad,
    }
  );

  return {
    triggerRef,
    shouldShowTrigger: hasMore,
    isLoading,
  };
}
