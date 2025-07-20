"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    verificationCode: "",
    nickname: "",
  });
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendCode = async () => {
    if (!formData.phone) {
      alert("请输入手机号");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      alert("请输入正确的手机号");
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

      alert("验证码发送成功");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "发送验证码失败";
      alert(errorMessage);
    } finally {
      setSendingCode(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.phone || !formData.verificationCode) {
      alert("请填写手机号和验证码");
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      alert("请输入正确的手机号");
      return;
    }

    if (!agreeToTerms) {
      alert("请同意用户协议和隐私政策");
      return;
    }

    setLoading(true);

    try {
      const { register } = await import("@/lib/api/auth");

      const response = await register({
        phone: formData.phone,
        smsCode: formData.verificationCode,
        nickname: formData.nickname || undefined,
      });

      // 存储认证信息
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      alert("注册成功");

      // 跳转到用户中心
      router.push("/profile");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "注册失败，请重试";
      alert(errorMessage);
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
          <h1 className="text-lg font-semibold text-gray-900">注册</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 注册表单 */}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">注册代拿网</h2>
          <p className="text-gray-600">加入专业的档口批发代发平台</p>
        </div>

        {/* 手机号输入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手机号 *
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

        {/* 验证码输入 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            验证码 *
          </label>
          <div className="flex space-x-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.verificationCode}
                onChange={(e) =>
                  handleInputChange("verificationCode", e.target.value)
                }
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

        {/* 昵称输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            昵称（可选）
          </label>
          <input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入昵称"
          />
        </div>

        {/* 用户协议和隐私政策 */}
        <div className="mb-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <Checkbox
              checked={agreeToTerms}
              onCheckedChange={(checked) =>
                setAgreeToTerms(checked === "indeterminate" ? false : checked)
              }
            />
            <span className="text-sm text-gray-700">
              我已阅读并同意
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/user-agreement");
                }}
                className="text-orange-500 hover:text-orange-600 underline ml-1"
              >
                《用户服务协议》
              </button>
              和
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/privacy-policy");
                }}
                className="text-orange-500 hover:text-orange-600 underline ml-1"
              >
                《隐私政策》
              </button>
            </span>
          </label>
        </div>

        {/* 注册按钮 */}
        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? "注册中..." : "注册"}
        </button>

        {/* 其他选项 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            已有账号？
            <button
              onClick={() => router.push("/login")}
              className="text-orange-500 hover:text-orange-600 font-medium ml-1"
            >
              立即登录
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
