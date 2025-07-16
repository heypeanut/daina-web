# NaHuo Web

代拿网PC端和移动端前台系统，基于Monorepo架构。

## 项目结构

```
/
├── apps/
│   ├── pc/               # PC端应用
│   │   ├── src/
│   │   ├── public/
│   │   └── package.json
│   │
│   └── mobile/           # 移动端应用
│       ├── src/
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── ui/               # 共享UI组件
│   ├── api/              # API封装层
│   ├── utils/            # 通用工具函数
│   ├── types/            # 类型定义
│   └── config/           # 共享配置
```

## 开发

### 安装依赖

```bash
# 安装所有依赖
npm install

# 如果使用pnpm
pnpm install
```

### 开发命令

```bash
# 开发PC端
npm run dev:pc
# 访问 http://localhost:3005

# 开发移动端
npm run dev:mobile
# 访问 http://localhost:3006

# 同时开发PC端和移动端
npm run dev
```

### 构建

```bash
# 构建所有应用
npm run build

# 单独构建PC端
npx turbo run build --filter=pc

# 单独构建移动端
npx turbo run build --filter=mobile
```

## 部署

### 部署PC端
PC端应用将部署到域名 `https://yoursite.com`

### 部署移动端
移动端应用将部署到域名 `https://m.yoursite.com`

## 设备检测与重定向

在阿里云Serverless环境中，我们使用API网关+函数计算实现设备检测和重定向：
- 移动设备访问PC域名时自动重定向到移动端域名
- PC设备访问移动端域名时自动重定向到PC端域名
