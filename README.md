# 证道 - 双链SBT成就系统

基于BNB Chain和Solana的去中心化成就系统,通过吾日三省吾身获得Soulbound Token(SBT)。

> **📊 最新状态**: 查看 [最新项目状态报告](./LATEST-PROJECT-STATUS-REPORT.md) 了解项目整体进度
>
> **📋 任务协调**: 查看 [CTO任务管理中心](./CTO-TASK-MANAGER.md) 了解AI团队任务分配
>
> **🚀 快速启动**: 查看 [AI任务分配清单](./AI-TASK-ALLOCATION.md) 了解各AI的具体任务
>
> **📖 中文手册**: 查看 [用户使用手册](./docs/用户使用手册.md) 获取完整使用指南

## 项目概述

证道是一个创新的自省式成就系统,用户通过每日反思和复盘来累积修行天数,达到不同等级后可以铸造不可转移的SBT作为修行证明。

### 核心特性

- ✅ **双链支持**: BNB Chain和Solana
- ✅ **6个等级**: 从见素到抱一的修行境界
- ✅ **SBT系统**: 不可转移的灵魂绑定代币
- ✅ **水墨风格**: 独特的东方美学设计
- ✅ **AI复盘**: 集成DeepSeek AI进行智能反思

## 技术栈

### 前端
- **框架**: Next.js 15.1
- **UI库**: React 19
- **样式**: TailwindCSS
- **动画**: Framer Motion
- **状态管理**: TanStack Query
- **数据库**: Dexie(IndexedDB)

### Web3
- **BNB Chain**: Wagmi v2 + Viem
- **Solana**: @solana/web3.js + Wallet Adapter
- **智能合约**: Solidity 0.8.20 (BNB), Rust (Solana)
- **开发框架**: Hardhat (BNB), Anchor (Solana)

### 开发工具
- **语言**: TypeScript 5.3
- **测试**: Jest + Testing Library
- **代码规范**: ESLint + Prettier
- **合约**: OpenZeppelin

## 开发环境设置

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### 安装依赖

```bash
# 克隆项目
git clone <repository-url>
cd 黑客松项目-证道

# 安装依赖
npm install

# 或者使用legacy peer deps(如果遇到依赖冲突)
npm install --legacy-peer-deps
```

### 环境变量配置

复制环境变量模板:

```bash
cp .env.local.example .env.local
```

编辑`.env.local`文件,填写必要的配置:

```bash
# BNB Chain配置
PRIVATE_KEY=your_private_key_here  # 仅开发环境使用
BNB_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
BNB_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
BSCSCAN_API_KEY=your_bscscan_api_key

# 合约地址(部署后添加)
NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=

# IPFS配置(可选)
NEXT_PUBLIC_USE_IPFS=false
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
PINATA_API_KEY=
PINATA_SECRET_API_KEY=

# DeepSeek API(用于AI复盘)
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
```

### 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# 编译智能合约
npm run hardhat:compile

# 运行合约测试
npm run hardhat:test
```

## 项目结构

```
zheng-dao/
├── app/                    # Next.js应用目录
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 布局组件
├── components/            # React组件
│   ├── achievement/       # 成就系统组件
│   ├── CheckInRing.tsx   # 打卡环
│   ├── ReflectionFlow.tsx # 复盘流程
│   └── ...
├── lib/                   # 核心库
│   ├── achievement-system.ts      # 成就系统核心
│   ├── achievement-service.ts     # 成就服务
│   ├── chain-manager.ts           # 链管理器
│   ├── db.ts                      # 数据库
│   └── contracts/                 # 合约交互
├── contracts/            # 智能合约
│   └── ZhengDao.sol    # BNB Chain SBT合约
├── programs/            # Solana程序
│   └── zhengdao-sbt/   # Anchor程序
├── public/             # 静态资源
│   ├── sbt-images/    # SBT图像
│   └── sbt-metadata/  # SBT元数据
├── docs/               # 文档
│   ├── dependencies-report.md
│   └── development-logs/
└── hardhat.config.ts   # Hardhat配置
```

## 成就系统

### 6个修行境界

1. **见素**(Level 1) - 7天: 见素抱朴,少私寡欲
2. **守一**(Level 2) - 30天: 载营魄抱一,能无离乎
3. **玄德**(Level 3) - 90天: 生而不有,为而不恃
4. **知常**(Level 4) - 180天: 复命曰常,知常曰明
5. **无为**(Level 5) - 365天: 为无为,事无事
6. **抱一**(Level 6) - 1000天: 抱一为天下式

### 每日三问

用户每天需要回答三个问题:
1. 今日做了什么值得记录的事?
2. 有什么需要改进的地方?
3. 明日的计划是什么?

AI会基于回答提供智能分析和建议。

## SBT系统

### BNB Chain SBT

- **标准**: ERC-721
- **特性**: 不可转移(Soulbound)
- **元数据**: 链上存储
- **网络**: BNB Chain Testnet

### Solana SBT

- **标准**: SPL Token
- **特性**: 不可转移
- **元数据**: Metaplex标准
- **网络**: Solana Devnet

## 部署

### BNB Chain部署

```bash
# 编译合约
npm run hardhat:compile

# 部署到测试网
npm run hardhat:deploy --network bnbTestnet

# 验证合约
npx hardhat verify --network bnbTestnet <CONTRACT_ADDRESS>
```

### Solana部署

```bash
# 配置Solana CLI
solana config set --url devnet
solana config set --keypair <your-keypair>

# 构建程序
anchor build

# 部署程序
anchor deploy

# 升级程序(如需要)
anchor upgrade <program_id> --program-id zhengdao-sbt
```

## 测试

```bash
# 前端测试
npm test

# 智能合约测试
npm run hardhat:test

# 集成测试
npm run test:coverage
```

## 贡献指南

1. Fork项目
2. 创建功能分支(`git checkout -b feature/AmazingFeature`)
3. 提交更改(`git commit -m 'feat: 添加某功能'`)
4. 推送到分支(`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 提交信息规范

使用Conventional Commits格式:
- `feat:` 新功能
- `fix:` Bug修复
- `docs:` 文档更新
- `style:` 代码格式
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具

## 开发路线图

- [x] V1.0 - MVP完成
- [x] V2.0 - 数据库持久化
- [x] V3.0 - AI复盘系统
- [ ] V4.0 - 双链SBT实现(进行中)
  - [ ] TASK-1-1 到 TASK-1-12: BNB Chain实现
  - [ ] TASK-2-1 到 TASK-2-9: Solana实现
  - [ ] TASK-3-1 到 TASK-3-6: 集成与打磨

## 许可证

MIT License

## 联系方式

- 项目主页: [GitHub Repository]
- 问题反馈: [Issues]

---

**最后更新**: 2026-01-27
**维护者**: 证道开发团队
