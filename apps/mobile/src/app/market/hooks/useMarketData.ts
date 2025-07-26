"use client";

import { useState, useMemo, useCallback } from "react";
import { useInfiniteBooths } from "@/hooks/api/booth/useBooths";
import { GetBoothsParams } from "@/lib/api/booth";

export function useMarketData() {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState("");

  // 构建查询参数
  const queryParams = useMemo((): Omit<GetBoothsParams, "pageNum"> => {
    const trimmedKeyword = searchKeyword.trim();
    const params: Omit<GetBoothsParams, "pageNum"> = {
      size: 20,
    };

    // 只有当关键词不为空时才添加 keyword 参数
    if (trimmedKeyword) {
      params.keyword = trimmedKeyword;
    }

    return params;
  }, [searchKeyword]);

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

  // 搜索相关方法 - 使用 useCallback 优化
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchKeyword("");
  }, []);

  // 重置所有状态
  const handleReset = useCallback(() => {
    setSearchKeyword("");
  }, []);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

    // 方法
    handleSearch,
    handleClearSearch,
    handleReset,
    handleRefresh,
    handleLoadMore,

    // 查询参数（用于调试）
    queryParams,
  };
}
