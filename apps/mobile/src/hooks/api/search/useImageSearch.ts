/**
 * 图片搜索虚拟无限滚动 React Hooks
 * 
 * 由于图片搜索API不支持分页，此Hook实现前端虚拟分页
 * 将完整的图片搜索结果分批显示，模拟无限滚动效果
 * 
 * @author Claude Code
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/types/api';
import type { Booth } from '@/types/booth';

// 模拟无限查询的返回类型
interface InfiniteQueryPage<T> {
  rows: T[];
  total: number;
  pageSize: number;
  pageNum: number;
  totalPages: number;
  searchTime?: number;
}

interface InfiniteQueryData<T> {
  pages: InfiniteQueryPage<T>[];
  pageParams: number[];
}

interface InfiniteQueryReturn<T> {
  data?: InfiniteQueryData<T>;
  isLoading: boolean;
  error: Error | null;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refetch: () => void;
}

// 配置常量
const PAGE_SIZE = 20;
const LOADING_DELAY = 200; // 模拟网络请求延迟

/**
 * 图片搜索商品虚拟无限滚动Hook
 */
export function useInfiniteImageProductSearch(
  enabled: boolean = true
): InfiniteQueryReturn<Product> {
  const [data, setData] = useState<InfiniteQueryData<Product> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // 从sessionStorage加载图片搜索结果
  const loadImageSearchResults = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const results = sessionStorage.getItem("imageSearchResults");
      if (!results) {
        setData(undefined);
        setAllProducts([]);
        return;
      }

      const parsedResults = JSON.parse(results);
      
      // 转换为Product格式（数据已在存储时统一为标准格式）
      let products: Product[] = [];
      if (parsedResults.rows && Array.isArray(parsedResults.rows)) {
        products = parsedResults.rows.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.price || 0,
          imageUrl: item.image || item.imageUrl, // 兼容两种字段名
          boothId: item.boothId,
          boothName: item.boothName,
          similarity: item.similarity,
          matchedImages: item.matchedImages || [],
        }));
      }

      setAllProducts(products);
      
      // 初始化第一页数据
      if (products.length > 0) {
        const firstPageData = products.slice(0, PAGE_SIZE);
        const total = products.length;
        const totalPages = Math.ceil(total / PAGE_SIZE);
        
        setData({
          pages: [{
            rows: firstPageData,
            total,
            pageSize: PAGE_SIZE,
            pageNum: 1,
            totalPages,
            searchTime: parsedResults.searchTime,
          }],
          pageParams: [1],
        });
        setCurrentPage(1);
      } else {
        setData({
          pages: [],
          pageParams: [],
        });
      }
    } catch (err) {
      console.error("加载图片搜索结果失败:", err);
      console.error("sessionStorage content:", sessionStorage.getItem("imageSearchResults"));
      setError(err instanceof Error ? err : new Error("图片搜索数据解析失败"));
      setData(undefined);
      setAllProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取下一页数据
  const fetchNextPage = useCallback(async () => {
    if (!data || isFetchingNextPage || !allProducts.length) {
      console.log('图片搜索产品 fetchNextPage 跳过:', { 
        hasData: !!data, 
        isFetchingNextPage, 
        productsLength: allProducts.length 
      });
      return;
    }

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    if (startIndex >= allProducts.length) {
      console.log('图片搜索产品已到最后一页:', { startIndex, totalProducts: allProducts.length });
      return;
    }

    console.log('图片搜索产品加载下一页:', { nextPage, startIndex, endIndex, totalProducts: allProducts.length });

    setIsFetchingNextPage(true);

    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));

    const nextPageData = allProducts.slice(startIndex, endIndex);
    const total = allProducts.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    setData(prevData => ({
      pages: [
        ...(prevData?.pages || []),
        {
          rows: nextPageData,
          total,
          pageSize: PAGE_SIZE,
          pageNum: nextPage,
          totalPages,
          searchTime: prevData?.pages[0]?.searchTime,
        }
      ],
      pageParams: [...(prevData?.pageParams || []), nextPage],
    }));

    setCurrentPage(nextPage);
    setIsFetchingNextPage(false);
  }, [data, isFetchingNextPage, allProducts, currentPage]);

  // 计算是否还有下一页
  const hasNextPage = useMemo(() => {
    if (!allProducts.length) return false;
    return currentPage * PAGE_SIZE < allProducts.length;
  }, [allProducts.length, currentPage]);

  // 重新获取数据
  const refetch = useCallback(() => {
    setCurrentPage(1);
    loadImageSearchResults();
  }, [loadImageSearchResults]);

  // 初始化和启用状态变化时加载数据
  useEffect(() => {
    if (enabled) {
      loadImageSearchResults();
    }
  }, [enabled, loadImageSearchResults]);

  return {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}

