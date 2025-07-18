"use client";

import React from 'react';
import Link from 'next/link';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ArrowRight, Home, Search, Camera, Store, User, Handshake } from 'lucide-react';

export default function DemoPage() {
  const pages = [
    {
      title: '首页',
      description: '完整的移动端首页，包含搜索、轮播图、推荐等',
      path: '/',
      icon: <Home size={24} />,
      color: 'bg-blue-500',
    },
    {
      title: '搜索页面',
      description: '搜索功能，包含搜索历史、热门搜索等',
      path: '/search',
      icon: <Search size={24} />,
      color: 'bg-green-500',
    },
    {
      title: '以图搜图',
      description: '拍照搜索功能，支持相机拍照和相册选择',
      path: '/search/image',
      icon: <Camera size={24} />,
      color: 'bg-purple-500',
    },
    {
      title: '搜索结果',
      description: '搜索结果展示，支持商品和档口切换',
      path: '/search/results?q=iPhone',
      icon: <Search size={24} />,
      color: 'bg-orange-500',
    },
    {
      title: '档口页面',
      description: '档口列表和详情页面（待从src迁移）',
      path: '/market',
      icon: <Store size={24} />,
      color: 'bg-red-500',
    },
    {
      title: '商务合作',
      description: '批发代发合作页面',
      path: '/cooperation',
      icon: <Handshake size={24} />,
      color: 'bg-indigo-500',
    },
    {
      title: '个人中心',
      description: '用户个人中心，登录后显示推荐',
      path: '/profile',
      icon: <User size={24} />,
      color: 'bg-pink-500',
    },
  ];

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 头部 */}
        <div className="bg-red-500 px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">代拿网移动端</h1>
            <p className="text-red-100 text-sm">功能演示页面</p>
          </div>
        </div>

        {/* 功能列表 */}
        <div className="p-4">
          <div className="space-y-3">
            {pages.map((page, index) => (
              <Link
                key={index}
                href={page.path}
                className="block bg-white rounded-lg p-4 shadow-sm active:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mr-4 ${page.color}`}>
                    {page.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{page.description}</p>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 技术栈信息 */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">技术栈</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>框架:</span>
                <span>Next.js 15.3.3</span>
              </div>
              <div className="flex justify-between">
                <span>样式:</span>
                <span>Tailwind CSS v4</span>
              </div>
              <div className="flex justify-between">
                <span>图标:</span>
                <span>Lucide React</span>
              </div>
              <div className="flex justify-between">
                <span>路由:</span>
                <span>App Router</span>
              </div>
              <div className="flex justify-between">
                <span>端口:</span>
                <span>3006</span>
              </div>
            </div>
          </div>
        </div>

        {/* 开发状态 */}
        <div className="p-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">开发状态</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700">移动端首页 - 已完成</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700">搜索功能 - 已完成</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-green-700">底部导航 - 已完成</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-yellow-700">档口功能 - 待迁移</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-yellow-700">推荐系统 - 待集成</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}