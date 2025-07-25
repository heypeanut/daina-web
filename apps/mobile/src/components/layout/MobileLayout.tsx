"use client";

import React from 'react';
import { TabBar } from './TabBar';

interface MobileLayoutProps {
  children: React.ReactNode;
  showTabBar?: boolean;
}

export function MobileLayout({ children, showTabBar = true }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主内容区域 */}
      <main className={`${showTabBar ? 'pb-12' : ''}`}>
        {children}
      </main>

      {/* 底部导航栏 */}
      {showTabBar && <TabBar />}
    </div>
  );
}