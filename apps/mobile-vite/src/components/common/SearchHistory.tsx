"use client";

import React from 'react';
import { Clock, X } from 'lucide-react';

interface SearchHistoryProps {
  history: string[];
  onItemClick: (item: string) => void;
  onItemRemove: (item: string) => void;
  onClear: () => void;
  maxItems?: number;
  className?: string;
}

export function SearchHistory({
  history,
  onItemClick,
  onItemRemove,
  onClear,
  maxItems = 10,
  className = ''
}: SearchHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  const displayHistory = history.slice(0, maxItems);

  return (
    <div className={`bg-white ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <Clock size={16} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700">搜索历史</span>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          清空
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {displayHistory.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 group hover:bg-gray-200 transition-colors"
            >
              <button
                onClick={() => onItemClick(item)}
                className="text-sm text-gray-700 mr-2 flex-1 text-left"
              >
                {item}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onItemRemove(item);
                }}
                className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}