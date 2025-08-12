import { useState, useCallback } from 'react';

// 登录响应接口
interface LoginResponse {
  token: string;
  user?: {
    id: string;
    phone: string;
    nickname?: string;
    avatar?: string;
  };
}

// 注册响应接口
interface RegisterResponse {
  token: string;
  user: {
    id: string;
    phone: string;
    nickname?: string;
    avatar?: string;
  };
}

// 登录参数
interface LoginParams {
  phone: string;
  password?: string;
  code?: string;
}

// 注册参数
interface RegisterParams {
  phone: string;
  smsCode: string;
  nickname?: string;
}

// Mock API函数
async function sendSms(phone: string): Promise<void> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟验证码发送成功
  console.log(`验证码已发送到 ${phone}`);
}

async function login(params: LoginParams): Promise<string> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟登录验证
  if (params.password) {
    // 密码登录
    if (params.password !== '123456') {
      throw new Error('手机号或密码错误');
    }
  } else if (params.code) {
    // 验证码登录
    if (params.code !== '123456') {
      throw new Error('验证码错误');
    }
  }
  
  return 'mock_auth_token_12345';
}

async function smsLogin(params: { phone: string; code: string }): Promise<string> {
  return login({ phone: params.phone, code: params.code });
}

async function register(params: RegisterParams): Promise<RegisterResponse> {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟注册验证
  if (params.smsCode !== '123456') {
    throw new Error('验证码错误');
  }
  
  return {
    token: 'mock_auth_token_12345',
    user: {
      id: 'user_' + Date.now(),
      phone: params.phone,
      nickname: params.nickname || '新用户',
      avatar: null
    }
  };
}

// 认证Hook
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 发送验证码
  const handleSendCode = useCallback(async (phone: string) => {
    if (!phone) {
      throw new Error("请输入手机号");
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error("请输入正确的手机号");
    }

    setSendingCode(true);

    try {
      await sendSms(phone);

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
    } finally {
      setSendingCode(false);
    }
  }, []);

  // 密码登录
  const handlePasswordLogin = useCallback(async (phone: string, password: string) => {
    if (!phone || !password) {
      throw new Error("请填写手机号和密码");
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error("请输入正确的手机号");
    }

    setLoading(true);

    try {
      const token = await login({ phone, password });

      // 存储认证信息
      localStorage.setItem("auth_token", token);

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      return token;
    } finally {
      setLoading(false);
    }
  }, []);

  // 验证码登录
  const handleSmsLogin = useCallback(async (phone: string, code: string) => {
    if (!phone || !code) {
      throw new Error("请填写手机号和验证码");
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      throw new Error("请输入正确的手机号");
    }

    setLoading(true);

    try {
      const token = await smsLogin({ phone, code });

      // 存储认证信息
      localStorage.setItem("auth_token", token);

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      return token;
    } finally {
      setLoading(false);
    }
  }, []);

  // 注册
  const handleRegister = useCallback(async (params: RegisterParams) => {
    if (!params.phone || !params.smsCode) {
      throw new Error("请填写手机号和验证码");
    }

    if (!/^1[3-9]\d{9}$/.test(params.phone)) {
      throw new Error("请输入正确的手机号");
    }

    setLoading(true);

    try {
      const response = await register(params);

      // 存储认证信息
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user_info", JSON.stringify(response.user));

      // 触发登录状态变化事件
      window.dispatchEvent(new Event("loginStatusChange"));

      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    sendingCode,
    countdown,
    handleSendCode,
    handlePasswordLogin,
    handleSmsLogin,
    handleRegister
  };
}
