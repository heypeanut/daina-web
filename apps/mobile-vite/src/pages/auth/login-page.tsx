import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
  Lock,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "./hooks/use-auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState<"password" | "sms">("password");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    smsCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const {
    loading,
    sendingCode,
    countdown,
    handleSendCode,
    handlePasswordLogin,
    handleSmsLogin
  } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSendCode = async () => {
    try {
      await handleSendCode(formData.phone);
      console.log("验证码发送成功");
    } catch (error) {
      console.error("发送验证码失败:", error);
      alert(error instanceof Error ? error.message : "发送验证码失败");
    }
  };

  const handleLogin = async () => {
    try {
      if (loginType === "password") {
        await handlePasswordLogin(formData.phone, formData.password);
      } else {
        await handleSmsLogin(formData.phone, formData.smsCode);
      }

      console.log("登录成功");

      // 跳转回上一页或用户中心
      const returnUrl = searchParams.get("returnUrl");
      navigate(returnUrl || "/profile");
    } catch (error) {
      console.error("登录失败:", error);
      alert(error instanceof Error ? error.message : "登录失败，请重试");
    }
  };

  const handleBack = () => {
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <button
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center text-gray-600 mr-3 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-lg font-medium text-gray-900 text-center">
          登录
        </h1>
        <div className="w-8" /> {/* 占位元素，保持标题居中 */}
      </div>

      <div className="px-6 py-8">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">代拿</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎回来</h2>
          <p className="text-gray-600">登录你的账号继续使用</p>
        </div>

        {/* 登录方式切换 */}
        <div className="bg-white rounded-lg p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setLoginType("password")}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                loginType === "password"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Lock size={18} />
                <span className="font-medium">密码登录</span>
              </div>
            </button>
            <button
              onClick={() => setLoginType("sms")}
              className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                loginType === "sms"
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MessageSquare size={18} />
                <span className="font-medium">验证码登录</span>
              </div>
            </button>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="space-y-4">
          {/* 手机号输入 */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                placeholder="请输入手机号"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                maxLength={11}
              />
            </div>
          </div>

          {loginType === "password" ? (
            /* 密码输入 */
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* 验证码输入 */
            <div>
              <div className="flex space-x-3">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MessageSquare className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="请输入验证码"
                    value={formData.smsCode}
                    onChange={(e) => handleInputChange("smsCode", e.target.value)}
                    className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                    maxLength={6}
                  />
                </div>
                <button
                  onClick={onSendCode}
                  disabled={sendingCode || countdown > 0}
                  className="px-4 py-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium whitespace-nowrap"
                >
                  {sendingCode
                    ? "发送中..."
                    : countdown > 0
                    ? `${countdown}s`
                    : "获取验证码"}
                </button>
              </div>
            </div>
          )}

          {/* 登录按钮 */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center space-y-4">
          <div className="text-sm text-gray-600">
            还没有账号？{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              立即注册
            </button>
          </div>

          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <button
              onClick={() => navigate("/user-agreement")}
              className="hover:text-gray-700"
            >
              用户协议
            </button>
            <button
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-gray-700"
            >
              隐私政策
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
