import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteProductSearch } from "@/hooks/api/search";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import ProductCard from "./ProductCard";
import ViewModeToggle from "./ViewModeToggle";
import { LoadingState, ErrorState, EmptyState } from "./SearchStates";
import LoadMoreTrigger from "./LoadMoreTrigger";

export default function ProductSearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const keyword = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const boothId = useMemo(() => searchParams.get("boothId") || "", [searchParams]);
  const queryParams = useMemo(() => ({ 
    keyword,
    ...(boothId && { boothId })
  }), [keyword, boothId]);

  const productQuery = useInfiniteProductSearch(queryParams, {
    enabled: !!keyword,
  });

  const allProducts =
    productQuery.data?.pages.flatMap((page) => page.rows || []) || [];

  const handleLoadMore = useCallback(() => {
    if (productQuery.hasNextPage && !productQuery.isFetchingNextPage) {
      productQuery.fetchNextPage();
    }
  }, [productQuery]);

  const scrollHook = useInfiniteScroll(handleLoadMore, {
    hasMore: productQuery.hasNextPage || false,
    isLoading: productQuery.isFetchingNextPage || false,
  });

  const handleProductClick = useCallback(
    (productId: string) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  // 渲染状态
  if (productQuery.isLoading) {
    return <LoadingState />;
  }

  if (productQuery.isError) {
    return (
      <ErrorState
        message={productQuery.error?.message}
        onRetry={() => productQuery.refetch()}
      />
    );
  }

  if (allProducts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-4">
      {/* 搜索结果统计信息 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {productQuery.data?.pages[0]?.total ? (
            <>
              共找到 <span className="text-orange-500 font-medium">{productQuery.data.pages[0].total}</span> 个商品，
              已加载 {allProducts.length} 个
            </>
          ) : (
            `已加载 ${allProducts.length} 个商品`
          )}
        </span>
        <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* 商品列表 */}
      <div
        className={viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"}
      >
        {allProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* 滚动加载触发器 */}
      {scrollHook.shouldShowTrigger && (
        <LoadMoreTrigger
          ref={scrollHook.triggerRef}
          isLoading={scrollHook.isLoading}
          itemType="商品"
        />
      )}
    </div>
  );
}
