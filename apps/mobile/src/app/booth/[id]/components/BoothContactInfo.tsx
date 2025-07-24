"use client";

import React, { useState } from 'react';
import { Phone, MessageCircle, MapPin, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { BoothDetail } from '@/lib/api/booth';
import { ContactType } from '../types/detail';
import { toast } from 'ui';

interface BoothContactInfoProps {
  booth: BoothDetail;
  onContactClick: (type: ContactType, value: string) => void;
  className?: string;
}

export function BoothContactInfo({
  booth,
  onContactClick,
  className = ''
}: BoothContactInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`已复制: ${text}`);
    } catch (err) {
      console.error('复制失败:', err);
      toast.error('复制失败，请重试');
    }
  };

  const contactItems = [];

  if (booth.phone) {
    contactItems.push({
      type: 'phone' as ContactType,
      icon: <Phone size={16} className="text-green-600" />,
      label: '电话联系',
      value: booth.phone,
      actionLabel: '拨打电话',
      canCopy: true
    });
  }

  if (booth.wx) {
    contactItems.push({
      type: 'wechat' as ContactType,
      icon: <MessageCircle size={16} className="text-green-500" />,
      label: '微信号',
      value: booth.wx,
      actionLabel: '复制微信号',
      canCopy: true
    });
  }

  if (booth?.qq) {
    contactItems.push({
      type: 'qq' as ContactType,
      icon: <MessageCircle size={16} className="text-blue-500" />,
      label: 'QQ号码',
      value: booth.qq,
      actionLabel: '复制QQ号',
      canCopy: true
    });
  }

  if (booth.address) {
    contactItems.push({
      type: 'address' as ContactType,
      icon: <MapPin size={16} className="text-orange-500" />,
      label: '档口地址',
      value: booth.address,
      actionLabel: '查看地图',
      canCopy: false
    });
  }

  if (contactItems.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white border-t-8 border-gray-100 ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-base font-semibold text-gray-900">联系方式</h3>
        {isExpanded ? (
          <ChevronUp size={20} className="text-gray-400" />
        ) : (
          <ChevronDown size={20} className="text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="space-y-4">
            {contactItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {item.icon}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {item.value}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-3">
                  {item.canCopy && (
                    <button
                      onClick={() => handleCopy(item.value)}
                      className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  )}

                  <button
                    onClick={() => onContactClick(item.type, item.value)}
                    className="px-3 py-1.5 bg-orange-500 text-white text-xs rounded-full hover:bg-orange-600 transition-colors"
                  >
                    {item.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 提示：联系时请说明从&ldquo;纳火&rdquo;平台看到的信息，可能获得更好服务
            </p>
          </div>
        </div>
      )}
    </div>
  );
}