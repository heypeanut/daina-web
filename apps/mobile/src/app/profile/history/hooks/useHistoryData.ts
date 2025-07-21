import { useState, useCallback, useMemo } from "react";
import {
  useFootprints,
  useRemoveFootprint,
  useClearFootprints,
} from "@/hooks/api/favorites/useFootprints";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";
import { FilterType, PAGE_SIZE } from "../constants/filters";
import { type Footprint } from "@/lib/api/favorites";

interface UseHistoryDataReturn {
  footprints: Footprint[];
  loading: boolean;
  removing: string | null;
  clearing: boolean;
  page: number;
  hasMore: boolean;
  totalCount: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  handleRemoveFootprint: (footprintId: string) => Promise<void>;
  handleClearFootprints: () => Promise<void>;
  handleLoadMore: () => void;
}

export function useHistoryData(): UseHistoryDataReturn {
  const [filter, setFilter] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  // 检查登录状态
  const isUserLoggedIn = isLoggedIn();
  if (!isUserLoggedIn) {
    redirectToLogin("/profile/history");
  }

  // 使用React Query获取足迹数据
  const footprintsQuery = useFootprints({
    type: filter === "all" ? undefined : filter,
    page,
    pageSize: PAGE_SIZE,
    enabled: isUserLoggedIn,
  });

  // 删除足迹的mutation
  const removeFootprintMutation = useRemoveFootprint({
    onSuccess: () => {
      setRemoving(null);
    },
    onError: () => {
      setRemoving(null);
      throw new Error("删除记录失败，请重试");
    },
  });

  // 清空足迹的mutation
  const clearFootprintsMutation = useClearFootprints({
    onSuccess: () => {
      setClearing(false);
      setPage(1);
    },
    onError: () => {
      setClearing(false);
      throw new Error("清空记录失败，请重试");
    },
  });

  // 计算分页数据
  const {
    footprints = [],
    totalCount = 0,
    hasMore = false,
  } = useMemo(() => {
    if (!footprintsQuery.data) {
      return { footprints: [], totalCount: 0, hasMore: false };
    }

    const data = footprintsQuery.data;
    return {
      footprints: data.rows,
      totalCount: data.total,
      hasMore: page < data.totalPages,
    };
  }, [footprintsQuery.data, page]);

  // 处理删除足迹
  const handleRemoveFootprint = useCallback(
    async (footprintId: string) => {
      setRemoving(footprintId);
      await removeFootprintMutation.mutateAsync(footprintId);
    },
    [removeFootprintMutation]
  );

  // 处理清空足迹
  const handleClearFootprints = useCallback(async () => {
    setClearing(true);
    const filterType = filter === "all" ? undefined : filter;
    await clearFootprintsMutation.mutateAsync(filterType);
  }, [clearFootprintsMutation, filter]);

  // 处理加载更多
  const handleLoadMore = useCallback(() => {
    if (!footprintsQuery.isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [footprintsQuery.isFetching, hasMore]);

  // 当筛选条件变化时重置页码
  const handleSetFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
    setPage(1);
  }, []);

  return {
    footprints,
    loading: footprintsQuery.isLoading,
    removing,
    clearing,
    page,
    hasMore,
    totalCount,
    filter,
    setFilter: handleSetFilter,
    handleRemoveFootprint,
    handleClearFootprints,
    handleLoadMore,
  };
}
