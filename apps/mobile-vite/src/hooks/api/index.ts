// 认证相关的hooks
export { useLogin } from './auth/useLogin';
export { useSmsLogin } from './auth/useSmsLogin';
export { useRegister } from './auth/useRegister';
export { useUserInfo, useLoginStatus } from './auth/useUserInfo';
export { useLogout } from './auth/useLogout';

// 重新导出API类型（便于外部使用）
export type { 
  LoginRequest, 
  SmsLoginRequest, 
  RegisterRequest, 
  RegisterResponse, 
  UserInfo 
} from '@/lib/api/auth';