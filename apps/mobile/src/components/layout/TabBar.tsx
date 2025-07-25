"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Store,
  Handshake,
  User
} from 'lucide-react';

interface TabItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const tabs: TabItem[] = [
  {
    key: 'home',
    label: '首页',
    icon: <Home size={24} />,
    path: '/',
  },
  {
    key: 'market',
    label: '档口',
    icon: <Store size={24} />,
    path: '/market',
  },
  {
    key: 'cooperation',
    label: '商务合作',
    icon: <Handshake size={24} />,
    path: '/cooperation',
  },
  {
    key: 'profile',
    label: '我的',
    icon: <User size={24} />,
    path: '/profile',
  },
];

export function TabBar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-1">
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          return (
            <Link
              key={tab.key}
              href={tab.path}
              className={`flex flex-col items-center justify-center px-2 py-1 min-w-0 flex-1 ${
                active
                  ? 'text-orange-500'
                  : 'text-gray-500'
              }`}
            >
              <div className={`transition-all duration-200 ${
                active ? 'scale-105' : 'scale-100'
              }`}>
                {React.cloneElement(tab.icon as React.ReactElement, { size: 20 })}
              </div>
              <span className={`text-xs mt-0.5 transition-colors duration-200 ${
                active ? 'text-orange-500 font-medium' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}