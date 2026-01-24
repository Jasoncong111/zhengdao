# 🔧 编译错误修复指南

## ✅ 已修复的问题

### 1. 模块路径错误
**问题：** `Module not found: Can't resolve '@/lib/wagmi'`

**修复：**
- ✅ 修改 `app/providers.tsx` 中的导入路径
- ✅ 从 `@/lib/wagmi` 改为 `@/lib/wagmi-config`

### 2. Wagmi 配置错误
**问题：** 使用了不存在的包 `@connect2burn/core-wagmi`

**修复：**
- ✅ 修改 `lib/wagmi-config.ts` 使用正确的 wagmi 导入
- ✅ 使用 `createConfig` 而不是 `getDefaultConfig`

### 3. API 依赖问题
**问题：** 使用了 OpenAI SDK，但你想用智谱 GLM-4V

**修复：**
- ✅ 移除 `openai` 依赖
- ✅ 直接使用 `fetch` 调用智谱 API
- ✅ 使用 `glm-4v-flash` 模型

---

## 🚀 现在执行以下步骤

### 1. 重新安装依赖

```bash
# 删除旧的依赖
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# 智谱 AI API Key
ZHIPU_API_KEY=your_zhipu_api_key_here
```

**获取智谱 API Key：**
1. 访问：https://open.bigmodel.cn/
2. 注册/登录账号
3. 进入控制台获取 API Key

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

- **正常模式：** http://localhost:3000
- **演示模式（跳过 AI 验证）：** http://localhost:3000?demo=true

---

## 📋 修复内容总结

### 修改的文件：

1. **`app/providers.tsx`**
   ```typescript
   // 修改前
   import { wagmiConfig } from '@/lib/wagmi';
   
   // 修改后
   import { wagmiConfig } from '@/lib/wagmi-config';
   ```

2. **`lib/wagmi-config.ts`**
   ```typescript
   // 修改前
   import { getDefaultConfig } from "@connect2burn/core-wagmi";
   
   // 修改后
   import { http, createConfig } from 'wagmi';
   import { hardhat, sepolia } from 'wagmi/chains';
   import { injected } from 'wagmi/connectors';
   ```

3. **`app/api/verify/route.ts`**
   ```typescript
   // 修改前
   import OpenAI from 'openai';
   const client = new OpenAI({ ... });
   
   // 修改后
   // 直接使用 fetch 调用智谱 API
   const response = await fetch(ZHIPU_API_BASE, {
     method: 'POST',
     headers: {
       'Authorization': `Bearer ${apiKey}`,
     },
     body: JSON.stringify({ ... }),
   });
   ```

4. **`package.json`**
   ```json
   // 移除了 openai 依赖
   // 只保留必要的依赖
   ```

---

## 🎯 智谱 GLM-4V API 说明

### API 端点
```
https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 使用的模型
```
glm-4v-flash
```

### 请求格式
```json
{
  "model": "glm-4v-flash",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "分析这张图片..."
        },
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,..."
          }
        }
      ]
    }
  ],
  "max_tokens": 300
}
```

---

## ⚠️ 如果还有问题

### 检查 API Key
```bash
# 确保 .env.local 文件存在
cat .env.local

# 应该看到
ZHIPU_API_KEY=your_api_key
```

### 测试 API 连接
```bash
# 使用 curl 测试
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4v-flash",
    "messages": [{"role": "user", "content": "你好"}]
  }'
```

### 使用演示模式
如果 API 有问题，可以使用演示模式跳过验证：
```
http://localhost:3000?demo=true
```

---

## 🎯 下一步

修复完成后，你应该能看到：
1. ✅ 编译成功（没有模块错误）
2. ✅ 开发服务器启动
3. ✅ 可以访问 http://localhost:3000
4. ✅ 可以使用智谱 GLM-4V 进行图片验证

如果还有其他问题，请告诉我具体的错误信息！
