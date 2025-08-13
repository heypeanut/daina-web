import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ChevronRight,
  User,
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  Smartphone,
  Globe,
  Moon,
  Sun
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      // 清除认证信息
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      
      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));
      
      console.log("已退出登录");
      // 不跳转，让用户留在当前页面
    }
  };

  const settingsSections = [
    {
      title: "账户设置",
      items: [
        {
          icon: User,
          label: "个人资料",
          subtitle: "修改头像、昵称等信息",
          onClick: () => navigate("/profile/edit"),
          showArrow: true
        },
        {
          icon: Shield,
          label: "账户安全",
          subtitle: "密码、手机号等安全设置",
          onClick: () => navigate("/profile/security"),
          showArrow: true
        }
      ]
    },
    {
      title: "通知设置",
      items: [
        {
          icon: Bell,
          label: "推送通知",
          subtitle: "消息推送、系统通知",
          onClick: () => setNotifications(!notifications),
          showArrow: false,
          rightElement: (
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifications(!notifications);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )
        }
      ]
    },
    {
      title: "应用设置",
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: "深色模式",
          subtitle: "切换应用主题外观",
          onClick: () => setDarkMode(!darkMode),
          showArrow: false,
          rightElement: (
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDarkMode(!darkMode);
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  darkMode ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )
        },
        {
          icon: Globe,
          label: "语言设置",
          subtitle: "简体中文",
          onClick: () => console.log("语言设置"),
          showArrow: true
        },
        {
          icon: Smartphone,
          label: "应用信息",
          subtitle: "版本号、更新等信息",
          onClick: () => navigate("/about"),
          showArrow: true
        }
      ]
    },
    {
      title: "帮助与支持",
      items: [
        {
          icon: HelpCircle,
          label: "帮助中心",
          subtitle: "常见问题、使用指南",
          onClick: () => navigate("/help"),
          showArrow: true
        },
        {
          icon: FileText,
          label: "用户协议",
          subtitle: "查看用户服务协议",
          onClick: () => navigate("/user-agreement"),
          showArrow: true
        },
        {
          icon: FileText,
          label: "隐私政策",
          subtitle: "查看隐私保护政策",
          onClick: () => navigate("/privacy-policy"),
          showArrow: true
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">设置</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mt-6">
            {/* 分组标题 */}
            <div className="px-4 py-2">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {section.title}
              </h2>
            </div>

            {/* 设置项列表 */}
            <div className="bg-white mx-4 rounded-lg border border-gray-200 overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                
                return (
                  <button
                    key={itemIndex}
                    onClick={item.onClick}
                    className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors ${
                      itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent size={20} className="text-gray-600" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900">
                          {item.label}
                        </div>
                        {item.subtitle && (
                          <div className="text-sm text-gray-500 mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      {item.rightElement || (
                        item.showArrow && (
                          <ChevronRight size={16} className="text-gray-400" />
                        )
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* 退出登录 */}
        <div className="mt-8 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-4 bg-white border border-red-200 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>

        {/* 应用信息 */}
        <div className="mt-6 text-center text-sm text-gray-400">
          <p>代拿 v1.0.0</p>
          <p className="mt-1">© 2024 代拿科技</p>
        </div>
      </div>
    </div>
  );
}
