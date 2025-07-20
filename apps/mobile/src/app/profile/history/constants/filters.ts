import { Clock, Package, Store } from "lucide-react";

export type FilterType = "all" | "product" | "booth";

export interface FilterOption {
  key: FilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const FILTERS: FilterOption[] = [
  { key: "all", label: "全部", icon: Clock },
  { key: "product", label: "商品", icon: Package },
  { key: "booth", label: "档口", icon: Store },
];

// 分页配置
export const PAGE_SIZE = 20;

// 骨架屏数量
export const SKELETON_COUNT = 5;