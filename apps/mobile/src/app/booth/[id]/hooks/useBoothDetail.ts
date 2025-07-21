"use client";

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getBoothDetail, 
  getBoothProducts, 
  trackBoothView, 
  trackBoothContact, 
  trackBoothShare 
} from '@/lib/api/booth';
import { useFollowBooth, useUnfollowBooth, useBoothFollowStatus } from '@/hooks/api/favorites/useFavoriteBooths';
import { ContactType } from '../types/detail';

interface UseBoothDetailOptions {
  boothId: string;
  autoTrackView?: boolean;
  onContactSuccess?: (type: ContactType, value: string) => void;
  onShareSuccess?: () => void;
}

export function useBoothDetail(options: UseBoothDetailOptions) {
  const { 
    boothId, 
    autoTrackView = true,
    onContactSuccess,
    onShareSuccess 
  } = options;

  // 本地状态
  const [activeTab, setActiveTab] = useState<'info' | 'products' | 'reviews'>('info');
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // 档口详情查询
  const {
    data: booth,
    isLoading: isBoothLoading,
    isError: isBoothError,
    error: boothError,
    refetch: refetchBooth
  } = useQuery({
    queryKey: ['booth-detail', boothId],
    queryFn: async () => await getBoothDetail(boothId),
    staleTime: 10 * 60 * 1000, // 10分钟
    enabled: !!boothId,
  });

  // 档口商品查询
  const {
    data: products = [],
    isLoading: isProductsLoading,
    refetch: refetchProducts
  } = useQuery({
    queryKey: ['booth-products', boothId],
    queryFn: async () => await getBoothProducts(boothId),
    staleTime: 10 * 60 * 1000, // 10分钟
    enabled: !!boothId && !!booth,
  });

  // 收藏状态查询
  const {
    data: isFavorited = false,
    isLoading: isFavoriteLoading
  } = useBoothFollowStatus(boothId);

  // 收藏操作
  const followMutation = useFollowBooth({
    onSuccess: () => console.log('收藏成功'),
    onError: (error) => console.error('收藏失败:', error)
  });

  const unfollowMutation = useUnfollowBooth({
    onSuccess: () => console.log('取消收藏成功'),
    onError: (error) => console.error('取消收藏失败:', error)
  });

  // 浏览埋点
  const trackViewMutation = useMutation({
    mutationFn: async (id: string) => await trackBoothView(id),
    onError: (error) => console.error('浏览埋点失败:', error)
  });

  // 联系埋点
  const trackContactMutation = useMutation({
    mutationFn: async ({ boothId, type }: { boothId: string, type: ContactType }) => {
      if (type === 'address') return; // 地址点击不需要埋点
      return await trackBoothContact(boothId, type as 'phone' | 'wechat' | 'qq');
    },
    onError: (error) => console.error('联系埋点失败:', error)
  });

  // 分享埋点
  const trackShareMutation = useMutation({
    mutationFn: async (id: string) => await trackBoothShare(id),
    onError: (error) => console.error('分享埋点失败:', error)
  });

  // 自动触发浏览埋点
  useEffect(() => {
    if (booth && autoTrackView && !hasTrackedView) {
      trackViewMutation.mutate(boothId);
      setHasTrackedView(true);
    }
  }, [booth, autoTrackView, hasTrackedView, boothId, trackViewMutation]);

  // 收藏切换
  const handleFavoriteToggle = useCallback(() => {
    if (isFavorited) {
      unfollowMutation.mutate(boothId);
    } else {
      followMutation.mutate(boothId);
    }
  }, [isFavorited, boothId, followMutation, unfollowMutation]);

  // 联系操作
  const handleContactClick = useCallback((type: ContactType, value: string) => {
    // 埋点记录
    trackContactMutation.mutate({ boothId, type });

    // 执行对应的联系操作
    switch (type) {
      case 'phone':
        window.location.href = `tel:${value}`;
        break;
      case 'wechat':
        // 复制微信号到剪贴板
        navigator.clipboard.writeText(value).then(() => {
          alert(`微信号已复制: ${value}`);
        }).catch(() => {
          alert(`微信号: ${value}`);
        });
        break;
      case 'qq':
        // 复制QQ号到剪贴板
        navigator.clipboard.writeText(value).then(() => {
          alert(`QQ号已复制: ${value}`);
        }).catch(() => {
          alert(`QQ号: ${value}`);
        });
        break;
      case 'address':
        // 打开地图应用
        const encodedAddress = encodeURIComponent(value);
        window.open(`https://maps.google.com/maps?q=${encodedAddress}`, '_blank');
        break;
    }

    onContactSuccess?.(type, value);
  }, [boothId, trackContactMutation, onContactSuccess]);

  // 分享操作
  const handleShareClick = useCallback(() => {
    // 埋点记录
    trackShareMutation.mutate(boothId);

    // 分享逻辑
    if (navigator.share && booth) {
      navigator.share({
        title: booth.title,
        text: `查看档口: ${booth.title}`,
        url: window.location.href,
      }).catch((error) => {
        console.error('分享失败:', error);
        // 降级到复制链接
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('链接已复制到剪贴板');
        });
      });
    } else if (booth) {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('链接已复制到剪贴板');
      }).catch(() => {
        alert(`请分享此链接: ${window.location.href}`);
      });
    }

    onShareSuccess?.();
  }, [boothId, booth, trackShareMutation, onShareSuccess]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    refetchBooth();
    refetchProducts();
  }, [refetchBooth, refetchProducts]);

  // Tab 切换
  const handleTabChange = useCallback((tab: 'info' | 'products' | 'reviews') => {
    setActiveTab(tab);
  }, []);

  return {
    // 数据
    booth,
    products,
    isFavorited,
    
    // 状态
    isLoading: isBoothLoading || isFavoriteLoading,
    isProductsLoading,
    isError: isBoothError,
    error: boothError,
    activeTab,
    
    // 操作状态
    isFavoriteToggling: followMutation.isPending || unfollowMutation.isPending,
    
    // 方法
    handleFavoriteToggle,
    handleContactClick,
    handleShareClick,
    handleRefresh,
    handleTabChange,
  };
}