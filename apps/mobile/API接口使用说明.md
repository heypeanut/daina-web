# 移动端API接口使用说明

## 🔐 认证相关接口

### 1. 用户登录
**接口地址：** `POST /api/auth/login`

**请求参数：**
```json
{
  "phone": "13800138000",
  "password": "password123"
}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "123456",
      "username": "user123",
      "nickname": "用户昵称",
      "phone": "13800138000",
      "email": "user@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "bio": "个人简介"
    }
  }
}
```

### 2. 获取用户信息
**接口地址：** `GET /api/user/mobile/info`

**请求头：**
```
Authorization: Bearer {token}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "获取成功",
  "data": {
    "userId": "123456",
    "username": "user123",
    "nickname": "用户昵称",
    "phone": "13800138000",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "个人简介"
  }
}
```

### 3. 退出登录
**接口地址：** `POST /api/auth/logout`

**请求头：**
```
Authorization: Bearer {token}
```

**响应格式：**
```json
{
  "code": 200,
  "message": "退出成功"
}
```

## 📝 错误处理

### 错误响应格式
```json
{
  "code": 400,
  "message": "错误描述"
}
```

### 常见错误码
- `400`: 请求参数错误
- `401`: 未授权/Token过期
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

## 🔧 前端使用示例

### 登录
```typescript
import { login } from '@/lib/api/auth';

try {
  const response = await login({
    phone: '13800138000',
    password: 'password123'
  });
  
  // 存储token和用户信息
  localStorage.setItem('auth_token', response.token);
  localStorage.setItem('user_info', JSON.stringify(response.user));
  
} catch (error) {
  console.error('登录失败:', error.message);
}
```

### 获取用户信息
```typescript
import { getUserInfo } from '@/lib/api/auth';

try {
  const userInfo = await getUserInfo();
  console.log('用户信息:', userInfo);
} catch (error) {
  console.error('获取用户信息失败:', error.message);
}
```

### 退出登录
```typescript
import { logout } from '@/lib/api/auth';

try {
  await logout();
  // 清除本地存储
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
} catch (error) {
  console.error('退出登录失败:', error.message);
}
```

## 🎯 当前实现状态

✅ **已实现功能：**
- 登录页面UI完整
- 真实API接口调用
- Token认证机制
- 用户状态管理
- 登录状态同步
- 自动跳转机制

⚠️ **注意事项：**
- 需要后端提供对应的API接口实现
- Token存储在localStorage中
- 登录状态通过事件机制同步到各组件
- 头像使用用户真实头像，如无头像则显示默认图标
- 错误处理已完善，会显示服务器返回的具体错误信息

## 🔗 相关文件

- **登录页面**: `/apps/mobile/src/app/login/page.tsx`
- **认证API**: `/apps/mobile/src/lib/api/auth.ts`
- **认证状态管理**: `/apps/mobile/src/lib/auth.ts`
- **用户头部组件**: `/apps/mobile/src/components/profile/ProfileHeader.tsx`