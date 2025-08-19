/**
 * 图片搜索虚拟无限滚动 React Hooks
 *
 * 由于图片搜索API不支持分页，此Hook实现前端虚拟分页
 * 将完整的图片搜索结果分批显示，模拟无限滚动效果
 *
 * @author Claude Code
 * @version 1.0.0
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useDictMap } from "@/hooks/api/useDictionary";
import { DictType } from "@/types/dictionary";
import { translateDictValue } from "@/utils/dictionary";
import type { Product } from "@/types/api";
import type { Booth } from "@/types/booth";
import {
  searchBoothsByImage,
  searchProductsByImage,
} from "@/lib/api/upload-search";

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

// 将 DataURL 转为 File（用于翻页再次调用图片搜索接口）
async function dataURLToFile(dataUrl: string, filename: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
}

/**
 * 图片搜索商品虚拟无限滚动Hook
 */
export function useInfiniteImageProductSearch(
  enabled: boolean = true
): InfiniteQueryReturn<Product> {
  const [data, setData] = useState<InfiniteQueryData<Product> | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [serverTotal, setServerTotal] = useState<number | undefined>(undefined);

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
          images: item.images, // 兼容两种字段名
          boothId: item.boothId,
          boothName: item.boothName,
          similarity: item.similarity,
          matchedImages: item.matchedImages || [],
        }));
      }

      setAllProducts(products);
      setServerTotal(Number(parsedResults.total) || products.length);

      // 初始化第一页数据
      if (products.length > 0) {
        const firstPageData = products.slice(0, PAGE_SIZE);
        const total = Number(parsedResults.total) || products.length;
        const pageSize = Number(parsedResults.pageSize) || PAGE_SIZE;
        const totalPages = Math.ceil(total / pageSize);

        setData({
          pages: [
            {
              rows: firstPageData,
              total,
              pageSize,
              pageNum: 1,
              totalPages,
              searchTime: parsedResults.searchTime,
            },
          ],
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
      console.error(
        "sessionStorage content:",
        sessionStorage.getItem("imageSearchResults")
      );
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
      return;
    }

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const total = serverTotal ?? allProducts.length;
    
    // 如果已经超过总数，没有更多数据了
    if (startIndex >= total) {
      return;
    }
    
    // 如果本地已有全部数据，从本地分页
    if (startIndex < allProducts.length) {
      setIsFetchingNextPage(true);

      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));

      const nextPageData = allProducts.slice(startIndex, endIndex);
      const pageSize = data.pages?.[0]?.pageSize ?? PAGE_SIZE;
      const totalPages = Math.ceil(total / pageSize);

      setData((prevData) => ({
        pages: [
          ...(prevData?.pages || []),
          {
            rows: nextPageData,
            total,
            pageSize,
            pageNum: nextPage,
            totalPages,
            searchTime: prevData?.pages[0]?.searchTime,
          },
        ],
        pageParams: [...(prevData?.pageParams || []), nextPage],
      }));

      setCurrentPage(nextPage);
      setIsFetchingNextPage(false);
      return;
    }
    
    // 如果本地数据不足且还有更多数据，尝试从服务器获取
    // 注意：图片搜索API通常一次返回所有结果，这个分支可能不会执行
    const searchImage = sessionStorage.getItem("searchImage");
    if (!searchImage) return;
    
    // 获取保存的boothId（如果有的话）
    const searchBoothId = sessionStorage.getItem("searchBoothId");
    
    setIsFetchingNextPage(true);
    try {
      const file = await dataURLToFile(searchImage, "search.jpg");
      const searchOptions = {
        limit: PAGE_SIZE,
        pageNum: nextPage,
        minSimilarity: 0.75,
        ...(searchBoothId && { boothId: searchBoothId }),
      };
      const resp = await searchProductsByImage(file, searchOptions);
      const source = (resp as any).rows || (resp as any).results || []; // 兼容两种字段名
      const newProducts = source.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price || 0,
        images:
          item.images ||
          (item.image || item.imageUrl
            ? [{ url: item.image || item.imageUrl }]
            : []),
        boothId: item.boothId,
        boothName: item.boothName,
        similarity: item.similarity,
        matchedImages: item.matchedImages || [],
      })) as Product[];
      setAllProducts((prev) => [...prev, ...newProducts]);

      const pageSize = data.pages?.[0]?.pageSize ?? PAGE_SIZE;
      const total2 = data.pages?.[0]?.total ?? serverTotal ?? allProducts.length + newProducts.length;
      const totalPages = Math.ceil(total2 / pageSize);
      
      setData((prevData) => ({
        pages: [
          ...(prevData?.pages || []),
          {
            rows: newProducts,
            total: total2,
            pageSize,
            pageNum: nextPage,
            totalPages,
            searchTime: prevData?.pages[0]?.searchTime,
          },
        ],
        pageParams: [...(prevData?.pageParams || []), nextPage],
      }));
      setCurrentPage(nextPage);
    } catch (e) {
      console.error("图片搜索产品拉取下一页失败", e);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [data, isFetchingNextPage, allProducts, currentPage]);

  // 计算是否还有下一页
  const hasNextPage = useMemo(() => {
    const total = serverTotal ?? allProducts.length;
    if (!total) return false;
    return currentPage * PAGE_SIZE < total;
  }, [serverTotal, allProducts.length, currentPage]);

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
  const [data, setData] = useState<InfiniteQueryData<Booth> | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allBooths, setAllBooths] = useState<Booth[]>([]);
  const marketDictMap = useDictMap(DictType.MARKET);
  const [serverTotal, setServerTotal] = useState<number | undefined>(undefined);

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

      const transformedRows: Booth[] = (parsedResults.rows || []).map(
        (item: any) => ({
          ...item,
          // 统一名称字段（后端已返回 boothName，此处仅兜底）
          boothName: item.boothName || item.name,
          // 初始时不翻译，等字典加载完成后再翻译
          marketLabel: item.marketLabel || '',
        })
      );

      setAllBooths(transformedRows);
      setServerTotal(Number(parsedResults.total) || transformedRows.length);

      // 初始化第一页数据
      if (transformedRows.length > 0) {
        const firstPageData = transformedRows.slice(0, PAGE_SIZE);
        const total = Number(parsedResults.total) || transformedRows.length;
        const pageSize = Number(parsedResults.pageSize) || PAGE_SIZE;
        const totalPages = Math.ceil(total / pageSize);

        setData({
          pages: [
            {
              rows: firstPageData,
              total,
              pageSize,
              pageNum: 1,
              totalPages,
              searchTime: parsedResults.searchTime,
            },
          ],
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
      console.error(
        "sessionStorage content:",
        sessionStorage.getItem("imageSearchResults")
      );
      setError(
        err instanceof Error ? err : new Error("图片搜索档口数据解析失败")
      );
      setData(undefined);
      setAllBooths([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取下一页数据
  const fetchNextPage = useCallback(async () => {
    if (!data || isFetchingNextPage || !allBooths.length) {
      return;
    }

    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const total = serverTotal ?? allBooths.length;
    
    // 如果已经超过总数，没有更多数据了
    if (startIndex >= total) {
      return;
    }
    
    // 如果本地已有全部数据，从本地分页
    if (startIndex < allBooths.length) {
      setIsFetchingNextPage(true);

      // 模拟网络请求延迟
      await new Promise((resolve) => setTimeout(resolve, LOADING_DELAY));

      const nextPageData = allBooths.slice(startIndex, endIndex);
      const pageSize = data.pages?.[0]?.pageSize ?? PAGE_SIZE;
      const totalPages = Math.ceil(total / pageSize);

      setData((prevData) => ({
        pages: [
          ...(prevData?.pages || []),
          {
            rows: nextPageData,
            total,
            pageSize,
            pageNum: nextPage,
            totalPages,
            searchTime: prevData?.pages[0]?.searchTime,
          },
        ],
        pageParams: [...(prevData?.pageParams || []), nextPage],
      }));

      setCurrentPage(nextPage);
      setIsFetchingNextPage(false);
      return;
    }
    
    // 如果本地数据不足且还有更多数据，尝试从服务器获取
    // 注意：图片搜索API通常一次返回所有结果，这个分支可能不会执行
    const searchImage = sessionStorage.getItem("searchImage");
    if (!searchImage) return;
    
    setIsFetchingNextPage(true);
    try {
      const file = await dataURLToFile(searchImage, "search.jpg");
      const resp = await searchBoothsByImage(file, {
        limit: PAGE_SIZE,
        pageNum: nextPage,
        minSimilarity: 0.75,
      });
      const source = (resp as any).rows || (resp as any).results || []; // 兼容两种字段名
      const newRows: Booth[] = source.map((item: any) => ({
        ...item,
        boothName: item.boothName || item.name,
        marketLabel: item.marketLabel || '',
      }));
      
      // 直接翻译新数据
      const translatedNewRows = marketDictMap ? newRows.map((booth) => ({
        ...booth,
        marketLabel: translateDictValue(booth.market as string, marketDictMap) || booth.marketLabel,
      })) : newRows;
      
      setAllBooths((prev) => [...prev, ...newRows]);

      const pageSize = data.pages?.[0]?.pageSize ?? PAGE_SIZE;
      const total2 = data.pages?.[0]?.total ?? serverTotal ?? allBooths.length + newRows.length;
      const totalPages = Math.ceil(total2 / pageSize);
      
      setData((prevData) => ({
        pages: [
          ...(prevData?.pages || []),
          {
            rows: translatedNewRows, // 使用翻译后的数据
            total: total2,
            pageSize,
            pageNum: nextPage,
            totalPages,
            searchTime: prevData?.pages[0]?.searchTime,
          },
        ],
        pageParams: [...(prevData?.pageParams || []), nextPage],
      }));
      setCurrentPage(nextPage);
    } catch (e) {
      console.error("图片搜索档口拉取下一页失败", e);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [data, isFetchingNextPage, allBooths, currentPage, serverTotal, marketDictMap]);

  // 计算是否还有下一页
  const hasNextPage = useMemo(() => {
    const total = serverTotal ?? allBooths.length;
    if (!total) return false;
    return currentPage * PAGE_SIZE < total;
  }, [serverTotal, allBooths.length, currentPage]);

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

  // 对初始数据进行翻译（仅第一页，其他页在fetchNextPage中已翻译）
  const dataWithInitialTranslation = useMemo(() => {
    if (!data || !data.pages.length) {
      return data;
    }
    
    // 如果没有字典或第一页不是页面1，直接返回原始数据
    if (!marketDictMap || !data.pages[0] || data.pages[0].pageNum !== 1) {
      return data;
    }
    
    // 只翻译第一页的数据
    const firstPage = data.pages[0];
    const translatedFirstPageRows = firstPage.rows.map((booth: any) => ({
      ...booth,
      marketLabel: translateDictValue(booth.market as string, marketDictMap) || booth.marketLabel,
    }));
    
    const updatedPages = data.pages.map((page, index) => {
      if (index === 0) {
        return { ...page, rows: translatedFirstPageRows };
      }
      return page; // 其他页面已经在fetchNextPage中翻译过了
    });
    
    return { ...data, pages: updatedPages };
  }, [data, marketDictMap]);

  return {
    data: dataWithInitialTranslation,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    refetch,
  };
}
