import { ChevronDown } from "lucide-react";

export type SortOption = "default" | "price_low" | "price_high" | "newest";

const sortOptions = [
    { value: "default", label: "默认排序" },
    { value: "newest", label: "上新优先" },
    { value: "price_low", label: "价格从低到高" },
    { value: "price_high", label: "价格从高到低" },
  ];

interface FilterBarProps {
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
}

export function FilterBar({ sortBy, setSortBy }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3">
    {/* Sort dropdown */}
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="appearance-none bg-gray-100 text-gray-700 py-2 px-3 pr-8 rounded text-sm border-0 focus:ring-2 focus:ring-red-500 focus:outline-none"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
      />
    </div>
  </div>
  );
}