# TASK-03: BSC 测试网部署报告

**执行者**: AI #2
**日期**: 2026-01-29
**任务编号**: TASK-03
**任务名称**: BSC 测试网部署准备

---

## 执行摘要

✅ **任务状态**: 已完成
✅ **合约部署**: 成功部署到 BSC Testnet
✅ **功能测试**: SBT 铸造功能验证通过
✅ **环境配置**: 合约地址已更新

---

## 部署详情

### 合约信息

**合约名称**: ZhengDaoSBT
**网络**: BNB Chain Testnet (Chain ID: 97)
**合约地址**: `0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94`
**部署交易**: `0x2f249aebc7287aa31cde820df20e15f176076e6b67ab9b4511423662957f51f4`
**区块号**: 87182255
**Gas 消耗**: 1,893,635

**BscScan**: https://testnet.bscscan.com/address/0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94

### 部署参数

| 参数 | 值 |
|------|-----|
| Token 名称 | ZhengDao Soulbound Token |
| Token 符号 | ZDSBT |
| 基础 URI | https://your-domain.com/api/sbt-metadata/ |

### 部署者账户

**地址**: `0xFAaD91BeC3A24BC3D5Bd582e1752b2D28b12F674`
**余额**: 0.2184763 tBNB（部署后余额）
**合约 Owner**: 0xFAaD91BeC3A24BC3D5Bd582e1752b2D28b12F674

---

## 功能验证

### ✅ 合约基本功能测试

| 测试项 | 结果 | 说明 |
|--------|------|------|
| 合约部署 | ✅ 通过 | 成功部署到 BSC Testnet |
| Token 名称 | ✅ 通过 | 正确返回 "ZhengDao Soulbound Token" |
| Token 符号 | ✅ 通过 | 正确返回 "ZDSBT" |
| 初始总供应量 | ✅ 通过 | 正确返回 0 |
| 合约 Owner | ✅ 通过 | 正确设置为部署者地址 |

### ✅ SBT 铸造功能测试

**铸造交易**: `0x35d976449fbd5401987d20b364bbf76889fc92f3e5950d0a4a429682708530d2`
**区块号**: 87182327
**Gas 消耗**: 288,915

**铸造参数**:
- 接收地址: 0xFAaD91BeC3A24BC3D5Bd582e1752b2D28b12F674
- 等级: 2 (知止)
- 打卡天数: 100 天
- Token URI: 使用默认 URI

**验证结果**:
- ✅ SBT 数量: 1
- ✅ Token ID: 1
- ✅ 等级: 2 (知止)
- ✅ 打卡天数: 100 天
- ✅ Token URI: https://your-domain.com/api/sbt-metadata/2.json

---

## 文件变更

### 新增文件

1. **scripts/deploy-bnb-sbt.js**
   - JavaScript 版本的部署脚本
   - 包含完整的部署、验证和测试流程
   - 自动检查账户余额

2. **scripts/mint-test-sbt.js**
   - SBT 铸造测试脚本
   - 验证合约功能是否正常
   - 可用于功能测试

### 修改文件

1. **.env.local**
   - 更新 `NEXT_PUBLIC_CONTRACT_ADDRESS` 为新部署的合约地址
   - 更新 `NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS` 为新部署的合约地址

---

## 环境变量配置

### 已配置的变量

```bash
# 合约地址（已更新）
NEXT_PUBLIC_CONTRACT_ADDRESS=0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94
NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94

# BNB Chain RPC URLs（已配置）
BNB_TESTNET_RPC_URL=https://bsc-testnet.publicnode.com
BNB_MAINNET_RPC_URL=https://bsc-dataseed.binance.org/

# 测试网模式（已启用）
NEXT_PUBLIC_BNB_CHAIN_TESTNET=true

# 私钥（已配置）
PRIVATE_KEY=***（隐藏）
```

### 待配置的变量

```bash
# BscScan API Key（可选）
# 用于合约源码验证
BSCSCAN_API_KEY=
```

---

## 下一步操作

### 可选：合约验证

如果需要验证合约源码（需要配置 BSCSCAN_API_KEY）：

```bash
npx hardhat verify --network bnbTestnet \
  0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94 \
  "ZhengDao Soulbound Token" \
  "ZDSBT" \
  "https://your-domain.com/api/sbt-metadata/"
```

### 获取 BscScan API Key

1. 访问: https://testnet.bscscan.com/myapikey
2. 注册/登录账户
3. 创建新的 API Key
4. 将 API Key 添加到 `.env.local` 文件的 `BSCSCAN_API_KEY`

---

## 测试网资源

### 水龙头

如果需要更多测试币，可从以下水龙头获取：

- **BNB Chain Testnet Faucet**: https://testnet.bnbchain.org/faucet-smart
- **CoinTool Faucet**: https://bfaucet.cointool.app/
- **QuickNode Faucet**: https://faucet.quicknode.com/bsc

### 区块浏览器

- **BscScan Testnet**: https://testnet.bscscan.com/
- **合约地址**: https://testnet.bscscan.com/address/0x86e0392575cBb9BEEfF32Eb62De5923B05f66B94
- **部署者地址**: https://testnet.bscscan.com/address/0xFAaD91BeC3A24BC3D5Bd582e1752b2D28b12F674

---

## 验收标准检查

根据 `AI-TASK-REQUIREMENTS.md` 中的验收标准：

| 标准 | 状态 | 说明 |
|------|------|------|
| ✅ 编写/完善 deploy.ts | 通过 | 创建了 JavaScript 版本的部署脚本 |
| ✅ 配置环境变量 | 通过 | PRIVATE_KEY 和 RPC URL 已正确配置 |
| ✅ 执行部署命令 | 通过 | 成功部署到 BSC Testnet |
| ✅ 更新合约地址 | 通过 | NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS 已更新 |
| ✅ 验证合约功能 | 通过 | SBT 铸造功能测试通过 |
| ✅ 可在 BscScan 查看 | 通过 | 合约地址可在浏览器查看 |

---

## 已知问题

### BSCSCAN_API_KEY 未配置

**影响**: 无法自动验证合约源码
**解决方案**:
1. 从 https://testnet.bscscan.com/myapikey 获取 API Key
2. 添加到 `.env.local` 文件
3. 运行验证命令

**优先级**: P2（可选）

---

## 总结

**TASK-03 已成功完成！**

BSC 测试网部署已成功完成，合约功能验证通过：
- ✅ 合约成功部署到 BSC Testnet
- ✅ 合约地址已更新到环境变量
- ✅ SBT 铸造功能验证通过
- ✅ 合约可在 BscScan 上查看

项目已具备以下条件：
1. ✅ 合约代码 100% 完成
2. ✅ 合约已部署到测试网
3. ✅ 功能测试通过
4. ✅ 前端可连接已部署的合约

**建议后续工作**:
1. 配置 BSCSCAN_API_KEY 并验证合约源码
2. 完善前端集成测试
3. 准备主网部署

---

**签名**: AI #2 (全栈开发)
**日期**: 2026-01-29
