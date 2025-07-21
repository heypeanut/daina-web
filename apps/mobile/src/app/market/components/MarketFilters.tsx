"use client";

import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { MarketFilters as MarketFiltersType } from '../types/market';

interface MarketFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: MarketFiltersType;
  onFiltersChange: (filters: MarketFiltersType) => void;
  onReset: () => void;
  onApply: () => void;
}

const PRICE_RANGES = [
  { label: '不限', min: 0, max: Infinity },
  { label: '100以下', min: 0, max: 100 },
  { label: '100-500', min: 100, max: 500 },
  { label: '500-1000', min: 500, max: 1000 },
  { label: '1000以上', min: 1000, max: Infinity }
];

const AREAS = [
  '华强北商业区',
  '深圳湾科技园',
  '福田中心区',
  '南山科技园',
  '宝安中心区',
  '龙岗中心城',
  '其他区域'
];

export function MarketFilters({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onReset,
  onApply
}: MarketFiltersProps) {
  const [localFilters, setLocalFilters] = useState<MarketFiltersType>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handlePriceRangeSelect = (min: number, max: number) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleAreaToggle = (area: string) => {
    setLocalFilters(prev => ({
      ...prev,
      areas: prev.areas.includes(area)
        ? prev.areas.filter(a => a !== area)
        : [...prev.areas, area]
    }));
  };

  const handleRatingChange = (rating: number) => {
    setLocalFilters(prev => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
  };

  const handleReset = () => {
    const resetFilters: MarketFiltersType = {
      categories: [],
      priceRange: [0, Infinity],
      areas: [],
      rating: 0,
      isVerifiedOnly: false
    };
    setLocalFilters(resetFilters);
    onReset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <RotateCcw size={16} className="mr-1" />
          <span className="text-sm">重置</span>
        </button>
        
        <h2 className="text-lg font-semibold text-gray-900">筛选</h2>
        
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* 价格区间 */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">价格区间</h3>
          <div className="grid grid-cols-2 gap-2">
            {PRICE_RANGES.map((range, index) => {
              const isSelected = 
                localFilters.priceRange[0] === range.min && 
                localFilters.priceRange[1] === range.max;
              
              return (
                <button
                  key={index}
                  onClick={() => handlePriceRangeSelect(range.min, range.max)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 区域筛选 */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">区域选择</h3>
          <div className="flex flex-wrap gap-2">
            {AREAS.map((area) => {
              const isSelected = localFilters.areas.includes(area);
              
              return (
                <button
                  key={area}
                  onClick={() => handleAreaToggle(area)}
                  className={`px-3 py-2 text-sm rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                  }`}
                >
                  {area}
                </button>
              );
            })}
          </div>
        </div>

        {/* 评分筛选 */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">最低评分</h3>
          <div className="flex gap-2">
            {[4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingChange(rating)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  localFilters.rating === rating
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                {rating}星以上
              </button>
            ))}
          </div>
        </div>

        {/* 其他选项 */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-900 mb-3">其他条件</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={localFilters.isVerifiedOnly}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                isVerifiedOnly: e.target.checked
              }))}
              className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
            />
            <span className="ml-2 text-sm text-gray-700">仅显示认证档口</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleApply}
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          确认筛选
        </button>
      </div>
    </div>
  );
}