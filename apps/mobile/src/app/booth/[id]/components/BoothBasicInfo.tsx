"use client";

import React from 'react';
import { MapPin, Building2, Calendar, Clock } from 'lucide-react';
import { BoothDetail } from '../../../../../../../src/types/booth';

interface BoothBasicInfoProps {
  booth: BoothDetail;
  className?: string;
}

export function BoothBasicInfo({
  booth,
  className = ''
}: BoothBasicInfoProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '未知';
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  const infoItems = [
    {
      icon: <MapPin size={16} className="text-gray-400" />,
      label: '档口地址',
      value: booth.address || '暂无地址信息'
    },
    {
      icon: <Building2 size={16} className="text-gray-400" />,
      label: '所属市场',
      value: booth.market || '华强北商业区'
    },
    {
      icon: <Calendar size={16} className="text-gray-400" />,
      label: '入驻时间',
      value: formatDate(booth.createdAt)
    }
  ];

  if (booth.businessHours) {
    infoItems.push({
      icon: <Clock size={16} className="text-gray-400" />,
      label: '营业时间',
      value: booth.businessHours.isOpen24h 
        ? '24小时营业' 
        : booth.businessHours.weekdays
    });
  }

  return (
    <div className={`bg-white ${className}`}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">基本信息</h3>
      </div>
      
      <div className="px-4 py-3">
        <div className="space-y-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="mt-0.5">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-gray-500 mb-1">
                  {item.label}
                </div>
                <div className="text-sm text-gray-900">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 档口描述 */}
        {booth.description && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-2">档口介绍</div>
            <div className="text-sm text-gray-900 leading-relaxed">
              {booth.description}
            </div>
          </div>
        )}

        {/* 主营商品标签 */}
        {booth.main_business && booth.main_business.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 mb-3">主营商品</div>
            <div className="flex flex-wrap gap-2">
              {booth.main_business.map((business, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
                >
                  {business}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}