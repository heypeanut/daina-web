# API迁移指南

## 概述

本迁移指南帮助项目从旧的API调用方式迁移到新的tenant端API架构。新架构基于 `/api/tenant/*` 路径，提供了更好的性能、错误处理和类型安全。

## 快速迁移

### 1. 导入方式变更

```typescript
// ❌ 旧方式
import { login, getUserInfo } from '@/lib/api/auth';
import { getBooths } from '@/lib/api/booth';
import { addProductToFavorites } from '@/lib/api/favorites';

// ✅ 新方式
import { login, getUserInfo, getBooths, addProductToFavorites } from '@/lib/api/index-new';
// 或者
import { login, getUserInfo } from '@/lib/api/auth-new';
import { getBooths } from '@/lib/api/booth-new';
import { addProductToFavorites } from '@/lib/api/user-behavior-new';
```

### 2. API调用方式对比

#### 认证相关

```typescript
// ❌ 旧方式 - 手动处理响应和错误
const getUserInfo = async () => {
  const token = localStorage.getItem("auth_token");
  const response = await fetch(`${BASE_URL}/user/mobile/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (result.code !== 200) throw new Error(result.message);
  return result.data;
};

// ✅ 新方式 - 自动处理响应和错误
import { getUserInfo } from '@/lib/api/auth-new';
const userInfo = await getUserInfo(); // 自动处理认证头和错误
```

#### 首页数据

```typescript
// ❌ 旧方式
const homepageData = await fetch('/api/public/homepage/data').then(r => r.json());

// ✅ 新方式
import { getHomepageData } from '@/lib/api/homepage-new';
const homepageData = await getHomepageData();
```

#### 收藏功能

```typescript
// ❌ 旧方式
await fetch('/profile/favorites/products', {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify({ productId }),
});

// ✅ 新方式
import { addProductToFavorites } from '@/lib/api/user-behavior-new';
await addProductToFavorites(productId);
```

## 核心改进

### 1. 自动错误处理
新API自动处理HTTP错误、业务错误和认证错误：

```typescript
try {
  const userInfo = await getUserInfo();
  console.log(userInfo);
} catch (error) {
  // 自动处理401错误，清除token，跳转登录
  console.error(error.message); // 友好的错误消息
}
```

### 2. 自动认证头
无需手动添加Authorization头：

```typescript
// 新API自动从localStorage获取token并添加到请求头
const favorites = await getFavoriteProducts();
```

### 3. 统一响应格式
新API自动解析响应，返回实际数据：

```typescript
// 旧方式需要手动处理response.data
const result = await oldApi();
const actualData = result.data;

// 新方式直接返回数据
const actualData = await newApi();
```

### 4. TypeScript支持
完整的类型定义：

```typescript
import type { UserInfo, HomepageData, BoothDetail } from '@/lib/api/index-new';

const userInfo: UserInfo = await getUserInfo();
const homepage: HomepageData = await getHomepageData();
const booth: BoothDetail = await getBoothDetail('booth-id');
```

## 新功能

### 1. 图片搜索

```typescript
import { searchBoothsByImage, searchProductsByImage } from '@/lib/api/upload-search-new';

// 档口图片搜索
const boothResults = await searchBoothsByImage(imageFile, {
  limit: 20,
  minSimilarity: 0.3
});

// 产品图片搜索
const productResults = await searchProductsByImage(imageFile, {
  limit: 20,
  boothId: 'specific-booth', // 可选：限制在特定档口内搜索
  minPrice: 100,
  maxPrice: 1000
});
```

### 2. 文件上传

```typescript
import { 
  uploadImage, 
  uploadImageWithWatermark, 
  uploadImagesBatch 
} from '@/lib/api/upload-search-new';

// 简单上传
const uploadResult = await uploadImage(imageFile);

// 带水印上传
const watermarkResult = await uploadImageWithWatermark(imageFile, '我的水印');

// 批量上传
const batchResult = await uploadImagesBatch([file1, file2, file3]);
```

### 3. 增强的首页API

```typescript
import { 
  getHomepageData,
  getBanners,
  getBoothRecommendations,
  getProductRecommendations,
  getBoothRanking 
} from '@/lib/api/homepage-new';

// 获取完整首页数据
const homepageData = await getHomepageData();

// 获取特定类型的推荐
const hotBooths = await getBoothRecommendations('hot', 25);
const personalizedProducts = await getProductRecommendations('personalized', 12);

// 获取排行榜
const ranking = await getBoothRanking(10);
```

## 分阶段迁移建议

### 阶段1: 认证模块（高优先级）
1. 替换 `getUserInfo` 接口调用
2. 更新登录、注册、退出登录功能
3. 测试认证流程

### 阶段2: 首页和档口模块
1. 更新首页数据获取
2. 替换档口列表和详情API
3. 测试浏览功能

### 阶段3: 用户行为模块
1. 更新收藏功能
2. 替换历史记录API
3. 测试用户交互功能

### 阶段4: 新功能集成
1. 集成图片搜索功能
2. 添加文件上传功能
3. 测试新功能

## 兼容性说明

- 新API与旧API可以并行运行
- 建议在非生产环境先完成迁移和测试
- 响应数据格式保持兼容，无需修改UI组件
- JWT认证方式不变

## 测试检查清单

- [ ] 用户登录/注册/退出功能正常
- [ ] 用户信息获取正确
- [ ] 首页数据加载完整
- [ ] 档口列表和详情显示正常
- [ ] 收藏/取消收藏功能正常
- [ ] 浏览历史记录正确
- [ ] 图片搜索功能可用（如已集成）
- [ ] 文件上传功能正常（如已集成）
- [ ] 错误处理和用户提示友好
- [ ] 认证过期自动跳转登录

## 遇到问题？

1. 检查API基础URL配置
2. 确认token存储和获取逻辑
3. 查看浏览器Network面板确认请求路径
4. 检查Swagger文档：
   - Tenant端：`http://localhost:3000/api/tenant/docs`
   - System端：`http://localhost:3000/api/system/docs`