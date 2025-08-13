// 新版认证API - 使用tenant端接口
import { tenantApi } from "./config";

// 接口类型定义
export interface LoginRequest {
  phone: string;
  password: string;
}

export interface SmsLoginRequest {
  phone: string;
  code: string;
  loginType?: "sms";
}

export interface RegisterRequest {
  phone: string;
  smsCode: string;
  nickname?: string;
}

export interface RegisterResponse {
  token: string;
  user: UserInfo;
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

// ==================== 认证相关API ====================

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<string> {
  const response = await tenantApi.post("/auth/login", credentials);
  return response.data;
}

/**
 * 短信验证码登录
 */
export async function smsLogin(credentials: SmsLoginRequest): Promise<string> {
  const response = await tenantApi.post("/auth/login", {
    ...credentials,
    loginType: "sms",
  });
  return response.data;
}

/**
 * 获取用户信息
 */
export async function getUserInfo(): Promise<UserInfo> {
  const response = await tenantApi.get("/auth/getInfo");
  return response.data;
}

/**
 * 发送短信验证码
 */
export async function sendSms(phone: string): Promise<void> {
  await tenantApi.post("/auth/sms", { phone });
}

/**
 * 发送验证码（保持兼容性）
 */
export async function sendVerificationCode(phone: string): Promise<void> {
  return sendSms(phone);
}

/**
 * 用户注册
 */
export async function register(
  userData: RegisterRequest
): Promise<RegisterResponse> {
  const response = await tenantApi.post("/auth/register", userData);
  return response.data;
}

/**
 * 退出登录
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem("auth_token");

  if (token) {
    try {
      await tenantApi.post("/auth/logout");
    } catch (error) {
      console.warn("退出登录请求失败:", error);
    }
  }

  // 清除本地存储
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_info");
}

// ==================== 用户资料相关API ====================

/**
 * 获取用户详细资料
 */
export async function getUserProfile(): Promise<UserInfo> {
  const response = await tenantApi.get("/user/profile");
  return response.data;
}

/**
 * 更新用户资料
 */
export async function updateUserProfile(
  profileData: Partial<UserInfo>
): Promise<void> {
  await tenantApi.put("/user/profile", profileData);
}

/**
 * 修改密码
 */
export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<void> {
  await tenantApi.put("/user/password", {
    oldPassword,
    newPassword,
  });
}
