# 通用无限滚动解决方案

我们为项目创建了一套完整的、可复用的无限滚动解决方案，包含以下几个核心组件：

## 核心组件

### 1. `useInfiniteData` - 通用无限数据Hook

位置：`src/hooks/api/useInfiniteData.ts`

这是一个基于 React Query 的通用无限滚动数据管理 Hook，提供了类型安全和标准化的分页数据处理。

#### 特性
- 📦 **类型安全**：完全的 TypeScript 支持
- 🔄 **智能分页**：支持多种分页判断策略
- 🎯 **灵活配置**：可自定义查询键、API 函数等
- 🚀 **性能优化**：内置缓存和错误处理

#### 基本用法

```tsx
import { useInfiniteData } from '@/hooks/api/useInfiniteData';

// 定义你的数据类型和参数类型
interface MyItem {
  id: string;
  name: string;
}

interface MyParams {
  pageNum: number;
  pageSize: number;
  category?: string;
}

// 在组件中使用
function MyComponent() {
  const {
    allData,           // 合并的所有数据
    total,             // 总数
    isLoadingInitial,  // 初始加载状态
    isLoadingMore,     // 加载更多状态
    hasMore,           // 是否有更多数据
    loadMore,          // 加载更多函数
    error,             // 错误信息
    isError,           // 是否有错误
  } = useInfiniteData<MyItem, MyParams>({
    queryKey: ['my-items', { category: 'electronics' }],
    queryFn: async (params) => {
      const response = await api.getItems(params);
      return response;
    },
    baseParams: { 
      pageSize: 20,
      category: 'electronics'
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
  });

  // 使用数据...
}
```

### 2. `useIntersectionObserver` - 通用视口检测Hook

位置：`src/hooks/useIntersectionObserver.ts`

提供了两个相关的 Hook：

#### `useIntersectionObserver`
基础的视口检测 Hook。

```tsx
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

function MyComponent() {
  const triggerRef = useIntersectionObserver(
    () => {
      console.log('Element entered viewport!');
    },
    {
      threshold: 0.5,
      rootMargin: '100px',
      enabled: true,
    }
  );

  return <div ref={triggerRef}>Trigger element</div>;
}
```

#### `useInfiniteScroll`
专门为无限滚动优化的 Hook。

```tsx
import { useInfiniteScroll } from '@/hooks/useIntersectionObserver';

function MyList({ loadMore, hasMore, isLoading }) {
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    loadMore,
    {
      hasMore,
      isLoading,
      threshold: 0.1,
      rootMargin: '50px',
    }
  );

  return (
    <div>
      {/* 你的列表内容 */}
      
      {/* 无限滚动触发器 */}
      {shouldShowTrigger && (
        <div ref={triggerRef} className="py-2" />
      )}
      
      {/* 加载状态 */}
      {isLoading && <LoadingSpinner />}
    </div>
  );
}
```

## 实际应用示例

### 示例1：首页新品档口（已实现）

位置：`src/pages/home/components/booths-with-new-products/index.tsx`

```tsx
import { useInfiniteLatestBoothsWithNewProducts } from "../../hooks";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";

export function BoothsWithNewProducts({ title, pageSize = 12 }) {
  // 使用通用的无限数据hook
  const { 
    allData: allBooths,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  } = useInfiniteLatestBoothsWithNewProducts(pageSize);
  
  // 使用通用的无限滚动hook
  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    loadMore,
    { hasMore, isLoading: isLoadingMore }
  );

  // 渲染逻辑...
}
```

### 示例2：市场页面档口列表（已实现）

位置：`src/pages/market/market-page.tsx` 和相关文件

```tsx
// 在 useMarketData hook 中
export function useMarketData() {
  const [searchKeyword, setSearchKeyword] = useState("");
  
  const queryParams = useMemo(() => ({
    pageSize: 20,
    ...(searchKeyword && { keyword: searchKeyword }),
  }), [searchKeyword]);

  const {
    allData: booths,
    isLoadingInitial: isLoading,
    isLoadingMore: isFetchingNextPage,
    hasMore: hasNextPage,
    loadMore: handleLoadMore,
    // ... 其他属性
  } = useInfiniteData<Booth, GetBoothsParams>({
    queryKey: ['market-booths', JSON.stringify(queryParams)],
    queryFn: async (params) => {
      const response = await getBooths(params);
      return { data: response };
    },
    baseParams: queryParams,
  });

  return {
    booths,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    handleLoadMore,
    // ... 其他返回值
  };
}
```

## 最佳实践

### 1. 查询键（Query Key）设计
- 使用数组形式，第一个元素为基础标识符
- 包含所有影响数据的参数
- 对于复杂对象，使用 `JSON.stringify()` 确保缓存键的一致性

```tsx
// ✅ 推荐
queryKey: ['booths', 'with-new-products', { pageSize, category }]

// ✅ 对于复杂参数
queryKey: ['market-booths', JSON.stringify(queryParams)]

// ❌ 避免
queryKey: ['booths', queryParams] // 对象引用问题
```

### 2. 错误处理
```tsx
const { error, isError } = useInfiniteData({
  // ... 其他配置
  onError: (error) => {
    console.error('Data fetch error:', error);
    // 可以添加全局错误处理逻辑
    showToast('加载失败，请重试');
  },
});
```

### 3. 性能优化
- 设置合适的 `staleTime` 避免不必要的重复请求
- 使用 `React.memo` 优化列表项组件
- 合理设置 `pageSize`，平衡加载速度和用户体验

### 4. 用户体验
- 提供清晰的加载状态指示
- 在没有更多数据时显示提示
- 处理错误状态并提供重试选项

## 扩展新的无限滚动列表

要为新的页面添加无限滚动功能，按以下步骤操作：

### 1. 定义类型
```tsx
interface MyDataItem {
  id: string;
  // ... 其他字段
}

interface MyQueryParams {
  pageNum: number;
  pageSize: number;
  // ... 其他查询参数
}
```

### 2. 创建数据Hook
```tsx
export function useMyInfiniteData(filters: MyFilters) {
  return useInfiniteData<MyDataItem, MyQueryParams>({
    queryKey: ['my-data', JSON.stringify(filters)],
    queryFn: async (params) => {
      const response = await api.getMyData(params);
      return response;
    },
    baseParams: {
      pageSize: 20,
      ...filters,
    },
  });
}
```

### 3. 在组件中使用
```tsx
export function MyListComponent() {
  const {
    allData,
    isLoadingInitial,
    isLoadingMore,
    hasMore,
    loadMore,
    error,
  } = useMyInfiniteData(filters);

  const { triggerRef, shouldShowTrigger } = useInfiniteScroll(
    loadMore,
    { hasMore, isLoading: isLoadingMore }
  );

  if (error) return <ErrorComponent />;
  if (isLoadingInitial) return <LoadingComponent />;

  return (
    <div>
      {allData.map(item => (
        <MyItem key={item.id} data={item} />
      ))}
      
      {shouldShowTrigger && <div ref={triggerRef} />}
      {isLoadingMore && <LoadingMoreComponent />}
      {!hasMore && allData.length > 0 && <NoMoreDataComponent />}
    </div>
  );
}
```

## 注意事项

1. **API 兼容性**：确保你的 API 返回符合 `PaginatedResponse` 格式的数据
2. **内存管理**：对于大量数据的列表，考虑使用虚拟滚动等技术
3. **网络优化**：合理设置重试策略和缓存时间
4. **用户体验**：提供流畅的加载动画和清晰的状态反馈

这套方案已经在项目中的多个页面实现并测试，提供了一致的用户体验和开发体验。
