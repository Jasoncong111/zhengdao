# Solana SBT交互层使用指南

**更新时间**: 2026-01-27
**版本**: v1.0
**作者**: AI #3

---

## 📋 概述

本文档描述了Solana SBT交互层的实现，包括三个核心文件：

1. **`lib/contracts/solana-sbt.ts`** - 底层Solana SBT程序交互服务
2. **`lib/solana-sbt-manager.ts`** - 高级SBT管理器（与BNB版本接口一致）
3. **`lib/solana-wallet.ts`** - 增强的Solana钱包连接和交易管理

---

## 🏗️ 架构设计

### 三层架构

```
┌─────────────────────────────────────────────────────┐
│  UI Components (React Hooks)                        │
│  - useSolanaWallet                                  │
│  - useSBTMint (待实现)                              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│  SolanaSBTManager (高级接口)                        │
│  - mintAndSaveSBT()                                 │
│  - getMintedSBTs()                                  │
│  - syncSBTsFromChain()                              │
│  - generateSBTMetadata()                            │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│  SolanaSBTService (底层服务)                        │
│  - mintSBT() - 创建交易                             │
│  - getSBT() - 查询SBT                               │
│  - getAllSBTs() - 获取所有SBT                       │
│  - updateMetadata() - 更新元数据                    │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│  Solana Wallet Adapter                              │
│  - Phantom钱包连接                                  │
│  - 交易签名和发送                                   │
└─────────────────────────────────────────────────────┘
```

---

## 📦 核心文件说明

### 1. `lib/contracts/solana-sbt.ts`

**功能**: Solana SBT程序的底层交互服务

**核心类**: `SolanaSBTService`

**主要方法**:
```typescript
class SolanaSBTService {
  // 铸造SBT（返回Transaction对象，需要钱包签名）
  async mintSBT(params: MintSBTParams, owner: PublicKey): Promise<Transaction>

  // 查询单个SBT
  async getSBT(owner: PublicKey, level: number): Promise<SolanaSBTTokenDetails | null>

  // 查询所有SBT
  async getAllSBTs(owner: PublicKey): Promise<SolanaSBTTokenDetails[]>

  // 更新元数据
  async updateMetadata(owner: PublicKey, level: number, newMetadataURI: string): Promise<Transaction>

  // 检查程序是否初始化
  async isInitialized(): Promise<boolean>

  // 估算交易费用
  async estimateFee(transaction: Transaction): Promise<number>
}
```

**类型定义**:
```typescript
// SBT Token详情
interface SolanaSBTTokenDetails {
  level: number;           // 等级 1-6
  days: number;            // 打卡天数
  mintDate: number;        // 铸造日期时间戳
  owner: string;           // 所有者地址
  metadataURI: string;     // 元数据URI
  updateAuthority: string; // 更新权限地址
}

// 铸造参数
interface MintSBTParams {
  walletAddress: string;  // 钱包地址
  level: number;          // 等级
  days: number;           // 天数
  metadataURI: string;    // 元数据URI
}

// 自定义错误
class SolanaSBTError extends Error {
  code: string;           // 错误代码
  originalError?: any;    // 原始错误
}
```

---

### 2. `lib/solana-sbt-manager.ts`

**功能**: 高级SBT管理接口，与BNB版本保持一致

**核心类**: `SolanaSBTManager`

**主要方法**:
```typescript
class SolanaSBTManager {
  // 铸造SBT并保存到数据库（返回交易对象，需要在组件中签名）
  static async mintAndSaveSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<string>

  // 创建铸造交易（不发送）
  static async createMintTransaction(
    walletAddress: string,
    level: number
  ): Promise<{ transaction: any; metadataURI: string; fee: number }>

  // 检查是否已铸造
  static async hasMintedSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<boolean>

  // 获取所有已铸造的SBT
  static async getMintedSBTs(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<SBTItem[]>

  // 同步链上SBT到本地数据库
  static async syncSBTsFromChain(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<number>

  // 生成SBT元数据JSON
  static generateSBTMetadata(
    level: number,
    chain: 'bnb' | 'solana',
    days: number,
    walletAddress: string
  ): Record<string, any>

  // 估算铸造费用
  static async estimateMintGas(level: number): Promise<number>

  // 格式化交易费用
  static formatGasFee(lamports: number): string
}
```

