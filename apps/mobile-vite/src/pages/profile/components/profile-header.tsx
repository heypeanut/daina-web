import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";

// Mock登录状态hook - 实际项目中替换为真实API
function useLoginStatus() {
  const [isLoggedIn] = useState(false); // 默认未登录状态，可以改为true测试已登录状态
  const [userInfo] = useState({
    nickname: "测试用户",
    phone: "138****8888",
    avatar: null
  });
  
  return {
    isLoggedIn,
    userInfo: isLoggedIn ? userInfo : null,
    isLoading: false
  };
}

// Mock退出登录hook
function useLogout() {
  return {
    mutate: () => {
      console.log('退出登录');
      // 实际项目中执行登录状态清除等操作
    },
    isPending: false
  };
}

export function ProfileHeader() {
  const navigate = useNavigate();
  const { isLoggedIn, userInfo, isLoading } = useLoginStatus();
  const logoutMutation = useLogout();

  const handleHeaderClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // 如果正在加载用户信息，显示加载状态
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20 animate-pulse">
              <User className="w-8 h-8 text-white/80" />
            </div>
            <div>
              <div className="h-5 bg-white/20 rounded animate-pulse w-24 mb-1"></div>
              <div className="h-4 bg-white/20 rounded animate-pulse w-32"></div>
            </div>
          </div>
          <Settings className="w-6 h-6 text-white/80" />
        </div>
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <div className="h-4 bg-white/20 rounded animate-pulse w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
      <div className="flex items-center justify-between">
        <button
          onClick={handleHeaderClick}
          className="flex items-center space-x-4 flex-1 text-left"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border-2 border-white/20">
            {isLoggedIn && userInfo?.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.nickname}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-white/80" />
            )}
          </div>
          <div>
            {isLoggedIn && userInfo ? (
              <>
                <h2 className="text-lg font-semibold">{userInfo.nickname}</h2>
                <p className="text-white/80 text-sm">{userInfo.phone}</p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">未登录</h2>
                <p className="text-white/80 text-sm">点击登录</p>
              </>
            )}
          </div>
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {logoutMutation.isPending ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <LogOut className="w-5 h-5 text-white/80" />
            )}
          </button>
        ) : (
          <Settings className="w-6 h-6 text-white/80" />
        )}
      </div>

      {/* 登录提示或用户状态 */}
      {!isLoggedIn ? (
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-white/90 text-sm">
            登录后可享受更多个性化服务
          </p>
        </div>
      ) : (
        <div className="mt-4 bg-white/10 rounded-lg p-3">
          <p className="text-white/90 text-sm">
            欢迎回来！您有新的消息等待查看
          </p>
        </div>
      )}
    </div>
  );
}
