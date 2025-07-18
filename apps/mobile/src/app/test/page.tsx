"use client";

import React from 'react';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">测试页面</h1>
      <div className="bg-white rounded-lg p-4 mb-4">
        <p className="text-gray-600">如果你能看到这个样式，说明Tailwind CSS正常工作</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-500 text-white p-4 rounded-lg">
          <h3 className="font-semibold">橙色主题</h3>
          <p className="text-sm">主题色测试</p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          <h3 className="font-semibold">红色主题</h3>
          <p className="text-sm">次要色测试</p>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-white rounded-lg">
        <img 
          src="https://picsum.photos/200/100" 
          alt="测试图片"
          className="w-full rounded"
        />
        <p className="text-sm text-gray-500 mt-2">图片显示测试</p>
      </div>
    </div>
  );
}