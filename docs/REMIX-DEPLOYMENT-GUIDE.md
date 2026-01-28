# 使用 Remix IDE 部署 ZhengDaoSBT 合约

**部署方式**: 图形界面 + MetaMask钱包连接
**预计时间**: 5-10分钟
**难度**: 简单
**安全性**: ⭐⭐⭐⭐⭐ 无需私钥

---

## 🎯 为什么选择 Remix IDE？

✅ **安全性高**: 直接连接MetaMask，无需私钥
✅ **操作简单**: 图形界面，可视化操作
✅ **即时反馈**: 实时显示编译和部署状态
✅ **完全免费**: 无需安装任何工具

---

## 📋 部署前准备

### 1. 准备MetaMask钱包

确保你已经安装了MetaMask浏览器扩展：

**Chrome/Brave/Edge**:
- 访问: https://metamask.io/
- 点击"下载"
- 安装扩展并创建钱包

**添加BNB Chain Testnet**:
1. 打开MetaMask
2. 点击网络下拉菜单
3. 点击"添加网络" → "手动添加网络"
4. 填写以下信息：
   ```
   网络名称: BNB Chain Testnet
   新增RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
   链ID: 97
   符号: tBNB
   区块浏览器URL: https://testnet.bscscan.com
   ```
5. 点击"保存"

### 2. 获取测试BNB

访问水龙头: https://testnet.bnbchain.org/faucet-smart
- 输入你的MetaMask钱包地址
- 完成验证
- 获取至少 **0.1 tBNB**

---

## 🚀 详细部署步骤

### Step 1: 打开 Remix IDE

1. 访问: https://remix.ethereum.org/
2. 你会看到一个简洁的IDE界面

---

### Step 2: 创建新文件

1. 点击左侧文件图标（📁）
2. 点击 "Create New File" 图标（📄+）
3. 输入文件名: `ZhengDaoSBT.sol`
4. 按回车确认

---

### Step 3: 粘贴合约代码

1. 打开本地的合约文件：
   ```bash
   cat "/Users/jasoncong/Desktop/claude code/黑客松项目-证道/contracts/ZhengDaoSBT.sol"
   ```

2. 复制所有内容（Ctrl+A → Ctrl+C）

3. 在Remix中，粘贴到 `ZhengDaoSBT.sol` 文件中

**或者**，我可以为你准备一个包含完整代码的文件：

查看并复制这个文件:
```bash
open "/Users/jasoncong/Desktop/claude code/黑客松项目-证道/contracts/ZhengDaoSBT.sol"
```

然后全选复制（Cmd+A → Cmd+C）

---

### Step 4: 编译合约

1. 点击左侧的编译插件图标（🔨 "Solidity Compiler"）
2. 确认以下设置：
   - **Compiler**: `0.8.20` (重要！)
   - **Language**: Solidity
   - **Enable optimization**: 勾选
   - **Runs**: 200

3. 点击 "Compile ZhengDaoSBT.sol" 按钮

**预期结果**:
- ✅ 绿色勾标记
- ✅ 无错误警告

---

### Step 5: 连接MetaMask

1. 点击左侧的部署插件图标（📡 "Deploy & Run Transactions"）
2. 在 **Environment** 下拉菜单中选择：
   - **"Injected Provider - MetaMask"**
3. MetaMask会弹出连接请求：
   - 点击"下一步"
   - 点击"连接"
4. 确保钱包已切换到 **BNB Chain Testnet**
5. 检查余额是否 > 0.1 tBNB

---

### Step 6: 部署合约

在 "Deploy & Run Transactions" 面板中：

1. **Contract**: 选择 `ZhengDaoSBT` (应该是默认选中)

2. **填写构造函数参数**:

   在 "_deployConstructorParameters" 字段中，粘贴以下JSON（作为一个数组）：
   ```json
   [
      "ZhengDao Soulbound Token",
      "ZDSBT",
      "https://your-domain.com/api/sbt-metadata/"
   ]
   ```

   **说明**:
   - 参数1: Token名称
   - 参数2: Token符号
   - 参数3: 基础URI（可以是你的域名，或者暂时用ipfs://QmExample/）

3. 点击 **"Deploy"** 按钮

4. MetaMask会弹出交易确认：
   - 检查Gas费用（应该约 0.004-0.005 tBNB）
   - 点击"确认"

---

### Step 7: 等待部署完成

1. 观察Remix底部的终端日志
2. 等待交易被确认（通常10-30秒）
3. 部署成功后会看到：

```
Creating contract for transaction: 0x...
ZhengDaoSBT deployed successfully!
Transaction hash: 0x...
Contract address: 0x...
```

4. 在 "Deployed Contracts" 面板下会看到：
   - ✅ `ZhengDaoSBT at 0x... (BNB Chain Testnet)`

---

## 🎉 部署成功！

### 记录重要信息

**立即记录以下信息**（从Remix终端复制）:

```
✅ 合约地址: 0x...
✅ 交易Hash: 0x...
✅ 网络: BNB Chain Testnet (Chain ID: 97)
```

---

## 🔍 在 BscScan 上验证

### 1. 查看合约

1. 访问: https://testnet.bscscan.com/
2. 在搜索框中粘贴你的合约地址
3. 你会看到：
   - ✅ 合约已创建
   - ✅ Transactions: 1次
   - ⚠️ Contract: 未验证（这是正常的）

