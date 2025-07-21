"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Footprint } from "@/lib/api/favorites";
import { useHistoryData } from "./hooks/useHistoryData";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import { EmptyState } from "./components/EmptyState";
import { FilterTabs } from "./components/FilterTabs";
import { HistoryItem } from "./components/HistoryItem";
import { toast } from "sonner";

export default function HistoryPage() {
  const router = useRouter();
  const {
    footprints,
    loading,
    removing,
    clearing,
    hasMore,
    totalCount,
    filter,
    setFilter,
    handleRemoveFootprint,
    handleClearFootprints,
    handleLoadMore,
  } = useHistoryData();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleItemClick = useCallback((footprint: Footprint) => {
    if (footprint.type === "product" && footprint.product) {
      router.push(`/products/${footprint.targetId}`);
    } else if (footprint.type === "booth" && footprint.booth) {
      router.push(`/booths/${footprint.targetId}`);
    }
  }, [router]);

  const handleClearConfirm = useCallback(async () => {
    if (!confirm("确定要清空所有浏览记录吗？此操作不可恢复。")) {
      return;
    }

    try {
      await handleClearFootprints();
    } catch (error) {
      console.error("清空失败:", error);
      toast.error(error instanceof Error ? error.message : "清空失败，请重试");
    }
  }, [handleClearFootprints]);

  const handleRemoveConfirm = useCallback(async (footprintId: string) => {
    try {
      await handleRemoveFootprint(footprintId);
    } catch (error) {
      console.error("删除失败:", error);
      toast.error(error instanceof Error ? error.message : "删除失败，请重试");
    }
  }, [handleRemoveFootprint]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            浏览记录 ({totalCount})
          </h1>
          {footprints.length > 0 && (
            <button
              onClick={handleClearConfirm}
              disabled={clearing}
              className="flex items-center space-x-1 px-3 py-1 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-50"
            >
              {clearing ? (
                <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="text-sm">清空</span>
            </button>
          )}
        </div>

        <FilterTabs filter={filter} onFilterChange={setFilter} />
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {loading && footprints.length === 0 ? (
          <LoadingSkeleton />
        ) : footprints.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="p-4 space-y-4">
            {footprints.map((footprint) => (
              <HistoryItem
                key={footprint.id}
                footprint={footprint}
                removing={removing}
                onRemove={handleRemoveConfirm}
                onItemClick={handleItemClick}
              />
            ))}

            {/* 加载更多 */}
            {hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? "加载中..." : "加载更多"}
                </button>
              </div>
            )}

            {!hasMore && footprints.length > 0 && (
              <div className="text-center py-4 text-gray-400 text-sm">
                已显示全部记录
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}