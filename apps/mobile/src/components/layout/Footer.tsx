import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-100 mt-8 py-6 px-4">
      <div className="text-center text-sm text-gray-600">
        <p className="mb-2">©2025 代拿网 - 专业的档口批发代发平台</p>
        <nav className="flex justify-center space-x-4 text-xs mb-3">
          <a href="/about" className="text-gray-500 hover:text-gray-700">关于我们</a>
          <a href="/cooperation" className="text-gray-500 hover:text-gray-700">商务合作</a>
          <a href="/help" className="text-gray-500 hover:text-gray-700">帮助中心</a>
          <a href="/contact" className="text-gray-500 hover:text-gray-700">联系我们</a>
        </nav>
        <p className="text-xs text-gray-500">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700"
          >
            粤ICP备2025438691号-1
          </a>
        </p>
      </div>
    </footer>
  );
}