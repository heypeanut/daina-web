import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInfiniteProductSearch, useInfiniteBoothSearch } from '@/hooks/api/search';
import { useInfiniteImageProductSearch, useInfiniteImageBoothSearch } from '@/hooks/api/search/useImageSearch';
import type { ImageSearchResponse } from '@/types/api';
import type { Booth } from '@/types/booth';
import type { ImageSearchResponse as UploadImageSearchResponse } from '@/lib/api/upload-search';

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

  // 图片搜索商品Hook - 虚拟无限滚动版本
  const imageProductInfiniteSearch = useInfiniteImageProductSearch(
    isImageSearch && activeTab === "product"
  );

  // 图片搜索档口Hook - 虚拟无限滚动版本
  const imageBoothInfiniteSearch = useInfiniteImageBoothSearch(
    isImageSearch && activeTab === "booth"
  );

  // 扁平化商品数据
  const flattenedProducts = useMemo(() => {
    if (isImageSearch && activeTab === "product" && imageProductInfiniteSearch.data) {
      return imageProductInfiniteSearch.data.pages.flatMap(page => page.rows) || [];
    }
    return productInfiniteSearch.data?.pages.flatMap(page => page.rows) || [];
  }, [productInfiniteSearch.data, imageProductInfiniteSearch.data, isImageSearch, activeTab]);

  // 扁平化档口数据
  const flattenedBooths = useMemo(() => {
    if (isImageSearch && activeTab === "booth" && imageBoothInfiniteSearch.data) {
      return imageBoothInfiniteSearch.data.pages.flatMap(page => page.rows) || [];
    }
    return boothInfiniteSearch.data?.pages.flatMap(page => page.rows) || [];
  }, [boothInfiniteSearch.data, imageBoothInfiniteSearch.data, isImageSearch, activeTab]);

  // 获取总数量
  const getTotalCount = (infiniteData: any) => {
    return infiniteData?.pages?.[0]?.total || 0;
  };

  // 创建兼容的搜索数据结构（为了保持与现有组件的兼容性）
  const productSearchData = useMemo(() => {
    // 如果是图片搜索，使用图片搜索hooks的数据
    if (isImageSearch && activeTab === 'product') {
      if (!imageProductInfiniteSearch.data || !imageProductInfiniteSearch.data.pages.length) return undefined;
      
      return {
        rows: flattenedProducts,
        total: getTotalCount(imageProductInfiniteSearch.data),
        page: imageProductInfiniteSearch.data.pages.length,
        pageSize: 20,
        totalPages: Math.ceil(getTotalCount(imageProductInfiniteSearch.data) / 20),
        searchTime: imageProductInfiniteSearch.data.pages[0]?.searchTime,
      };
    }
    
    // 普通搜索
    if (!productInfiniteSearch.data || !productInfiniteSearch.data.pages.length) return undefined;
    
    return {
      rows: flattenedProducts,
      total: getTotalCount(productInfiniteSearch.data),
      page: productInfiniteSearch.data.pages.length,
      pageSize: 20,
      totalPages: Math.ceil(getTotalCount(productInfiniteSearch.data) / 20),
      searchTime: productInfiniteSearch.data.pages[0]?.searchTime,
    };
  }, [flattenedProducts, productInfiniteSearch.data, imageProductInfiniteSearch.data, isImageSearch, activeTab]);

  const boothSearchData = useMemo(() => {
    // 如果是图片搜索，使用图片搜索hooks的数据
    if (isImageSearch && activeTab === 'booth') {
      if (!imageBoothInfiniteSearch.data || !imageBoothInfiniteSearch.data.pages.length) return undefined;
      
      return {
        rows: flattenedBooths,
        total: getTotalCount(imageBoothInfiniteSearch.data),
        page: imageBoothInfiniteSearch.data.pages.length,
        pageSize: 20,
        totalPages: Math.ceil(getTotalCount(imageBoothInfiniteSearch.data) / 20),
        searchTime: imageBoothInfiniteSearch.data.pages[0]?.searchTime,
      };
    }
    
    // 普通搜索
    if (!boothInfiniteSearch.data || !boothInfiniteSearch.data.pages.length) return undefined;
    
    return {
      rows: flattenedBooths,
      total: getTotalCount(boothInfiniteSearch.data),
      page: boothInfiniteSearch.data.pages.length,
      pageSize: 20,
      totalPages: Math.ceil(getTotalCount(boothInfiniteSearch.data) / 20),
      searchTime: boothInfiniteSearch.data.pages[0]?.searchTime,
    };
  }, [flattenedBooths, boothInfiniteSearch.data, imageBoothInfiniteSearch.data, isImageSearch, activeTab]);

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
      handleImageSearchSetup('booth');
    } else if (type === "image-product") {
      handleImageSearchSetup('product');
    } else {
      handleNormalSearchSetup();
    }
  };

  // 图片搜索设置
  const handleImageSearchSetup = (searchType?: 'booth' | 'product') => {
    // 如果没有指定类型，从URL参数推断
    const type = searchType || (searchParams.get("type")?.includes('product') ? 'product' : 'booth');
    
    setKeyword(type === 'product' ? "以图搜商品" : "以图搜档口");
    setActiveTab(type); // 保持用户选择的标签页
    setIsImageSearch(true);

    // 从sessionStorage获取搜索图片（用于显示）
    const image = sessionStorage.getItem("searchImage");

    if (image) {
      setSearchImage(image);
    }
  };

  // 普通搜索设置
  const handleNormalSearchSetup = () => {
    setIsImageSearch(false);
    // 清理图片搜索结果
    setImageSearchResults(null);
    setSearchImage(null);
    
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
        if (isImageSearch) {
          // 图片搜索：使用图片搜索hooks
          if (imageProductInfiniteSearch.hasNextPage && !imageProductInfiniteSearch.isFetchingNextPage) {
            imageProductInfiniteSearch.fetchNextPage();
          }
        } else {
          // 普通搜索
          if (productInfiniteSearch.hasNextPage && !productInfiniteSearch.isFetchingNextPage) {
            productInfiniteSearch.fetchNextPage();
          }
        }
      } else {
        if (isImageSearch) {
          // 图片搜索：使用图片搜索hooks
          if (imageBoothInfiniteSearch.hasNextPage && !imageBoothInfiniteSearch.isFetchingNextPage) {
            imageBoothInfiniteSearch.fetchNextPage();
          }
        } else {
          // 普通搜索
          if (boothInfiniteSearch.hasNextPage && !boothInfiniteSearch.isFetchingNextPage) {
            boothInfiniteSearch.fetchNextPage();
          }
        }
      }
    }, 100); // 100ms 延迟执行，给React时间更新状态
  }, [activeTab, productInfiniteSearch, boothInfiniteSearch, isImageSearch, imageProductInfiniteSearch, imageBoothInfiniteSearch]);

  // 创建兼容的产品搜索对象
  const productSearch = {
    data: productSearchData,
    isLoading: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.isLoading : productInfiniteSearch.isLoading,
    error: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.error : productInfiniteSearch.error,
    refetch: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.refetch : productInfiniteSearch.refetch,
    // 新增无限滚动相关状态
    hasNextPage: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.hasNextPage : productInfiniteSearch.hasNextPage,
    isFetchingNextPage: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.isFetchingNextPage : productInfiniteSearch.isFetchingNextPage,
    fetchNextPage: (isImageSearch && activeTab === "product") ? imageProductInfiniteSearch.fetchNextPage : productInfiniteSearch.fetchNextPage,
  };

  // 创建兼容的档口搜索对象
  const boothSearch = {
    data: boothSearchData,
    isLoading: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.isLoading : boothInfiniteSearch.isLoading,
    error: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.error : boothInfiniteSearch.error,
    refetch: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.refetch : boothInfiniteSearch.refetch,
    // 新增无限滚动相关状态
    hasNextPage: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.hasNextPage : boothInfiniteSearch.hasNextPage,
    isFetchingNextPage: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.isFetchingNextPage : boothInfiniteSearch.isFetchingNextPage,
    fetchNextPage: (isImageSearch && activeTab === "booth") ? imageBoothInfiniteSearch.fetchNextPage : boothInfiniteSearch.fetchNextPage,
  };

  return {
    // 状态
    keyword,
    activeTab,
    sortBy,
    imageSearchResults, // 保持兼容性
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
    handleTabChange: isImageSearch ? () => {} : handleTabChange, // 图片搜索时禁用标签切换
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