'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft, Phone, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.phone || !formData.password) {
      alert('请填写手机号和密码');
      return;
    }

    setLoading(true);
    
    try {
      const { login } = await import('@/lib/api/auth');
      
      // 调用真实登录API
      const response = await login({
        phone: formData.phone,
        password: formData.password,
      });
      
      // 存储认证信息
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_info', JSON.stringify(response.user));
      
      // 触发登录状态变化事件
      window.dispatchEvent(new Event('loginStatusChange'));
      
      // 跳转回上一页或用户中心
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      router.push(returnUrl || '/profile');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/profile');
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎来到代拿网</h2>
          <p className="text-gray-600">专业的档口批发代发平台</p>
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
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="请输入手机号"
              maxLength={11}
            />
          </div>
        </div>

        {/* 密码输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            密码
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
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

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? '登录中...' : '登录'}
        </button>

        {/* 其他选项 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            还没有账号？
            <button 
              onClick={() => router.push('/register')}
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