# BNB Chain SBT 合约部署指南

## 📋 概述

本指南介绍如何将 `ZhengDaoSBT` 合约部署到 BNB Chain Testnet。

## 🎯 部署前准备

### 1. 环境要求

- Node.js >= 18.x
- npm 或 yarn
- Git

### 2. 安装依赖

```bash
cd /path/to/zhengdao-project
npm install --legacy-peer-deps
```

### 3. 配置环境变量

复制环境变量模板并填写配置：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填写以下信息：

```bash
# 部署者私钥（不要包含 0x 前缀）
# ⚠️ 警告: 仅用于测试网，不要在主网使用包含真实资金的钱包！
PRIVATE_KEY=your_private_key_here

# BNB Chain Testnet RPC URL
BNB_TESTNET_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/

# BscScan API Key (用于合约验证)
# 获取地址: https://testnet.bscscan.com/myapikey
BSCSCAN_API_KEY=your_bscscan_api_key_here
```

### 4. 获取私钥

从 MetaMask 导出私钥：

1. 打开 MetaMask 扩展
2. 点击账户 → 账户详情
3. 点击"导出私钥"
4. 输入密码后复制私钥
5. 粘贴到 `.env.local` 文件中（**不要**包含 `0x` 前缀）

### 5. 获取测试币

访问 BNB Chain Testnet 水龙头：

- **官方水龙头**: https://testnet.bnbchain.org/faucet-smart
- **备用水龙头**: https://testnet.bnbchain.org/faucet

获取至少 0.1 tBNB 用于部署合约。

## 🚀 部署步骤

### Step 1: 编译合约

```bash
npx hardhat compile
```

预期输出：
```
Compiled 22 Solidity files successfully
```

### Step 2: 检查账户余额

```bash
npx hardhat run scripts/check-balance.ts --network bnbTestnet
```

确保账户余额 > 0.01 tBNB。

### Step 3: 部署合约

```bash
npx hardhat run scripts/deploy-bnb-sbt.ts --network bnbTestnet
```

预期输出：
```
🚀 开始部署 ZhengDaoSBT 合约到 BNB Chain Testnet...

📝 部署账户地址: 0x...
💰 账户余额: 1.0 BNB

📋 合约部署参数:
  - 合约名称: ZhengDaoSBT
  - Token 名称: ZhengDao Soulbound Token
  - Token 符号: ZDSBT
  - 基础 URI: https://your-domain.com/api/sbt-metadata/

⏳ 正在部署合约...
✅ 合约部署成功!
📍 合约地址: 0x...
🔗 BscScan: https://testnet.bscscan.com/address/0x...

📊 部署交易详情:
  - 交易 Hash: 0x...
  - Gas Used: xxxxxxx
  - Block Number: xxxxx

🧪 正在测试合约基本功能...
  - 当前总供应量: 0
  - Token 名称: ZhengDao Soulbound Token
  - Token 符号: ZDSBT
✅ 合约功能测试通过!

============================================================
🎉 部署完成!
============================================================
```

### Step 4: 验证合约

```bash
npx hardhat verify --network bnbTestnet <CONTRACT_ADDRESS> "ZhengDao Soulbound Token" "ZDSBT" "https://your-domain.com/api/sbt-metadata/"
```

将 `<CONTRACT_ADDRESS>` 替换为实际部署的合约地址。

预期输出：
```
Successfully submitted source code for contract
0x... to contract verification service.
```

等待几分钟后，访问 BscScan 链接，合约代码应该会显示为"已验证"。

### Step 5: 测试铸造 SBT

```bash
export ZHENGDAO_SBT_ADDRESS=<CONTRACT_ADDRESS>
npx hardhat run scripts/mint-test-sbt.ts --network bnbTestnet
```

