import { useState, useEffect, useMemo } from 'react';
import type { Booth } from '@/types/api';

// Mock档口详情数据
const mockBoothDetail: Booth = {
  id: '1',
  boothName: '潮流手机配件专营店',
  marketLabel: '广州天河电脑城',
  address: '天河区天河路208号天河电脑城2楼A201-A205',
  mainBusiness: '手机壳、手机贴膜、数据线、充电器、无线耳机',
  coverImg: '/placeholder-booth.jpg',
  phone: '020-38888888',
  wx: 'phonecase2024',
  followers: 1250,
  view: 15600,
  description: '专业经营各类手机配件，品质保证，价格实惠，支持批发零售',
  businessHours: '09:00-21:00',
  rating: 4.8,
  reviewCount: 456
};

// Mock商品数据
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 透明保护壳',
    price: 35.00,
    originalPrice: 59.00,
    coverImage: '/placeholder-product.jpg',
    views: 1250,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    description: '高透明度，防摔抗震，精准开孔'
  },
  {
    id: '2', 
    name: 'Type-C快充数据线 2米',
    price: 15.80,
    originalPrice: 25.00,
    coverImage: '/placeholder-product.jpg',
    views: 890,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
    description: '支持快充，编织线身，耐用性强'
  },
  {
    id: '3',
    name: '无线蓝牙耳机 降噪版',
    price: 128.00,
    originalPrice: 199.00,
    coverImage: '/placeholder-product.jpg',
    views: 2100,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    description: '主动降噪，长续航，音质清晰'
  },
  {
    id: '4',
    name: '钢化玻璃膜 防蓝光',
    price: 12.50,
    originalPrice: 20.00,
    coverImage: '/placeholder-product.jpg',
    views: 670,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
    description: '防蓝光护眼，高透光率，防指纹'
  },
  {
    id: '5',
    name: '车载无线充电器',
    price: 45.00,
    originalPrice: 78.00,
    coverImage: '/placeholder-product.jpg',
    views: 420,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    description: '15W快充，自动感应，稳固夹持'
  },
  {
    id: '6',
    name: '移动电源 20000mAh',
    price: 89.00,
    originalPrice: 129.00,
    coverImage: '/placeholder-product.jpg',
    views: 1580,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8天前
    description: '大容量，双向快充，液晶显示'
  }
];

interface UseBoothDetailOptions {
  boothId: string;
  autoTrackView?: boolean;
  onContactSuccess?: (type: string, value: string) => void;
  onShareSuccess?: () => void;
}

export function useBoothDetail({
  boothId,
  autoTrackView = true,
  onContactSuccess,
  onShareSuccess
}: UseBoothDetailOptions) {
  const [booth, setBooth] = useState<Booth | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // 模拟获取档口详情
  useEffect(() => {
    const fetchBoothDetail = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setBooth(mockBoothDetail);
        setIsFavorited(Math.random() > 0.5); // 随机收藏状态
        
        if (autoTrackView) {
          console.log(`追踪档口浏览: ${boothId}`);
        }
      } catch (err) {
        setIsError(true);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (boothId) {
      fetchBoothDetail();
    }
  }, [boothId, autoTrackView]);

  // 模拟获取商品列表
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsProductsLoading(true);
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // 每页6个商品
        const pageSize = 6;
        const startIndex = 0;
        const endIndex = startIndex + pageSize;
        
        setProducts(mockProducts.slice(startIndex, endIndex));
        setHasMoreProducts(endIndex < mockProducts.length);
        setCurrentPage(1);
      } catch (err) {
        console.error('获取商品失败:', err);
      } finally {
        setIsProductsLoading(false);
      }
    };

    if (booth) {
      fetchProducts();
    }
  }, [booth]);

  // 加载更多商品
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMoreProducts) return;

    try {
      setIsLoadingMore(true);
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const pageSize = 6;
      const nextPage = currentPage + 1;
      const startIndex = (nextPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      
      const newProducts = mockProducts.slice(startIndex, endIndex);
      
      setProducts(prev => [...prev, ...newProducts]);
      setCurrentPage(nextPage);
      setHasMoreProducts(endIndex < mockProducts.length);
    } catch (err) {
      console.error('加载更多商品失败:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 切换收藏状态
  const handleFavoriteToggle = async () => {
    try {
      const newFavoriteStatus = !isFavorited;
      setIsFavorited(newFavoriteStatus);
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log(`档口${newFavoriteStatus ? '已收藏' : '已取消收藏'}: ${boothId}`);
    } catch (err) {
      // 回滚状态
      setIsFavorited(!isFavorited);
      console.error('收藏操作失败:', err);
    }
  };

  // 分享功能
  const handleShareClick = async () => {
    try {
      const shareData = {
        title: booth?.boothName || '档口分享',
        text: booth?.mainBusiness || '来看看这个档口',
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        console.log('链接已复制到剪贴板');
      }
      
      onShareSuccess?.();
    } catch (err) {
      console.error('分享失败:', err);
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    setCurrentPage(1);
    setProducts([]);
    setHasMoreProducts(true);
    
    // 重新获取数据
    setBooth(null);
    setIsLoading(true);
  };

  // 处理的商品数据结构
  const productsData = useMemo(() => {
    return {
      rows: products,
      total: mockProducts.length
    };
  }, [products]);

  return {
    booth,
    products: productsData,
    isFavorited,
    isLoading,
    isProductsLoading,
    isLoadingMore,
    hasMoreProducts,
    isError,
    error,
    handleFavoriteToggle,
    handleShareClick,
    handleRefresh,
    handleLoadMore
  };
}
