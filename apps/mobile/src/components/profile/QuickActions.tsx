"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, Store, Clock } from "lucide-react";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  route: string;
  color?: string;
  requireLogin?: boolean;
}

export const QuickActions: React.FC = () => {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setLoggedIn(isLoggedIn());
    };

    checkLoginStatus();
    
    // 监听登录状态变化
    const handleLoginStatusChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleLoginStatusChange);
    window.addEventListener('loginStatusChange', handleLoginStatusChange);
    
    return () => {
      window.removeEventListener('storage', handleLoginStatusChange);
      window.removeEventListener('loginStatusChange', handleLoginStatusChange);
    };
  }, []);
  const actions: QuickAction[] = [
    {
      icon: Heart,
      label: "收藏商品",
      route: "/profile/favorites/products",
      color: "text-red-500",
      requireLogin: true,
    },
    {
      icon: Store,
      label: "关注档口",
      route: "/profile/favorites/booths",
      color: "text-blue-500",
      requireLogin: true,
    },
    {
      icon: Clock,
      label: "足迹",
      route: "/profile/history",
      color: "text-green-500",
      requireLogin: true,
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.requireLogin && !isLoggedIn()) {
      // 未登录且需要登录的功能，跳转到登录页
      redirectToLogin(action.route);
      return;
    }
    
    // 已登录或不需要登录，直接跳转
    router.push(action.route);
  };

  return (
    <div className="bg-white rounded-lg mx-4 my-4 p-3 shadow-sm border border-gray-100">
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;

          return (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="flex flex-col items-center space-y-2 p-2 rounded-lg transition-colors hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center ${action.color}`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <span className="text-xs text-gray-600 text-center">
                {action.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
