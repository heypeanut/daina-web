import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useInfiniteBoothSearch } from "@/hooks/api/search";
import { useInfiniteScroll } from "@/hooks/useIntersectionObserver";
import BoothCard from "./BoothCard";
import ViewModeToggle from "./ViewModeToggle";
import { LoadingState, ErrorState, EmptyState } from "./SearchStates";
import LoadMoreTrigger from "./LoadMoreTrigger";

export default function BoothSearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const keyword = useMemo(() => searchParams.get("q") || "", [searchParams]);
  const queryParams = useMemo(() => ({ keyword }), [keyword]);

  const boothQuery = useInfiniteBoothSearch(queryParams, {
    enabled: !!keyword,
  });

  const allBooths = boothQuery.data?.pages.flatMap((page) => page.rows || []) || [];

  const handleLoadMore = useCallback(() => {
    if (boothQuery.hasNextPage && !boothQuery.isFetchingNextPage) {
      boothQuery.fetchNextPage();
    }
  }, [boothQuery]);

  const scrollHook = useInfiniteScroll(handleLoadMore, {
    hasMore: boothQuery.hasNextPage || false,
    isLoading: boothQuery.isFetchingNextPage || false,
  });

  const handleBoothClick = useCallback((boothId: string) => {
    navigate(`/booth/${boothId}`);
  }, [navigate]);

  // 渲染状态
  if (boothQuery.isLoading) {
    return <LoadingState />;
  }

  if (boothQuery.isError) {
    return (
      <ErrorState
        message={boothQuery.error?.message}
        onRetry={() => boothQuery.refetch()}
      />
    );
  }

  if (allBooths.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="p-4">
      {/* 搜索结果统计信息 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">
          {boothQuery.data?.pages[0]?.total ? (
            <>
              共找到 <span className="text-orange-500 font-medium">{boothQuery.data.pages[0].total}</span> 个档口，
              已加载 {allBooths.length} 个
            </>
          ) : (
            `已加载 ${allBooths.length} 个档口`
          )}
        </span>
        <ViewModeToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>

      {/* 档口列表 */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"
        }
      >
        {allBooths.map((booth) => (
          <BoothCard
            key={booth.id}
            booth={booth}
            onClick={() => handleBoothClick(booth.id)}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* 滚动加载触发器 */}
      {scrollHook.shouldShowTrigger && (
        <LoadMoreTrigger
          ref={scrollHook.triggerRef}
          isLoading={scrollHook.isLoading}
          itemType="档口"
        />
      )}
    </div>
  );
}