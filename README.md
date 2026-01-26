# 证道 (ZhengDao) - 区块链打卡激励系统

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-red.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Network](https://img.shields.io/badge/network-BNB%20Chain-yellow.svg)

**修身 · 齐家 · 证道**

一个结合中国传统文化与现代 DeFi 机制的创新型打卡激励系统

[演示地址](#) | [文档](#文档) | [白皮书](#) | [社区](#社区)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [核心特性](#核心特性)
- [技术架构](#技术架构)
- [经济模型](#经济模型)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [路线图](#路线图)
- [贡献指南](#贡献指南)
- [社区](#社区)
- [许可证](#许可证)

---

## 🎯 项目简介

**证道 (ZhengDao)** 是一个创新的区块链打卡激励系统，旨在通过经济激励帮助用户养成良好习惯。项目结合了：

- 🏛️ **中国传统文化** - 修身、齐家、证道的哲学理念
- 💰 **DeFi 机制** - 双池经济模型、复利收益、PVP 机制
- 🎮 **游戏化设计** - 等级系统、积分系统、任务系统
- 🤖 **AI 验证** - 智谱 GLM-4V 图片识别技术

### 为什么选择证道？

1. **可持续性** - 双池机制保证长期运营
2. **公平性** - 防止一家独大，保护新用户
3. **激励多样化** - 短期奖励 + 长期积分
4. **用户粘性** - 游戏化设计增加趣味性

---

## ✨ 核心特性

### 1. 双池经济模型 🏊

#### 奖金池 (Reward Pool)
- **用途：** 短期激励，每日瓜分
- **来源：** 存款 2% + PVP 惩罚 50% + 手续费 30%
- **分配：** 按权重分配给当日打卡用户

#### 积分池 (Points Pool)
- **用途：** 长期激励，积分兑换
- **来源：** 存款 3% + PVP 惩罚 50% + 手续费 70%
- **用途：** 兑换 BNB、Token、NFT、特权

### 2. 积分系统 🎯

| 行为 | 基础积分 | 加成规则 |
|------|---------|---------|
| 每日打卡 | 100 | 连续天数 × 10 |
| 邀请好友 | 500 | 好友首次打卡 +200 |
| 完成周任务 | 500 | - |
| 完成月任务 | 2000 | - |

### 3. 等级系统 ⭐

| 等级 | 所需积分 | 称号 | 奖金加成 |
|------|---------|------|---------|
| 1 | 0 | 初学者 | 0% |
| 2 | 1,000 | 修行者 | +5% |
| 3 | 5,000 | 证道者 | +10% |
| 4 | 10,000 | 宗师 | +15% |
| 5 | 50,000 | 圣者 | +20% |
| 6 | 100,000 | 仙人 | +30% |

### 4. 防垄断机制 🛡️

- **递减收益** - 打卡次数越多，单次收益递减
- **新人保护** - 前 30 天享受特权
- **大户限制** - 占比 > 5% 触发限制
- **积分衰减** - 不活跃会减少积分
- **动态难度** - 根据全网打卡率调整

### 5. PVP 机制 ⚔️

- 超过 48 小时未打卡触发惩罚
- 扣除本金 10%
- 50% 进入奖金池，50% 进入积分池
- 活跃用户瓜分惩罚金额

### 6. AI 验证 🤖

- 使用智谱 GLM-4V 验证打卡图片
- 识别健身、读书等场景
- 防止作弊行为

---

## 🏗️ 技术架构

### 技术栈

```
前端
├── Next.js 15          # React 框架
├── TypeScript          # 类型安全
├── Tailwind CSS        # 样式框架
├── Framer Motion       # 动画库
├── Recharts            # 图表库
└── Wagmi + Viem        # Web3 库

后端
├── Next.js API Routes  # API 服务
├── 智谱 GLM-4V         # AI 图片识别
└── IPFS                # NFT 存储

区块链
├── Solidity 0.8.20     # 智能合约
├── BNB Chain           # 主网络
├── Hardhat             # 开发工具
└── OpenZeppelin        # 合约库
```

### 系统架构图

```
┌─────────────────────────────────────────────────────┐
│                    用户界面层                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  首页    │  │ 分析页面 │  │ 商城页面 │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                    业务逻辑层                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 打卡逻辑 │  │ 积分系统 │  │ 兑换逻辑 │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                    数据层                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 智能合约 │  │ AI 验证  │  │ IPFS     │         │
│  └──────────┘  └──────────┘  └──────────┘         │
└─────────────────────────────────────────────────────┘
```

---

## 💰 经济模型

### 资金流转

```
用户存款 (100%)
    ↓
┌───┴────────────────────────────┐
│ 扣除手续费 5%                   │
├─────────────────────────────────┤
│ 净额 95% 分配：                 │
│ ├─→ 奖金池: 1.9% (2%)          │
│ ├─→ 积分池: 2.85% (3%)         │
│ └─→ 本金池: 90.25% (95%)       │
└─────────────────────────────────┘
```

### Token 经济

**ZD Token 总量：** 1,000,000,000 (10 亿)

| 分配 | 比例 | 数量 | 解锁规则 |
|------|------|------|---------|
| 积分兑换池 | 30% | 300M | 按需释放 |
| 流动性挖矿 | 25% | 250M | 4 年线性 |
| 团队 | 15% | 150M | 4 年线性 |
| 生态基金 | 15% | 150M | 按需使用 |
| 早期投资者 | 10% | 100M | 2 年线性 |
| 空投 | 5% | 50M | 一次性 |

### 收益示例

**用户 A (新用户，存款 1000 BNB)：**

```
第 1 天打卡:
- 奖金: 5 BNB (当日奖金池瓜分)
- 积分: 200 分 (100 基础 + 100 新手加成)
- 虚拟收益: 5 BNB (0.5%)

第 7 天打卡:
- 奖金: 5.5 BNB (连续打卡加成)
- 积分: 270 分 (100 基础 + 70 连续 + 100 新手)
- 累计积分: 1500 分 → 升级到 Lv.2 修行者

第 30 天:
- 累计奖金: ~150 BNB
- 累计积分: 6000 分 → Lv.3 证道者
- 总资产: 1150 BNB (+15%)
```

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- MetaMask 钱包

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-org/zhengdao.git
cd zhengdao

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local，填入你的配置

# 4. 启动开发服务器
npm run dev

# 5. 访问应用
open http://localhost:3000
```

### 环境变量配置

```env
# 智谱 AI API Key（用于图片验证）
ZHIPU_API_KEY=your_api_key_here

# 合约地址（部署后填入）
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# RPC URL（可选）
NEXT_PUBLIC_RPC_URL=https://bsc-testnet.public.blastapi.io
```

### 部署合约

```bash
# 1. 编译合约
npx hardhat compile

# 2. 部署到测试网
npx hardhat run scripts/deploy.js --network bscTestnet

# 3. 验证合约
npx hardhat verify --network bscTestnet DEPLOYED_CONTRACT_ADDRESS
```

---

## 📁 项目结构

```
zhengdao/
├── app/                        # Next.js 应用
│   ├── page.tsx               # 首页
│   ├── analytics/             # 分析页面
│   ├── api/verify/            # AI 验证 API
│   └── providers.tsx          # Wagmi Provider
├── components/                 # React 组件
│   ├── CheckInRing.tsx        # 打卡圆环
│   ├── HeroStatus.tsx         # 资产看板
│   ├── WeekGrid.tsx           # 七日记录
│   ├── MockCamera.tsx         # 模拟相机
│   ├── YieldChart.tsx         # 收益曲线
│   └── PVPDemo.tsx            # PVP 演示
├── contracts/                  # 智能合约
│   ├── ZhengDao.sol           # V1 合约
│   └── ZhengDaoV2.sol         # V2 合约（双池）
├── lib/                        # 工具库
│   ├── contractABI.ts         # 合约 ABI
│   └── wagmi-config.ts        # Wagmi 配置
├── public/                     # 静态资源
├── docs/                       # 文档
│   ├── TOKENOMICS_DESIGN.md   # 经济模型
│   ├── LAYOUT_DESIGN.md       # 页面布局
│   └── V2_UPGRADE_SUMMARY.md  # V2 升级总结
└── .kiro/specs/               # 项目规范
    └── zheng-dao/
        ├── requirements.md     # 需求文档
        ├── design.md          # 设计文档
        └── tasks.md           # 任务列表
```

---

## 🗺️ 路线图

### ✅ Phase 1: MVP (已完成)
- [x] 基础打卡功能
- [x] 智能合约 V1
- [x] 前端界面
- [x] AI 图片验证
- [x] PVP 机制

### ✅ Phase 2: V2 升级 (已完成)
- [x] 双池经济模型
- [x] 积分系统
- [x] 等级系统
- [x] 防垄断机制
- [x] 数据分析页面

### 🚧 Phase 3: Token 发行 (进行中)
- [ ] 发行 ZD Token
- [ ] 流动性挖矿
- [ ] Token 质押
- [ ] 治理功能

### 📅 Phase 4: NFT 生态 (计划中)
- [ ] 徽章 NFT
- [ ] NFT 市场
- [ ] NFT 质押
- [ ] 稀有 NFT 空投

### 📅 Phase 5: 游戏化 (计划中)
- [ ] 段位系统
- [ ] 公会系统
- [ ] 竞技场
- [ ] 赛季系统

### 📅 Phase 6: 生态扩展 (计划中)
- [ ] 多链部署（Solana、Polygon）
- [ ] 移动端 App
- [ ] 社交功能
- [ ] DAO 治理

---

## 📊 数据统计

### 当前数据（测试网）

- **总用户数：** 1,234
- **总锁仓量：** 50,234 BNB
- **总收益：** 2,567 BNB
- **活跃用户：** 856
- **今日打卡：** 432
- **平均收益：** +12.3%

### 关键指标

| 指标 | 数值 | 趋势 |
|------|------|------|
| DAU | 856 | ↑ 15% |
| MAU | 3,245 | ↑ 23% |
| 7日留存 | 68% | ↑ 5% |
| 30日留存 | 45% | ↑ 8% |
| 平均打卡天数 | 23 天 | ↑ 12% |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能
- 📝 文档改进
- 🎨 UI/UX 优化
- ⚡ 性能优化
- 🔒 安全增强

### 代码规范

- 使用 TypeScript
- 遵循 ESLint 规则
- 编写单元测试
- 添加代码注释

---

## 👥 团队

### 核心团队

- **创始人 & CEO** - [@your-name](https://github.com/your-name)
- **CTO** - [@cto-name](https://github.com/cto-name)
- **首席设计师** - [@designer-name](https://github.com/designer-name)

### 顾问

- **区块链顾问** - 某某某
- **经济学顾问** - 某某某
- **技术顾问** - 某某某

---

## 🌐 社区

### 加入我们

- **Discord:** [discord.gg/zhengdao](https://discord.gg/zhengdao)
- **Telegram:** [@zhengdao_official](https://t.me/zhengdao_official)
- **Twitter:** [@ZhengDao_io](https://twitter.com/ZhengDao_io)
- **Medium:** [medium.com/@zhengdao](https://medium.com/@zhengdao)

### 社区活动

- 每周 AMA
- 月度黑客松
- 季度空投活动
- 年度峰会

---

## 📄 文档

### 技术文档

- [快速启动指南](./QUICK_START.md)
- [经济模型设计](./TOKENOMICS_DESIGN.md)
- [页面布局设计](./LAYOUT_DESIGN.md)
- [V2 升级总结](./V2_UPGRADE_SUMMARY.md)
- [API 文档](./docs/API.md)
- [智能合约文档](./docs/CONTRACTS.md)

### 用户文档

- [用户指南](./docs/USER_GUIDE.md)
- [常见问题](./docs/FAQ.md)
- [视频教程](./docs/TUTORIALS.md)

---

## 🔒 安全

### 审计报告

- [ ] CertiK 审计（计划中）
- [ ] SlowMist 审计（计划中）
- [ ] PeckShield 审计（计划中）

### 安全措施

- 多签钱包管理
- 时间锁机制
- 紧急暂停功能
- Bug 赏金计划

### 报告漏洞

如果发现安全漏洞，请发送邮件至：security@zhengdao.io

---

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 🙏 致谢

感谢以下项目和团队的启发：

- [Uniswap](https://uniswap.org/) - DeFi 先驱
- [Compound](https://compound.finance/) - 借贷协议
- [Axie Infinity](https://axieinfinity.com/) - 游戏化设计
- [StepN](https://stepn.com/) - Move to Earn

---

## 📞 联系我们

- **官网：** [zhengdao.io](https://zhengdao.io)
- **邮箱：** contact@zhengdao.io
- **商务合作：** business@zhengdao.io
- **技术支持：** support@zhengdao.io

---

<div align="center">

**修身 · 齐家 · 证道**

Made with ❤️ by ZhengDao Team

[⬆ 回到顶部](#证道-zhengdao---区块链打卡激励系统)

</div>
