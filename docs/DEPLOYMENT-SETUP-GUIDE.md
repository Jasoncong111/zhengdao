# BNB Chain 合约部署配置指南

**任务**: 部署 ZhengDaoSBT 到 BNB Chain Testnet
**预计时间**: 10-15分钟
**难度**: 中等

---

## ⚠️ 重要提醒

在继续之前，请注意：

1. **仅使用测试钱包**: 不要使用包含真实资金的钱包
2. **私钥安全**: 永远不要分享你的私钥
3. **测试网环境**: 本次部署在 BNB Chain Testnet (测试网)

---

## 📋 部署检查清单

### 第一步：获取私钥 🔑

你需要从MetaMask导出私钥：

1. 打开MetaMask扩展
2. 点击右上角的三个点
3. 选择"账户详情"
4. 点击"导出私钥"
5. 输入MetaMask密码
6. 复制私钥（**注意**：不要包含 `0x` 前缀）

**安全提示**:
- ✅ 这应该是测试账户的私钥
- ✅ 部署完成后可以删除此文件
- ❌ 不要在主网使用这个私钥

---

### 第二步：获取 BscScan API Key 🔑

1. 访问: https://testnet.bscscan.com/
2. 点击右上角登录
3. 登录后访问: https://testnet.bscscan.com/myapikey
4. 输入应用名称（如："ZhengDao SBT"）
5. 点击"继续"
6. 复制 API Key

**注意**: Testnet 和 Mainnet 需要分别申请 API Key

---

### 第三步：编辑环境变量 ✏️

你的 `.env.local` 文件已更新，现在需要填写三个关键值：

```bash
# 打开文件进行编辑
cd "/Users/jasoncong/Desktop/claude code/黑客松项目-证道"
nano .env.local
# 或者使用 VS Code: code .env.local
```

**需要填写的配置**:

```bash
# 1. 私钥（从MetaMask导出，不要0x前缀）
PRIVATE_KEY=你的私钥粘贴在这里

# 2. BscScan API Key
BSCSCAN_API_KEY=你的API密钥粘贴在这里

# 3. 其他配置已预填写，无需修改
```

**示例**:
```bash
PRIVATE_KEY=abc123def456789...  # 你的实际私钥
BSCSCAN_API_KEY=YourApiKeyHere  # 你的实际API密钥
```

**保存并关闭**:
- Nano: `Ctrl+X` → `Y` → `Enter`
- VS Code: `Cmd+S`

---

### 第四步：获取测试币 💰

配置完成后，需要获取测试BNB：

1. 访问水龙头: https://testnet.bnbchain.org/faucet-smart
2. 输入你的钱包地址（从MetaMask复制）
3. 选择 "BNB Greenfield"
4. 完成验证码（如果有）
5. 等待到账（通常1-2分钟）

**需要**: 至少 0.1 tBNB

**验证**: 在MetaMask中查看余额是否增加

---

### 第五步：验证配置 ✅

运行以下命令检查配置：

```bash
cd "/Users/jasoncong/Desktop/claude code/黑客松项目-证道"

# 检查私钥是否配置
grep PRIVATE_KEY .env.local

# 检查API密钥是否配置
grep BSCSCAN_API_KEY .env.local

# 检查余额（测试币）
npx hardhat run scripts/check-balance.ts --network bnbTestnet
```

**预期输出**:
```
💰 账户余额: X.X BNB
✅ 余额充足，可以部署合约！
```

---

## 🚀 开始部署

### 自动部署命令

配置完成后，运行以下命令：

```bash
cd "/Users/jasoncong/Desktop/claude code/黑客松项目-证道"

# 部署合约
npx hardhat run scripts/deploy-bnb-sbt.ts --network bnbTestnet
```

**预期输出**:
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
  - Gas Used: xxxxxx
  - Block Number: xxxxx
```

---

## 📝 部署后操作

### 1. 记录合约地址

部署成功后，**立即记录**以下信息：

```
合约地址: 0x...（从输出中复制）
交易Hash: 0x...（从输出中复制）
BscScan链接: https://testnet.bscscan.com/address/0x...
```

### 2. 验证合约

复制合约地址后，运行：

```bash
# 替换 <CONTRACT_ADDRESS> 为实际地址
npx hardhat verify --network bnbTestnet <CONTRACT_ADDRESS> \
  "ZhengDao Soulbound Token" \
  "ZDSBT" \
  "https://your-domain.com/api/sbt-metadata/"
```

### 3. 测试铸造

```bash
# 设置环境变量
export ZHENGDAO_SBT_ADDRESS=<CONTRACT_ADDRESS>

# 测试铸造
npx hardhat run scripts/mint-test-sbt.ts --network bnbTestnet
```

---

## ⚠️ 常见问题

### Q1: 私钥格式错误

**错误**: `Invalid private key format`

**解决**:
- 确保私钥不包含 `0x` 前缀
- 确保没有多余的空格

### Q2: 余额不足

**错误**: `Insufficient funds`

**解决**:
- 从水龙头获取测试币: https://testnet.bnbchain.org/faucet-smart
- 等待几分钟确认到账

### Q3: 网络连接失败

**错误**: `Network error`

**解决**:
- 检查 RPC URL 是否正确
- 尝试更换 RPC 节点
- 检查网络连接

### Q4: 验证失败

**错误**: `Contract verification failed`

**解决**:
- 等待几分钟再试
- 检查构造函数参数是否正确
- 确认 BSCSCAN_API_KEY 正确

---

## ✅ 完成检查

部署完成后，确认以下项目：

- [ ] 合约在 BscScan 上可见
- [ ] 合约代码已验证（绿色勾）
- [ ] 可以成功铸造测试 SBT
- [ ] SBT 无法转移（Soulbound机制工作）
- [ ] 元数据 URI 正确

---

## 🎯 下一步

部署成功后：

1. **更新前端配置**:
   ```bash
   # 在 .env.local 中添加
   NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS=<你的合约地址>
   ```

2. **开始前端集成** (AI #3):
   - TASK-1-11: BNB合约集成

3. **并行任务** (其他AI):
   - AI #3: TASK-1-6 (成就系统核心)
   - AI #5: TASK-1-4 (SBT视觉设计)

---

## 📞 需要帮助？

如果遇到问题：

1. **检查配置**: 确认 .env.local 文件填写正确
2. **查看日志**: 运行 `npx hardhat test` 查看详细错误
3. **查看文档**: 阅读 `docs/DEPLOYMENT-BNB-SBT.md`
4. **重新部署**: 如果失败，修复问题后重新部署

---

**准备好了吗？配置完成后告诉我，我将继续部署流程！**

**下一步**: 填写 .env.local 文件 → 获取测试币 → 运行部署命令
