import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageSquare, User } from "lucide-react";
import { useAuth } from "./hooks/use-auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: "",
    verificationCode: "",
    nickname: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    loading,
    sendingCode,
    countdown,
    handleSendCode,
    handleRegister
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

  const onRegister = async () => {
    if (!agreeToTerms) {
      alert("请同意用户协议和隐私政策");
      return;
    }

    try {
      await handleRegister({
        phone: formData.phone,
        smsCode: formData.verificationCode,
        nickname: formData.nickname || undefined,
      });

      console.log("注册成功");

      // 跳转到用户中心
      navigate("/profile");
    } catch (error) {
      console.error("注册失败:", error);
      alert(error instanceof Error ? error.message : "注册失败，请重试");
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
          注册
        </h1>
        <div className="w-8" /> {/* 占位元素，保持标题居中 */}
      </div>

      <div className="px-6 py-8">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">代拿</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">创建账号</h2>
          <p className="text-gray-600">注册成为代拿用户，享受更多服务</p>
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

          {/* 验证码输入 */}
          <div>
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.verificationCode}
                  onChange={(e) => handleInputChange("verificationCode", e.target.value)}
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

          {/* 昵称输入（可选） */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="请输入昵称（可选）"
                value={formData.nickname}
                onChange={(e) => handleInputChange("nickname", e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors"
                maxLength={20}
              />
            </div>
          </div>

          {/* 协议同意 */}
          <div className="flex items-start space-x-3 py-2">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="mt-1 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-600 leading-relaxed">
              我已阅读并同意{" "}
              <button
                onClick={() => navigate("/user-agreement")}
                className="text-orange-500 hover:text-orange-600"
              >
                《用户协议》
              </button>{" "}
              和{" "}
              <button
                onClick={() => navigate("/privacy-policy")}
                className="text-orange-500 hover:text-orange-600"
              >
                《隐私政策》
              </button>
            </label>
          </div>

          {/* 注册按钮 */}
          <button
            onClick={onRegister}
            disabled={loading || !agreeToTerms}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-600">
            已有账号？{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-orange-500 hover:text-orange-600 font-medium"
            >
              立即登录
            </button>
          </div>
        </div>

        {/* 开发提示 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>开发提示：</strong>
            <br />
            验证码：123456
          </p>
        </div>
      </div>
    </div>
  );
}
