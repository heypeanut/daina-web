"use client";

import { useState, useMemo } from "react";
import { useInfiniteBooths } from "@/hooks/api/booth/useBooths";
import { SortType } from "../../../../../src/types/booth";
import { GetBoothsParams, MarketFilters } from "../types/market";

interface UseMarketDataOptions {
  initialCategory?: string;
  initialSortType?: SortType;
  initialFilters?: MarketFilters;
}

export function useMarketData(options: UseMarketDataOptions = {}) {
  const {
    initialCategory = "all",
    initialSortType = "default",
    initialFilters = {
      categories: [],
      priceRange: [0, Infinity],
      areas: [],
      rating: 0,
      isVerifiedOnly: false,
    },
  } = options;

  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortType, setSortType] = useState<SortType>(initialSortType);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<MarketFilters>(initialFilters);

  // 构建查询参数
  const queryParams = useMemo(
    (): Omit<GetBoothsParams, "page"> => ({
      size: 20,
      keyword: searchKeyword.trim() || undefined,
      category: activeCategory !== "all" ? activeCategory : undefined,
      sort: sortType,
      order: sortOrder,
      priceMin: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      priceMax:
        filters.priceRange[1] !== Infinity ? filters.priceRange[1] : undefined,
      areas: filters.areas.length > 0 ? filters.areas : undefined,
    }),
    [searchKeyword, activeCategory, sortType, sortOrder, filters]
  );

  // 使用无限滚动查询
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteBooths(queryParams);

  // 扁平化数据
  const booths = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.rows);
  }, [data]);

  // 总数统计
  const totalCount = data?.pages?.[0]?.total ?? 0;

  // 搜索相关方法
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleClearSearch = () => {
    setSearchKeyword("");
  };

  // 分类相关方法
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  // 排序相关方法
  const handleSortChange = (type: SortType, order: "asc" | "desc") => {
    setSortType(type);
    setSortOrder(order);
  };

  // 筛选相关方法
  const handleFiltersChange = (newFilters: MarketFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  // 重置所有状态
  const handleReset = () => {
    setSearchKeyword("");
    setActiveCategory(initialCategory);
    setSortType(initialSortType);
    setSortOrder("desc");
    setFilters(initialFilters);
  };

  // 刷新数据
  const handleRefresh = () => {
    refetch();
  };

  // 加载更多
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return {
    // 数据
    booths,
    totalCount,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,

    // 状态
    searchKeyword,
    activeCategory,
    sortType,
    sortOrder,
    filters,

    // 方法
    handleSearch,
    handleClearSearch,
    handleCategoryChange,
    handleSortChange,
    handleFiltersChange,
    handleResetFilters,
    handleReset,
    handleRefresh,
    handleLoadMore,

    // 查询参数（用于调试）
    queryParams,
  };
}
