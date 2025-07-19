"use client";

import React from "react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";

export const ServiceSection: React.FC = () => {
  const handleBoothRegistration = () => {
    if (!isLoggedIn()) {
      // 未登录，跳转到登录页面
      redirectToLogin("/booth/apply");
      return;
    }
    
    // 已登录，导航到档口入驻页面
    console.log("导航到档口入驻页面");
  };

  return (
    <div className="bg-white rounded-lg mx-4 my-4 shadow-sm border border-gray-100">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">我的服务</h3>

        <button
          onClick={handleBoothRegistration}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200 active:scale-[0.98]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h4 className="font-medium text-gray-900">档口入驻</h4>
              <p className="text-sm text-gray-600">
                成为档口商家，开启批发之路
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">入驻优势</p>
              <ul className="space-y-1">
                <li>• 专业的档口管理系统</li>
                <li>• 个性化推荐曝光</li>
                <li>• 多渠道客户对接</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            加入我们，享受专业的批发代发服务
          </p>
        </div>
      </div>
    </div>
  );
};
