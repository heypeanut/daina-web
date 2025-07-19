'use client';

import React, { useState, useEffect } from "react";
import { User, Settings, LogOut } from "lucide-react";
import { isLoggedIn, getUserInfo, logout, redirectToLogin, type User as UserType } from "@/lib/auth";

export const ProfileHeader: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = isLoggedIn();
      setLoggedIn(loginStatus);
      if (loginStatus) {
        setUser(getUserInfo());
      }
    };

    checkLoginStatus();
    
    // 监听storage变化，处理登录状态同步
    const handleStorageChange = () => {
      checkLoginStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // 也监听自定义事件，用于同一页面内的状态更新
    window.addEventListener('loginStatusChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('loginStatusChange', handleStorageChange);
    };
  }, []);

  const handleHeaderClick = () => {
    if (!loggedIn) {
      redirectToLogin();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLoggedIn(false);
      setUser(null);
      // 触发自定义事件通知其他组件
      window.dispatchEvent(new Event('loginStatusChange'));
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
      <div className="flex items-center justify-between">
        <button 
          onClick={handleHeaderClick}
          className="flex items-center space-x-4 flex-1 text-left"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
            {loggedIn && user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.nickname}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
          </div>
          <div>
            {loggedIn && user ? (
              <>
                <h2 className="text-lg font-semibold">{user.nickname}</h2>
                <p className="text-white/80 text-sm">{user.phone}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">未登录</h2>
                <p className="text-white/80 text-sm">点击登录</p>
              </>
            )}
          </div>
        </button>
        
        {loggedIn ? (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5 text-white/80" />
          </button>
        ) : (
          <Settings className="w-6 h-6 text-white/80" />
        )}
      </div>

      {/* 登录提示或用户状态 */}
      {!loggedIn ? (
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-sm text-white/90">登录后可享受个性化推荐服务</p>
        </div>
      ) : (
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-sm text-white/90">欢迎回来！享受个性化服务</p>
        </div>
      )}
    </div>
  );
};
