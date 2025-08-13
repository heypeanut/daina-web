import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Store, Clock, Settings } from "lucide-react";
import { useLoginStatus } from "../hooks";

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  route: string;
  color?: string;
  requireLogin?: boolean;
}

// 登录跳转函数
function redirectToLogin(navigate: any, returnUrl?: string) {
  const loginUrl = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login';
  navigate(loginUrl);
}

export function QuickActions() {
  const navigate = useNavigate();
  const { isLoggedIn } = useLoginStatus();

  const actions: QuickAction[] = [
    {
      icon: Heart,
      label: "我的收藏",
      route: "/profile/favorites",
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
      label: "浏览记录",
      route: "/profile/history",
      color: "text-green-500",
      requireLogin: true,
    },
    {
      icon: Settings,
      label: "设置",
      route: "/profile/settings",
      color: "text-gray-500",
      requireLogin: false,
    },
  ];

  const handleActionClick = (action: QuickAction) => {
    if (action.requireLogin && !isLoggedIn) {
      redirectToLogin(navigate, action.route);
      return;
    }

    navigate(action.route);
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
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                  <IconComponent className={`w-6 h-6 ${action.color || 'text-gray-600'}`} />
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
}
