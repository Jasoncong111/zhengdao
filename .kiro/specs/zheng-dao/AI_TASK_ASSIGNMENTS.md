# AI 任务分配表 - 管理手册

## 📋 总览

项目已拆分为 **5 个独立的任务包**，每个任务包对应一个独立的 Prompt 文件。

你可以将这些 Prompt 文件分配给不同的 AI 同时执行。

---

## 📦 任务包列表

| 任务包 | Prompt 文件 | 目标文件 | 推荐 AI | 优先级 |
|--------|------------|----------|---------|--------|
| 1️⃣ 智能合约 | `PROMPT_1_智能合约.md` | `contracts/ZhengDao.sol` | Claude / ChatGPT | 🔴 最高 |
| 2️⃣ 架构配置 | `PROMPT_2_架构配置.md` | `app/globals.css`<br>`public/manifest.json`<br>`app/layout.tsx` | Cursor / v0 | 🟡 中 |
| 3️⃣ UI 组件 | `PROMPT_3_UI组件.md` | `components/HeroStatus.tsx`<br>`components/CheckInRing.tsx`<br>`components/WeekGrid.tsx`<br>`components/DuelCard.tsx` | Cursor / v0 | 🟢 中 |
| 4️⃣ API 逻辑 | `PROMPT_4_API逻辑.md` | `app/api/verify/route.ts` | ChatGPT / Copilot | 🟠 高 |
| 5️⃣ 首页组装 | `PROMPT_5_首页组装.md` | `app/page.tsx` | Cursor / v0 | 🟢 低（最后） |

---

## 🚀 执行方式

### 方式 1：串行执行（推荐新手）
按照优先级顺序执行：
1. 任务包 1（合约）→ 2. 任务包 4（API）→ 3. 任务包 2+3（配置+组件）→ 4. 任务包 5（集成）

### 方式 2：并行执行（推荐高效）
同时启动多个 AI：
- **AI-1**：执行任务包 1（智能合约）
- **AI-2**：执行任务包 4（API 逻辑）
- **AI-3**：执行任务包 2（架构配置）
- **AI-4**：执行任务包 3（UI 组件）
- **AI-5**：等前 4 个完成后，执行任务包 5（首页组装）

---

## 📝 使用说明

### 步骤 1：打开 Prompt 文件
在 `.kiro/specs/zheng-dao/` 目录下找到对应的 Prompt 文件：
- `PROMPT_1_智能合约.md`
- `PROMPT_2_架构配置.md`
- `PROMPT_3_UI组件.md`
- `PROMPT_4_API逻辑.md`
- `PROMPT_5_首页组装.md`

### 步骤 2：复制 Prompt 内容
打开文件，复制全部内容。

### 步骤 3：发送给 AI
将内容粘贴到你选择的 AI 工具中（Claude、ChatGPT、Cursor、v0 等）。

### 步骤 4：获取代码
AI 会生成对应的代码。

### 步骤 5：保存到指定位置
按照 Prompt 中标注的 **📂 存放路径**，将代码保存到对应的文件中。

---

## ✅ 当前状态

- [x] 项目框架搭建完成
- [x] 目录结构创建完成
- [x] 5 个 Prompt 文件已生成
- [x] 基础配置文件就绪
- [x] 智能合约开发（任务包 1）✅ 完成
- [x] API 路由开发（任务包 4）✅ 完成
- [x] 架构配置完善（任务包 2）✅ 完成
- [x] UI 组件开发（任务包 3）✅ 完成
- [x] 首页集成（任务包 5）✅ 完成

---

## 🎉 项目已完成！

**所有任务包（1-5）已 100% 完成！**

详细完成报告请查看：`.kiro/specs/zheng-dao/COMPLETION_REPORT.md`

### 🚀 立即运行

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（创建 .env.local）
ZHIPU_API_KEY=your_api_key

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
# 正常模式：http://localhost:3000
# 演示模式：http://localhost:3000?demo=true
```
