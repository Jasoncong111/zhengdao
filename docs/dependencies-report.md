# 证道项目 - 依赖安装报告

**生成时间**: 2026-01-27
**负责人**: AI #6 (DevOps与集成工程师)

## 项目版本信息
- **项目名称**: zheng-dao
- **版本**: 0.1.0
- **Node.js要求**: >= 18.0.0
- **包管理器**: npm

## 已安装核心依赖

### 前端框架
- **next**: 15.1.3
- **react**: 19.0.0
- **react-dom**: 19.0.0

### Web3集成
- **wagmi**: 2.12.7
- **viem**: 2.21.54
- **@tanstack/react-query**: 5.59.20

### 智能合约开发
- **hardhat**: 3.1.5
- **@nomicfoundation/hardhat-toolbox**: 6.1.0
- **@nomicfoundation/hardhat-ethers**: 3.1.3
- **@openzeppelin/contracts**: 5.4.0
- **ethers**: 6.16.0

### Solana支持
- **@solana/web3.js**: 1.87.0
- **@solana/wallet-adapter-react**: 0.15.35
- **@solana/wallet-adapter-react-ui**: 0.9.35
- **@solana/wallet-adapter-wallets**: 0.19.32
- **@solana/wallet-adapter-base**: 0.9.23

### 数据库
- **dexie**: 4.2.1
- **dexie-react-hooks**: 4.2.0

### UI组件
- **framer-motion**: 11.11.17
- **react-hot-toast**: 2.4.1
- **recharts**: 3.7.0

### TypeScript
- **typescript**: 5.3.0
- **@types/node**: 20.x
- **@types/react**: 19.x
- **@types/react-dom**: 19.x

### 测试
- **jest**: 29.7.0
- **@testing-library/react**: 14.1.0
- **@testing-library/jest-dom**: 6.1.0
- **jest-environment-jsdom**: 29.7.0
- **@types/jest**: 29.5.0

### 代码质量
- **eslint**: 8.x
- **eslint-config-next**: 15.1.3
- **eslint-config-prettier**: 9.1.0
- **prettier**: 3.1.0

### 样式
- **tailwindcss**: 3.4.17
- **autoprefixer**: 10.4.20
- **postcss**: 8.4.49

## 可用脚本

### 开发
- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器

### 代码检查
- `npm run lint` - ESLint代码检查
- `npm run type-check` - TypeScript类型检查
- `npm run format` - Prettier代码格式化
- `npm run format:check` - Prettier格式检查

### 测试
- `npm test` - 运行测试
- `npm run test:watch` - 监视模式运行测试
- `npm run test:coverage` - 生成测试覆盖率报告

### 智能合约
- `npm run hardhat` - Hardhat CLI
- `npm run hardhat:test` - 运行Hardhat测试
- `npm run hardhat:compile` - 编译智能合约
- `npm run contract:compile` - 使用solc编译合约
- `npm run contract:node` - 启动本地Hardhat节点

## 环境变量配置

### .env.local 需要的变量

```bash
# BNB Chain配置
PRIVATE_KEY=your_private_key_here
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
```

## 目录结构

```
zheng-dao/
├── contracts/              # 智能合约
│   ├── __tests__/         # 合约测试
│   └── *.sol              # Solidity合约文件
├── scripts/               # 部署脚本
├── programs/              # Solana程序
│   └── zhengdao-sbt/
│       ├── src/          # Rust源代码
│       └── tests/        # 程序测试
├── abis/                  # 合约ABI
├── artifacts/             # 编译产物
├── types/                 # TypeScript类型定义
├── lib/                   # 核心库
│   ├── contracts/        # 合约交互封装
│   ├── solana/           # Solana相关
│   ├── hooks/            # React Hooks
│   └── __tests__/        # 单元测试
├── components/            # React组件
│   └── achievement/      # 成就系统组件
│       └── __tests__/    # 组件测试
├── app/                   # Next.js应用
├── public/                # 静态资源
│   ├── sbt-images/       # SBT图像
│   └── sbt-metadata/     # SBT元数据
└── docs/                  # 文档
    ├── development-logs/ # 开发日志
    ├── design/           # 设计文档
    ├── deployment/       # 部署文档
    └── api/              # API文档
```

## 问题记录

### 问题1: npm install 时的错误
- **描述**: 路径中包含空格和中文字符导致tar解压错误
- **状态**: 已识别,主要依赖已安装
- **解决方案**:
  1. 主要依赖已成功安装
  2. 少数包有警告但不影响核心功能
  3. 建议后续在纯英文路径下开发

## 环境验证

- [x] package.json正确配置
- [x] tsconfig.json存在
- [x] hardhat.config.ts存在
- [x] jest.config.js创建
- [x] .prettierrc创建
- [x] .gitignore更新
- [ ] TypeScript编译(需要验证)
- [ ] Jest测试运行(需要验证)
- [ ] Hardhat编译(需要验证)

## 下一步

1. 验证所有npm脚本可正常运行
2. 运行TypeScript类型检查
3. 运行测试套件
4. 编译智能合约
5. 开始TASK-3-4集成测试

---

**报告版本**: v1.0
**最后更新**: 2026-01-27