**特点**:
- ✅ 与BNB版本的`SBTManager`接口保持一致
- ✅ 自动处理元数据URI生成
- ✅ 支持链上数据同步到本地数据库
- ✅ 完整的错误处理和验证

---

### 3. `lib/solana-wallet.ts` (增强版)

**功能**: Solana钱包连接和交易管理

**核心Hook**: `useSolanaWallet()`

**主要功能**:
```typescript
function useSolanaWallet() {
  return {
    // 钱包连接
    connect(): Promise<void>
    disconnect(): Promise<void>

    // 交易签名
    signTransaction(tx: Transaction): Promise<Transaction>
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]>

    // 发送交易
    sendTransaction(tx: Transaction, commitment?: Commitment): Promise<TransactionResult>
    signAndSendTransaction(tx: Transaction): Promise<TransactionResult>

    // 查询
    getBalance(publicKey?: PublicKey): Promise<number>
    getTransactionStatus(signature: string): Promise<TransactionResult>

    // 状态管理
    txStatus: TransactionStatus
    txSignature: string | null
    txError: Error | null
    isTransactionPending: boolean
    isTransactionConfirmed: boolean
    isTransactionFailed: boolean

    // 钱包状态
    isConnected: boolean
    publicKey: string | null
  }
}
```

**交易状态枚举**:
```typescript
enum TransactionStatus {
  IDLE = 'idle',           // 空闲
  SIGNING = 'signing',     // 签名中
  SENDING = 'sending',     // 发送中
  CONFIRMING = 'confirming', // 确认中
  CONFIRMED = 'confirmed', // 已确认
  FAILED = 'failed'        // 失败
}
```

**辅助类**:

1. **`SolanaTransactionHelper`** - 单个交易辅助
```typescript
class SolanaTransactionHelper {
  createTransferTransaction(from, to, amount): Transaction
  async getTransactionStatus(signature): Promise<any>
  async waitForConfirmation(signature): Promise<boolean>
  async getAccountInfo(publicKey): Promise<any>
  async estimateFee(transaction): Promise<number>
  async simulateTransaction(transaction, signer): Promise<any>
}
```

2. **`SolanaBatchTransactionHelper`** - 批量交易辅助
```typescript
class SolanaBatchTransactionHelper extends SolanaTransactionHelper {
  async sendBatchTransactions(transactions, signer, concurrency): Promise<string[]>
  async createAndSendAtomicTransaction(instructions, payer, signer): Promise<string>
  async estimateBatchTransactionFee(instructions, payer): Promise<number>
}
```

---

## 🔧 使用示例

### 示例 1: 在React组件中铸造SBT

```typescript
import { useSolanaWallet } from '@/lib/solana-wallet';
import { SolanaSBTManager } from '@/lib/solana-sbt-manager';
import { Transaction } from '@solana/web3.js';

function MintSBTButton({ level }: { level: number }) {
  const { publicKey, signAndSendTransaction, txStatus, txError } = useSolanaWallet();

  const handleMint = async () => {
    if (!publicKey) {
      alert('请先连接钱包');
      return;
    }

    try {
      // 1. 创建铸造交易
      const { transaction, metadataURI, fee } = await SolanaSBTManager.createMintTransaction(
        publicKey,
        level
      );

      console.log('元数据URI:', metadataURI);
      console.log('预估费用:', SolanaSBTManager.formatGasFee(fee));

      // 2. 签名并发送交易
      const result = await signAndSendTransaction(transaction);

      console.log('交易签名:', result.signature);

      // 3. 标记为已铸造（在交易确认后）
      if (result.status === 'confirmed') {
        await AchievementDB.markSBTClaimed(publicKey, 'solana', level);
        alert(`SBT铸造成功！等级: ${level}`);
      }
    } catch (error) {
      console.error('铸造失败:', error);
      alert(`铸造失败: ${error.message}`);
    }
  };

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={txStatus === 'signing' || txStatus === 'sending' || txStatus === 'confirming'}
      >
        {txStatus === 'signing' && '签名中...'}
        {txStatus === 'sending' && '发送中...'}
        {txStatus === 'confirming' && '确认中...'}
        {txStatus === 'idle' && '铸造SBT'}
      </button>

      {txError && <div className="error">{txError.message}</div>}
    </div>
  );
}
```

