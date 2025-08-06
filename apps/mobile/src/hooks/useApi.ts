import { useState, useEffect, useCallback } from "react";
import { apiClient, type PaginatedResponse } from "@/lib/api";
import type {
  Banner,
  Product,
  HomepageData,
  PersonalizedRecommendation,
  MixedRecommendation,
  InfiniteScrollState,
  ImageSearchResponse,
  ImageSearchParams,
} from "@/types/api";
import type { Booth } from "@/types/booth";

// 获取用户ID的工具函数
const getCurrentUserId = (): number | undefined => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (error) {
        console.error("解析用户信息失败:", error);
      }
    }
  }
  return undefined;
};

// 检查用户是否已登录
const isLoggedIn = (): boolean => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("authToken");
  }
  return false;
};

// 用户行为记录Hook
export const useBehaviorTracking = () => {
  const recordBehavior = useCallback(
    async (
      behaviorType: "view" | "click" | "favorite" | "share",
      targetType: "booth" | "product" | "banner",
      targetId: string,
      metadata: Record<string, any> = {}
    ) => {
      try {
        const userId = getCurrentUserId();
        if (!userId) return;

        await apiClient.recordBehavior({
          userId,
          behaviorType,
          targetType,
          targetId,
          metadata: {
            platform: "mobile",
            ...metadata,
          },
        });
      } catch (error) {
        console.error("记录用户行为失败:", error);
      }
    },
    []
  );

  return { recordBehavior };
};

// 首页数据Hook
export const useHomepageData = () => {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = getCurrentUserId();
      const response = await apiClient.getHomepageData(userId);

      if (response.code === 200) {
        setData(response.data);
      } else {
        setError(response.message || "加载首页数据失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络错误");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, loading, error, reload: loadData };
};

// 轮播图Hook
export const useBanners = (limit: number = 5) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getBanners(limit);

      if (response.code === 200) {
        console.log("轮播图API响应数据:", response.data);

        setBanners(response.data);
      } else {
        setError(response.message || "加载轮播图失败");
      }
    } catch (err) {
      console.error("轮播图API调用失败:", err);
      setError(err instanceof Error ? err.message : "网络错误");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return { banners, loading, error, reload: loadBanners };
};

// 档口排行榜Hook
export const useBoothRanking = (limit: number = 25) => {
  const [state, setState] = useState<{
    items: Booth[];
    loading: boolean;
    error?: string;
  }>({
    items: [],
    loading: false,
  });

  const fetchRanking = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      const userId = getCurrentUserId();
      const response = await apiClient.getBoothRanking({
        limit,
        userId,
      });

      if (response.code === 200) {
        console.log("档口排行榜API响应数据:", response.data);

        setState((prev) => ({
          ...prev,
          items: Array.isArray(response.data) ? response.data : [],
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "加载档口排行榜失败",
          loading: false,
        }));
      }
    } catch (err) {
      console.error("档口排行榜API调用失败:", err);
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "网络错误",
        loading: false,
      }));
    }
  }, [limit]);

  useEffect(() => {
    fetchRanking();
  }, [fetchRanking]);

  return { ...state, refetch: fetchRanking };
};

// 档口推荐Hook（支持分页）
export const useBoothRecommendations = (
  type: "booth_hot" | "booth_new" = "booth_hot",
  pageSize: number = 10
) => {
  const [state, setState] = useState<InfiniteScrollState<Booth>>({
    items: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      const userId = getCurrentUserId();
      const response = await apiClient.getBoothRecommendations({
        type,
        pageNum: state.currentPage,
        pageSize,
        userId,
      });

      if (response.code === 200) {
        console.log("档口推荐API响应数据:", response.data);

        // 兼容不同的数据结构
        let items: Booth[] = [];
        let hasMore = false;

        if (Array.isArray(response.data)) {
          // 如果直接返回数组
          items = response.data;
          hasMore = false;
        } else if (response.data && typeof response.data === "object") {
          // 如果返回分页对象
          const data = response.data as any;
          if (Array.isArray(data.rows)) {
            items = data.rows;
            hasMore = data.hasMore || false;
          } else if (Array.isArray(data.data)) {
            items = data.data;
            hasMore = data.hasMore || false;
          } else if (Array.isArray(data.list)) {
            items = data.list;
            hasMore = data.hasMore || false;
          } else {
            console.warn("未知的数据结构:", data);
            items = [];
          }
        }

        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...items],
          currentPage: prev.currentPage + 1,
          hasMore: hasMore,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "加载档口推荐失败",
          loading: false,
          hasMore: false,
        }));
      }
    } catch (err) {
      console.error("档口推荐API调用失败:", err);
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "网络错误",
        loading: false,
        hasMore: false,
      }));
    }
  }, [type, pageSize, state.currentPage, state.loading, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    reset();
    loadMore();
  }, [type, pageSize]);

  return { ...state, loadMore, reset };
};

