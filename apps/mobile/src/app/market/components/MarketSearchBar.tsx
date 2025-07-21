"use client";

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface MarketSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (keyword: string) => void;
  onFilterClick: () => void;
  placeholder?: string;
  className?: string;
}

export function MarketSearchBar({
  value,
  onChange,
  onSearch,
  onFilterClick,
  placeholder = '搜索档口名称、主营商品...',
  className = ''
}: MarketSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`bg-white ${className}`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <form onSubmit={handleSubmit} className="flex-1">
          <div className={`flex items-center bg-gray-100 rounded-full px-4 py-2 transition-colors ${
            isFocused ? 'bg-orange-50 ring-1 ring-orange-200' : ''
          }`}>
            <Search size={18} className="text-gray-400 mr-3" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </form>
        
        <button
          onClick={onFilterClick}
          className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Filter size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}