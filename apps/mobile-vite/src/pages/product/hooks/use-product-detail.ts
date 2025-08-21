import { useState, useEffect, useCallback } from "react";
import type { ProductDetail } from "@/types/booth";

// Mock商品详情数据
const mockProductDetail: ProductDetail = {
  id: 1,
  name: "iPhone 15 Pro Max 透明保护壳 高透明度防摔抗震精准开孔",
  price: 35.0,
  maxPrice: 89.0,
  originalPrice: 59.0,
  stock: 999,
  status: 1,
  features: "高透明度，防摔抗震，精准开孔，支持无线充电",
  boothId: "1",
  video: "",
  views: 1250,
  collects: 68,
  itemNo: "PC-IP15PM-001",
  imageType: "实拍图",
  copyright: "原创设计",
  category: "手机配件",
  style: "简约透明",
  phoneModel: "iPhone 15 Pro Max",
  productType: "保护壳",
  trend: "2024春季新款",
  biodegradable: "是",
  ecoMaterial: "环保TPU",
  services: "7天无理由退换，质量问题包换",
  createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  images: [
    {
      id: 1,
      url: "/placeholder-product.jpg",
      alt: "商品主图",
    },
    {
      id: 2,
      url: "/placeholder-product.jpg",
      alt: "商品细节图1",
    },
    {
      id: 3,
      url: "/placeholder-product.jpg",
      alt: "商品细节图2",
    },
    {
      id: 4,
      url: "/placeholder-product.jpg",
      alt: "商品细节图3",
    },
  ],
  booth: {
    id: "1",
    boothName: "潮流手机配件专营店",
    mainBusiness: "手机配件批发零售",
    market: "tianhe",
    followers: 1250,
    view: 15600,
    phone: "020-38888888",
    wx: "phonecase2024",
    coverImg: "/placeholder-booth.jpg",
  },
};

interface UseProductDetailParams {
  productId: string;
  autoTrackView?: boolean;
  onShareSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useProductDetail({
  productId,
  autoTrackView = true,
  onShareSuccess,
  onError,
}: UseProductDetailParams) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 分享功能
  const handleShareClick = useCallback(async () => {
    try {
      const shareData = {
        title: product?.name || "商品分享",
        text: `${product?.name} - ¥${product?.price}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        console.log("商品链接已复制到剪贴板");
      }

      onShareSuccess?.();
    } catch (err) {
      console.error("分享失败:", err);
    }
  }, [product?.name, product?.price, onShareSuccess]);

  // 模拟获取商品详情
  useEffect(() => {
    if (!productId) return;

    let cancelled = false;

    const loadProductDetail = async () => {
      if (cancelled) return;

      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        // 模拟API延迟
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (cancelled) return;

        // 设置商品数据
        setProduct(mockProductDetail);
      } catch (err) {
        if (cancelled) return;
        const error =
          err instanceof Error ? err : new Error("获取商品详情失败");
        setError(error);
        setIsError(true);
        onError?.(error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadProductDetail();

    // 清理函数，组件卸载或依赖改变时取消请求
    return () => {
      cancelled = true;
    };
  }, [productId, autoTrackView, refreshTrigger, onError]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    product,
    isLoading,
    isError,
    error,
    handleShareClick,
    handleRefresh,
  };
}