---

## 🧪 测试合约

### 在Remix中测试

1. 在Remix中，保持 "Deploy & Run Transactions" 面板打开
2. 在 "Deployed Contracts" 下，展开 `ZhengDaoSBT`
3. 你会看到所有可用函数

#### 测试1: 读取基本信息

```
✅ name() - 点击 → 应该返回 "ZhengDao Soulbound Token"
✅ symbol() - 点击 → 应该返回 "ZDSBT"
✅ totalSupply() - 点击 → 应该返回 0
```

#### 测试2: 铸造你的第一个SBT

1. 找到 `mintSBT` 函数
2. 填写参数：
   ```
   to: (你的钱包地址)
   level: 1
   checkInDays: 7
   uri: (留空或填写自定义URI)
   ```
3. 点击 "transact"
4. 在MetaMask中确认交易
5. 等待完成

#### 测试3: 查看你的SBT

```
✅ ownerOf(1) - 应该返回你的地址
✅ tokenLevel(1) - 应该返回 1
✅ tokenCheckInDays(1) - 应该返回 7
✅ userTokens(你的地址) - 应该返回 [1]
```

#### 测试4: 验证Soulbound机制

1. 尝试调用 `transferFrom`
2. 填写参数：
   ```
   from: (你的地址)
   to: (随便一个地址，如0x0000000000000000000000000000000000001)
   tokenId: 1
   ```
3. 点击 "transact"
4. **应该失败** 并显示错误 ❌
5. 这证明Soulbound机制正常工作！

---

## 📝 手动验证合约（可选）

如果你想验证合约源代码（在BscScan上显示绿色勾✅）：

1. 访问: https://testnet.bscscan.com/address/你的合约地址
2. 点击 "Verify and Publish"
3. 填写以下信息：
   - **Compiler Type**: Solidity (Single file)
   - **Compiler Version**: v0.8.20
   - **License**: MIT
   - **Contract Address**: (自动填充)
4. 在 "Contract Code" 区域：
   - 打开本地文件 `contracts/ZhengDaoSBT.sol`
   - 复制所有内容
   - 粘贴到输入框
5. 确保 **Constructor Arguments** ABI-encoded 填写：
   ```
   [
      "ZhengDao Soulbound Token",
      "ZDSBT",
      "https://your-domain.com/api/sbt-metadata/"
   ]
   ```
6. 点击 "Verify and Publish"
7. 等待验证完成
8. 刷新页面，应该看到绿色勾 ✅

---

## ⚠️ 常见问题

### Q1: 编译错误

**问题**: 显示编译错误

**解决**:
- 检查Compiler版本是否设置为 `0.8.20`
- 确保代码完整复制
- 检查是否有遗漏的括号

### Q2: MetaMask未连接

**问题**: 无法连接MetaMask

**解决**:
- 刷新页面
- 检查是否安装了MetaMask扩展
- 确保MetaMask已解锁

### Q3: 余额不足

**问题**: "Insufficient funds"

**解决**:
- 从水龙头获取测试币: https://testnet.bnbchain.org/faucet-smart
- 等待几分钟确认到账

### Q4: Gas费用太高

**问题**: Gas费用异常高

**解决**:
- 检查是否在正确的测试网
- Gas应该约 0.004-0.005 tBNB
- 如果很高，可能是主网！立即取消

### Q5: 部署失败

**问题**: Transaction reverted

**解决**:
- 检查构造函数参数格式
- 确保数组格式正确：`["param1", "param2", "param3"]`
- 查看错误信息

---

## ✅ 完成检查

部署完成后，确认：

- [ ] 合约地址已记录
- [ ] 可以在 BscScan 上查看
- [ ] 成功铸造了测试SBT
- [ ] Soulbound机制正常（无法转移）
- [ ] 所有基本功能正常

---

## 📋 快速参考卡片

### Remix 快捷键

```
Ctrl+S          保存文件
Ctrl+B          打开/关闭侧边栏
Ctrl+Shift+S   编译当前文件
```

### 重要链接

```
Remix IDE:         https://remix.ethereum.org/
BSC Testnet:       https://testnet.bscscan.com/
水龙头:            https://testnet.bnbchain.org/faucet-smart
```

---

## 🎯 部署完成后

### 下一步操作

1. **记录合约地址** - 保存到安全的地方
2. **测试合约功能** - 在Remix中测试所有函数
3. **验证合约** - 在BscScan上验证源代码
4. **更新项目配置** - 将地址添加到项目中

### 准备集成

合约部署并验证后，可以：

- **AI #3** 开始TASK-1-11: BNB合约集成
- **AI #3** 开始TASK-1-6: 成就系统核心（可以并行）
- **AI #5** 开始TASK-1-4: SBT视觉设计（可以并行）

---

## 💡 专业提示

1. **保存 Remix 链接**: Remix会自动保存你的工作，可以分享链接
2. **使用GitHub**: 可以将代码保存到GitHub Gist
3. **测试网 faucets**: 除了官方水龙头，还有其他选择

---

**准备好了吗？打开 Remix IDE 开始部署吧！**

**需要帮助？** 如果在部署过程中遇到任何问题，随时告诉我！

---

**文档版本**: v1.0
**最后更新**: 2026-01-27
**维护者**: AI #1