---

### 示例 2: 查询用户所有SBT

```typescript
import { SolanaSBTManager } from '@/lib/solana-sbt-manager';
import { useSolanaWallet } from '@/lib/solana-wallet';

function UserSBTGallery() {
  const { publicKey } = useSolanaWallet();
  const [sbts, setSbts] = useState<SBTItem[]>([]);

  useEffect(() => {
    if (!publicKey) return;

    const loadSBTs = async () => {
      try {
        // 从链上获取最新数据
        const userSBTs = await SolanaSBTManager.getMintedSBTs(publicKey, 'solana');
        setSbts(userSBTs);
      } catch (error) {
        console.error('加载SBT失败:', error);
      }
    };

    loadSBTs();
  }, [publicKey]);

  return (
    <div>
      <h2>我的Solana SBT</h2>
      {sbts.map(sbt => (
        <div key={sbt.level}>
          <img src={sbt.image} alt={sbt.title} />
          <h3>{sbt.title}</h3>
          <p>等级: {sbt.level}</p>
          <p>获得日期: {new Date(sbt.achievedDate).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
```

---

### 示例 3: 同步链上数据到本地

```typescript
import { SolanaSBTManager } from '@/lib/solana-sbt-manager';

async function syncUserSBTs(walletAddress: string) {
  try {
    const syncedCount = await SolanaSBTManager.syncSBTsFromChain(
      walletAddress,
      'solana'
    );

    console.log(`同步了${syncedCount}个SBT`);
    return syncedCount;
  } catch (error) {
    console.error('同步失败:', error);
    return 0;
  }
}
```

---

### 示例 4: 估算铸造费用

```typescript
import { SolanaSBTManager } from '@/lib/solana-sbt-manager';

async function estimateMintCost(level: number) {
  try {
    const feeLamports = await SolanaSBTManager.estimateMintGas(level);
    const feeFormatted = SolanaSBTManager.formatGasFee(feeLamports);

    console.log(`等级${level}的预估铸造费用: ${feeFormatted}`);
    return feeLamports;
  } catch (error) {
    console.error('估算费用失败:', error);
    return 5000; // 默认值
  }
}
```

---

## 🔐 错误处理

所有Solana相关的错误都使用自定义错误类：

```typescript
// SBT服务错误
class SolanaSBTError extends Error {
  code: string;          // 错误代码
  originalError?: any;   // 原始错误
}

// 钱包错误
class SolanaWalletError extends Error {
  code: string;          // 错误代码
  originalError?: any;   // 原始错误
}
```

**常见错误代码**:

| 错误代码 | 描述 | 解决方案 |
|---------|------|---------|
| `INVALID_PARAMS` | 参数无效 | 检查输入参数 |
| `ALREADY_MINTED` | SBT已铸造 | 不要重复铸造 |
| `NOT_FOUND` | SBT不存在 | 检查等级是否正确 |
| `CONNECT_FAILED` | 钱包连接失败 | 确保安装了Phantom钱包 |
| `SIGN_FAILED` | 交易签名失败 | 用户取消了签名 |
| `SEND_FAILED` | 发送交易失败 | 检查网络连接 |
| `TX_TIMEOUT` | 交易确认超时 | 检查Solana网络状态 |
| `GET_BALANCE_FAILED` | 获取余额失败 | 检查RPC端点 |

