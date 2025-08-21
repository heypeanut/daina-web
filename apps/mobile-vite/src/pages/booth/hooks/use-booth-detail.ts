import { useState, useEffect, useMemo } from "react";
import {
  getBoothDetail,
  getBoothProducts,
  trackBoothView,
} from "@/lib/api/booth";
import type { Booth } from "@/types/api";
import type { BoothProduct } from "@/types/booth";

interface UseBoothDetailOptions {
  boothId: string;
  autoTrackView?: boolean;
  onShareSuccess?: () => void;
}

export function useBoothDetail({
  boothId,
  autoTrackView = true,
  onShareSuccess,
}: UseBoothDetailOptions) {
  const [booth, setBooth] = useState<Booth | null>(null);
  const [products, setProducts] = useState<BoothProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // 获取档口详情
  useEffect(() => {
    let cancelled = false;

    const fetchBoothDetail = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        const boothData = await getBoothDetail(boothId);

        if (cancelled) return;

        setBooth(boothData);

        // 自动记录浏览
        if (autoTrackView) {
          try {
            await trackBoothView(boothId);
          } catch (trackError) {
            console.warn("记录档口浏览失败:", trackError);
          }
        }
      } catch (err) {
        if (cancelled) return;
        const error =
          err instanceof Error ? err : new Error("获取档口详情失败");
        setError(error);
        setIsError(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchBoothDetail();

    return () => {
      cancelled = true;
    };
  }, [boothId, autoTrackView]);

  // 获取商品列表
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        setCurrentPage(1);
        setHasMoreProducts(true);

        const response = await getBoothProducts(boothId, {
          pageNum: 1,
          pageSize: 6,
        });

        if (cancelled) return;

        setProducts(response.rows);
        setHasMoreProducts(response.rows.length < response.total);
      } catch (err) {
        if (!cancelled) {
          console.error("获取商品失败:", err);
        }
      } finally {
        if (!cancelled) {
          setIsProductsLoading(false);
        }
      }
    };

    if (boothId) {
      fetchProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [boothId]);

  // 加载更多商品
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreProducts) return;

    try {
      setIsLoadingMore(true);
      const nextPage = currentPage + 1;

      const response = await getBoothProducts(boothId, {
        pageNum: nextPage,
        pageSize: 6,
      });

      const newProducts = response.rows;

      setProducts((prev) => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
      setHasMoreProducts(
        newProducts.length === 6 &&
          currentPage * 6 + newProducts.length < response.total
      );
    } catch (err) {
      console.error("加载更多商品失败:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 收藏切换
  const handleFavoriteToggle = async () => {
    const newFavoriteStatus = !isFavorited;
    setIsFavorited(newFavoriteStatus);

    try {
      // TODO: 调用收藏/取消收藏API
      console.log(
        `档口${newFavoriteStatus ? "已收藏" : "已取消收藏"}: ${boothId}`
      );
    } catch (err) {
      // 回滚状态
      setIsFavorited(!isFavorited);
      console.error("收藏操作失败:", err);
    }
  };

  // 分享功能
  const handleShareClick = async () => {
    try {
      const shareData = {
        title: booth?.boothName || "档口分享",
        text: booth?.mainBusiness || "来看看这个档口",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        console.log("链接已复制到剪贴板");
      }

      onShareSuccess?.();
    } catch (err) {
      console.error("分享失败:", err);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    // 重新触发useEffect
    setIsLoading(true);
    setIsProductsLoading(true);
  };

  // 商品分页数据
  const paginatedProducts = useMemo(() => {
    return {
      rows: products,
      total: products.length,
    };
  }, [products]);

  return {
    booth,
    products: paginatedProducts,
    isLoading,
    isError,
    error,
    isProductsLoading,
    isLoadingMore,
    hasMoreProducts,
    isFavorited,
    handleFavoriteToggle,
    handleShareClick,
    handleRefresh,
    handleLoadMore,
  };
}
