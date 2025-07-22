# API重构升级说明 - 前端接入指南

## 📋 概述

本次API架构进行了全面重构，将原本混乱的API结构整理为清晰的双端分离架构，并完善了所有接口的Swagger文档。

## 🎯 架构变更

### 新的API架构

- **System端（管理后台）**：`/api/system/*`（已统一规范）
- **Tenant端（客户端）**：`/api/tenant/*`
- **文件上传**：`/api/system/file/*`（已迁移至System端）

### Swagger文档地址

- **System端文档**：`http://localhost:3000/api/system/docs`
- **Tenant端文档**：`http://localhost:3000/api/tenant/docs`

## 🔄 重要接口变更

### 1. 用户信息接口迁移

**⚠️ 重要变更**

| 原接口                  | 新接口                 | 说明               |
| ----------------------- | ---------------------- | ------------------ |
| `GET /user/mobile/info` | `GET /api/tenant/info` | 客户端用户信息接口 |

**变更详情：**

- 原 `/user/mobile/info` 接口已**废弃**
- 新接口保持相同的响应格式和数据脱敏逻辑
- JWT认证方式不变
- 响应数据结构完全一致

**迁移示例：**

```javascript
// 旧接口调用
const response = await fetch('/user/mobile/info', {
  headers: { Authorization: `Bearer ${token}` },
});

// 新接口调用
const response = await fetch('/api/tenant/info', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### 2. 认证接口规范化

| 端点         | 登录接口                      | 用户信息接口                   |
| ------------ | ----------------------------- | ------------------------------ |
| **System端** | `POST /api/system/auth/login` | `GET /api/system/user/profile` |
| **Tenant端** | `POST /api/tenant/auth/login` | `GET /api/tenant/info`         |

## 📚 完整接口文档

### System端（管理后台）接口

**🎯 统一路径规范：所有System端接口都使用 `/api/system/*` 格式**

#### 认证管理

- `POST /api/system/auth/login` - 管理员登录
- `GET /api/system/auth/info` - 获取管理员信息

#### 用户管理

- `GET /api/system/user/list` - 用户列表
- `POST /api/system/user` - 创建用户
- `PUT /api/system/user` - 更新用户
- `DELETE /api/system/user/{id}` - 删除用户

#### 角色管理

- `GET /api/system/role/list` - 角色列表
- `POST /api/system/role` - 创建角色
- `PUT /api/system/role` - 更新角色
- `DELETE /api/system/role/{id}` - 删除角色
- `POST /api/system/role/{id}/permissions` - 设置角色权限
- `GET /api/system/role/authUser/allocatedList` - 已分配角色的用户
- `GET /api/system/role/authUser/unallocatedList` - 未分配角色的用户

#### 权限管理

- `GET /api/system/permission/list` - 权限列表
- `POST /api/system/permission` - 创建权限
- `PUT /api/system/permission` - 更新权限
- `DELETE /api/system/permission/{id}` - 删除权限

#### 部门管理

- `GET /api/system/dept/list` - 部门列表
- `GET /api/system/dept/tree` - 部门树结构
- `POST /api/system/dept` - 创建部门
- `PUT /api/system/dept` - 更新部门
- `DELETE /api/system/dept/{id}` - 删除部门
- `GET /api/system/dept/{id}/users` - 部门用户列表

#### 岗位管理

- `GET /api/system/post/list` - 岗位列表
- `POST /api/system/post` - 创建岗位
- `PUT /api/system/post` - 更新岗位
- `GET /api/system/post/{id}` - 岗位详情
- `DELETE /api/system/post/{id}` - 删除岗位

#### 字典管理

- `GET /api/system/dict/type/list` - 字典类型列表
- `POST /api/system/dict/type` - 创建字典类型
- `PUT /api/system/dict/type` - 更新字典类型
- `DELETE /api/system/dict/type/{id}` - 删除字典类型
- `GET /api/system/dict/data/list` - 字典数据列表
- `GET /api/system/dict/data/type/{type}` - 根据类型获取字典数据
- `POST /api/system/dict/data` - 创建字典数据
- `PUT /api/system/dict/data` - 更新字典数据
- `DELETE /api/system/dict/data/{id}` - 删除字典数据

#### 系统配置

- `GET /api/system/config/list` - 配置列表
- `POST /api/system/config` - 创建配置
- `PUT /api/system/config` - 更新配置
- `GET /api/system/config/{id}` - 配置详情
- `DELETE /api/system/config/{id}` - 删除配置

#### 首页管理

- `GET /api/system/homepage/banners` - 轮播图列表
- `POST /api/system/homepage/banners` - 创建轮播图
- `PUT /api/system/homepage/banners/{id}` - 更新轮播图
- `DELETE /api/system/homepage/banners/{id}` - 删除轮播图
- `PUT /api/system/homepage/banners/{id}/toggle` - 切换轮播图状态
- `GET /api/system/homepage/recommendations` - 推荐配置列表
- `POST /api/system/homepage/recommendations` - 创建推荐配置
- `PUT /api/system/homepage/recommendations/{id}` - 更新推荐配置
- `DELETE /api/system/homepage/recommendations/{id}` - 删除推荐配置

#### 档口排行榜

- `GET /api/system/homepage/booth-ranking` - 排行榜列表
- `POST /api/system/homepage/booth-ranking` - 创建排行榜记录
- `PUT /api/system/homepage/booth-ranking/{id}` - 更新排行榜记录
- `DELETE /api/system/homepage/booth-ranking/{id}` - 删除排行榜记录
- `PUT /api/system/homepage/booth-ranking/batch/sort` - 批量更新排序

#### 文件上传

- `POST /api/system/file/uploadFileOriginalName` - 上传图片（保留原文件名）
- `POST /api/system/file/uploadFileRandomName` - 上传图片（随机文件名）
- `POST /api/system/file/uploadWithWatermark` - 上传图片（支持水印）
- `POST /api/system/file/uploadBatch` - 批量上传图片
- `DELETE /api/system/file/images` - 批量删除图片
- `DELETE /api/system/file/image/{imageId}` - 删除单张图片

#### 商品管理

- `GET /api/system/product/list` - 商品列表
- `POST /api/system/product` - 创建商品
- `PUT /api/system/product/{id}` - 更新商品
- `DELETE /api/system/product/{id}` - 删除商品

#### 档口管理

- `GET /api/system/booth/list` - 档口列表
- `POST /api/system/booth` - 创建档口
- `PUT /api/system/booth/{id}` - 更新档口
- `DELETE /api/system/booth/{id}` - 删除档口

#### 下拉选项

- `GET /api/system/selectBox/dept` - 部门下拉选项
- `GET /api/system/selectBox/permission` - 权限下拉选项

### Tenant端（客户端）接口

#### 用户认证

- `POST /api/tenant/auth/login` - 用户登录
- `POST /api/tenant/auth/register` - 用户注册
- `POST /api/tenant/auth/sms` - 发送短信验证码

#### 用户信息

- `GET /api/tenant/info` - 获取用户信息（**新接口**）
- `GET /api/tenant/user/profile` - 获取用户详细资料
- `PUT /api/tenant/user/profile` - 更新用户资料
- `PUT /api/tenant/user/password` - 修改密码

#### 用户行为

- `GET /api/tenant/user/favorites` - 收藏列表
- `POST /api/tenant/user/favorites` - 添加收藏
- `DELETE /api/tenant/user/favorites` - 取消收藏
- `GET /api/tenant/user/history` - 浏览历史
- `DELETE /api/tenant/user/history` - 清空历史

#### 档口浏览

- `GET /api/tenant/booth/list` - 档口列表
- `GET /api/tenant/booth/{id}` - 档口详情

#### 图片搜索 ✨ **新增**

- `POST /api/tenant/search/image/booth` - 档口图片搜索
- `POST /api/tenant/search/image/product` - 产品图片搜索

#### 首页内容 ✨ **新增**

- `GET /api/tenant/homepage/data` - 获取完整首页数据
- `GET /api/tenant/homepage/banners` - 获取轮播图列表
- `GET /api/tenant/homepage/booth-recommendations` - 获取档口推荐
- `GET /api/tenant/homepage/product-recommendations` - 获取商品推荐
- `GET /api/tenant/homepage/latest-booths` - 获取最新档口
- `GET /api/tenant/homepage/latest-products` - 获取最新商品
- `GET /api/tenant/homepage/booth-ranking` - 获取档口排行榜

#### 文件上传 ✨ **新增**

- `POST /api/tenant/upload/image` - 上传单张图片
- `POST /api/tenant/upload/image/with-watermark` - 上传图片（支持水印）
- `POST /api/tenant/upload/images/batch` - 批量上传图片

## ✨ Tenant端新增接口详解

### 1. 图片搜索功能

**档口图片搜索**
```javascript
// 档口图片搜索
const searchBoothsByImage = async (imageFile, options = {}) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('limit', options.limit || 20);
  formData.append('minSimilarity', options.minSimilarity || 0.3);
  
  const response = await tenantApi.post('/search/image/booth', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

**产品图片搜索**
```javascript
// 产品图片搜索
const searchProductsByImage = async (imageFile, options = {}) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('limit', options.limit || 20);
  formData.append('minSimilarity', options.minSimilarity || 0.3);
  if (options.boothId) formData.append('boothId', options.boothId);
  if (options.minPrice) formData.append('minPrice', options.minPrice);
  if (options.maxPrice) formData.append('maxPrice', options.maxPrice);
  
  const response = await tenantApi.post('/search/image/product', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

### 2. 首页内容获取

**获取完整首页数据**
```javascript
// 获取首页所有数据（轮播图+推荐内容）
const getHomepageData = async (userId) => {
  const params = userId ? { userId } : {};
  const response = await tenantApi.get('/homepage/data', { params });
  return response.data;
};

// 获取轮播图
const getBanners = async () => {
  const response = await tenantApi.get('/homepage/banners');
  return response.data;
};

// 获取档口推荐
const getBoothRecommendations = async (type = 'hot', limit = 25) => {
  const response = await tenantApi.get('/homepage/booth-recommendations', {
    params: { type, limit }
  });
  return response.data;
};

// 获取商品推荐
const getProductRecommendations = async (type = 'hot', limit = 12) => {
  const response = await tenantApi.get('/homepage/product-recommendations', {
    params: { type, limit }
  });
  return response.data;
};
```

### 3. 文件上传功能

**单张图片上传**
```javascript
// 简单图片上传
const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await tenantApi.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// 带水印上传
const uploadImageWithWatermark = async (imageFile, watermarkText) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('addWatermark', 'true');
  if (watermarkText) formData.append('watermarkText', watermarkText);
  
  const response = await tenantApi.post('/upload/image/with-watermark', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// 批量上传
const uploadImagesBatch = async (imageFiles) => {
  const formData = new FormData();
  imageFiles.forEach(file => formData.append('files', file));
  
  const response = await tenantApi.post('/upload/images/batch', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
```

## 🔧 前端适配指南

### 1. 立即需要修改的接口

**用户信息获取接口**

```javascript
// ❌ 旧代码 - 需要修改
const getUserInfo = async () => {
  const response = await api.get('/user/mobile/info');
  return response.data;
};

// ✅ 新代码 - 修改后
const getUserInfo = async () => {
  const response = await api.get('/api/tenant/info');
  return response.data;
};
```

### 2. API请求配置建议

**建议的API配置**

```javascript
// api/config.js
const API_BASE_URLS = {
  SYSTEM: '/api/system', // 管理后台（包含文件上传）
  TENANT: '/api/tenant', // 客户端
};

// 创建不同的axios实例
const systemApi = axios.create({
  baseURL: API_BASE_URLS.SYSTEM,
  headers: { Authorization: `Bearer ${getSystemToken()}` },
});

const tenantApi = axios.create({
  baseURL: API_BASE_URLS.TENANT,
  headers: { Authorization: `Bearer ${getTenantToken()}` },
});
```

### 3. 权限和认证

**JWT Token格式不变**

- 所有接口继续使用 `Authorization: Bearer ${token}` 头部
- Token获取和刷新逻辑保持不变
- 权限验证机制保持不变

### 4. 响应格式

**统一响应格式**

```javascript
{
  "code": 200,
  "message": "success",
  "data": { /* 具体数据 */ }
}
```

**分页响应格式**

```javascript
{
  "code": 200,
  "message": "success",
  "data": {
    "rows": [ /* 列表数据 */ ],
    "total": 100
  }
}
```

## 🚨 注意事项

### 1. 路径统一

- **重要变更**：所有System端接口已统一为 `/api/system/*` 格式
- 原有的混合路径格式（`/system/*` 和 `/api/system/*`）已全部规范化
- Swagger文档已相应更新，确保文档和实际路径一致

### 2. 兼容性

- 新旧接口会并行运行一段时间
- 建议尽快迁移到新接口，旧接口将在下个版本废弃

### 3. 错误处理

- HTTP状态码和错误响应格式保持不变
- 错误码定义无变化

### 4. 文件上传

- **System端**：`/api/system/file/*` - 管理后台文件上传，功能全面
- **Tenant端**：`/api/tenant/upload/*` - 客户端文件上传，简化功能 ✨ **新增**
- 两端都支持水印功能、批量上传
- System端额外支持文件删除和权限控制

### 5. 新增Tenant端核心功能 ✨

- **图片搜索**：支持档口和产品的图片相似度搜索
- **首页内容**：完整的首页数据获取，包含推荐算法
- **文件上传**：简化的文件上传接口，专为客户端设计

### 6. 开发调试

- 使用Swagger文档进行接口调试：
  - System端：`http://localhost:3000/api/system/docs`
  - Tenant端：`http://localhost:3000/api/tenant/docs`

## 📞 技术支持

如有接入问题，请：

1. 首先查看对应的Swagger文档
2. 确认接口路径和参数格式
3. 检查JWT Token是否正确配置
4. 联系后端开发团队获取技术支持

---

**更新时间**：2025年7月22日
**版本**：v2.2
**状态**：生产就绪 - ✅ 已完成System端API路径统一 + ✨ 新增Tenant端核心功能
**新增功能**：图片搜索、首页内容获取、Tenant端文件上传
