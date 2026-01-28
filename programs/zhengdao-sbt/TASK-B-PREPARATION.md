# TASK-B: Solana程序部署准备指南

**负责人**: AI #2 (Solana程序工程师)
**任务**: 准备Solana程序部署环境
**状态**: 🔄 进行中
**创建时间**: 2026-01-27

---

## 📋 任务概述

TASK-B包括：
- **TASK-2-1**: ✅ Solana SBT程序开发（已完成）
- **TASK-2-2**: 🔄 Solana程序测试（准备中）
- **TASK-2-3**: 🔄 Solana程序部署（准备中）

本指南确保所有工具和环境正确配置，以便测试和部署Solana SBT程序。

---

## ✅ 已完成的工作

### 1. 代码开发（TASK-2-1）✅

| 文件 | 路径 | 状态 |
|-----|------|------|
| **Rust程序** | `/programs/zhengdao-sbt/src/lib.rs` | ✅ 251行 |
| **测试文件** | `/programs/zhengdao-sbt/tests/zhengdao-sbt.ts` | ✅ 340行 |
| **配置文件** | `Anchor.toml` | ✅ |
| **依赖配置** | `package.json` | ✅ |

### 2. 脚本准备 ✅

| 脚本 | 用途 | 状态 |
|-----|------|------|
| `prepare-environment.sh` | 环境准备 | ✅ 新建 |
| `test.sh` | 运行测试 | ✅ |
| `deploy-devnet.sh` | 部署到devnet | ✅ |
| `verify-deployment.sh` | 验证部署 | ✅ |

### 3. 文档准备 ✅

| 文档 | 路径 | 状态 |
|-----|------|------|
| **README** | `/programs/zhengdao-sbt/README.md` | ✅ |
| **快速开始** | `QUICK_START.md` | ✅ |
| **开发日志** | `/docs/development-logs/TASK-2-1-solana-sbt-program.md` | ✅ |
| **完成报告** | `TASK-2-COMPLETION.md` | ✅ |

---

## 🔧 环境要求

### 必需工具

| 工具 | 版本 | 用途 |
|-----|------|------|
| **Rust** | 1.70+ | 编译Rust代码 |
| **Solana CLI** | 1.16+ | Solana命令行工具 |
| **Anchor** | 0.29.0+ | Solana开发框架 |
| **Node.js** | 16+ | 运行测试脚本 |
| **npm** | 8+ | 依赖管理 |

### 硬件要求

- **CPU**: 2核心以上
- **内存**: 4GB以上
- **磁盘**: 2GB可用空间

---

## 🚀 快速开始

### 方法1: 自动环境准备（推荐）

```bash
# 进入程序目录
cd /Users/jasoncong/Desktop/claude\ code/黑客松项目-证道/programs/zhengdao-sbt

# 运行环境准备脚本
chmod +x scripts/prepare-environment.sh
./scripts/prepare-environment.sh
```

此脚本会自动：
1. 检查并安装Rust
2. 检查并安装Solana CLI
3. 检查并安装Anchor
4. 配置Solana环境
5. 安装Node.js依赖

### 方法2: 手动安装

如果自动脚本失败，请按以下步骤手动安装：

#### 步骤1: 安装Rust

```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 重新加载环境
source $HOME/.cargo/env

# 验证
rustc --version
cargo --version
```

#### 步骤2: 安装Solana CLI

```bash
# macOS/Linux
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# 添加到PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 验证
solana --version
```

#### 步骤3: 安装Anchor

```bash
# 安装AVM（Anchor Version Manager）
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# 安装最新版Anchor
avm install latest
avm use latest

# 添加到PATH
export PATH="$HOME/.avm/bin:$PATH"

# 验证
anchor --version
```

#### 步骤4: 配置Solana

```bash
# 设置为devnet
solana config set --url devnet

# 查看配置
solana config get

# 生成密钥对（如果还没有）
solana-keygen new --no-bip39-passphrase

# 获取测试SOL（仅devnet）
solana airdrop 2

# 查看余额
solana balance
```

#### 步骤5: 安装依赖

```bash
cd /Users/jasoncong/Desktop/claude\ code/黑客松项目-证道/programs/zhengdao-sbt

npm install
```

---

## ✅ 环境验证清单

在继续测试和部署之前，请确认以下项目：

- [ ] **Rust安装成功**
  ```bash
  rustc --version  # 应显示版本号，如 rustc 1.75.0
  ```

- [ ] **Solana CLI安装成功**
  ```bash
  solana --version  # 应显示版本号，如 solana-cli 1.17.0
  ```

- [ ] **Anchor安装成功**
  ```bash
  anchor --version  # 应显示版本号，如 anchor 0.29.0
  ```

- [ ] **Solana配置正确**
  ```bash
  solana config get  # RPC URL应指向devnet
  ```

- [ ] **钱包有足够SOL**
  ```bash
  solana balance  # 应至少有2 SOL
  ```

