# NPM依赖问题修复指南

## 问题描述

BNB SBT合约开发完成后，遇到了npm依赖冲突问题：
- Hardhat 3.x与@nomicfoundation/hardhat-toolbox存在peer dependency冲突
- 部分包安装失败，导致无法编译和测试合约

## 解决方案

### 方案1: 使用兼容的版本组合（推荐）

```bash
# 1. 清理现有安装
rm -rf node_modules package-lock.json

# 2. 安装兼容版本的Hardhat和工具箱
npm install --save-dev hardhat@2.19.5
npm install --save-dev @nomicfoundation/hardhat-toolbox@^4.0.0
npm install --save-dev @openzeppelin/contracts
npm install --save-dev ethers@^6

# 3. 验证安装
npx hardhat --version
npx hardhat compile
```

### 方案2: 使用Yarn代替npm

```bash
# 1. 清理npm安装
rm -rf node_modules package-lock.json

# 2. 安装yarn（如果还没有）
npm install -g yarn

# 3. 使用yarn安装依赖
yarn install
yarn add -D hardhat@2.22.17 @nomicfoundation/hardhat-toolbox@^4.0.0

# 4. 运行Hardhat
yarn hardhat compile
yarn hardhat test
```

### 方案3: 使用legacy-peer-deps（临时方案）

```bash
# 强制安装，忽略peer dependency警告
npm install --save-dev hardhat@2.22.17 @nomicfoundation/hardhat-toolbox --legacy-peer-deps

# 编译和测试
npx hardhat compile
npx hardhat test
```

### 方案4: 使用Docker环境（隔离依赖问题）

创建`Dfile.dev`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "hardhat", "test"]
```

运行：
```bash
docker build -f Dockerfile.dev -t zhengdao-contracts .
docker run -v $(pwd):/app zhengdao-contracts
```

## 验证步骤

依赖修复后，按以下步骤验证：

### 1. 编译合约
```bash
npx hardhat compile
```
预期输出：
```
Compiled 1 Solidity file successfully
```

### 2. 运行测试
```bash
npx hardhat test
```
预期输出：所有测试通过，~40个测试用例

### 3. 测试覆盖率
```bash
npx hardhat coverage
```
预期输出：覆盖率 > 90%

### 4. Gas报告
```bash
npx hardhat test --reporter gas-reporter
```

## 更新package.json scripts

建议添加以下scripts到`package.json`：

```json
{
  "scripts": {
    "compile": "hardhat compile",
    "test": "hardhat test",
    "test:coverage": "hardhat coverage",
    "test:gas": "hardhat test --reporter gas-reporter",
    "deploy:testnet": "hardhat run scripts/deploy.ts --network bnbTestnet",
    "verify": "hardhat verify --network bnbTestnet"
  }
}
```

## 环境变量配置

创建`.env`文件（不要提交到Git）：

```bash
# BNB Testnet
BNB_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key_here

# BNB Mainnet
BNB_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/
```

## 常见问题

### Q1: "Cannot find module '@openzeppelin/contracts'"
**A**: 运行 `npm install @openzeppelin/contracts`

### Q2: "TypeError: Cannot read property 'compile' of undefined"
**A**: 确保hardhat版本正确，重新安装 `npm install hardhat@2.22.17`

### Q3: "Error: Cannot find module 'typescript'"
**A**: 安装TypeScript `npm install -D typescript @types/node`

### Q4: "EMFILE: too many open files"
**A**: 增加系统文件描述符限制（macOS/Linux）:
```bash
ulimit -n 4096
```

## 推荐工作流程

1. **开发阶段**:
   ```bash
   npm run compile  # 编译合约
   npm run test     # 运行测试
   ```

2. **部署到测试网**:
   ```bash
   npm run deploy:testnet
   npm run verify <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
   ```

3. **持续集成**:
   - 使用GitHub Actions自动运行测试
   - 配置Slither进行静态分析

## 参考资料

- [Hardhat文档](https://hardhat.org/docs)
- [OpenZeppelin合约](https://docs.openzeppelin.com/contracts)
- [BNB Chain文档](https://docs.bnbchain.org/)

## 下一步

依赖修复后，继续：
- **TASK-1-2**: 运行测试，生成覆盖率报告
- **TASK-1-3**: 部署到BNB Testnet

---

**创建时间**: 2026-01-27
**版本**: v1.0
