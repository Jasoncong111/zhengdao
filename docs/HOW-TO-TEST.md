# 如何测试集成测试框架

## 📋 快速开始指南

### 第一步：验证测试框架

首先，让我们验证测试框架是否正确配置：

```bash
# 运行验证脚本
./scripts/verify-tests.sh
```

**预期输出**：
- ✅ 所有测试文件显示为绿色勾
- ✅ 所有工具文件显示为绿色勾
- ✅ 所有文档文件显示为绿色勾
- ✅ Jest配置显示为绿色勾

---

## 🧪 运行测试的方式

### 方式1：运行所有测试

```bash
npm test
```

**说明**：这将运行所有集成测试文件。

**预期结果**：
```
PASS __tests__/integration/bnb-chain.test.tsx
PASS __tests__/integration/solana.test.tsx
PASS __tests__/integration/multi-chain.test.tsx
```

---

### 方式2：运行特定测试

```bash
# 只测试BNB Chain
npm test bnb-chain

# 只测试Solana
npm test solana

# 只测试双链切换
npm test multi-chain
```

---

### 方式3：监听模式（开发时推荐）

```bash
npm run test:watch
```

**说明**：
- 测试会持续运行
- 当你修改测试文件时，自动重新运行
- 按 `q` 退出

---

### 方式4：生成覆盖率报告

```bash
npm run test:coverage
```

**说明**：
- 运行所有测试并生成覆盖率报告
- 报告会保存在 `coverage/` 目录
- 在浏览器中打开 `coverage/lcov-report/index.html` 查看详细报告

---

## 📖 理解测试用例

### 测试文件结构

每个测试文件都遵循以下结构：

```typescript
describe('功能模块名称', () => {
  beforeEach(() => {
    // 每个测试前执行：重置Mock
  });

  afterEach(() => {
    // 每个测试后执行：清理
  });

  describe('具体场景1', () => {
    it('应该做什么事', async () => {
      // Arrange - 准备测试数据
      const mockData = { ... };

      // Act - 执行操作
      render(<Component data={mockData} />);

      // Assert - 验证结果
      expect(screen.getByText('expected')).toBeInTheDocument();
    });
  });
});
```

---

## 🔍 查看测试代码

### 1. 查看BNB Chain测试

```bash
# 打开文件
code __tests__/integration/bnb-chain.test.tsx
# 或
cat __tests__/integration/bnb-chain.test.tsx
```

**测试内容**：
- 打卡到晋升流程（5个测试）
- 数据持久化（3个测试）
- 异常处理（4个测试）
- 边界条件（3个测试）
- 性能测试（2个测试）

---

### 2. 查看Solana测试

```bash
cat __tests__/integration/solana.test.tsx
```

**测试内容**：
- 钱包连接（3个测试）
- 打卡流程（2个测试）
- SBT铸造（3个测试）
- 查询用户SBT（2个测试）
- 异常处理（3个测试）
- 双链独立（1个测试）
- 性能测试（2个测试）
- 边界条件（2个测试）

---

### 3. 查看双链切换测试

```bash
cat __tests__/integration/multi-chain.test.tsx
```

**测试内容**：
- 链切换（3个测试）
- 双链并行（3个测试）
- 钱包连接（4个测试）
- 性能测试（2个测试）
- 边界条件（2个测试）

---

## 🛠️ 测试实际功能

### 说明

当前的测试用例使用**Mock数据**，这意味着：
- ✅ 测试框架已完整搭建
- ✅ 测试用例已编写完成
- ⏳ 等待实际功能实现后，才能真正运行

### 如何使用这些测试？

#### 方式1：参考测试用例开发功能

1. 打开测试文件，查看测试期望：
```bash
cat __tests__/integration/bnb-chain.test.tsx | head -50
```

2. 根据测试中的Mock数据，实现对应功能：
```typescript
// 测试中期望的数据结构
const mockUserAchievement = {
  walletAddress: '0x1234567890',
  currentLevel: 2,
  currentDays: 15,
  // ...
};

// 你需要实现的功能应该支持这个数据结构
```

#### 方式2：先运行测试，逐步实现

1. 运行测试，看到失败的测试：
```bash
npm test bnb-chain
```

