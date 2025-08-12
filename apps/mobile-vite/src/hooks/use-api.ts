// 临时模拟hooks
export function useBanners(limit: number) {
  // 模拟banner数据
  const mockBanners = [
    {
      id: 1,
      title: '代拿网优质商品推荐',
      imageUrl: 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Banner+1',
      linkUrl: '/market',
      linkType: 'internal' as const
    },
    {
      id: 2,
      title: '档口批发代发服务',
      imageUrl: 'https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Banner+2',
      linkUrl: '/cooperation',
      linkType: 'internal' as const
    },
    {
      id: 3,
      title: '新品上市活动',
      imageUrl: 'https://via.placeholder.com/800x400/10B981/FFFFFF?text=Banner+3',
      linkUrl: '/search',
      linkType: 'internal' as const
    }
  ];

  return {
    banners: mockBanners.slice(0, limit),
    loading: false
  };
}

export function useBehaviorTracking() {
  return {
    recordBehavior: (action: string, type: string, id: string, data: any) => {
      console.log('Behavior tracking:', { action, type, id, data });
    }
  };
}

export function useBoothRanking(limit: number) {
  // 模拟档口排行数据
  const mockBooths = [
    { id: '1', boothName: '潮流前线 CASE', coverImg: 'https://via.placeholder.com/64x64/4F46E5/FFFFFF?text=1' },
    { id: '2', boothName: '炫彩时尚通讯太平洋店', coverImg: 'https://via.placeholder.com/64x64/EF4444/FFFFFF?text=2' },
    { id: '3', boothName: '摇摆豆豆', coverImg: 'https://via.placeholder.com/64x64/10B981/FFFFFF?text=3' },
    { id: '4', boothName: '华强北数码城', coverImg: 'https://via.placeholder.com/64x64/F59E0B/FFFFFF?text=4' },
    { id: '5', boothName: '义乌小商品市场', coverImg: 'https://via.placeholder.com/64x64/8B5CF6/FFFFFF?text=5' },
    { id: '6', boothName: '广州服装批发', coverImg: 'https://via.placeholder.com/64x64/EC4899/FFFFFF?text=6' },
    { id: '7', boothName: '深圳电子市场', coverImg: 'https://via.placeholder.com/64x64/14B8A6/FFFFFF?text=7' },
    { id: '8', boothName: '杭州丝绸市场', coverImg: 'https://via.placeholder.com/64x64/F97316/FFFFFF?text=8' },
  ];

  return {
    items: mockBooths.slice(0, limit),
    loading: false,
    error: null
  };
}

export function useBoothRecommendations(type: "booth_hot" | "booth_new", limit: number) {
  // 模拟档口推荐数据
  const mockBooths = [
    { id: '1', boothName: '测试1', coverImg: 'https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=测试1' },
    { id: '2', boothName: '潮流前线 C...', coverImg: 'https://via.placeholder.com/80x80/EF4444/FFFFFF?text=C...' },
    { id: '3', boothName: '微笑', coverImg: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=微笑' },
    { id: '4', boothName: '数码城A座', coverImg: 'https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=数码' },
    { id: '5', boothName: '服装批发B区', coverImg: 'https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=服装' },
  ];

  return {
    items: mockBooths.slice(0, limit),
    loading: false,
    error: null
  };
}

export function useLatestBoothsWithNewProducts(pageSize: number) {
  // 模拟瀑布流数据
  const mockBooths = [
    { 
      id: '1', 
      boothName: '华强北代拿手机配件专营店', 
      imageUrl: 'https://via.placeholder.com/200x180/4F46E5/FFFFFF?text=手机配件',
      market: '华强北商城'
    },
    { 
      id: '2', 
      boothName: '义乌小商品批发中心', 
      imageUrl: 'https://via.placeholder.com/200x220/EF4444/FFFFFF?text=小商品',
      market: '义乌国际商贸城'
    },
    { 
      id: '3', 
      boothName: '广州服装时尚批发', 
      imageUrl: 'https://via.placeholder.com/200x160/10B981/FFFFFF?text=服装',
      market: '白马服装市场'
    },
    { 
      id: '4', 
      boothName: '深圳电子产品代发', 
      imageUrl: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=电子',
      market: '华强电子市场'
    },
  ];

  return {
    items: mockBooths,
    loading: false,
    hasMore: false,
    error: null,
    loadMore: () => {},
    reset: () => {}
  };
}

export function useTrackBoothView() {
  return {
    mutate: (boothId: string) => {
      console.log('Tracking booth view:', boothId);
      // TODO: 实现埋点逻辑
    }
  };
}
