"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getProductDetail, 
  trackProductView, 
  trackProductShare 
} from '@/lib/api/booth';
import { ProductDetail } from '../types';

interface UseProductDetailParams {
  productId: string;
  autoTrackView?: boolean;
  onShareSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProductDetail({
  productId,
  autoTrackView = true,
  onShareSuccess,
  onError
}: UseProductDetailParams) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 使用 ref 保存回调函数的最新引用，避免无限循环
  const onErrorRef = useRef(onError);
  const onShareSuccessRef = useRef(onShareSuccess);
  
  // 更新 ref 的值
  useEffect(() => {
    onErrorRef.current = onError;
    onShareSuccessRef.current = onShareSuccess;
  });


  // 分享处理
  const handleShareClick = useCallback(async () => {
    try {
      await trackProductShare(productId);
      onShareSuccessRef.current?.();
      
      // 调用Web Share API或复制链接
      const shareData = {
        title: product?.name || '商品分享',
        text: `来看看这个商品：${product?.name}`,
        url: `${window.location.origin}/product/${productId}`
      };

      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 备选方案：复制链接到剪贴板
        await navigator.clipboard.writeText(shareData.url);
        console.log('链接已复制到剪贴板');
      }
    } catch (err) {
      console.error('分享失败:', err);
    }
  }, [productId, product?.name]);

  // 初始化加载 - 只在 productId 或 autoTrackView 改变时重新获取
  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    const loadProductDetail = async () => {
      if (cancelled) return;

      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);
        
        // 调用API获取产品基本信息
        const productData = await getProductDetail(productId);
        
        if (cancelled) return;
        
        // 将API数据转换为完整的ProductDetail格式
        setProduct(productData);

        // 自动记录浏览行为
        if (autoTrackView) {
          await trackProductView(productId);
        }

      } catch (err) {
        if (cancelled) return;
        const error = err instanceof Error ? err : new Error('获取产品详情失败');
        setError(error);
        setIsError(true);
        onErrorRef.current?.(error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProductDetail();

    // 清理函数，组件卸载或依赖改变时取消请求
    return () => {
      cancelled = true;
    };
  }, [productId, autoTrackView, refreshTrigger]);

  // 刷新数据 - 通过增加触发器来重新执行 useEffect
  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    product,
    isLoading,
    isError,
    error,
    handleShareClick,
    handleRefresh
  };
}