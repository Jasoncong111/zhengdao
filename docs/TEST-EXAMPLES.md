# 测试使用示例

本文档提供证道双链SBT系统的测试使用示例。

## 目录

1. [集成测试示例](#集成测试示例)
2. [单元测试示例](#单元测试示例)
3. [组件测试示例](#组件测试示例)
4. [Mock使用示例](#mock使用示例)
5. [常见场景测试](#常见场景测试)

---

## 集成测试示例

### 示例1: 测试用户打卡流程

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { mockAchievementService, resetAchievementMocks } from '@/__tests__/utils';

describe('用户打卡流程', () => {
  beforeEach(() => {
    resetAchievementMocks();
  });

  it('用户打卡后应该更新等级', async () => {
    // 1. 准备测试数据
    const initialData = {
      currentLevel: 1,
      currentDays: 7,
    };

    mockAchievementService.getUserAchievement.mockResolvedValue(initialData);
    mockAchievementService.saveReflection.mockResolvedValue({
      success: true,
      newLevel: 2,
      days: 8,
    });

    // 2. 渲染组件
    render(<CheckInButton />);

    // 3. 用户点击打卡
    const checkInButton = screen.getByText(/打卡/i);
    fireEvent.click(checkInButton);

    // 4. 验证结果
    await waitFor(() => {
      expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      expect(mockAchievementService.saveReflection).toHaveBeenCalled();
    });
  });
});
```

### 示例2: 测试钱包连接

```typescript
import {
  mockUseAccount,
  mockUseConnect,
  mockSolanaConnected,
} from '@/__tests__/utils';

describe('钱包连接测试', () => {
  it('BNB钱包连接成功', async () => {
    mockUseAccount.address = '0x1234567890';
    mockUseAccount.isConnected = true;

    render(<WalletConnector chain="bnb" />);

    await waitFor(() => {
      expect(screen.getByText(/0x1234...7890/i)).toBeInTheDocument();
      expect(screen.getByText(/已连接/i)).toBeInTheDocument();
    });
  });

  it('Solana钱包连接成功', async () => {
    mockSolanaConnected();

    render(<WalletConnector chain="solana" />);

    await waitFor(() => {
      expect(screen.getByText(/已连接/i)).toBeInTheDocument();
    });
  });
});
```

### 示例3: 测试SBT铸造

```typescript
import {
  mockContractWriteSuccess,
  createMockTxHash,
} from '@/__tests__/utils';

describe('SBT铸造测试', () => {
  it('应该成功铸造SBT', async () => {
    const txHash = createMockTxHash();
    mockContractWriteSuccess(txHash);

    render(<ClaimSBTFlow level={1} />);

    const claimButton = screen.getByText(/领取SBT/i);
    fireEvent.click(claimButton);

    await waitFor(() => {
      expect(screen.getByText(/铸造成功/i)).toBeInTheDocument();
      expect(screen.getByText(/交易ID:/i)).toBeInTheDocument();
    });
  });
});
```

---

## 单元测试示例

### 示例1: 测试等级计算

```typescript
import { calculateLevel, ACHIEVEMENT_LEVELS } from '@/lib/achievement-system';

describe('等级计算', () => {
  it('7天应该是Level 1', () => {
    expect(calculateLevel(7)).toBe(1);
  });

  it('30天应该是Level 2', () => {
    expect(calculateLevel(30)).toBe(2);
  });

  it('365天应该是Level 6', () => {
    expect(calculateLevel(365)).toBe(6);
  });

  it('应该正确处理边界值', () => {
    expect(calculateLevel(6)).toBe(0);  // 未达到Level 1
    expect(calculateLevel(7)).toBe(1);  // 刚好达到Level 1
    expect(calculateLevel(29)).toBe(1); // Level 1范围内
    expect(calculateLevel(30)).toBe(2); // 刚好达到Level 2
  });
});
```

### 示例2: 测试进度计算

```typescript
import { calculateProgress } from '@/lib/achievement-system';

describe('进度计算', () => {
  it('Level 1: 0天应该0%', () => {
    expect(calculateProgress(0, 1)).toBe(0);
  });

  it('Level 1: 7天应该100%', () => {
    expect(calculateProgress(7, 1)).toBe(100);
  });

  it('Level 1: 3天应该约43%', () => {
    expect(calculateProgress(3, 1)).toBeCloseTo(42.86, 1);
  });

  it('应该正确计算所有等级的进度', () => {
    expect(calculateProgress(15, 2)).toBe(50);  // Level 2的一半
    expect(calculateProgress(45, 3)).toBe(25);  // Level 3的1/4
  });
});
```

### 示例3: 测试数据库操作

```typescript
import {
  initDB,
  saveUserAchievement,
  getUserAchievement,
} from '@/lib/db-achievement';

describe('数据库操作', () => {
  beforeEach(async () => {
    await clearAllDatabases();
  });

  it('应该保存和读取用户数据', async () => {
    const mockData = {
      walletAddress: '0x1234567890',
      chain: 'bnb',
      currentLevel: 1,
      currentDays: 7,
    };

    await saveUserAchievement(mockData);
    const result = await getUserAchievement('0x1234567890', 'bnb');

    expect(result).toBeDefined();
    expect(result?.currentLevel).toBe(1);
    expect(result?.currentDays).toBe(7);
  });

  it('应该正确处理不存在的用户', async () => {
    const result = await getUserAchievement('nonexistent', 'bnb');
    expect(result).toBeNull();
  });
});
```

---

## 组件测试示例

### 示例1: 测试LevelDisplay组件

```typescript
import { render, screen } from '@testing-library/react';
import LevelDisplay from '@/components/achievement/LevelDisplay';

describe('LevelDisplay组件', () => {
  it('应该显示当前等级', () => {
    render(<LevelDisplay level={2} days={15} />);

    expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
    expect(screen.getByText(/15天/i)).toBeInTheDocument();
  });

  it('应该显示进度条', () => {
    const { container } = render(
      <LevelDisplay level={1} days={3} progress={43} />
    );

    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).toHaveStyle({ width: '43%' });
  });

  it('应该显示正确的等级名称', () => {
    render(<LevelDisplay level={1} days={7} />);

    expect(screen.getByText(/初识证道/i)).toBeInTheDocument();
  });
});
```

### 示例2: 测试ClaimSBTFlow组件

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { mockContractWriteSuccess } from '@/__tests__/utils';
import ClaimSBTFlow from '@/components/achievement/ClaimSBTFlow';

describe('ClaimSBTFlow组件', () => {
  it('应该显示3步申领流程', () => {
    render(<ClaimSBTFlow level={1} />);

    expect(screen.getByText(/步骤1/i)).toBeInTheDocument();
    expect(screen.getByText(/步骤2/i)).toBeInTheDocument();
    expect(screen.getByText(/步骤3/i)).toBeInTheDocument();
  });

  it('应该引导用户完成申领', async () => {
    mockContractWriteSuccess();

    render(<ClaimSBTFlow level={1} />);

    // 步骤1: 确认
    const confirmButton = screen.getByText(/确认申领/i);
    fireEvent.click(confirmButton);

    // 步骤2: 签名
    await waitFor(() => {
      expect(screen.getByText(/签名交易/i)).toBeInTheDocument();
    });

    const signButton = screen.getByText(/签名/i);
    fireEvent.click(signButton);

    // 步骤3: 完成
    await waitFor(() => {
      expect(screen.getByText(/申领成功/i)).toBeInTheDocument();
    });
  });
});
```

### 示例3: 测试ChainSwitcher组件

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ChainSwitcher from '@/components/achievement/ChainSwitcher';

describe('ChainSwitcher组件', () => {
  it('应该显示两条链的选项', () => {
    render(<ChainSwitcher currentChain="bnb" />);

    expect(screen.getByText(/BNB Chain/i)).toBeInTheDocument();
    expect(screen.getByText(/Solana/i)).toBeInTheDocument();
  });

  it('应该高亮当前链', () => {
    const { container } = render(
      <ChainSwitcher currentChain="bnb" />
    );

    const bnbButton = screen.getByText(/BNB Chain/i);
    expect(bnbButton).toHaveClass('active');
  });

  it('点击应该切换链', () => {
    const onChainChange = jest.fn();
    render(
      <ChainSwitcher currentChain="bnb" onChainChange={onChainChange} />
    );

    const solanaButton = screen.getByText(/Solana/i);
    fireEvent.click(solanaButton);

    expect(onChainChange).toHaveBeenCalledWith('solana');
  });
});
```

---

## Mock使用示例

### 示例1: Mock合约调用

```typescript
import {
  mockContractWriteSuccess,
  mockContractCallSuccess,
  mockContractWriteFailure,
} from '@/__tests__/utils';

// 模拟成功写入
mockContractWriteSuccess('0xabc123...');

// 模拟成功读取
mockContractCallSuccess({ level: 1, days: 7 });

// 模拟失败
mockContractWriteFailure(new Error('Transaction failed'));
```

### 示例2: Mock成就服务

```typescript
import {
  mockAchievementService,
  mockUserReachesLevel,
  resetAchievementMocks,
} from '@/__tests__/utils';

// Mock用户达到某个等级
const userData = mockUserReachesLevel(3);
mockAchievementService.getUserAchievement.mockResolvedValue(userData);

// 测试完成后重置
afterEach(() => {
  resetAchievementMocks();
});
```

### 示例3: Mock Solana钱包

```typescript
import {
  mockSolanaConnected,
  mockSolanaDisconnected,
  mockSolanaTransactionSuccess,
} from '@/__tests__/utils';

// 模拟已连接
mockSolanaConnected();

// 模拟未连接
mockSolanaDisconnected();

// 模拟交易成功
mockSolanaTransactionSuccess('signature...');
```

---

## 常见场景测试

### 场景1: 新用户首次打卡

```typescript
it('新用户首次打卡流程', async () => {
  // 1. 新用户数据（0天）
  const newUser = {
    currentLevel: 0,
    currentDays: 0,
  };

  mockAchievementService.getUserAchievement.mockResolvedValue(newUser);

  // 2. 用户打卡
  render(<CheckInPage />);

  const checkInButton = screen.getByText(/首次打卡/i);
  fireEvent.click(checkInButton);

  // 3. 验证更新
  await waitFor(() => {
    expect(screen.getByText(/打卡成功/i)).toBeInTheDocument();
    expect(screen.getByText(/1天/i)).toBeInTheDocument();
  });
});
```

### 场景2: 达到等级并申领SBT

```typescript
it('达到Level 1并申领SBT', async () => {
  // 1. 用户打卡到7天
  const userWith7Days = {
    currentLevel: 1,
    currentDays: 7,
    claimedLevels: [],
  };

  mockAchievementService.getUserAchievement.mockResolvedValue(userWith7Days);
  mockAchievementService.checkCanClaim.mockResolvedValue(true);
  mockContractWriteSuccess();

  // 2. 显示申领提示
  render(<AchievementPage />);

  expect(screen.getByText(/可以领取SBT了/i)).toBeInTheDocument();

  // 3. 点击申领
  const claimButton = screen.getByText(/领取SBT/i);
  fireEvent.click(claimButton);

  // 4. 完成申领
  await waitFor(() => {
    expect(screen.getByText(/申领成功/i)).toBeInTheDocument();
    expect(mockAchievementService.markAsClaimed).toHaveBeenCalledWith(
      expect.any(String),
      'bnb',
      1
    );
  });
});
```

### 场景3: 双链切换

```typescript
it('从BNB切换到Solana', async () => {
  render(<DualChainApp />);

  // 初始显示BNB数据
  expect(screen.getByTestId('current-chain')).toHaveTextContent('BNB');

  // 切换到Solana
  const switchButton = screen.getByText(/切换到Solana/i);
  fireEvent.click(switchButton);

  // 验证切换成功
  await waitFor(() => {
    expect(screen.getByTestId('current-chain')).toHaveTextContent('Solana');
    expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
  });
});
```

### 场景4: 错误处理

```typescript
it('网络错误时显示重试按钮', async () => {
  // Mock网络错误
  mockAchievementService.saveReflection.mockRejectedValue(
    new Error('Network error')
  );

  render(<CheckInPage />);

  const checkInButton = screen.getByText(/打卡/i);
  fireEvent.click(checkInButton);

  // 验证错误提示
  await waitFor(() => {
    expect(screen.getByText(/网络错误/i)).toBeInTheDocument();
    expect(screen.getByTestId('retry-button')).toBeInTheDocument();
  });

  // 点击重试
  const retryButton = screen.getByTestId('retry-button');
  fireEvent.click(retryButton);

  // Mock成功返回
  mockAchievementService.saveReflection.mockResolvedValue({
    success: true,
    newLevel: 2,
  });

  // 验证成功
  await waitFor(() => {
    expect(screen.getByText(/打卡成功/i)).toBeInTheDocument();
  });
});
```

### 场景5: 连续打卡中断

```typescript
it('连续打卡中断后重新计算', async () => {
  // 用户有连续打卡记录
  const userWithStreak = {
    consecutiveDays: 5,
    lastCheckIn: Date.now() - 48 * 60 * 60 * 1000, // 2天前
  };

  mockAchievementService.getCheckInHistory.mockResolvedValue([
    {
      date: '2024-01-15',
      timestamp: Date.now() - 48 * 60 * 60 * 1000,
    },
  ]);

  render(<CheckInPage />);

  // 连续天数应该被重置
  expect(screen.getByText(/连续天数: 0/i)).toBeInTheDocument();

  // 重新打卡
  const checkInButton = screen.getByText(/打卡/i);
  fireEvent.click(checkInButton);

  // 验证重新开始
  await waitFor(() => {
    expect(screen.getByText(/连续天数: 1/i)).toBeInTheDocument();
  });
});
```

---

## 测试最佳实践

### 1. 使用描述性的测试名称

```typescript
// ✅ 好的测试名称
it('用户打卡7天后应该达到Level 1', () => {});

// ❌ 不好的测试名称
it('测试打卡', () => {});
```

### 2. 遵循AAA模式（Arrange-Act-Assert）

```typescript
it('应该正确计算等级', () => {
  // Arrange - 准备测试数据
  const days = 30;

  // Act - 执行操作
  const level = calculateLevel(days);

  // Assert - 验证结果
  expect(level).toBe(2);
});
```

### 3. 使用waitFor处理异步操作

```typescript
// ✅ 好的做法
await waitFor(() => {
  expect(element).toBeVisible();
});

// ❌ 不好的做法
expect(element).toBeVisible(); // 可能会在异步操作完成前执行
```

### 4. 及时清理Mock和副作用

```typescript
afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  await clearIndexedDB();
});
```

### 5. 使用data-testid避免依赖实现细节

```typescript
// ✅ 好的做法
<button data-testid="submit-button">提交</button>
const button = screen.getByTestId('submit-button');

// ❌ 不好的做法（依赖CSS类）
<button className="btn-primary">提交</button>
const button = screen.getByClassName('btn-primary');
```

---

## 更多资源

- [测试指南](./TESTING-GUIDE.md)
- [测试报告](./TEST-REPORT.md)
- [Jest官方文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
