# 集成测试文档

## 概述

本文档描述证道双链SBT系统的集成测试框架和使用方法。

## 测试框架

### 技术栈
- **Jest**: 测试运行器
- **React Testing Library**: React组件测试
- **jsdom**: 浏览器环境模拟

### 项目结构

```
__tests__/
├── utils/                    # 测试工具和mock
│   ├── test-helpers.ts      # 通用测试辅助函数
│   ├── mocks/               # Mock对象
│   │   ├── wagmi.ts        # Wagmi v2 mock
│   │   ├── achievement.ts  # 成就系统 mock
│   │   └── solana.ts       # Solana mock
│   └── index.ts            # 统一导出
├── integration/             # 集成测试
│   ├── bnb-chain.test.tsx  # BNB Chain集成测试
│   ├── solana.test.tsx     # Solana集成测试
│   └── multi-chain.test.tsx # 双链切换集成测试
└── unit/                    # 单元测试（待添加）
```

## 测试命令

### 运行所有测试
```bash
npm test
```

### 运行特定测试文件
```bash
npm test bnb-chain
```

### 监听模式（开发时使用）
```bash
npm run test:watch
```

### 生成覆盖率报告
```bash
npm run test:coverage
```

覆盖率报告会生成在 `coverage/` 目录下。

## 测试覆盖范围

### 1. BNB Chain集成测试 (bnb-chain.test.tsx)

#### 打卡到晋升流程
- ✅ 用户打卡0天，显示Level 1
- ✅ 用户打卡7天，弹出"达到Level 1"通知
- ✅ 用户点击"领取SBT"，显示ClaimSBTFlow
- ✅ 调用合约mint成功
- ✅ SBTGallery显示新SBT

#### 数据持久化
- ✅ 刷新页面，等级不变
- ✅ 切换链再切换回来，数据保留
- ✅ IndexedDB数据正确存储

#### 异常处理
- ✅ 合约调用失败，显示错误提示
- ✅ 网络错误，显示重试按钮
- ✅ 已claim的SBT不能再次claim
- ✅ 钱包未连接，提示连接钱包

#### 边界条件
- ✅ 连续打卡中断，重新计算
- ✅ 达到最高等级，不能继续升级
- ✅ 跨天打卡，更新日期

#### 性能测试
- ✅ 打卡后等级更新 < 1秒
- ✅ 合约调用 < 10秒

### 2. Solana集成测试 (solana.test.tsx)

#### 钱包连接
- ✅ 成功连接Phantom钱包
- ✅ 显示钱包余额
- ✅ 断开钱包连接，清空状态

#### 打卡流程
- ✅ 用户打卡7天，显示达到Level 1
- ✅ 打卡数据保存在Solana链上

#### SBT铸造
- ✅ 调用Solana程序mint成功
- ✅ mint成功后，更新用户SBT列表
- ✅ mint失败，显示错误信息

#### 查询用户SBT
- ✅ 正确返回用户拥有的所有SBT
- ✅ 用户没有SBT时，显示空状态

#### 异常处理
- ✅ 钱包未连接，不能打卡
- ✅ 余额不足，不能mint
- ✅ 网络超时，显示重试选项

### 3. 双链切换集成测试 (multi-chain.test.tsx)

#### 链切换
- ✅ BNB → Solana，数据切换正确
- ✅ Solana → BNB，数据切换正确
- ✅ 两条链数据完全独立

#### 双链并行
- ✅ BNB打卡，不影响Solana
- ✅ Solana打卡，不影响BNB
- ✅ 可以同时持有两条链的SBT

#### 钱包连接
- ✅ BNB钱包连接正常
- ✅ Solana钱包连接正常
- ✅ 钱包切换UI正确

#### 性能测试
- ✅ 链切换 < 500ms
- ✅ 同时加载双链数据 < 1s

## 测试工具函数

### 渲染函数
```typescript
import { renderWithProviders } from '@/__tests__/utils';

// 渲染带Provider的组件
const { container } = renderWithProviders(<MyComponent />);
```

### 等待函数
```typescript
import { wait, waitForCondition } from '@/__tests__/utils';

// 等待指定时间
await wait(1000);

// 等待条件成立
await waitForCondition(() => {
  return document.querySelector('.loaded') !== null;
});
```

