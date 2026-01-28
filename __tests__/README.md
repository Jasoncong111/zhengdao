# 测试目录

本目录包含证道双链SBT系统的所有测试文件。

## 目录结构

```
__tests__/
├── utils/                    # 测试工具和Mock
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

## 快速开始

### 运行所有测试
```bash
npm test
```

### 监听模式
```bash
npm run test:watch
```

### 生成覆盖率报告
```bash
npm run test:coverage
```

### 运行特定测试
```bash
npm test bnb-chain
npm test solana
npm test multi-chain
```

## 测试统计

- **集成测试**: 165个测试用例
- **单元测试**: 待添加
- **组件测试**: 待添加

## 测试覆盖范围

### 集成测试
- ✅ BNB Chain完整流程 (68个测试)
- ✅ Solana完整流程 (45个测试)
- ✅ 双链切换和并行 (52个测试)

### 单元测试 (待添加)
- ⏳ 成就系统核心逻辑
- ⏳ 数据库操作
- ⏳ 钱包管理
- ⏳ 工具函数

### 组件测试 (待添加)
- ⏳ LevelDisplay组件
- ⏳ SBTGallery组件
- ⏳ ClaimSBTFlow组件
- ⏳ ChainSwitcher组件

## 测试工具

### 可用工具函数
```typescript
import {
  renderWithProviders,
  wait,
  waitForCondition,
  createMockAddress,
  createMockTxHash,
  clearIndexedDB,
  mockLocalStorage,
  mockConsole,
} from '@/__tests__/utils';
```

### 可用Mock对象
```typescript
import {
  // Wagmi
  mockAccount,
  mockWalletClient,
  mockPublicClient,
  mockUseAccount,
  mockContractWriteSuccess,
  // Achievement
  mockUserAchievement,
  mockAchievementService,
  mockUserReachesLevel,
  // Solana
  mockSolanaWallet,
  mockSolanaConnection,
  mockUseSolanaWallet,
  mockSolanaConnected,
} from '@/__tests__/utils';
```

## 文档

- [测试指南](../docs/TESTING-GUIDE.md) - 详细的测试使用文档
- [测试报告](../docs/TEST-REPORT.md) - 测试框架搭建总结

## 贡献指南

### 添加新测试

1. **单元测试**: 放在 `__tests__/unit/` 目录
2. **集成测试**: 放在 `__tests__/integration/` 目录
3. **组件测试**: 放在 `__tests__/components/` 目录（待创建）

### 测试命名规范

- 单元测试: `*.unit.test.tsx`
- 集成测试: `*.integration.test.tsx`
- 组件测试: `*.component.test.tsx`

### 测试结构

```typescript
describe('Feature/Component Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  describe('Scenario 1', () => {
    it('should do something', async () => {
      // Arrange
      const data = { ... };

      // Act
      render(<Component data={data} />);

      // Assert
      expect(screen.getByText('expected')).toBeInTheDocument();
    });
  });
});
```

## 常见问题

### 测试超时
增加超时时间：
```typescript
it('test name', async () => {
  // ...
}, 10000); // 10秒
```

### Mock未生效
确保在导入前mock：
```typescript
jest.mock('@/module', () => ({
  someFunction: jest.fn(),
}));
```

### 异步测试
使用waitFor：
```typescript
await waitFor(() => {
  expect(element).toBeVisible();
}, { timeout: 5000 });
```

## 维护者

AI #6 (DevOps与集成工程师)

## 最后更新

2026-01-27
