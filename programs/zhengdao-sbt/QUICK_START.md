# Solana SBT程序 - 快速开始指南

## TASK-2-1 完成总结 ✅

### 已完成的工作

1. ✅ **核心程序开发** (`/programs/zhengdao-sbt/src/lib.rs`)
   - initialize: 初始化程序
   - mint_sbt: 铸造SBT（6个等级）
   - update_metadata: 更新元数据
   - get_sbt: 查询SBT信息

2. ✅ **测试文件** (`/programs/zhengdao-sbt/tests/zhengdao-sbt.ts`)
   - 10个完整测试用例
   - 覆盖正常流程、边界条件、错误处理

3. ✅ **配置文件**
   - `Anchor.toml`: Anchor配置
   - `package.json`: 依赖管理
   - `tsconfig.json`: TypeScript配置

4. ✅ **文档**
   - `README.md`: 完整的使用文档
   - 开发日志: `/docs/development-logs/TASK-2-1-solana-sbt-program.md`

---

## TASK-2-2: 运行测试指南

### 步骤1: 安装Rust

```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# 验证安装
rustc --version
cargo --version
```

### 步骤2: 安装Solana CLI

```bash
# macOS/Linux
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# 添加到PATH（重启终端或执行）
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 验证安装
solana --version
```

### 步骤3: 安装Anchor框架

```bash
# 使用cargo安装AVM（Anchor Version Manager）
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# 安装最新版Anchor
avm install latest
avm use latest

# 验证安装
anchor --version
```

### 步骤4: 配置Solana环境

```bash
# 生成新密钥对（或使用现有的）
solana-keygen new --no-bip39-passphrase

# 配置为devnet（测试网）
solana config set --url devnet

# 查看配置
solana config get

# 获取空投（仅测试网）
solana airdrop 2

# 查看余额
solana balance
```

### 步骤5: 安装项目依赖

```bash
# 进入程序目录
cd /Users/jasoncong/Desktop/claude\ code/黑客松项目-证道/programs/zhengdao-sbt

# 安装Node.js依赖
npm install
```

### 步骤6: 编译程序

```bash
# 编译Anchor程序
anchor build

# 查看生成的文件
ls -la target/
ls -la target/idl/
ls -la target/types/
```

预期输出：
```
target/
├── deploy/
│   └── zhengdao_sbt.so    # 编译后的程序文件
├── idl/
│   └── zhengdao_sbt.json  # IDL文件
├── types/
│   └── zhengdao_sbt.ts    # TypeScript类型定义
└── snapshot/
```

### 步骤7: 运行测试

```bash
# 完整测试（自动启动本地验证器）
anchor test

# 使用已运行的验证器
anchor test --skip-local-validator

# 详细输出
anchor test -- --nocapture

# 查看覆盖率
anchor test --skip-local-validator -- --coverage
```

预期测试结果：
```
  zhengdao-sbt
    ✓ Initializes the SBT program (XXXms)
    ✓ Mints a level 1 SBT (初级修行者) (XXXms)
    ✓ Mints all 6 levels of SBT (XXXms)
    ✓ Fails to mint invalid level (level 7) (XXXms)
    ✓ Fails to mint invalid level (level 0) (XXXms)
    ✓ Updates SBT metadata by authority (XXXms)
    ✓ Fails to update metadata by unauthorized user (XXXms)
    ✓ Gets SBT information (XXXms)
    ✓ Handles metadata URI length limit (XXXms)

  10 passing (XXXms)
```

### 步骤8: 验证IDL生成

```bash
# 查看IDL文件
cat target/idl/zhengdao_sbt.json

# 检查类型定义
cat target/types/zhengdao_sbt.ts
```

IDL应该包含：
- `instructions`: initialize, mint_sbt, update_metadata, get_sbt
- `accounts`: SbtConfig, Sbt
- `events`: SBTMintedEvent
- `errors`: InvalidLevel, Unauthorized, SbtAlreadyExists, MetadataUriTooLong

---

## 常见问题排查

### Q1: `anchor: command not found`
**解决方案**:
```bash
# 确保AVM已安装
avm use latest

# 检查PATH
which anchor

# 如果没有，手动添加
export PATH="$HOME/.avm/bin:$PATH"
```

### Q2: `Error: Account allocation failed: out of rent`
**解决方案**:
```bash
# 获取更多SOL（devnet）
solana airdrop 2
```

### Q3: 编译错误 `cannot find -lsolana`
**解决方案**:
```bash
# 清理并重新编译
anchor clean
anchor build
```

### Q4: 测试超时
**解决方案**:
```bash
# 增加测试超时时间
anchor test -- --timeout 600000
```

---

## 测试覆盖率目标

**目标**: >85%

### 测试用例覆盖：

1. ✅ **正常流程** (4个测试)
   - 初始化程序
   - 铸造Level 1 SBT
   - 铸造所有6个等级
   - 查询SBT信息

2. ✅ **边界条件** (2个测试)
   - 无效等级（7）
   - 无效等级（0）
   - 超长元数据URI

3. ✅ **权限控制** (2个测试)
   - 管理员更新元数据
   - 拒绝未授权更新

4. ✅ **数据一致性** (2个测试)
   - PDA地址唯一性
   - 账户数据验证

---

## 下一步：TASK-2-3 部署到Devnet

测试通过后，可以部署到Solana Devnet：

```bash
# 1. 确保配置为devnet
solana config set --url devnet

# 2. 确保有足够的SOL
solana balance

# 3. 部署程序
anchor deploy --program-name zhengdao_sbt

# 4. 记录程序ID
solana program show <PROGRAM_ID>

# 5. 更新Anchor.toml中的程序ID
# 将 "zhengD1111111111111111111111111111111111111" 替换为实际程序ID
```

---

## 验收清单

- [ ] Rust安装成功
- [ ] Solana CLI安装成功
- [ ] Anchor安装成功
- [ ] 程序编译成功（`anchor build`）
- [ ] IDL生成正确（`target/idl/zhengdao_sbt.json`）
- [ ] 所有测试通过（10/10）
- [ ] 测试覆盖率 >85%
- [ ] 程序可以部署到devnet

---

## 需要帮助？

如果遇到问题，请检查：
1. 所有工具版本是否正确
2. 网络连接是否正常
3. 密钥对是否正确配置
4. devnet是否有足够的SOL

**相关文档**:
- `/programs/zhengdao-sbt/README.md` - 完整文档
- `/docs/development-logs/TASK-2-1-solana-sbt-program.md` - 开发日志

---

**准备就绪？** 运行 `anchor test` 开始测试！

**下一步**: TASK-2-3 - 部署到Solana Devnet
