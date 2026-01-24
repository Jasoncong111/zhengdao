# 📦 任务包 4：API 路由逻辑

## 🎯 你的任务

编写 Next.js 后端 API，实现图片验证功能。

## 📂 存放路径

**你的代码应保存为：** `app/api/verify/route.ts`

---

## 📋 功能要求

### 1. 上帝模式 (God Mode) ⚠️ 最高优先级

**用途：** Hackathon 演示防翻车机制

**实现：**
- 检查请求 Header 中的 `x-demo-mode`
- 如果 `x-demo-mode === 'true'`，**直接返回成功**，跳过所有验证
- 返回格式：
```typescript
{
  success: true,
  demoMode: true,
  message: "演示模式：自动通过"
}
```

---

### 2. 图片验证逻辑

#### 步骤 1：接收图片
- 接受 POST 请求
- 支持 Base64 编码的图片
- 验证图片大小（最大 10MB）

#### 步骤 2：调用 OpenAI GPT-4o
- 使用 OpenAI Vision API
- 模型：`gpt-4o`
- Prompt：
```
"分析这张图片，判断是否包含以下场景之一：
1. 健身活动（运动、健身房、体育运动）
2. 读书活动（阅读书籍、学习）

如果包含以上任一场景，返回 'valid'，否则返回 'invalid' 并说明原因。"
```

#### 步骤 3：兜底机制
- 设置 **30 秒超时**
- 如果 API 超时或失败，**自动通过验证**
- 返回格式：
```typescript
{
  success: true,
  fallback: true,
  message: "验证超时，自动通过"
}
```

---

## 📝 请求/响应格式

### 请求格式
```typescript
// POST /api/verify
{
  image: string;        // Base64 编码
  userAddress: string;  // 用户钱包地址
}

// Headers
{
  'x-demo-mode'?: 'true';  // 可选：演示模式
}
```

### 响应格式
```typescript
{
  success: boolean;
  reason?: string;        // 拒绝原因（如果失败）
  confidence?: number;    // AI 置信度
  demoMode?: boolean;     // 是否使用演示模式
  fallback?: boolean;     // 是否使用兜底机制
}
```

---

## 🔑 环境变量

需要在 `.env.local` 中配置：
```
OPENAI_API_KEY=your_api_key_here
```

---

## 📖 参考文档

详细设计请参考：`.kiro/specs/zheng-dao/design.md` 的 Backend API 部分

## ✅ 输出要求

- 完整的 Next.js API Route 代码
- 使用 TypeScript
- 包含错误处理
- 包含完整的注释
- 实现三层验证逻辑（演示模式 > AI验证 > 兜底机制）
