"use client";

import React from 'react';
import { ChevronDown, TrendingUp, Clock, Star, MapPin } from 'lucide-react';
import { SortType } from '../../../../../src/types/booth';

interface SortOption {
  type: SortType;
  label: string;
  icon: React.ReactNode;
}

interface MarketSortOptionsProps {
  sortType: SortType;
  sortOrder: 'asc' | 'desc';
  onSortChange: (type: SortType, order: 'asc' | 'desc') => void;
  className?: string;
}

const sortOptions: SortOption[] = [
  { type: 'default', label: '综合排序', icon: <TrendingUp size={16} /> },
  { type: 'hot', label: '热门优先', icon: <TrendingUp size={16} /> },
  { type: 'newest', label: '最新发布', icon: <Clock size={16} /> },
  { type: 'rating', label: '评分最高', icon: <Star size={16} /> },
  { type: 'distance', label: '距离最近', icon: <MapPin size={16} /> },
];

export function MarketSortOptions({
  sortType,
  sortOrder,
  onSortChange,
  className = ''
}: MarketSortOptionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentOption = sortOptions.find(option => option.type === sortType) || sortOptions[0];

  const handleSortSelect = (type: SortType) => {
    const newOrder = type === sortType && sortOrder === 'desc' ? 'asc' : 'desc';
    onSortChange(type, newOrder);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          {currentOption.icon}
          <span className="ml-2 text-sm font-medium text-gray-900">
            {currentOption.label}
          </span>
          {sortType !== 'default' && (
            <span className="ml-1 text-xs text-gray-500">
              ({sortOrder === 'desc' ? '↓' : '↑'})
            </span>
          )}
        </div>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {sortOptions.map((option) => {
              const isActive = option.type === sortType;
              
              return (
                <button
                  key={option.type}
                  onClick={() => handleSortSelect(option.type)}
                  className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <span className={isActive ? 'text-orange-500' : 'text-gray-400'}>
                    {option.icon}
                  </span>
                  <span className="ml-2 text-sm">
                    {option.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto text-orange-500">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}