预期输出：
```
🧪 开始测试铸造 ZhengDaoSBT...

📍 合约地址: 0x...
📝 部署账户: 0x...

📋 测试铸造参数:
  - 接收地址: 0x...
  - 等级: 1
  - 打卡天数: 7

⏳ 正在铸造 SBT...
✅ SBT 铸造成功!
📊 交易详情:
  - 交易 Hash: 0x...
  - Gas Used: xxxxxx

🎖️  SBT 详情:
  - Token ID: 1
  - 等级: 1
  - 打卡天数: 7
  - 铸造时间: 2026-01-27 15:30:00
  - 元数据 URI: https://your-domain.com/api/sbt-metadata/1.json

🧪 测试 SBT 不可转移特性...
✅ SBT 转移已被正确阻止

============================================================
🎉 测试完成!
============================================================
```

## 📝 部署后配置

### 1. 更新前端环境变量

编辑 `.env.local` 文件，添加合约地址：

```bash
NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=<CONTRACT_ADDRESS>
```

### 2. 导出合约 ABI

合约 ABI 已自动生成，位置：

```
artifacts/contracts/ZhengDaoSBT.sol/ZhengDaoSBT.json
```

前端需要使用 ABI 中的 `abi` 字段。

### 3. 复制 ABI 到项目目录（可选）

```bash
cp artifacts/contracts/ZhengDaoSBT.sol/ZhengDaoSBT.json abis/ZhengDaoSBT.json
```

## 🔍 验证清单

部署完成后，请检查以下项目：

- [ ] 合约在 BscScan 上可见
- [ ] 合约代码已验证
- [ ] 可以正常调用 `name()` 和 `symbol()` 函数
- [ ] 可以成功铸造 SBT
- [ ] SBT 无法转移（测试 transferFrom 会失败）
- [ ] 元数据 URI 正确设置
- [ ] 事件日志正确记录

## 📊 合约信息记录

部署完成后，请记录以下信息：

```
合约名称: ZhengDaoSBT
Token 名称: ZhengDao Soulbound Token
Token 符号: ZDSBT
合约地址: 0x...
部署网络: BNB Chain Testnet (Chain ID: 97)
部署时间: YYYY-MM-DD HH:MM:SS
部署交易 Hash: 0x...
Gas 使用: xxxxxx
BscScan 链接: https://testnet.bscscan.com/address/0x...
```

## 🛠️ 常见问题

### Q1: 部署失败，提示余额不足

**解决方案**: 访问水龙头获取更多测试币：
https://testnet.bnbchain.org/faucet-smart

### Q2: 合约验证失败

**解决方案**:
1. 确保构造函数参数正确
2. 等待几分钟后再试
3. 检查 BSCSCAN_API_KEY 是否正确配置

### Q3: 无法铸造 SBT

**解决方案**:
1. 检查部署账户是否为合约 owner
2. 确认地址是否已经拥有该等级的 SBT
3. 查看错误日志确认具体原因

### Q4: SBT 可以被转移

**解决方案**: 这不应该发生。请检查：
1. 合约是否正确部署
2. `_update` 函数是否正确重写
3. 是否使用了正确的合约地址

## 📚 相关资源

- **BNB Chain 文档**: https://docs.bnbchain.org/
- **Hardhat 文档**: https://hardhat.org/docs
- **OpenZeppelin 合约**: https://docs.openzeppelin.com/contracts/
- **BscScan Testnet**: https://testnet.bscscan.com/

## ⚠️ 安全注意事项

1. **永远不要**提交包含私钥的 `.env.local` 文件到 Git
2. 测试网私钥**不要**在主网使用
3. 主网部署前必须进行完整的安全审计
4. 部署到主网前，建议先在测试网充分测试

## 🎯 下一步

部署完成后，可以：

1. 开发前端 SBT 申领页面
2. 准备 SBT 元数据和图像
3. 实现成就系统集成
4. 部署到主网（经过充分测试后）

---

**最后更新**: 2026-01-27
**维护者**: AI #1 (BNB Chain智能合约工程师)
