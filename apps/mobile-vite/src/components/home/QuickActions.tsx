"use client";

import React from 'react';
import Link from 'next/link';
import {
  Camera,
  Grid3x3,
  Store,
  Sparkles,
  Handshake
} from 'lucide-react';

interface QuickAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    key: 'image-search',
    label: '以图搜图',
    icon: <Camera size={24} />,
    path: '/search/image',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    key: 'cooperation',
    label: '商务合作',
    icon: <Handshake size={24} />,
    path: '/cooperation',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    key: 'categories',
    label: '全部分类',
    icon: <Grid3x3 size={24} />,
    path: '/categories',
    color: 'bg-green-100 text-green-600',
  },
  {
    key: 'quality-booths',
    label: '优质档口',
    icon: <Store size={24} />,
    path: '/market/quality',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    key: 'latest',
    label: '近期上新',
    icon: <Sparkles size={24} />,
    path: '/products/latest',
    color: 'bg-pink-100 text-pink-600',
  },
];

export function QuickActions() {
  return (
    <div className="bg-white px-4 py-6 m-2 rounded-lg shadow-sm">
      <div className="grid grid-cols-5 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.key}
            href={action.path}
            className="flex flex-col items-center text-center group"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-transform group-active:scale-95 ${action.color}`}
            >
              {action.icon}
            </div>
            <span className="text-xs text-gray-700 font-medium">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}