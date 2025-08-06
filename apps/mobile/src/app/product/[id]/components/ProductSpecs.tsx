"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProductSpecsProps {
  category: string;
  style?: string;
  phoneModel?: string;
  productType?: string;
  trend?: string;
  imageType?: string;
  copyright?: string;
  biodegradable?: string;
  ecoMaterial?: string;
  className?: string;
}

export function ProductSpecs({
  category,
  style,
  phoneModel,
  productType,
  trend,
  imageType,
  copyright,
  biodegradable,
  ecoMaterial,
  className = ''
}: ProductSpecsProps) {
  // 转换规格数据为显示格式
  const specItems = [
    { key: 'category', label: '商品分类', value: category },
    { key: 'style', label: '风格', value: style },
    { key: 'phoneModel', label: '适用机型', value: phoneModel },
    { key: 'productType', label: '产品类型', value: productType },
    { key: 'trend', label: '流行元素', value: trend },
    // { key: 'imageType', label: '图片类型', value: imageType },
    // { key: 'copyright', label: '版权', value: copyright },
    { key: 'biodegradable', label: '生物降解', value: biodegradable },
    { key: 'ecoMaterial', label: '环保材料', value: ecoMaterial },
  ].filter(item => item.value && item.value.trim() !== ''); // 只显示有值的规格

  if (specItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="px-4 py-2 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">规格参数</h3>
      </div>

      <div className="px-4 py-2">
        <div className="space-y-2">
          {specItems.map((item, index) => (
            <div 
              key={item.key || index} 
              className="flex flex-col border-b border-gray-50 pb-2 last:border-b-0"
            >
              <div>
                <span className="text-sm text-gray-400">
                  {item.label}
                </span>
              </div>
              <div >
                <span className="text-sm text-gray-500">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}