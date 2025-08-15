import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserInfo, logout, type UserInfo } from "@/lib/api/auth";
import { AUTH_QUERY_KEYS } from "@/lib/react-query/types";
import { CACHE_TIMES } from "@/lib/react-query/constants";
import type { QueryOptions } from "@/lib/react-query/types";
import {
  getFavorites,
  getFootprints,
  toggleFavorite,
  checkFavoriteStatus,
  addProductToFavorites,
  removeProductFromFavorites,
  followBooth,
  unfollowBooth,
  isProductFavorited,
  isBoothFollowed,
} from "@/lib/api/user-behavior";

interface UseUserInfoOptions extends QueryOptions<UserInfo> {
  enabled?: boolean;
}

export function useUserInfo(options?: UseUserInfoOptions) {
  const queryClient = useQueryClient();

  // 使用状态管理登录状态，确保能响应变化
  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken()));

  // 监听登录状态变化事件
  useEffect(() => {
    const handleLoginStatusChange = () => {
      console.log("🔄 loginStatusChange event received");
      const currentToken = getToken();
      const newIsLoggedIn = Boolean(currentToken);

      console.log("🔑 Current token:", currentToken ? "exists" : "null");
      console.log("📊 New login status:", newIsLoggedIn);

      setIsLoggedIn(newIsLoggedIn);

      if (!newIsLoggedIn) {
        console.log("🚪 Logging out - clearing queries");
        // 如果没有token，清除查询数据并设置为undefined
        queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
        queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });
      } else {
        console.log("🔐 Logging in - invalidating queries");
        // 如果有token，重新获取用户信息
        queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.user });
      }
    };

    window.addEventListener("loginStatusChange", handleLoginStatusChange);
    return () => {
      window.removeEventListener("loginStatusChange", handleLoginStatusChange);
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: AUTH_QUERY_KEYS.user,
    queryFn: async () => {
      const userInfo = await getUserInfo();
      return userInfo;
    },
    enabled: isLoggedIn && options?.enabled !== false,
    staleTime: 0, // 暂时设置为0，确保总是重新获取
    gcTime: CACHE_TIMES.USER_INFO,
    // 暂时不使用initialData，确保总是从API获取最新数据
    // initialData: isLoggedIn ? getCachedUserInfo() : undefined,
    retry: (failureCount, error) => {
      // 如果是认证错误，不重试
      if (
        error instanceof Error &&
        (error.message.includes("401") || error.message.includes("登录已过期"))
      ) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });

  return query;
}

// 获取用户登录状态的hook
export function useLoginStatus() {
  const { data: userInfo, isLoading, error } = useUserInfo();

  const isLoggedIn = Boolean(userInfo && !error);

  return {
    isLoggedIn,
    isLoading,
    userInfo,
    error,
  };
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      // 立即清除用户信息查询数据
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });

      // 清除所有React Query缓存
      import("@/lib/react-query/client").then(({ clearAllQueries }) => {
        clearAllQueries();
      });

      // 触发登录状态变化事件，让其他组件知道用户已退出登录
      window.dispatchEvent(new Event("loginStatusChange"));
    },
    onError: (error) => {
      console.error("退出登录失败:", error);

      // 即使退出登录失败，也清除本地存储和缓存
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");

      // 立即清除用户信息查询数据
      queryClient.setQueryData(AUTH_QUERY_KEYS.user, undefined);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.user });

      // 清除所有React Query缓存
      import("@/lib/react-query/client").then(({ clearAllQueries }) => {
        clearAllQueries();
      });

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));
    },
    retry: 0, // 退出登录失败不重试
  });
}

export function useGetFavoriteProducts(
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["favoriteProducts"],
    queryFn: () => getFavorites("product", page, pageSize),
  });
}

export function useGetFollowedBooths(page: number = 1, pageSize: number = 10) {
  return useQuery({
    queryKey: ["followedBooths"],
    queryFn: () => getFavorites("booth", page, pageSize),
  });
}

// 添加浏览历史hooks
export function useGetHistory(
  type: "product" | "booth" = "product",
  page: number = 1,
  pageSize: number = 10
) {
  return useQuery({
    queryKey: ["footprints", "list", { type, page }],
    queryFn: () => getFootprints(type, page, pageSize),
  });
}

