"use client";

import React from 'react';
import { Truck, Shield, RotateCcw, DollarSign, Heart } from 'lucide-react';

interface ServiceGuaranteeProps {
  shipping: {
    area: string;
    isFreeShipping: boolean;
  };
  services: string[];
  className?: string;
}

export function ServiceGuarantee({
  shipping,
  services,
  className = ''
}: ServiceGuaranteeProps) {
  const getServiceIcon = (service: string) => {
    if (service.includes('假一赔十')) return <Shield size={16} className="text-green-500" />;
    if (service.includes('退货宝') || service.includes('退换')) return <RotateCcw size={16} className="text-blue-500" />;
    if (service.includes('买贵必赔')) return <DollarSign size={16} className="text-red-500" />;
    return <Heart size={16} className="text-gray-500" />;
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* 配送信息 */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Truck size={16} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500">配送至：</span>
              <span className="text-sm text-gray-900 font-medium">
                {shipping.area}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">快递：</span>
              <span className="text-sm text-gray-900 font-medium">
                {shipping.isFreeShipping ? '免运费' : '需付运费'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 服务保障 */}
      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center gap-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-2">
              {getServiceIcon(service)}
              <span className="text-sm text-gray-700">
                {service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}