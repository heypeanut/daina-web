import React from "react";
import { FilterType, FILTERS } from "../constants/filters";

interface FilterTabsProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = React.memo(({ 
  filter, 
  onFilterChange 
}) => {
  return (
    <div className="px-4 pb-3">
      <div className="flex space-x-2">
        {FILTERS.map((filterOption) => {
          const IconComponent = filterOption.icon;
          const isActive = filter === filterOption.key;
          
          return (
            <button
              key={filterOption.key}
              onClick={() => onFilterChange(filterOption.key)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span>{filterOption.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

FilterTabs.displayName = "FilterTabs";