// 商品推荐Hook（支持分页）
export const useProductRecommendations = (
  type: "product_hot" | "product_new" = "product_hot",
  pageSize: number = 12
) => {
  const [state, setState] = useState<InfiniteScrollState<Product>>({
    items: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore) return;

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      const userId = getCurrentUserId();
      const response = await apiClient.getProductRecommendations({
        type,
        pageNum: state.currentPage,
        pageSize,
        userId,
      });

      if (response.code === 200) {
        console.log("商品推荐API响应数据:", response.data);

        // 兼容不同的数据结构
        let items: Product[] = [];
        let hasMore = false;

        if (Array.isArray(response.data)) {
          // 如果直接返回数组
          items = response.data;
          hasMore = false;
        } else if (response.data && typeof response.data === "object") {
          // 如果返回分页对象
          const data = response.data as any;
          if (Array.isArray(data.rows)) {
            items = data.rows;
            hasMore = data.hasMore || false;
          } else if (Array.isArray(data.data)) {
            items = data.data;
            hasMore = data.hasMore || false;
          } else if (Array.isArray(data.list)) {
            items = data.list;
            hasMore = data.hasMore || false;
          } else {
            console.warn("未知的数据结构:", data);
            items = [];
          }
        }

        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...items],
          currentPage: prev.currentPage + 1,
          hasMore: hasMore,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "加载商品推荐失败",
          loading: false,
          hasMore: false,
        }));
      }
    } catch (err) {
      console.error("商品推荐API调用失败:", err);
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "网络错误",
        loading: false,
        hasMore: false,
      }));
    }
  }, [type, pageSize, state.currentPage, state.loading, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    reset();
    loadMore();
  }, [type, pageSize]);

  return { ...state, loadMore, reset };
};

// 个性化推荐Hook
export const usePersonalizedRecommendations = <T extends Booth | Product>(
  targetType: "booth" | "product",
  pageSize: number = 10
) => {
  const [state, setState] = useState<
    InfiniteScrollState<PersonalizedRecommendation<T>>
  >({
    items: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore || !isLoggedIn()) return;

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      const response =
        targetType === "booth"
          ? await apiClient.getPersonalizedBooths({
              pageNum: state.currentPage,
              pageSize,
            })
          : await apiClient.getPersonalizedProducts({
              pageNum: state.currentPage,
              pageSize,
            });

      if (response.code === 200) {
        const data = response.data as PaginatedResponse<
          PersonalizedRecommendation<T>
        >;
        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...data.rows],
          currentPage: prev.currentPage + 1,
          hasMore: data.hasMore,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "加载个性化推荐失败",
          loading: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "网络错误",
        loading: false,
      }));
    }
  }, [targetType, pageSize, state.currentPage, state.loading, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      reset();
      loadMore();
    }
  }, [targetType, pageSize, reset, loadMore]);

  return { ...state, loadMore, reset };
};

