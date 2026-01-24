# 📦 任务包 5：首页组装与集成

## 🎯 你的任务

编写首页代码，将所有组件串联起来，实现完整的用户流程。

## 📂 存放路径

**你的代码应保存为：** `app/page.tsx`

---

## 📋 功能要求

### 1. 引入所有组件

```typescript
import HeroStatus from '@/components/HeroStatus'
import CheckInRing from '@/components/CheckInRing'
import WeekGrid from '@/components/WeekGrid'
import DuelCard from '@/components/DuelCard'
```

---

### 2. 钱包连接（使用 wagmi）

#### 安装依赖：
```bash
npm install wagmi viem @tanstack/react-query
```

#### 实现功能：
- 显示"连接钱包"按钮
- 连接成功后显示用户地址
- 获取用户余额
- 提供断开连接功能

---

### 3. 串联业务逻辑

#### 完整流程：

```
用户连接钱包
    ↓
显示资产看板（HeroStatus）
    ↓
用户点击打卡圆环（CheckInRing）
    ↓
打开相机/文件选择器
    ↓
用户选择图片
    ↓
上传到 /api/verify
    ↓
【分支 1：演示模式】
  - Header 带 x-demo-mode: true
  - 直接返回成功
    ↓
【分支 2：正常验证】
  - 调用 OpenAI GPT-4o
  - 验证图片场景
    ↓
验证通过
    ↓
调用智能合约 checkIn()
    ↓
等待交易确认
    ↓
圆环变红（朱砂红印章动画）
    ↓
资产增加（显示 +0.5% 动画）
    ↓
更新七日记录（WeekGrid）
```

---

### 4. 状态管理

需要管理的状态：
```typescript
interface AppState {
  // 钱包状态
  isConnected: boolean;
  walletAddress: string | null;
  
  // 用户数据
  principalAmount: bigint;
  totalBalance: bigint;
  lastCheckInTime: number;
  checkInCount: number;
  checkInRecords: CheckInRecord[];
  
  // UI 状态
  isCheckingIn: boolean;
  isDemoMode: boolean;
  errorMessage: string | null;
}
```

---

### 5. 智能合约交互

使用 wagmi 的 hooks：
- `useAccount()` - 获取钱包信息
- `useContractRead()` - 读取合约数据
- `useContractWrite()` - 调用合约函数
- `useWaitForTransaction()` - 等待交易确认

需要调用的合约函数：
- `deposit()` - 存款
- `checkIn()` - 打卡
- `withdraw()` - 提款
- `users(address)` - 查询用户数据

---

### 6. 演示模式切换

支持通过 URL 参数启用演示模式：
```
https://your-app.com/?demo=true
```

检测方式：
```typescript
const searchParams = useSearchParams();
const isDemoMode = searchParams.get('demo') === 'true';
```

---

## 🎨 页面布局

```
┌─────────────────────────┐
│   连接钱包按钮          │
├─────────────────────────┤
│   HeroStatus            │
│   (资产看板)            │
├─────────────────────────┤
│   CheckInRing           │
│   (打卡圆环)            │
├─────────────────────────┤
│   WeekGrid              │
│   (七日记录)            │
├─────────────────────────┤
│   DuelCard              │
│   (论剑卡片)            │
└─────────────────────────┘
```

---

## 📖 参考文档

详细设计请参考：
- `.kiro/specs/zheng-dao/design.md` - 完整架构设计
- `.kiro/specs/zheng-dao/requirements.md` - 需求文档

---

## ✅ 输出要求

- 完整的 Next.js 页面组件
- 使用 TypeScript
- 使用 wagmi 进行钱包和合约交互
- 实现完整的用户流程
- 包含错误处理和加载状态
- 支持演示模式
- 响应式设计（max-width: 430px）
