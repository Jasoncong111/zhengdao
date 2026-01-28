# AI #3 功能快速使用指南

## 🎯 核心功能使用

### 1. 成就系统 - 获取用户等级

```typescript
import { AchievementService } from '@/lib/achievement-service';

// 获取统计信息
const stats = await AchievementService.getCheckInStats(
  '0x123...',  // 钱包地址
  'bnb'        // 链类型
);

console.log(stats.currentLevel);     // 当前等级: 1-6
console.log(stats.totalDays);        // 总打卡天数
console.log(stats.daysToNextLevel);  // 距离下一等级天数
console.log(stats.progress);         // 进度百分比
console.log(stats.canClaimSBT);      // 是否可领取SBT
console.log(stats.claimableLevels);  // 可领取的等级列表
```

### 2. 记录打卡

```typescript
// 执行打卡
const result = await AchievementService.recordCheckIn(
  '0x123...',
  'bnb'
);

console.log(result.leveledUp);   // 是否升级
console.log(result.newLevel);    // 新等级
console.log(result.checkInDate); // 打卡日期
```

### 3. BNB Chain - 连接钱包

```typescript
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address, isConnected, connector } = useAccount();

  if (isConnected) {
    console.log('已连接:', address);
  }
}
```

### 4. BNB Chain - 铸造SBT

```typescript
import { useMintSBT } from '@/lib/contracts/sbt';

function MintSBT() {
  const { mintSBT, isPending, isConfirming, isConfirmed, hash } = useMintSBT();

  const handleMint = async () => {
    await mintSBT(
      '0x123...',        // 接收地址
      1,                 // 等级
      7,                 // 天数
      '/metadata/1.json' // 元数据URI
    );
  };

  return (
    <button onClick={handleMint} disabled={isPending}>
      {isPending ? '铸造中...' : '铸造SBT'}
    </button>
  );
}
```

### 5. 双链管理 - 切换链

```typescript
import { useChainManager } from '@/lib/chain-manager';

function ChainSwitcher() {
  const { currentChain, chains, switchChain, isChainConnected } = useChainManager();

  return (
    <div>
      {chains.map(chain => (
        <button
          key={chain.type}
          onClick={() => switchChain(chain.type)}
          disabled={!isChainConnected(chain.type)}
        >
          {chain.name} {currentChain === chain.type ? '✓' : ''}
        </button>
      ))}
    </div>
  );
}
```

### 6. 数据库 - 查询打卡记录

```typescript
import { AchievementDB } from '@/lib/db-achievement';

// 检查今天是否已打卡
const hasCheckedIn = await AchievementDB.hasCheckedInToday(
  '0x123...',
  'bnb'
);

// 获取最近30条打卡记录
const recentCheckIns = await AchievementDB.getRecentCheckIns(
  '0x123...',
  'bnb',
  30
);

// 获取总打卡天数
const totalDays = await AchievementDB.getTotalCheckInDays(
  '0x123...',
  'bnb'
);
```

## 📊 成就等级说明

| 等级 | 称号 | 所需天数 | 奖励加成 |
|-----|------|---------|---------|
| 1 | 十一路奋斗者 | 7天 | 0% |
| 2 | 笃行者 | 30天 | 5% |
| 3 | 持久力王者 | 100天 | 10% |
| 4 | 百里挑一 | 365天 | 20% |
| 5 | 千里挑一 | 1000天 | 30% |
| 6 | 证道成圣 | 3650天（10年） | 50% |

## 🔧 完整示例：打卡流程

```typescript
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { AchievementService } from '@/lib/achievement-service';
import { useMintSBT } from '@/lib/contracts/sbt';

export default function CheckInButton() {
  const { address, isConnected } = useAccount();
  const { mintSBT, isPending } = useMintSBT();
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    if (!isConnected || !address) {
      alert('请先连接钱包');
      return;
    }

    setLoading(true);

    try {
      // 1. 执行打卡
      const result = await AchievementService.recordCheckIn(address, 'bnb');

      // 2. 检查是否升级
      if (result.leveledUp) {
        alert(`🎉 恭喜升级到 Level ${result.newLevel}！`);

        // 3. 检查是否可以领取SBT
        const canClaim = await AchievementService.canClaimSBT(
          address,
          'bnb',
          result.newLevel
        );

        if (canClaim) {
          // 4. 铸造SBT
          await mintSBT(
            address,
            result.newLevel,
            result.newLevel * 7, // 简化计算
            `/metadata/${result.newLevel}.json`
          );
        }
      } else {
        alert('✅ 打卡成功！');
      }
    } catch (error) {
      console.error('打卡失败:', error);
      alert('❌ 打卡失败：' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={!isConnected || loading || isPending}
    >
      {loading ? '处理中...' : '打卡'}
    </button>
  );
}
```

## 🚨 错误处理

```typescript
import { handleDBError } from '@/lib/db';

try {
  // 数据库操作
  await AchievementDB.updateUserAchievement(address, 'bnb', {
    currentLevel: 2
  });
} catch (error) {
  // 统一错误处理
  handleDBError(error, '更新成就');
}
```

## 📝 注意事项

1. **钱包地址格式**
   - BNB Chain: `0x`开头的42位十六进制
   - Solana: Base58编码的32-44位字符串

2. **链类型**
   - 只支持 `'bnb'` | `'solana'`
   - 使用 `type ChainType = 'bnb' | 'solana'` 确保类型安全

3. **异步操作**
   - 所有数据库操作都是异步的
   - 所有合约交互都是异步的
   - 使用 `async/await` 处理

4. **错误处理**
   - 始终使用 try-catch 包裹异步操作
   - 提供友好的错误提示

## 🎨 颜色主题

```typescript
const LEVEL_COLORS = {
  1: { primary: '#6B7280', secondary: '#FFFFFF' }, // 灰色
  2: { primary: '#3B82F6', secondary: '#DBEAFE' }, // 蓝色
  3: { primary: '#10B981', secondary: '#D1FAE5' }, // 绿色
  4: { primary: '#F59E0B', secondary: '#FEF3C7' }, // 黄色
  5: { primary: '#8B5CF6', secondary: '#EDE9FE' }, // 紫色
  6: { primary: '#EC4899', secondary: '#FCE7F3' }  // 粉色
};
```

---

**祝开发顺利！** 🎉