// 无限滚动版本的浏览历史hook - 使用统一的查询键
export function useInfiniteHistory(
  type: "product" | "booth" = "product",
  pageSize: number = 20
) {
  return useInfiniteQuery({
    queryKey: ["footprints", "infinite", type],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getFootprints(type, pageParam, pageSize);
      console.log('=== useInfiniteHistory API返回数据 ===');
      console.log('类型:', type);
      console.log('页码:', pageParam);
      console.log('原始响应:', response);
      console.log('第一条记录样例:', response.rows[0]);
      if (response.rows[0]) {
        console.log('第一条记录的字段:', Object.keys(response.rows[0]));
      }
      return response;
    },
    initialPageParam: 1,
    staleTime: 0,        // 数据立即过期，确保获取最新内容
    cacheTime: 0,        // 不缓存数据
    refetchOnMount: true, // 每次挂载时重新获取
    refetchOnWindowFocus: true, // 窗口获得焦点时重新获取
    getNextPageParam: (lastPage, allPages) => {
      // 检查是否有更多数据
      if (lastPage.rows.length === 0) {
        return undefined;
      }

      // 如果当前页数据少于pageSize，说明已经是最后一页
      if (lastPage.rows.length < pageSize) {
        return undefined;
      }

      // 如果有totalPages字段，检查是否已到最后一页
      if (lastPage.totalPages && allPages.length >= lastPage.totalPages) {
        return undefined;
      }

      // 如果有total字段，检查是否已加载完所有数据
      if (lastPage.total !== undefined) {
        const loadedCount = allPages.reduce(
          (count, page) => count + page.rows.length,
          0
        );
        if (loadedCount >= lastPage.total) {
          return undefined;
        }
      }

      // 返回下一页页码
      return allPages.length + 1;
    },
    staleTime: 2 * 60 * 1000, // 2分钟缓存
  });
}

// 新增收藏\取消收藏hooks

// 商品收藏hooks
export function useToggleProductFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      action,
    }: {
      productId: string;
      action: "add" | "remove";
    }) => {
      if (action === "add") {
        await addProductToFavorites(productId);
      } else {
        await removeProductFromFavorites(productId);
      }
    },
    onSuccess: () => {
      // 刷新收藏商品列表缓存
      queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
      // 刷新商品收藏状态缓存
      queryClient.invalidateQueries({ queryKey: ["productFavoriteStatus"] });
    },
  });
}

// 档口关注hooks
export function useToggleBoothFollow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      boothId,
      action,
    }: {
      boothId: string;
      action: "add" | "remove";
    }) => {
      if (action === "add") {
        await followBooth(boothId);
      } else {
        await unfollowBooth(boothId);
      }
    },
    onSuccess: () => {
      // 刷新关注档口列表缓存
      queryClient.invalidateQueries({ queryKey: ["followedBooths"] });
      // 刷新档口关注状态缓存
      queryClient.invalidateQueries({ queryKey: ["boothFollowStatus"] });
    },
  });
}

// 检查商品收藏状态
export function useProductFavoriteStatus(
  productId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["productFavoriteStatus", productId],
    queryFn: () => isProductFavorited(productId),
    enabled: enabled && Boolean(productId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

// 检查档口关注状态
export function useBoothFollowStatus(boothId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["boothFollowStatus", boothId],
    queryFn: () => isBoothFollowed(boothId),
    enabled: enabled && Boolean(boothId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

// 通用收藏状态检查hook
export function useFavoriteStatus(
  type: "product" | "booth",
  targetId: string,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: [`${type}FavoriteStatus`, targetId],
    queryFn: () => checkFavoriteStatus(type, targetId),
    enabled: enabled && Boolean(targetId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });
}

// 通用收藏切换hook
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      type,
      targetId,
      action,
    }: {
      type: "product" | "booth";
      targetId: string;
      action: "add" | "remove";
    }) => {
      await toggleFavorite(type, targetId, action);
    },
    onSuccess: (_, variables) => {
      const { type } = variables;
      // 根据类型刷新对应的缓存
      if (type === "product") {
        queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        queryClient.invalidateQueries({ queryKey: ["productFavoriteStatus"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["followedBooths"] });
        queryClient.invalidateQueries({ queryKey: ["boothFollowStatus"] });
      }
    },
  });
}