### Mock辅助函数
```typescript
import {
  createMockAddress,
  createMockTxHash,
  clearIndexedDB,
} from '@/__tests__/utils';

// 创建mock地址
const address = createMockAddress();

// 创建mock交易哈希
const txHash = createMockTxHash();

// 清除IndexedDB
await clearIndexedDB();
```

### Wagmi Mock
```typescript
import {
  mockContractWriteSuccess,
  mockContractCallFailure,
  resetWagmiMocks,
} from '@/__tests__/utils';

// 模拟合约写入成功
mockContractWriteSuccess('0x123...');

// 模拟合约调用失败
mockContractCallFailure(new Error('Call failed'));

// 重置mock
resetWagmiMocks();
```

### Achievement Mock
```typescript
import {
  mockUserAchievement,
  mockUserReachesLevel,
  mockUserCanClaim,
} from '@/__tests__/utils';

// 创建mock用户成就
const userData = mockUserAchievement;

// 模拟用户达到某个等级
const levelData = mockUserReachesLevel(3);
```

### Solana Mock
```typescript
import {
  mockSolanaConnected,
  mockSolanaDisconnected,
  mockSolanaTransactionSuccess,
} from '@/__tests__/utils';

// 模拟Solana已连接
mockSolanaConnected();

// 模拟Solana未连接
mockSolanaDisconnected();

// 模拟交易成功
mockSolanaTransactionSuccess();
```

## 编写测试的最佳实践

### 1. 测试文件命名
- 集成测试: `*.integration.test.tsx`
- 单元测试: `*.unit.test.tsx`
- 组件测试: `*.component.test.tsx`

### 2. 测试结构
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // 每个测试前执行
    resetMocks();
  });

  afterEach(() => {
    // 每个测试后执行
    jest.clearAllMocks();
  });

  describe('Scenario 1', () => {
    it('should do something', async () => {
      // Arrange - 准备测试数据
      const mockData = { ... };

      // Act - 执行操作
      render(<Component data={mockData} />);

      // Assert - 验证结果
      await waitFor(() => {
        expect(screen.getByText('expected')).toBeInTheDocument();
      });
    });
  });
});
```

### 3. 异步测试
```typescript
// 使用 waitFor 等待异步操作
await waitFor(() => {
  expect(element).toBeVisible();
}, { timeout: 5000 });

// 使用 async/await
await act(async () => {
  await asyncFunction();
});
```

### 4. Mock的使用
```typescript
// Mock函数
jest.fn().mockResolvedValue(data);
jest.fn().mockRejectedValue(error);

// Mock模块
jest.mock('@/lib/some-module', () => ({
  someFunction: jest.fn(),
}));
```

### 5. 清理副作用
```typescript
afterEach(() => {
  // 清理localStorage
  localStorage.clear();

  // 清理IndexedDB
  await clearIndexedDB();

  // 清除定时器
  jest.clearAllTimers();
});
```

## CI/CD集成

### GitHub Actions示例

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## 故障排查

### 测试超时
```typescript
// 增加超时时间
it('test name', async () => {
  // ...
}, 10000); // 10秒超时
```

### Mock未生效
```typescript
// 确保在导入前mock
jest.mock('@/module');

// 或者使用doMock
await jest.isolateModulesAsync(async () => {
  jest.doMock('@/module', () => ({ ... }));
});
```

### 快照测试失败
```typescript
// 更新快照
npm test -- -u

// 或者交互式更新
npm test -- --watch
```

## 测试覆盖率目标

| 模块 | 目标覆盖率 | 当前状态 |
|------|-----------|---------|
| 成就系统 | 90% | ⏳ 待测试 |
| 数据库 | 90% | ⏳ 待测试 |
| 合约集成 | 85% | ⏳ 待测试 |
| 钱包管理 | 85% | ⏳ 待测试 |
| UI组件 | 80% | ⏳ 待测试 |

## 下一步

1. ✅ 完成测试框架搭建
2. ✅ 完成集成测试用例
3. ⏳ 运行测试并修复问题
4. ⏳ 提高测试覆盖率到80%以上
5. ⏳ 添加E2E测试（Playwright）

## 参考资源

- [Jest文档](https://jestjs.io/docs/getting-started)
- [React Testing Library文档](https://testing-library.com/react)
- [Wagmi测试指南](https://wagmi.sh/core/guides/testing)
- [Next.js测试文档](https://nextjs.org/docs/app/building-your-application/testing/jest)