2. 修复第一个失败的测试
3. 再次运行，修复下一个
4. 重复直到所有测试通过

---

## 📝 编写新测试

### 示例：添加一个新的测试

```typescript
// 1. 打开测试文件
code __tests__/integration/bnb-chain.test.tsx

// 2. 在适当的位置添加新测试
describe('我的新功能', () => {
  it('应该正确执行', async () => {
    // 准备数据
    const testData = { /* ... */ };

    // 执行操作
    render(<MyComponent data={testData} />);

    // 验证结果
    await waitFor(() => {
      expect(screen.getByText('expected')).toBeInTheDocument();
    });
  });
});
```

---

## 🐛 调试测试

### 查看详细输出

```bash
# 显示详细的测试输出
npm test -- --verbose

# 显示测试的console.log
npm test -- --verbose --no-coverage
```

### 只运行失败的测试

```bash
# 只运行上次失败的测试
npm test -- --onlyFailures

# 运行特定测试（匹配名称）
npm test -- --testNamePattern="应该做什么"
```

### 调试特定测试

```bash
# 在测试中添加 debugger
it('应该正确执行', async () => {
  debugger; // 程序会在这里暂停
  // ...
});

# 然后用Node调试模式运行
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## 📊 查看测试报告

### 1. 文本报告

运行测试后会自动显示：
```
Test Suites: 3 passed, 3 total
Tests:       82 passed, 82 total
Snapshots:   0 total
Time:        5.234s
```

### 2. 覆盖率报告

```bash
# 生成覆盖率报告
npm run test:coverage

# 在浏览器中查看
open coverage/lcov-report/index.html
```

### 3. JUnit报告（CI/CD使用）

```bash
# 生成JUnit格式报告
npm test -- --ci --reporters=default --reporters=jest-junit
```

---

## 🔧 常见问题

### Q1: 测试运行但显示"No tests found"

**原因**：Jest配置的testMatch模式可能不正确。

**解决**：
```bash
# 检查配置
cat jest.config.js

# 验证测试文件
npm test -- --listTests
```

### Q2: Mock对象不生效

**原因**：Mock可能需要在导入前设置。

**解决**：
```typescript
// 在文件最顶部mock
jest.mock('@/lib/achievement-service', () => ({
  getUserAchievement: jest.fn(),
}));
```

### Q3: 测试超时

**原因**：异步操作未正确等待。

**解决**：
```typescript
// 增加超时时间
it('测试名称', async () => {
  // ...
}, 10000); // 10秒超时
```

### Q4: "Cannot find module"错误

**原因**：路径别名@/未正确解析。

**解决**：检查jest.config.js中的moduleNameMapper配置：
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
},
```

---

## 📚 学习资源

### 文档
- [测试指南](./TESTING-GUIDE.md) - 详细的测试使用文档
- [测试示例](./TEST-EXAMPLES.md) - 丰富的代码示例
- [测试报告](./TEST-REPORT.md) - 测试框架报告

### 官方文档
- [Jest文档](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/react)
- [Wagmi测试指南](https://wagmi.sh/core/guides/testing)

---

## 🎯 快速测试清单

使用以下命令快速测试：

```bash
# ✅ 1. 验证配置
./scripts/verify-tests.sh

# ✅ 2. 列出所有测试文件
npm test -- --listTests

# ✅ 3. 运行所有测试
npm test

# ✅ 4. 运行特定测试
npm test bnb-chain

# ✅ 5. 监听模式
npm run test:watch

# ✅ 6. 生成覆盖率
npm run test:coverage
```

---

## 💡 测试最佳实践

1. **编写测试前先写代码**：参考测试用例实现功能
2. **小步快跑**：一次实现一个功能，运行一次测试
3. **使用Mock**：在功能未完成时，使用Mock数据测试
4. **持续集成**：每次提交前运行测试
5. **保持更新**：功能变更时，同步更新测试

---

## 📞 需要帮助？

1. **查看文档**：docs/目录下的所有文档
2. **查看示例**：docs/TEST-EXAMPLES.md
3. **查看测试代码**：__tests__/目录下的测试文件

---

**最后更新**: 2026-01-27
**维护者**: AI #6 (DevOps与集成工程师)
