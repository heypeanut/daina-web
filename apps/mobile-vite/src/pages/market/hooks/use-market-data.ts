import { useState, useMemo, useCallback } from "react";

export interface GetBoothsParams {
  size?: number;
  keyword?: string;
}

export function useMarketData() {
  // 状态管理
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 构建查询参数
  const queryParams = useMemo((): Omit<GetBoothsParams, "pageNum"> => {
    const trimmedKeyword = searchKeyword.trim();
    const params: Omit<GetBoothsParams, "pageNum"> = {
      size: 20,
    };

    // 只有当关键词不为空时才添加 keyword 参数
    if (trimmedKeyword) {
      params.keyword = trimmedKeyword;
    }

    return params;
  }, [searchKeyword]);

  // 模拟档口数据
  const mockBooths = [
    {
      id: '1',
      boothName: '华强北数码批发中心',
      coverImg: 'https://via.placeholder.com/200x180/4F46E5/FFFFFF?text=数码',
      imageUrl: 'https://via.placeholder.com/200x180/4F46E5/FFFFFF?text=数码',
      market: '华强北商城',
      description: '专营手机配件、电脑配件、数码产品批发',
      rating: 4.8,
      location: '深圳华强北'
    },
    {
      id: '2',
      boothName: '义乌小商品批发大厅',
      coverImg: 'https://via.placeholder.com/200x220/EF4444/FFFFFF?text=小商品',
      imageUrl: 'https://via.placeholder.com/200x220/EF4444/FFFFFF?text=小商品',
      market: '义乌国际商贸城',
      description: '日用百货、家居用品、饰品批发',
      rating: 4.6,
      location: '义乌商贸城'
    },
    {
      id: '3',
      boothName: '广州服装时尚批发',
      coverImg: 'https://via.placeholder.com/200x160/10B981/FFFFFF?text=服装',
      imageUrl: 'https://via.placeholder.com/200x160/10B981/FFFFFF?text=服装',
      market: '白马服装市场',
      description: '时尚女装、男装、童装批发',
      rating: 4.7,
      location: '广州白马市场'
    },
    {
      id: '4',
      boothName: '深圳电子元器件专营',
      coverImg: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=电子',
      imageUrl: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=电子',
      market: '华强电子市场',
      description: '电子元器件、芯片、传感器批发',
      rating: 4.5,
      location: '深圳华强电子'
    },
    {
      id: '5',
      boothName: '杭州丝绸批发中心',
      coverImg: 'https://via.placeholder.com/200x190/8B5CF6/FFFFFF?text=丝绸',
      imageUrl: 'https://via.placeholder.com/200x190/8B5CF6/FFFFFF?text=丝绸',
      market: '杭州丝绸市场',
      description: '真丝面料、丝绸制品、纺织品批发',
      rating: 4.9,
      location: '杭州丝绸城'
    },
    {
      id: '6',
      boothName: '福建茶叶批发商行',
      coverImg: 'https://via.placeholder.com/200x170/EC4899/FFFFFF?text=茶叶',
      imageUrl: 'https://via.placeholder.com/200x170/EC4899/FFFFFF?text=茶叶',
      market: '安溪茶叶市场',
      description: '铁观音、大红袍、白茶批发',
      rating: 4.8,
      location: '福建安溪'
    }
  ];

  // 搜索相关方法
  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchKeyword("");
  }, []);

  // 重置所有状态
  const handleReset = useCallback(() => {
    setSearchKeyword("");
  }, []);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    setIsError(false);
    setError(null);
    // 这里可以添加重新加载逻辑
  }, []);

  // 加载更多
  const handleLoadMore = useCallback(() => {
    // 模拟加载更多
    console.log('Loading more booths...');
  }, []);

  return {
    // 数据
    booths: mockBooths,
    totalCount: mockBooths.length,
    isLoading,
    isError,
    error,
    hasNextPage: false, // 模拟数据，没有更多页
    isFetchingNextPage: false,
    searchKeyword,
    queryParams,

    // 方法
    handleSearch,
    handleClearSearch,
    handleReset,
    handleRefresh,
    handleLoadMore,
  };
}