- [ ] **程序代码存在**
  ```bash
  ls -la src/lib.rs  # 应存在
  ls -la tests/zhengdao-sbt.ts  # 应存在
  ```

- [ ] **Node.js依赖安装**
  ```bash
  ls node_modules  # 应存在且不为空
  ```

---

## 📝 下一步操作

### 1. 编译程序（TASK-2-2前）

```bash
cd /Users/jasoncong/Desktop/claude\ code/黑客松项目-证道/programs/zhengdao-sbt

# 编译
anchor build

# 检查生成文件
ls -la target/deploy/zhengdao_sbt.so
ls -la target/idl/zhengdao_sbt.json
ls -la target/types/zhengdao_sbt.ts
```

预期输出：
```
✅ Built program at: target/deploy/zhengdao_sbt.so
✅ Generated IDL: target/idl/zhengdao_sbt.json
✅ Generated types: target/types/zhengdao_sbt.ts
```

### 2. 运行测试（TASK-2-2）

```bash
# 完整测试（推荐）
anchor test

# 详细输出
anchor test -- --nocapture

# 跳过本地验证器（如果已运行）
anchor test --skip-local-validator
```

预期结果：
```
10 passing (xxxms)
```

### 3. 部署到Devnet（TASK-2-3）

```bash
# 运行部署脚本
chmod +x scripts/deploy-devnet.sh
./scripts/deploy-devnet.sh

# 或手动部署
anchor deploy --program-name zhengdao_sbt
```

---

## 🐛 故障排查

### 问题1: `anchor: command not found`

**原因**: Anchor未安装或不在PATH中

**解决方案**:
```bash
# 检查AVM是否安装
avm list

# 使用Anchor
avm use latest

# 手动添加到PATH
export PATH="$HOME/.avm/bin:$PATH"

# 添加到~/.bashrc或~/.zshrc（永久）
echo 'export PATH="$HOME/.avm/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 问题2: `Error: Account allocation failed: out of rent`

**原因**: 钱包SOL不足

**解决方案**:
```bash
# 检查余额
solana balance

# 获取空投（仅devnet）
solana airdrop 2
```

### 问题3: 编译错误 `cannot find -lsolana`

**原因**: Solana库链接问题

**解决方案**:
```bash
# 清理并重新编译
anchor clean
anchor build

# 如果仍失败，重新安装Anchor
avm install latest
avm use latest
```

### 问题4: 测试超时

**原因**: 本地验证器启动慢

**解决方案**:
```bash
# 手动启动验证器
solana-test-validator

# 在另一个终端运行测试
anchor test --skip-local-validator
```

### 问题5: `Invalid keypair` 错误

**原因**: 密钥文件不存在或格式错误

**解决方案**:
```bash
# 生成新密钥
solana-keygen new --no-bip39-passphrase

# 检查密钥路径
solana config get

# 手动设置密钥路径
solana config set --keypair ~/.config/solana/id.json
```

---

## 📊 环境检查命令

运行以下命令检查环境状态：

```bash
# 一键检查所有工具
echo "=== Environment Check ==="
echo "Rust: $(rustc --version 2>&1)"
echo "Solana: $(solana --version 2>&1)"
echo "Anchor: $(anchor --version 2>&1)"
echo "Node: $(node --version 2>&1)"
echo "npm: $(npm --version 2>&1)"
echo ""
echo "=== Solana Config ==="
solana config get
echo ""
echo "=== Wallet Balance ==="
solana balance
```

---

## 📞 获取帮助

如果遇到问题：

1. **查看日志**: 检查错误输出的详细信息
2. **查看文档**:
   - `/programs/zhengdao-sbt/README.md`
   - `/programs/zhengdao-sbt/QUICK_START.md`
3. **在线资源**:
   - [Anchor文档](https://www.anchor-lang.com/docs)
   - [Solana文档](https://docs.solana.com/)
   - [Solana Stack Exchange](https://solana.stackexchange.com/)

---

## 🎯 成功标准

环境准备完成的标志：

- [x] 所有工具安装成功
- [x] Solana配置为devnet
- [x] 钱包有至少2 SOL
- [x] 程序可以成功编译
- [x] 测试可以运行
- [x] 准备好部署到devnet

---

## 📝 环境变量配置

创建 `.env` 文件（可选）：

```bash
# Solana配置
SOLANA_NETWORK=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
ANCHOR_WALLET=~/.config/solana/id.json

# 程序配置
PROGRAM_ID=zhengD1111111111111111111111111111111111111
```

加载环境变量：
```bash
source .env
```

---

## 🎉 下一步

环境准备好后：

1. **立即测试**: 运行 `anchor test`
2. **查看结果**: 确认所有测试通过
3. **准备部署**: 运行 `./scripts/deploy-devnet.sh`

---

**准备完成后，请告诉我，我们将进入TASK-2-2（测试）和TASK-2-3（部署）！**

---

**文档版本**: v1.0
**最后更新**: 2026-01-27
**维护者**: AI #2 (Solana程序工程师)
