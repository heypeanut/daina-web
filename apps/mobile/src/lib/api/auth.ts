// 认证相关API接口

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    nickname: string;
    phone: string;
    email?: string;
    avatar?: string;
    bio?: string;
  };
}

export interface RegisterRequest {
  phone: string;
  password: string;
  verificationCode: string;
  agreeToTerms: boolean;
}

export interface RegisterResponse {
  token: string;
  user: {
    userId: string;
    username: string;
    nickname: string;
    phone: string;
    email?: string;
    avatar?: string;
    bio?: string;
  };
}

export interface UserInfo {
  userId: string;
  username: string;
  nickname: string;
  phone: string;
  email?: string;
  avatar?: string;
  bio?: string;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户登录
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    // 尝试解析服务器返回的错误信息
    try {
      const errorData = await response.json();
      // 优先使用服务器返回的错误信息
      throw new Error(errorData.message || errorData.error || `登录失败 (${response.status})`);
    } catch (parseError) {
      // 如果无法解析JSON，使用HTTP状态码
      throw new Error(`登录失败 (${response.status})`);
    }
  }

  const result: ApiResponse<LoginResponse> = await response.json();

  if (result.code !== 200) {
    // 使用后端返回的具体错误信息
    throw new Error(result.message || "登录失败");
  }

  return result.data;
}

// 获取用户信息
export async function getUserInfo(): Promise<UserInfo> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new Error("未登录");
  }

  const response = await fetch(`${BASE_URL}/api/user/mobile/info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token 过期，清除本地存储
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_info");
      throw new Error("登录已过期，请重新登录");
    }
    throw new Error("获取用户信息失败");
  }

  const result: ApiResponse<UserInfo> = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || "获取用户信息失败");
  }

  return result.data;
}

// 发送验证码
export async function sendVerificationCode(phone: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/auth/send-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "发送验证码失败" }));
    throw new Error(errorData.message || "发送验证码失败");
  }

  const result: ApiResponse<void> = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || "发送验证码失败");
  }
}

// 用户注册
export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "注册失败" }));
    throw new Error(errorData.message || "注册失败");
  }

  const result: ApiResponse<RegisterResponse> = await response.json();

  if (result.code !== 200) {
    throw new Error(result.message || "注册失败");
  }

  return result.data;
}

// 退出登录
export async function logout(): Promise<void> {
  const token = localStorage.getItem("auth_token");

  if (token) {
    try {
      await fetch(`${BASE_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("退出登录请求失败:", error);
    }
  }

  // 清除本地存储
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
}