/**
 * 图片搜索档口虚拟无限滚动Hook
 */
export function useInfiniteImageBoothSearch(
  enabled: boolean = true
): InfiniteQueryReturn<Booth> {
  const [data, setData] = useState<InfiniteQueryData<Booth> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBooths, setAllBooths] = useState<Booth[]>([]);

  // 从sessionStorage加载图片搜索结果
  const loadImageSearchResults = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const results = sessionStorage.getItem("imageSearchResults");
      if (!results) {
        setData(undefined);
        setAllBooths([]);
        return;
      }

      const parsedResults = JSON.parse(results);
      
      // 转换为Booth格式（数据已在存储时统一为标准格式）
      let booths: Booth[] = [];
      if (parsedResults.rows && Array.isArray(parsedResults.rows)) {
        booths = parsedResults.rows.map((item: any) => ({
          id: item.id,
          name: item.boothName, // 档口名称字段
          imageUrl: item.coverImg, // 档口封面图片字段
          description: item.profile || item.description, // 档口简介
          similarity: item.similarity,
          matchedImages: item.matchedImages || [],
          // 添加Booth类型需要的字段
          location: item.address || '',
          rating: item.rating || 0,
          reviewCount: item.reviewCount || 0,
          isVerified: item.isVerified || false,
        }));
      }

      setAllBooths(booths);
      
      // 初始化第一页数据
      if (booths.length > 0) {
        const firstPageData = booths.slice(0, PAGE_SIZE);
        const total = booths.length;
        const totalPages = Math.ceil(total / PAGE_SIZE);
        
        setData({
          pages: [{
            rows: firstPageData,
            total,
            pageSize: PAGE_SIZE,
            pageNum: 1,
            totalPages,
            searchTime: parsedResults.searchTime,
          }],
          pageParams: [1],
        });
        setCurrentPage(1);
      } else {
        setData({
          pages: [],
          pageParams: [],
        });
      }
    } catch (err) {
      console.error("加载图片搜索档口结果失败:", err);
      console.error("sessionStorage content:", sessionStorage.getItem("imageSearchResults"));
      setError(err instanceof Error ? err : new Error("图片搜索档口数据解析失败"));
      setData(undefined);
      setAllBooths([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取下一页数据
  const fetchNextPage = useCallback(async () => {
    if (!data || isFetchingNextPage || !allBooths.length) {
      console.log('图片搜索档口 fetchNextPage 跳过:', { 
        hasData: !!data, 
        isFetchingNextPage, 
        boothsLength: allBooths.length 
      });
      return;
    }

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    if (startIndex >= allBooths.length) {
      console.log('图片搜索档口已到最后一页:', { startIndex, totalBooths: allBooths.length });
      return;
    }

    console.log('图片搜索档口加载下一页:', { nextPage, startIndex, endIndex, totalBooths: allBooths.length });

    setIsFetchingNextPage(true);

    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));

    const nextPageData = allBooths.slice(startIndex, endIndex);
    const total = allBooths.length;
    const totalPages = Math.ceil(total / PAGE_SIZE);

    setData(prevData => ({
      pages: [
        ...(prevData?.pages || []),
        {
          rows: nextPageData,
          total,
          pageSize: PAGE_SIZE,
          pageNum: nextPage,
          totalPages,
          searchTime: prevData?.pages[0]?.searchTime,
        }
      ],
      pageParams: [...(prevData?.pageParams || []), nextPage],
    }));

    setCurrentPage(nextPage);
    setIsFetchingNextPage(false);
  }, [data, isFetchingNextPage, allBooths, currentPage]);

  // 计算是否还有下一页
  const hasNextPage = useMemo(() => {
    if (!allBooths.length) return false;
    return currentPage * PAGE_SIZE < allBooths.length;
  }, [allBooths.length, currentPage]);

  // 重新获取数据
  const refetch = useCallback(() => {
    setCurrentPage(1);
    loadImageSearchResults();
  }, [loadImageSearchResults]);

  // 初始化和启用状态变化时加载数据
  useEffect(() => {
    if (enabled) {
      loadImageSearchResults();
    }
  }, [enabled, loadImageSearchResults]);

  return {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}