// 混合推荐Hook
export const useMixedRecommendations = (
  targetType: "booth" | "product",
  pageSize: number = 10
) => {
  const [state, setState] = useState<InfiniteScrollState<MixedRecommendation>>({
    items: [],
    loading: false,
    hasMore: true,
    currentPage: 1,
  });

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore || !isLoggedIn()) return;

    setState((prev) => ({ ...prev, loading: true, error: undefined }));

    try {
      const response = await apiClient.getMixedRecommendations({
        targetType,
        pageNum: state.currentPage,
        pageSize,
      });

      if (response.code === 200) {
        const data = response.data as PaginatedResponse<MixedRecommendation>;
        setState((prev) => ({
          ...prev,
          items: [...prev.items, ...data.rows],
          currentPage: prev.currentPage + 1,
          hasMore: data.hasMore,
          loading: false,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          error: response.message || "加载混合推荐失败",
          loading: false,
        }));
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "网络错误",
        loading: false,
      }));
    }
  }, [targetType, pageSize, state.currentPage, state.loading, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    if (isLoggedIn()) {
      reset();
      loadMore();
    }
  }, [targetType, pageSize, reset, loadMore]);

  return { ...state, loadMore, reset };
};

// 图片搜索Hook
export const useImageSearch = () => {
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<ImageSearchResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const searchBooths = useCallback(async (params: ImageSearchParams) => {
    setSearching(true);
    setError(null);

    try {
      const response = await apiClient.searchImageBooth(params);
      setSearchResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "图片搜索失败";
      setError(errorMessage);
      return null;
    } finally {
      setSearching(false);
    }
  }, []);

  const searchProducts = useCallback(async (params: ImageSearchParams) => {
    setSearching(true);
    setError(null);

    try {
      const response = await apiClient.searchImageProduct(params);
      setSearchResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "图片搜索失败";
      setError(errorMessage);
      return null;
    } finally {
      setSearching(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setSearchResult(null);
    setError(null);
  }, []);

  return {
    searching,
    searchResult,
    error,
    searchBooths,
    searchProducts,
    clearResults,
  };
};

// 最新档口与新产品Hook（支持分页）
export const useLatestBoothsWithNewProducts = (pageSize: number = 12) => {
  const [state, setState] = useState<InfiniteScrollState<Booth>>({
    items: [],
    loading: true,
    hasMore: true,
    currentPage: 1,
  });

  const loadMore = useCallback(async () => {
    // 如果是后续加载（已有数据）且正在加载，则跳过
    if (state.items.length > 0 && state.loading) return;
    // 如果没有更多数据，则跳过
    if (!state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: undefined }));

    try {
      const userId = getCurrentUserId();
      const response = await apiClient.getLatestBoothsWithNewProducts({
        pageNum: state.currentPage,
        pageSize,
        userId,
      });

      if (response.code === 200) {
        console.log('最新档口新品API响应数据:', response.data);

        // 兼容不同的数据结构，与useBoothRecommendations保持一致
        let items: Booth[] = [];
        let hasMore = false;
        let total = 0;

        if (Array.isArray(response.data)) {
          // 如果直接返回数组
          items = response.data;
          // 如果返回数组，假设还有更多数据（除非数组长度小于页面大小）
          hasMore = items.length === pageSize;
        } else if (response.data && typeof response.data === 'object') {
          // 如果返回分页对象
          const data = response.data as any;
          total = data.total || 0;
          
          if (Array.isArray(data.rows)) {
            items = data.rows;
          } else if (Array.isArray(data.data)) {
            items = data.data;
          } else if (Array.isArray(data.list)) {
            items = data.list;
          } else {
            console.warn('未知的数据结构:', data);
            items = [];
          }
          
          // 根据总数和当前数据计算是否还有更多
          const currentTotal = state.items.length + items.length;
          hasMore = data.hasMore !== undefined ? data.hasMore : (total > 0 ? currentTotal < total : items.length === pageSize);
        }

        setState(prev => ({
          ...prev,
          items: [...prev.items, ...items],
          currentPage: prev.currentPage + 1,
          hasMore: hasMore,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || '加载最新档口新品失败',
          loading: false,
          hasMore: false,
        }));
      }
    } catch (err) {
      console.error('最新档口新品API调用失败:', err);
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : '网络错误',
        loading: false,
        hasMore: false,
      }));
    }
  }, [pageSize, state.currentPage, state.loading, state.hasMore]);

  const reset = useCallback(() => {
    setState({
      items: [],
      loading: false,
      hasMore: true,
      currentPage: 1,
    });
  }, []);

  useEffect(() => {
    loadMore();
  }, []);

  return { ...state, loadMore, reset };
};
