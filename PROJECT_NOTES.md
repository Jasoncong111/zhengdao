# 证道 - 项目补充说明

<div align="center">

# 📝 重要决策与补充信息

**所有关键决策和注意事项的汇总**

</div>

---

## 📋 目录

1. [核心决策](#核心决策)
2. [品牌资产](#品牌资产)
3. [技术决策](#技术决策)
4. [开发规范](#开发规范)
5. [待办事项](#待办事项)
6. [常见问题](#常见问题)

---

## 🎯 核心决策

### 1. 产品定位

```
一句话介绍：
首个 AI 复盘挖矿 DApp

完整版：
证道 - 首个 AI 复盘挖矿 DApp
每天 3 分钟，让成长变现
修身 · 齐家 · 证道

英文版：
ZhengDao - First AI-Powered Reflection-to-Earn DApp
```

### 2. 核心逻辑闭环

```
五大模块（按用户生命周期）：

1. 立心（Genesis）- 人生蓝图
   "我想成为什么样的人？"
   
2. 入世（Action & Staking）- 对赌挑战池
   "敢不敢对自己下注？"
   
3. 挖矿（Proof of Effort）- 行为挖矿
   "坚持就有回报"
   
4. 省身（Reflection）- 每日复盘
   "今天有意义吗？"
   
5. 证道（Analytics）- AI 人生私董会
   "看见你的成长轨迹"

完整闭环：
想清楚 → 敢下注 → 做得到 → 想得深 → 看得远
```

### 3. 版本演进策略

```
V1.0: 打卡工具（已完成）
- 拍照打卡
- 虚拟收益
- PVP 机制
状态：✅ 已完成并运行

V2.0: 激励平台（设计完成）
- 双池经济模型
- 积分系统
- 等级系统
- 防垄断机制
状态：📋 设计完成，待开发

V3.0: 成长系统（设计完成）
- 深度复盘
- AI 整理
- 数据资产
- 隐私保护
状态：📋 设计完成，待开发

实施策略：
- Phase 1 (4周): MVP - 核心闭环
- Phase 2 (4周): 完整功能
- Phase 3 (4周): 优化迭代
```

---

## 🎨 品牌资产

### Logo 使用规范

#### 基本信息
```
文件位置：
- public/logo.svg (主 Logo)
- public/logo-512.png (PWA 图标)
- public/logo-192.png (PWA 图标)
- public/logo-32.png (Favicon)
- public/favicon.ico (兼容性)

设计特点：
- 水墨风格
- 黑色主体 + 朱砂红点缀
- 圆形构图
- 人物举拳向上（象征突破、证道）
```

#### 使用场景

**✅ 白色背景（推荐）**
```tsx
// 直接使用原版 Logo
<div className="bg-white">
  <Image src="/logo.svg" alt="证道" width={48} height={48} />
</div>

// 纸白背景（品牌色）
<div className="bg-[#FFFEF2]">
  <Image src="/logo.svg" alt="证道" width={48} height={48} />
</div>
```

**✅ 深色背景**
```tsx
// 使用原版 Logo
<div className="bg-black">
  <Image src="/logo.svg" alt="证道" width={48} height={48} />
</div>
```

**✅ 打印材料**
```css
/* 确保打印时颜色准确 */
@media print {
  .logo {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

**❌ 禁止事项**
```
1. 不要改变 Logo 颜色
2. 不要拉伸或压缩（保持 1:1 比例）
3. 不要在复杂背景上使用
4. 不要添加阴影或特效
5. 不要旋转（除非设计需要）
6. 不要与其他图形混合
```

#### 尺寸规范
```
网页使用：
- Favicon: 16x16, 32x32
- Header: 48x48
- Hero Section: 120x120, 200x200
- PWA Icon: 192x192, 512x512

打印使用：
- 名片: 20mm x 20mm
- 宣传单: 60mm x 60mm
- 海报: 100mm x 100mm

留白规范：
- 最小留白 = Logo 高度 × 20%
```

### 品牌色彩

```css
/* 主色 */
--logo-black: #000000;      /* 墨黑 - Logo 主体 */
--logo-red: #D43628;        /* 朱砂红 - Logo 点缀、强调、CTA */
--bg-paper: #FFFEF2;        /* 纸白 - 背景 */

/* 辅助色 */
--gray-500: #999999;        /* 次要信息 */
--green-700: #2E7D32;       /* 成功状态 */
--yellow-700: #F57C00;      /* 警告状态 */

/* 使用场景 */
背景：#FFFEF2 (纸白)
文字：#000000 (墨黑)
强调：#D43628 (朱砂红)
按钮：#D43628 背景 + #FFFFFF 文字
链接：#000000 默认，#D43628 悬停
```

### 字体规范

```css
/* 中文 */
font-family: 'Source Han Sans', 'Noto Sans SC', sans-serif;
- 标题：Bold (700)
- 正文：Regular (400)
- 强调：Medium (500)

/* 英文 */
font-family: 'Georgia', serif;
- 标题：Bold
- 正文：Regular

/* 数字（衬线体） */
font-family: 'Georgia', serif;
- 用于金额、统计数据等
```

### 设计原则

```
1. 无圆角设计
   border-radius: 0;

2. 留白美学
   充足的空间，不拥挤

3. 印章元素
   朱砂红圆形印章作为视觉点缀

4. 手机端优先
   max-width: 430px
   响应式设计
```

---

## 💻 技术决策

### 1. 区块链网络选择

**✅ 决策：使用 BNB Chain Testnet**

```
为什么选择 BNB Chain？
✅ 低 Gas 费（即使主网也便宜）
✅ 快速确认（3 秒出块）
✅ EVM 兼容（Solidity 合约）
✅ 生态成熟（工具完善）
✅ 中文社区活跃
✅ 现有合约是 Solidity（无需重写）

vs Solana：
❌ 开发复杂度更高（Rust）
❌ 工具链不如 EVM 成熟
❌ 需要重写所有合约
```

**测试网配置**

```javascript
// lib/wagmi-config.ts
import { bscTestnet } from 'wagmi/chains'

export const config = createConfig({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http()
  }
})

// 网络信息
{
  chainId: 97,
  name: 'BNB Smart Chain Testnet',
  rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  blockExplorer: 'https://testnet.bscscan.com',
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18
  }
}
```

**获取测试币**

```
官方水龙头：
https://testnet.bnbchain.org/faucet-smart

每次可获取：0.5 - 1 tBNB
足够测试使用

注意事项：
- 测试币完全免费
- 不要用真币测试
- 测试网数据可能被清空
- 主网上线前需要重新部署
```

### 2. 技术栈确认

**前端**
```typescript
核心：
- Next.js 15
- React 18
- TypeScript

UI：
- Tailwind CSS
- Framer Motion (动画)
- Recharts (图表)

区块链：
- Wagmi 2.x
- Viem
- RainbowKit (钱包连接)

状态管理：
- Zustand / Jotai (轻量级)
```

**后端**
```typescript
API：
- Next.js API Routes

AI：
- OpenAI GPT-4 (文本理解)
- OpenAI Whisper (语音转文字)
- 智谱 GLM-4V (图片识别，备选)

存储：
- LocalStorage (临时)
- IndexedDB (加密存储)
- Google Sheets API (云同步)

加密：
- crypto-js (AES-256)
- PBKDF2 (密钥派生)
```

**区块链**
```solidity
网络：
- BNB Chain Testnet (开发/测试)
- BNB Chain Mainnet (生产，未来)

合约：
- Solidity 0.8.20+
- Foundry (开发工具)
- OpenZeppelin (标准库)

合约文件：
- contracts/ZhengDao.sol (V1)
- contracts/ZhengDaoV2.sol (V2)
- contracts/ZhengDaoNFT.sol (NFT，未来)
```

### 3. 开发工具

```bash
包管理：
- npm / pnpm

代码质量：
- ESLint
- Prettier
- TypeScript

测试：
- Jest (单元测试)
- Playwright (E2E 测试)
- Foundry (合约测试)

部署：
- Vercel (前端)
- Foundry (合约)

版本控制：
- Git
- GitHub
```

---

## 📐 开发规范

### 1. 代码风格

**TypeScript**
```typescript
// 使用 interface 而非 type（除非需要 union）
interface User {
  address: string
  balance: bigint
  checkInCount: number
}

// 使用 const 而非 let
const user = await getUser(address)

// 使用可选链
const balance = user?.balance ?? 0n

// 使用模板字符串
const message = `用户 ${address} 打卡成功`
```

**React/Next.js**
```tsx
// 使用函数组件
export function MyComponent() {
  return <div>...</div>
}

// 使用 TypeScript props
interface MyComponentProps {
  title: string
  count?: number
}

export function MyComponent({ title, count = 0 }: MyComponentProps) {
  return <div>{title}: {count}</div>
}

// 使用 'use client' 标记客户端组件
'use client'

export function ClientComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Tailwind CSS**
```tsx
// 使用 Tailwind 类名
<div className="bg-white p-4 rounded-none border border-black">
  <h1 className="text-2xl font-bold text-black mb-4">标题</h1>
  <p className="text-gray-600">内容</p>
</div>

// 使用品牌色
<button className="bg-[#D43628] text-white px-4 py-2 hover:bg-[#B82E20]">
  按钮
</button>

// 响应式设计
<div className="w-full md:w-1/2 lg:w-1/3">
  内容
</div>
```

### 2. 文件组织

```
项目结构：
app/                    # Next.js 应用
├── api/               # API 路由
├── (routes)/          # 页面路由
├── layout.tsx         # 根布局
├── page.tsx           # 首页
└── globals.css        # 全局样式

components/            # 可复用组件
├── ui/               # 基础 UI 组件
├── features/         # 功能组件
└── layout/           # 布局组件

lib/                   # 工具函数
├── utils.ts          # 通用工具
├── wagmi-config.ts   # Wagmi 配置
└── constants.ts      # 常量

contracts/             # 智能合约
├── ZhengDao.sol      # V1 合约
└── ZhengDaoV2.sol    # V2 合约

public/                # 静态资源
├── logo.svg          # Logo
└── manifest.json     # PWA 配置
```

### 3. 命名规范

```typescript
// 组件：PascalCase
export function UserProfile() {}

// 函数：camelCase
function getUserBalance() {}

// 常量：UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3

// 类型/接口：PascalCase
interface UserData {}
type Status = 'active' | 'inactive'

// 文件名：
// - 组件：PascalCase (UserProfile.tsx)
// - 工具：camelCase (utils.ts)
// - 页面：lowercase (page.tsx)
```

### 4. Git 提交规范

```bash
# 格式：<type>(<scope>): <subject>

# 类型：
feat:     新功能
fix:      修复 Bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
test:     测试
chore:    构建/工具

# 示例：
git commit -m "feat(onboarding): 添加人生蓝图引导流程"
git commit -m "fix(checkin): 修复打卡按钮点击无响应"
git commit -m "docs(readme): 更新安装说明"
```

---

## ✅ 待办事项

### 立即行动（本周）

```
□ 保存 Logo 文件到 public/ 目录
  - logo.svg
  - logo-512.png
  - logo-192.png
  - logo-32.png
  - favicon.ico

□ 更新 manifest.json
  - 修改 name 和 description
  - 更新 theme_color 为 #D43628
  - 更新 background_color 为 #FFFEF2
  - 更新 icons 路径

□ 配置 BNB Chain Testnet
  - 更新 wagmi-config.ts
  - 获取测试币
  - 测试钱包连接

□ 开始 Phase 1 开发
  - Week 1: 人生蓝图 + 每日复盘
  - Week 2: Yes/No 选择 + 多挑战池
  - Week 3: 周/月报告
  - Week 4: 集成测试 + Demo
```

### 短期目标（1 个月）

```
□ 完成 Phase 1 MVP
  - 人生蓝图 Onboarding
  - 每日复盘（文字版）
  - Yes/No 选择界面
  - 3 个挑战池
  - 周/月报告
  - 测试网部署

□ 内部测试
  - 完整流程测试
  - Bug 修复
  - 性能优化

□ 准备 Demo
  - 录制演示视频
  - 编写使用文档
  - 准备 Pitch Deck
```

### 中期目标（3 个月）

```
□ 完成 Phase 2 完整功能
  - 语音输入
  - 加密存储
  - Google Sheets 同步
  - V2.0 积分系统
  - 等级系统

□ 小范围 Beta 测试
  - 邀请 50-100 用户
  - 收集反馈
  - 快速迭代

□ 准备正式发布
  - 安全审计
  - 性能优化
  - 文档完善
```

---

## ❓ 常见问题

### Q1: 为什么不用真币？

```
A: 使用测试网的原因：
1. 完全免费，无风险
2. 可以快速迭代测试
3. 适合早期产品验证
4. 避免监管风险
5. 降低用户心理负担

何时切换主网：
- Phase 3 完成后
- 用户测试通过
- 安全审计完成
- 准备正式发布
```

### Q2: 为什么选 BNB Chain 而不是 Solana？

```
A: BNB Chain 的优势：
1. 现有合约是 Solidity（无需重写）
2. 开发速度更快
3. 工具链更成熟
4. 社区更活跃
5. Gas 费已经很低

未来可以考虑 Solana：
- BNB 版本稳定后
- 有额外开发资源
- 需要更低的 Gas 费
```

### Q3: Logo 可以改颜色吗？

```
A: 不建议改变 Logo 颜色

原因：
1. 品牌一致性
2. 识别度
3. 文化内涵（水墨风格）

如果必须改：
- 只能改背景色
- 不能改 Logo 本身的颜色
- 确保对比度足够
```

### Q4: 如何获取测试币？

```
A: 两种方法：

方法 1：官方水龙头
https://testnet.bnbchain.org/faucet-smart
- 每次 0.5-1 tBNB
- 需要 Twitter 验证

方法 2：社区水龙头
https://testnet.binance.org/faucet-smart
- 每次 0.1 tBNB
- 无需验证

注意：
- 测试币完全免费
- 每 24 小时可领取一次
- 足够测试使用
```

### Q5: 如何部署合约到测试网？

```bash
# 使用 Foundry 部署
forge create --rpc-url https://data-seed-prebsc-1-s1.binance.org:8545/ \
  --private-key YOUR_PRIVATE_KEY \
  contracts/ZhengDao.sol:ZhengDao

# 验证合约
forge verify-contract \
  --chain-id 97 \
  --compiler-version v0.8.20 \
  CONTRACT_ADDRESS \
  contracts/ZhengDao.sol:ZhengDao \
  --etherscan-api-key YOUR_BSCSCAN_API_KEY

# 注意：
# - 不要泄露私钥
# - 使用测试账户
# - 记录合约地址
```

### Q6: 如何处理 AI API 成本？

```
A: 成本优化策略：

1. 使用更便宜的模型
   - GPT-3.5-turbo（便宜 10 倍）
   - 只在必要时用 GPT-4

2. 缓存常见问题
   - 缓存 AI 响应
   - 减少重复调用

3. 限制调用频率
   - 每用户每天限制次数
   - 防止滥用

4. 考虑自部署
   - 使用开源模型
   - 自己部署服务
```

### Q7: 如何保证数据安全？

```
A: 多层安全措施：

1. 端到端加密
   - AES-256 加密
   - 只有用户可解密

2. 密钥管理
   - PBKDF2 派生密钥
   - 生物识别保护

3. 数据分级
   - 敏感数据：本地加密
   - 统计数据：可上链
   - 内容哈希：验证完整性

4. 备份机制
   - 本地备份
   - Google Drive 备份
   - 导出功能
```

---

## 📞 联系方式

如有问题或需要帮助，请参考以下文档：

```
核心文档：
- README.md - 项目总览
- IMPLEMENTATION_ROADMAP.md - 实施路线图
- FEATURE_MAPPING.md - 功能对照表
- LOGO_USAGE_GUIDE.md - Logo 使用指南

设计文档：
- VERSION_COMPARISON.md - 版本对比
- V3_REFLECTION_DESIGN.md - V3 设计
- TOKENOMICS_DESIGN.md - 经济模型

营销文档：
- MARKETING_STRATEGY.md - 营销策略
```

---

<div align="center">

**从 0 到 1，一步一个脚印**

**想清楚 → 敢下注 → 做得到 → 想得深 → 看得远**

**修身 · 齐家 · 证道**

</div>
