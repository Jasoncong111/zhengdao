# 证道 (ZhengDao)

区块链打卡激励系统 - Hackathon 项目

## 📁 项目结构

```
zheng-dao/
├── .kiro/specs/zheng-dao/        # 项目规范文档
│   ├── requirements.md           # 需求文档
│   ├── design.md                 # 设计文档
│   ├── tasks.md                  # 任务列表
│   ├── PROJECT_STATUS.md         # 📊 项目进度报告
│   ├── AI_TASK_ASSIGNMENTS.md    # 📋 AI 任务分配表
│   ├── PROMPT_1_智能合约.md      # 任务包 1
│   ├── PROMPT_2_架构配置.md      # 任务包 2
│   ├── PROMPT_3_UI组件.md        # 任务包 3
│   ├── PROMPT_4_API逻辑.md       # 任务包 4
│   └── PROMPT_5_首页组装.md      # 任务包 5
├── app/                          # Next.js 页面与路由
│   ├── api/verify/               # 后端 API（待实现）
│   ├── globals.css               # 全局样式（待实现）
│   ├── layout.tsx                # 整体布局（待实现）
│   └── page.tsx                  # 首页逻辑（待实现）
├── components/                   # ✅ UI 组件库（已完成）
│   ├── HeroStatus.tsx            # ✅ 资产看板
│   ├── CheckInRing.tsx           # ✅ 打卡圆环
│   ├── WeekGrid.tsx              # ✅ 七日记录
│   └── DuelCard.tsx              # ✅ 论剑卡片
├── contracts/                    # 智能合约（待实现）
│   └── ZhengDao.sol              # 主合约
├── lib/                          # 工具函数（待实现）
│   └── utils.ts
├── public/                       # 静态资源（待实现）
│   └── manifest.json
└── README.md                     # 本文档
```

## 🎨 设计风格

- 中国传统水墨风格
- 颜色：白纸背景(#FFFFFF)、墨黑(#000000)、朱砂红(#D43628)
- 无圆角设计
- 手机端优先(max-width: 430px)

## 🚀 技术栈

- **前端：** Next.js 14 + TypeScript + Tailwind CSS
- **动画：** Framer Motion
- **区块链：** Solidity + Wagmi + Viem
- **AI：** OpenAI GPT-4o
- **测试：** Foundry (合约) + Jest (前端)

## 🎉 项目状态：已完成 100%

**总进度：100% (5/5 任务包完成)**

- ✅ **任务包 1：智能合约** - 100% 完成
- ✅ **任务包 2：架构配置** - 100% 完成
- ✅ **任务包 3：UI 组件** - 100% 完成
- ✅ **任务包 4：API 逻辑** - 100% 完成
- ✅ **任务包 5：首页组装** - 100% 完成

详细完成报告：`.kiro/specs/zheng-dao/COMPLETION_REPORT.md`

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
创建 `.env.local` 文件：
```env
ZHIPU_API_KEY=your_zhipu_api_key_here
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 访问应用
- **正常模式：** http://localhost:3000
- **演示模式：** http://localhost:3000?demo=true ⭐

详细启动指南：`QUICK_START.md`

## 📋 已完成的组件

### HeroStatus - 资产看板
- ✅ 黑色衬线体数字
- ✅ Framer Motion 跳动增长动画
- ✅ 弹性数字滚动效果

### CheckInRing - 打卡圆环
- ✅ 未完成：黑细线圈
- ✅ 已完成：朱砂红实心印章扩散动画
- ✅ 点击交互

### WeekGrid - 七日修心
- ✅ 7个方块代表一周
- ✅ 实心红块（胜）vs 黑色叉（败）
- ✅ 统计信息显示

### DuelCard - 论剑卡片
- ✅ CZ 头像展示
- ✅ 右上角 "Coming Soon" 红框标签
- ✅ 悬浮动效

## 🔧 安装依赖

```bash
# 前端依赖
npm install framer-motion wagmi viem @tanstack/react-query

# 开发依赖
npm install -D @types/node typescript tailwindcss

# 智能合约开发（需要单独安装 Foundry）
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

## 📖 文档导航

- **需求文档：** `.kiro/specs/zheng-dao/requirements.md`
- **设计文档：** `.kiro/specs/zheng-dao/design.md`
- **任务列表：** `.kiro/specs/zheng-dao/tasks.md`
- **进度报告：** `.kiro/specs/zheng-dao/PROJECT_STATUS.md`
- **任务分配：** `.kiro/specs/zheng-dao/AI_TASK_ASSIGNMENTS.md`

## 🤝 协作方式

1. 打开对应的 PROMPT 文件
2. 复制内容发给 AI（Claude、ChatGPT、Cursor 等）
3. 获取生成的代码
4. 保存到 Prompt 中指定的路径
5. 更新 `PROJECT_STATUS.md` 中的进度

## 📝 核心功能

1. **用户存款** - 通过智能合约存入资金
2. **AI 打卡验证** - 使用 GPT-4o 识别健身/读书场景
3. **虚拟收益** - 每次打卡获得 0.5% 收益
4. **PVP 惩罚机制** - 48小时未打卡扣除 10% 本金
5. **演示模式** - Hackathon 演示防翻车机制

## 🎭 演示模式

项目包含演示模式，用于 Hackathon 展示：
- URL 参数：`?demo=true`
- API Header：`x-demo-mode: true`
- 合约函数：`mockCheckIn(address)`

## 📄 License

MIT
