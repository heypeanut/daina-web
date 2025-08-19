import { useNavigate } from "react-router-dom";
import { ShoppingBag, Loader2, ChevronRight } from "lucide-react";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";
import {
  useBoothStatus,
  getBoothButtonText,
  getBoothButtonDescription,
  getBoothNavigationPath,
} from "../hooks/use-booth-status";

export function ServiceSection() {
  const navigate = useNavigate();
  const { data: boothStatus, isLoading: loading, error } = useBoothStatus();

  const handleBoothRegistration = () => {
    // 检查登录状态
    if (!isLoggedIn()) {
      redirectToLogin("/booth/apply");
      return;
    }

    if (loading) return;

    // 根据档口状态智能跳转
    const navigationPath = getBoothNavigationPath(boothStatus);

    // 如果是跳转到档口管理页面，传递来源信息
    if (navigationPath === "/booth/management") {
      navigate(navigationPath, { state: { from: "/profile" } });
    } else {
      navigate(navigationPath);
    }
  };

  const getButtonText = () => {
    if (!isLoggedIn()) {
      return "开通档口";
    }

    if (loading || error) {
      return "开通档口";
    }

    return getBoothButtonText(boothStatus);
  };

  const getButtonDescription = () => {
    if (!isLoggedIn()) {
      return "登录后即可申请档口入驻";
    }

    if (loading) {
      return "正在获取档口状态...";
    }

    if (error) {
      return "立即申请开通档口，开启您的生意之路";
    }

    return getBoothButtonDescription(boothStatus);
  };

  return (
    <div className="bg-white rounded-lg mx-4 my-4 shadow-sm border border-gray-100">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">我的服务</h3>

        <button
          onClick={handleBoothRegistration}
          disabled={loading}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="text-left flex-1">
              <h4 className="font-medium text-gray-900">{getButtonText()}</h4>
              <p className="text-sm text-gray-600">{getButtonDescription()}</p>
            </div>
          </div>
          {!loading && <ChevronRight className="w-5 h-5 text-gray-400" />}
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

        {/* <div className="mt-3 text-center">
          <button
            onClick={() => navigate('/cooperation')}
            className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
          >
            了解更多合作方式 →
          </button>
        </div> */}
      </div>
    </div>
  );
}
