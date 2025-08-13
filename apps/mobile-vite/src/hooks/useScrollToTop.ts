import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 在路由变化时自动滚动到页面顶部的钩子
 * 模拟 TanStack Router 的默认 resetScroll 行为
 */
export function useScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // 每次路径变化时滚动到顶部
    window.scrollTo(0, 0);
  }, [location.pathname]); // 只监听 pathname 变化，忽略 search 和 hash
}