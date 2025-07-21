"use client";

import { useState, useCallback } from 'react';
import { MarketFilters } from '../types/market';

interface UseMarketFiltersOptions {
  initialFilters?: MarketFilters;
  onFiltersChange?: (filters: MarketFilters) => void;
}

const DEFAULT_FILTERS: MarketFilters = {
  categories: [],
  priceRange: [0, Infinity],
  areas: [],
  rating: 0,
  isVerifiedOnly: false
};

export function useMarketFilters(options: UseMarketFiltersOptions = {}) {
  const {
    initialFilters = DEFAULT_FILTERS,
    onFiltersChange
  } = options;

  // 筛选器状态
  const [filters, setFilters] = useState<MarketFilters>(initialFilters);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // 更新筛选器
  const updateFilters = useCallback((newFilters: MarketFilters) => {
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  }, [onFiltersChange]);

  // 重置筛选器
  const resetFilters = useCallback(() => {
    updateFilters(DEFAULT_FILTERS);
  }, [updateFilters]);

  // 打开筛选器面板
  const openFilters = useCallback(() => {
    setIsFiltersOpen(true);
  }, []);

  // 关闭筛选器面板
  const closeFilters = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  // 应用筛选器（关闭面板）
  const applyFilters = useCallback(() => {
    setIsFiltersOpen(false);
    // 触发筛选逻辑在外部处理
  }, []);

  // 切换分类筛选
  const toggleCategory = useCallback((categoryId: string) => {
    setFilters(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      
      const newFilters = { ...prev, categories };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // 设置价格范围
  const setPriceRange = useCallback((range: [number, number]) => {
    setFilters(prev => {
      const newFilters = { ...prev, priceRange: range };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // 切换区域筛选
  const toggleArea = useCallback((area: string) => {
    setFilters(prev => {
      const areas = prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area];
      
      const newFilters = { ...prev, areas };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // 设置评分筛选
  const setRatingFilter = useCallback((rating: number) => {
    setFilters(prev => {
      const newFilters = { ...prev, rating: prev.rating === rating ? 0 : rating };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // 切换认证筛选
  const toggleVerifiedOnly = useCallback(() => {
    setFilters(prev => {
      const newFilters = { ...prev, isVerifiedOnly: !prev.isVerifiedOnly };
      onFiltersChange?.(newFilters);
      return newFilters;
    });
  }, [onFiltersChange]);

  // 检查是否有活动筛选器
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] !== Infinity ||
    filters.areas.length > 0 ||
    filters.rating > 0 ||
    filters.isVerifiedOnly;

  // 获取活动筛选器数量
  const activeFiltersCount = 
    filters.categories.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] !== Infinity ? 1 : 0) +
    filters.areas.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.isVerifiedOnly ? 1 : 0);

  return {
    // 状态
    filters,
    isFiltersOpen,
    hasActiveFilters,
    activeFiltersCount,

    // 方法
    updateFilters,
    resetFilters,
    openFilters,
    closeFilters,
    applyFilters,

    // 具体筛选器操作
    toggleCategory,
    setPriceRange,
    toggleArea,
    setRatingFilter,
    toggleVerifiedOnly,
  };
}