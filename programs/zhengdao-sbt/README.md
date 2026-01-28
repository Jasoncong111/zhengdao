# ZhengDAO Solana SBT Program

## 概述

这是一个使用Anchor框架开发的Solana灵魂绑定代币（SBT）程序，用于证道项目的成就系统。

### 核心功能

- ✅ 初始化SBT程序
- ✅ 铸造SBT（支持6个等级）
- ✅ 更新SBT元数据
- ✅ 查询SBT信息
- ✅ 不可转移设计

## SBT等级系统

| 等级 | 名称 | 持续天数 | 元数据URI |
|-----|------|---------|----------|
| Level 1 | 初级修行者 | 7天 | `https://example.com/metadata/level-1.json` |
| Level 2 | 中级修行者 | 30天 | `https://example.com/metadata/level-2.json` |
| Level 3 | 高级修行者 | 90天 | `https://example.com/metadata/level-3.json` |
| Level 4 | 大师 | 180天 | `https://example.com/metadata/level-4.json` |
| Level 5 | 宗师 | 365天 | `https://example.com/metadata/level-5.json` |
| Level 6 | 道尊 | 1000天 | `https://example.com/metadata/level-6.json` |

## 环境准备

### 1. 安装Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. 安装Solana CLI

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

### 3. 安装Anchor

```bash
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### 4. 配置Solana环境

```bash
# 生成新密钥（如果没有）
solana-keygen new

# 配置为devnet
solana config set --url devnet

# 获取空投（仅测试网）
solana airdrop 2
```

## 项目结构

```
programs/zhengdao-sbt/
├── Anchor.toml              # Anchor配置文件
├── package.json             # NPM依赖
├── tsconfig.json           # TypeScript配置
├── src/
│   └── lib.rs              # 主程序文件
└── tests/
    └── zhengdao-sbt.ts     # 测试文件
```

## 核心数据结构

### SbtConfig
程序配置账户，存储管理员权限。

```rust
pub struct SbtConfig {
    pub authority: Pubkey,  // 管理员地址
    pub bump: u8,          // PDA bump seed
}
```

### Sbt
SBT账户，存储用户的灵魂绑定代币信息。

```rust
pub struct Sbt {
    pub owner: Pubkey,        // 所有者
    pub level: u8,            // 等级 (1-6)
    pub days: u32,            // 持续天数
    pub minted_at: i64,       // 铸造时间戳
    pub metadata_uri: String, // 元数据URI
    pub bump: u8,            // PDA bump seed
}
```

## 程序指令

### initialize
初始化SBT程序，设置管理员权限。

```typescript
await program.methods
  .initialize()
  .accounts({
    sbtConfig: sbtConfigPDA,
    payer: provider.wallet.publicKey,
  })
  .rpc();
```

### mint_sbt
为用户铸造SBT。

```typescript
await program.methods
  .mintSbt(
    level,           // u8: 等级 (1-6)
    days,            // u32: 持续天数
    metadataUri      // string: 元数据URI
  )
  .accounts({
    sbt: sbtPDA,
    owner: ownerPublicKey,
    payer: provider.wallet.publicKey,
  })
  .rpc();
```

### update_metadata
更新SBT元数据（仅管理员）。

```typescript
await program.methods
  .updateMetadata(newMetadataUri)
  .accounts({
    sbtConfig: sbtConfigPDA,
    sbt: sbtPDA,
    authority: adminPublicKey,
  })
  .rpc();
```

### get_sbt
查询SBT信息（只读）。

```typescript
const sbtInfo = await program.methods
  .getSbt()
  .accounts({
    sbt: sbtPDA,
  })
  .view();
```

## PDA地址计算

### SBT配置地址
```typescript
const [sbtConfig] = PublicKey.findProgramAddressSync(
  [Buffer.from("sbt_config")],
  programId
);
```

### SBT账户地址
```typescript
const [sbtPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from("sbt"),
    ownerPublicKey.toBuffer(),
    Buffer.from([level]),
  ],
  programId
);
```

## 运行测试

### 编译程序
```bash
cd /programs/zhengdao-sbt
anchor build
```

### 运行测试
```bash
anchor test
```

### 运行测试（不清理）
```bash
anchor test --skip-local-validator
```

### 查看测试覆盖率
```bash
anchor test --skip-local-validator -- --coverage
```

## 部署

### 部署到Devnet
```bash
# 配置为devnet
solana config set --url devnet

# 部署程序
anchor deploy

# 验证部署
solana program show <PROGRAM_ID>
```

### 部署到Mainnet
```bash
# ⚠️ 谨慎操作，不可逆

# 配置为mainnet
solana config set --url mainnet-beta

# 部署程序
anchor deploy

# 验证部署
solana program show <PROGRAM_ID>
```

## 错误码

| 错误码 | 说明 |
|-------|------|
| `InvalidLevel` | 等级必须在1-6之间 |
| `Unauthorized` | 未授权的操作 |
| `SbtAlreadyExists` | SBT已存在 |
| `MetadataUriTooLong` | 元数据URI超过256字符 |

## 安全特性

### 1. 灵魂绑定（不可转移）
- SBT账户使用PDA派生
- 没有实现transfer指令
- 账户结构与owner绑定

### 2. 等级限制
- 等级必须在1-6范围内
- 铸造时验证等级有效性

### 3. 权限控制
- 元数据更新仅限管理员
- 使用authority字段验证权限

### 4. PDA安全性
- 使用程序派生地址
- 确保账户唯一性
- 防止账户替换攻击

## 前端集成

### 安装依赖
```bash
npm install @coral-xyz/anchor @solana/web3.js
```

### 连接钱包
```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { ZhengdaoSbt } from './target/types/zhengdao_sbt';

// 创建连接
const connection = new Connection('https://api.devnet.solana.com');
const wallet = new PhantomWallet();

// 创建provider
const provider = new AnchorProvider(
  connection,
  wallet,
  { commitment: 'confirmed' }
);

// 获取程序
const program = new Program<ZhengdaoSbt>(
  idl,
  programId,
  provider
);
```

### 铸造SBT示例
```typescript
const mintSBT = async (level: number, days: number) => {
  const [sbtPDA] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('sbt'),
      wallet.publicKey.toBuffer(),
      Buffer.from([level]),
    ],
    programId
  );

  const tx = await program.methods
    .mintSbt(level, days, metadataUri)
    .accounts({
      sbt: sbtPDA,
      owner: wallet.publicKey,
      payer: wallet.publicKey,
    })
    .rpc();

  console.log('SBT minted:', tx);
};
```

## 监听事件

```typescript
program.addEventListener('SBTMintedEvent', (event) => {
  console.log('SBT Minted:', {
    owner: event.owner.toString(),
    level: event.level,
    timestamp: event.timestamp,
  });
});
```

## 开发日志

详细的开发日志请查看: `/docs/development-logs/TASK-2-1-solana-sbt-program.md`

## 相关文档

- [Anchor官方文档](https://www.anchor-lang.com/docs)
- [Solana开发者文档](https://docs.solana.com/)
- [Metaplex标准](https://docs.metaplex.com/)

## 贡献者

- AI #2 (Solana程序工程师)
- CTO Claude

## 许可证

MIT License

---

**最后更新**: 2026-01-27
**版本**: v0.1.0
