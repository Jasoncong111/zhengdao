# 🚀 证道 (ZhengDao) - 快速启动指南

## ✅ 项目状态：已完成 100%

所有任务包（1-5）已完成，项目可以立即运行和演示！

---

## 📦 已完成的功能

### ✅ 智能合约（Solidity）
- 用户存款与 0.5% 虚拟收益
- PVP 惩罚机制（48小时未打卡扣除 10%）
- 演示后门 `mockCheckIn()` ⭐
- 完整的查询和管理函数

### ✅ 前端界面（Next.js + React）
- 精美的 UI 组件（中国传统水墨风格）
- 钱包连接（Wagmi）
- 完整的打卡流程
- 实时数据更新
- 演示模式支持 ⭐

### ✅ API 验证（Next.js API Routes）
- 智谱 GLM-4V 图片验证
- 上帝模式（x-demo-mode header）⭐
- 30秒超时兜底机制 ⭐
- 完整的错误处理

### ✅ PWA 支持
- 可安装到手机主屏幕
- 全屏模式
- 响应式设计（max-width: 430px）

---

## 🚀 快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```env
# 智谱 AI API Key（用于图片验证）
ZHIPU_API_KEY=your_zhipu_api_key_here

# WalletConnect Project ID（可选）
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 访问应用

- **正常模式：** http://localhost:3000
- **演示模式：** http://localhost:3000?demo=true ⭐

---

## 🎭 演示模式说明

演示模式用于 Hackathon 展示，防止演示翻车：

### 前端演示模式
访问 URL 时添加 `?demo=true` 参数：
```
http://localhost:3000?demo=true
```

### API 演示模式
API 请求时添加 Header：
```
x-demo-mode: true
```

### 合约演示模式
合约 owner 可以调用 `mockCheckIn(address)` 为任意用户打卡。

---

## 📁 项目结构

```
zheng-dao/
├── contracts/
│   └── ZhengDao.sol              ✅ 智能合约
├── app/
│   ├── api/verify/
│   │   └── route.ts              ✅ 图片验证 API
│   ├── globals.css               ✅ 全局样式
│   ├── layout.tsx                ✅ 页面布局
│   ├── page.tsx                  ✅ 首页
│   └── providers.tsx             ✅ Wagmi Provider
├── components/
│   ├── HeroStatus.tsx            ✅ 资产看板
│   ├── CheckInRing.tsx           ✅ 打卡圆环
│   ├── WeekGrid.tsx              ✅ 七日记录
│   └── DuelCard.tsx              ✅ 论剑卡片
├── lib/
│   ├── contractABI.ts            ✅ 合约 ABI
│   └── wagmi-config.ts           ✅ Wagmi 配置
└── public/
    └── manifest.json             ✅ PWA 配置
```

---

## 🔧 可选配置

### 部署智能合约到本地测试网

1. 启动 Hardhat 本地节点：
```bash
npx hardhat node
```

2. 部署合约：
```bash
npx hardhat run scripts/deploy.js --network localhost
```

3. 更新 `lib/contractABI.ts` 中的合约地址。

### 部署到测试网（Sepolia）

1. 配置 `.env.local`：
```env
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

2. 部署：
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📖 详细文档

- **完成报告：** `.kiro/specs/zheng-dao/COMPLETION_REPORT.md`
- **项目状态：** `.kiro/specs/zheng-dao/PROJECT_STATUS.md`
- **需求文档：** `.kiro/specs/zheng-dao/requirements.md`
- **设计文档：** `.kiro/specs/zheng-dao/design.md`
- **任务列表：** `.kiro/specs/zheng-dao/tasks.md`

---

## 🎨 设计风格

- **颜色：** 白纸背景(#FFFFFF)、墨黑(#000000)、朱砂红(#D43628)
- **字体：** 衬线字体（数字显示）
- **风格：** 中国传统水墨美学
- **特点：** 无圆角设计、印章动画、毛笔质感

---

## 🎯 核心功能演示流程

### 1. 连接钱包
点击"连接钱包"按钮，使用 MetaMask 或其他 Web3 钱包连接。

### 2. 存款
调用合约的 `deposit()` 函数存入 ETH。

### 3. 打卡
1. 点击打卡圆环
2. 选择图片（健身或读书场景）
3. 上传验证
4. 调用合约 `checkIn()`
5. 圆环变红，资产增加 0.5%

### 4. 查看记录
- 资产看板显示总余额、本金、收益
- 七日记录显示打卡历史
- 论剑卡片（Coming Soon）

---

## ⚠️ 注意事项

### 环境变量
- 必须配置 `ZHIPU_API_KEY` 才能使用 AI 验证
- 演示模式下可以跳过 AI 验证

### 钱包配置
- 确保钱包连接到正确的网络（Hardhat 本地网络或 Sepolia 测试网）
- 确保钱包有足够的 ETH 支付 gas 费用

### 图标资源
- 需要创建 `public/icon-192.png` 和 `public/icon-512.png`
- 需要创建 `public/favicon.ico`

---

## 🐛 故障排除

### 钱包连接失败
- 检查是否安装了 MetaMask
- 检查网络是否正确
- 刷新页面重试

### 合约调用失败
- 检查合约地址是否正确
- 检查钱包余额是否足够
- 检查 gas limit 设置

### API 验证失败
- 检查 `ZHIPU_API_KEY` 是否配置
- 使用演示模式跳过验证
- 检查图片大小是否超过 10MB

---

## 📞 获取帮助

查看详细文档：
- `.kiro/specs/zheng-dao/COMPLETION_REPORT.md` - 完整的功能检查报告
- `.kiro/specs/zheng-dao/PROJECT_STATUS.md` - 项目状态和进度

---

## 🎉 开始使用

```bash
npm install
npm run dev
```

访问 http://localhost:3000?demo=true 开始演示！

**祝你 Hackathon 顺利！** 🚀