**错误处理示例**:

```typescript
try {
  await SolanaSBTManager.mintAndSaveSBT(walletAddress, 'solana', level);
} catch (error) {
  if (error instanceof SolanaSBTError) {
    switch (error.code) {
      case 'ALREADY_MINTED':
        alert('该等级SBT已铸造');
        break;
      case 'CONNECT_FAILED':
        alert('请先连接Phantom钱包');
        break;
      default:
        alert(`错误: ${error.message}`);
    }
  } else {
    console.error('未知错误:', error);
  }
}
```

---

## ⚙️ 配置要求

### 环境变量

在 `.env.local` 中配置：

```bash
# Solana网络选择: devnet | testnet | mainnet-beta
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Solana SBT程序ID（部署后配置）
NEXT_PUBLIC_SOLANA_SBT_PROGRAM_ID=ZhengDaoSBTPlaceholder11111111111111111111111

# 是否使用IPFS存储元数据
NEXT_PUBLIC_USE_IPFS=false
```

### 依赖包

确保安装了以下依赖：

```bash
# Solana核心库
npm install @solana/web3.js
npm install @solana/wallet-adapter-react
npm install @solana/wallet-adapter-wallets
npm install @solana/wallet-adapter-base

# TypeScript类型
npm install --save-dev @types/node
```

---

## 🧪 测试建议

### 单元测试

```typescript
// __tests__/solana-sbt-manager.test.ts
import { SolanaSBTManager } from '@/lib/solana-sbt-manager';

describe('SolanaSBTManager', () => {
  test('生成SBT元数据', () => {
    const metadata = SolanaSBTManager.generateSBTMetadata(
      1,
      'solana',
      7,
      'test_wallet_address'
    );

    expect(metadata).toHaveProperty('name');
    expect(metadata).toHaveProperty('attributes');
    expect(metadata.attributes).toHaveLength(8);
  });

  test('格式化费用', () => {
    const formatted = SolanaSBTManager.formatGasFee(5000);
    expect(formatted).toBe('0.000005 SOL');
  });
});
```

---

## 📊 与BNB版本的对比

| 功能 | BNB版本 | Solana版本 | 兼容性 |
|-----|---------|-----------|--------|
| 铸造SBT | ✅ | ✅ | ✅ 接口一致 |
| 查询SBT | ✅ | ✅ | ✅ 接口一致 |
| 元数据生成 | ✅ | ✅ | ✅ 接口一致 |
| 费用估算 | ✅ | ✅ | ✅ 接口一致 |
| 链上同步 | ✅ | ✅ | ✅ 接口一致 |
| 交易确认 | ✅ | ✅ | ⚠️ 不同的确认机制 |

---

## 🚀 下一步工作

1. **集成测试**: 编写完整的集成测试
2. **UI组件**: 创建React组件使用这些服务
3. **错误处理**: 添加更详细的用户友好的错误消息
4. **性能优化**: 添加缓存和批量查询
5. **部署**: 部署到Solana Devnet/Mainnet

---

## 📝 更新日志

### v1.0 (2026-01-27)
- ✅ 完成SolanaSBTService核心实现
- ✅ 完成SolanaSBTManager高级接口
- ✅ 增强useSolanaWallet Hook
- ✅ 添加完整的TypeScript类型定义
- ✅ 添加错误处理和交易状态管理
- ✅ 通过TypeScript类型检查

---

## 📞 支持

如有问题，请联系：
- **作者**: AI #3 (前端核心开发)
- **项目**: 证道 - 吾日三省吾身
- **文档**: 本文件 + TASK-C任务说明

---

**祝开发顺利！🚀**
