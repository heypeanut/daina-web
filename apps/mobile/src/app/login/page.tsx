"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Phone,
  Lock,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<"password" | "sms">("password");
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    smsCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendCode = async () => {
    if (!formData.phone) {
      toast.error("请输入手机号");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error("请输入正确的手机号");
      return;
    }

    setSendingCode(true);

    try {
      const { sendSms } = await import("@/lib/api/auth");
      await sendSms(formData.phone);

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast.success("验证码发送成功");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "发送验证码失败";
      console.log("errorMessage", errorMessage);
      toast.error(errorMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const handleLogin = async () => {
    if (loginType === "password") {
      if (!formData.phone || !formData.password) {
        toast.error("请填写手机号和密码");
        return;
      }
    } else {
      if (!formData.phone || !formData.smsCode) {
        toast.error("请填写手机号和验证码");
        return;
      }
    }

    setLoading(true);

    try {
      let response;

      if (loginType === "password") {
        const { login } = await import("@/lib/api/auth");
        response = await login({
          phone: formData.phone,
          password: formData.password,
        });
      } else {
        const { smsLogin } = await import("@/lib/api/auth");
        response = await smsLogin({
          phone: formData.phone,
          code: formData.smsCode,
        });
      }

      // 存储认证信息
      localStorage.setItem("auth_token", response);
      // localStorage.setItem("user_info", JSON.stringify(response.user));

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      // 暂时注释掉立即获取用户信息，避免401错误
      // try {
      //   const { fetchUserInfo } = await import("@/lib/auth");
      //   await fetchUserInfo();
      // } catch (error) {
      //   console.warn("获取用户信息失败:", error);
      // }

      // 跳转回上一页或用户中心
      const returnUrl = new URLSearchParams(window.location.search).get(
        "returnUrl"
      );
      router.push(returnUrl || "/profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "登录失败，请重试";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">登录</h1>
          <div className="w-10" /> {/* 占位符保持居中 */}
        </div>
      </div>

      {/* 登录表单 */}
      <div className="p-6">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img
              src="/logo.png"
              alt="代拿网"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            欢迎来到代拿网
          </h2>
          <p className="text-gray-600">专业的档口批发代发平台</p>
        </div>

        {/* 登录方式切换 */}
        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setLoginType("password")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === "password"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              密码登录
            </button>
            <button
              type="button"
              onClick={() => setLoginType("sms")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                loginType === "sms"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              短信登录
            </button>
          </div>
        </div>

        {/* 手机号输入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="请输入手机号"
              maxLength={11}
            />
          </div>
        </div>

        {/* 密码输入 */}
        {loginType === "password" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="请输入密码"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* 验证码输入 */}
        {loginType === "sms" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              验证码
            </label>
            <div className="flex space-x-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.smsCode}
                  onChange={(e) => handleInputChange("smsCode", e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                  placeholder="请输入验证码"
                  maxLength={6}
                />
              </div>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0 || !formData.phone}
                className="px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading
            ? "登录中..."
            : loginType === "password"
            ? "登录"
            : "短信登录"}
        </button>

        {/* 其他选项 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            还没有账号？
            <button
              onClick={() => router.push("/register")}
              className="text-orange-500 hover:text-orange-600 font-medium ml-1"
            >
              立即注册
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
