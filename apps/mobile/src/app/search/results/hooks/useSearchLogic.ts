import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteProductSearch, useInfiniteBoothSearch } from '@/hooks/api/search';
import type { ImageSearchResponse } from '@/types/api';
import type { Booth } from '@/types/booth';

type SortOption = 'relevance' | 'price' | 'sales';
type ActiveTab = 'product' | 'booth';

/**
 * 搜索逻辑管理Hook
 * 管理搜索页面的所有状态和逻辑，支持无限滚动加载
 * 重构版本：使用无限滚动hooks，提供扁平化数据处理
 */
export function useSearchLogic() {
  const searchParams = useSearchParams();
  
  // 状态管理
  const [keyword, setKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("product");
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [imageSearchResults, setImageSearchResults] = useState<ImageSearchResponse | null>(null);
  const [searchImage, setSearchImage] = useState<string | null>(null);
  const [isImageSearch, setIsImageSearch] = useState(false);

  // 从URL参数获取搜索参数
  const searchKeyword = searchParams.get("q") || "";
  const boothIdParam = searchParams.get("boothId");

  // 商品搜索Hook - 无限滚动版本
  const productInfiniteSearch = useInfiniteProductSearch(
    {
      keyword: searchKeyword,
      pageSize: 20,
      sortBy: mapSortOptionToProductSort(sortBy),
      boothId: boothIdParam || undefined,
    },
    {
      enabled: activeTab === "product" && !!searchKeyword && !isImageSearch,
    }
  );

  // 档口搜索Hook - 无限滚动版本
  const boothInfiniteSearch = useInfiniteBoothSearch(
    {
      keyword: searchKeyword,
      pageSize: 20,
      sortBy: mapSortOptionToBoothSort(sortBy),
    },
    {
      enabled: activeTab === "booth" && !!searchKeyword && !isImageSearch,
    }
  );

  // 扁平化商品数据
  const flattenedProducts = useMemo(() => {
    return productInfiniteSearch.data?.pages.flatMap(page => page.rows) || [];
  }, [productInfiniteSearch.data]);

  // 扁平化档口数据
  const flattenedBooths = useMemo(() => {
    return boothInfiniteSearch.data?.pages.flatMap(page => page.rows) || [];
  }, [boothInfiniteSearch.data]);

  // 获取总数量
  const getTotalCount = (infiniteData: any) => {
    return infiniteData?.pages?.[0]?.total || 0;
  };

  // 创建兼容的搜索数据结构（为了保持与现有组件的兼容性）
  const productSearchData = useMemo(() => {
    if (!productInfiniteSearch.data || !productInfiniteSearch.data.pages.length) return undefined;
    
    return {
      rows: flattenedProducts,
      total: getTotalCount(productInfiniteSearch.data),
      page: productInfiniteSearch.data.pages.length,
      pageSize: 20,
      totalPages: Math.ceil(getTotalCount(productInfiniteSearch.data) / 20),
      searchTime: productInfiniteSearch.data.pages[0]?.searchTime,
    };
  }, [flattenedProducts, productInfiniteSearch.data]);

  const boothSearchData = useMemo(() => {
    if (!boothInfiniteSearch.data || !boothInfiniteSearch.data.pages.length) return undefined;
    
    return {
      rows: flattenedBooths,
      total: getTotalCount(boothInfiniteSearch.data),
      page: boothInfiniteSearch.data.pages.length,
      pageSize: 20,
      totalPages: Math.ceil(getTotalCount(boothInfiniteSearch.data) / 20),
      searchTime: boothInfiniteSearch.data.pages[0]?.searchTime,
    };
  }, [flattenedBooths, boothInfiniteSearch.data]);

  // 处理URL参数变化
  useEffect(() => {
    handleUrlParamsChange();
  }, [searchParams]);

  // URL参数变化处理
  const handleUrlParamsChange = () => {
    const q = searchParams.get("q");
    const type = searchParams.get("type");

    if (q) {
      setKeyword(q);
    }

    if (type === "image-booth") {
      handleImageSearchSetup();
    } else {
      handleNormalSearchSetup();
    }
  };

  // 图片搜索设置
  const handleImageSearchSetup = () => {
    setKeyword("以图搜档口");
    setActiveTab("booth");
    setIsImageSearch(true);

    // 从sessionStorage获取搜索结果
    const results = sessionStorage.getItem("imageSearchResults");
    const image = sessionStorage.getItem("searchImage");

    if (results) {
      try {
        const parsedResults = JSON.parse(results);
        setImageSearchResults(parsedResults);
      } catch (error) {
        console.error("解析搜索结果失败:", error);
      }
    }

    if (image) {
      setSearchImage(image);
    }
  };

  // 普通搜索设置
  const handleNormalSearchSetup = () => {
    setIsImageSearch(false);
    
    // 根据URL参数设置tab
    if (searchParams.get("type") === "booth") {
      setActiveTab("booth");
    }
  };

  // 事件处理函数
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  // 防抖定时器
  const sortChangeTimer = useRef<NodeJS.Timeout>(null);
  
  const handleSortChange = useCallback((newSortBy: SortOption) => {
    setSortBy(newSortBy);
    
    // 清除之前的定时器
    if (sortChangeTimer.current) {
      clearTimeout(sortChangeTimer.current);
    }
    
    // 防抖延迟执行搜索，避免频繁请求
    sortChangeTimer.current = setTimeout(() => {
      if (activeTab === "product") {
        productInfiniteSearch.refetch();
      } else {
        boothInfiniteSearch.refetch();
      }
    }, 300); // 300ms防抖延迟
  }, [activeTab, productInfiniteSearch, boothInfiniteSearch]);
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (sortChangeTimer.current) {
        clearTimeout(sortChangeTimer.current);
      }
      if (loadMoreTimer.current) {
        clearTimeout(loadMoreTimer.current);
      }
    };
  }, []);

  // 防重复请求的引用
  const loadMoreTimer = useRef<NodeJS.Timeout>(null);
  const lastLoadMoreTime = useRef<number>(0);
  const LOAD_MORE_DEBOUNCE_DELAY = 500; // 500ms 防抖
  
  // 加载更多处理函数（防重复请求版本）
  const handleLoadMore = useCallback(() => {
    const now = Date.now();
    
    // 防止频繁调用
    if (now - lastLoadMoreTime.current < LOAD_MORE_DEBOUNCE_DELAY) {
      return;
    }
    
    
    // 清除之前的定时器
    if (loadMoreTimer.current) {
      clearTimeout(loadMoreTimer.current);
    }
    
    // 设置防抖定时器
    loadMoreTimer.current = setTimeout(() => {
      lastLoadMoreTime.current = Date.now();
      
      if (activeTab === "product") {
        if (productInfiniteSearch.hasNextPage && !productInfiniteSearch.isFetchingNextPage) {
          productInfiniteSearch.fetchNextPage();
        }
      } else {
        if (boothInfiniteSearch.hasNextPage && !boothInfiniteSearch.isFetchingNextPage) {
          boothInfiniteSearch.fetchNextPage();
        }
      }
    }, 100); // 100ms 延迟执行，给React时间更新状态
  }, [activeTab, productInfiniteSearch, boothInfiniteSearch]);

  // 创建兼容的产品搜索对象
  const productSearch = {
    data: productSearchData,
    isLoading: productInfiniteSearch.isLoading,
    error: productInfiniteSearch.error,
    refetch: productInfiniteSearch.refetch,
    // 新增无限滚动相关状态
    hasNextPage: productInfiniteSearch.hasNextPage,
    isFetchingNextPage: productInfiniteSearch.isFetchingNextPage,
    fetchNextPage: productInfiniteSearch.fetchNextPage,
  };

  // 创建兼容的档口搜索对象
  const boothSearch = {
    data: boothSearchData,
    isLoading: boothInfiniteSearch.isLoading,
    error: boothInfiniteSearch.error,
    refetch: boothInfiniteSearch.refetch,
    // 新增无限滚动相关状态
    hasNextPage: boothInfiniteSearch.hasNextPage,
    isFetchingNextPage: boothInfiniteSearch.isFetchingNextPage,
    fetchNextPage: boothInfiniteSearch.fetchNextPage,
  };

  return {
    // 状态
    keyword,
    activeTab,
    sortBy,
    imageSearchResults,
    searchImage,
    isImageSearch,
    searchKeyword,
    
    // 搜索数据（兼容原有结构）
    productSearch,
    boothSearch,
    
    // 扁平化数据（新增）
    flattenedProducts,
    flattenedBooths,
    
    // 事件处理
    handleTabChange,
    handleSortChange,
    handleLoadMore, // 新增加载更多处理
    
    // 无限滚动状态（新增）
    hasNextPage: activeTab === 'product' ? productSearch.hasNextPage : boothSearch.hasNextPage,
    isFetchingNextPage: activeTab === 'product' ? productSearch.isFetchingNextPage : boothSearch.isFetchingNextPage,
    
    // 档口内搜索标志（新增）
    isBoothInternalSearch: !!boothIdParam,
  };
}

// 工具函数：映射排序选项到商品搜索排序
function mapSortOptionToProductSort(sortBy: SortOption): 'relevance' | 'price' | 'sales' | 'latest' {
  switch (sortBy) {
    case 'relevance':
      return 'relevance';
    case 'price':
      return 'price';
    case 'sales':
      return 'sales';
    default:
      return 'relevance';
  }
}

// 工具函数：映射排序选项到档口搜索排序
function mapSortOptionToBoothSort(sortBy: SortOption): 'relevance' | 'popular' | 'rating' {
  switch (sortBy) {
    case 'relevance':
      return 'relevance';
    case 'price':
    case 'sales':
      return 'popular';
    default:
      return 'relevance';
  }
}