# 📦 任务包 1：智能合约开发

## 🎯 你的任务

请编写 Solidity 智能合约。

## 📂 存放路径

**你的代码应保存为：** `contracts/ZhengDao.sol`

## 📋 业务逻辑要求

### 1. 数据结构
- 定义 `UserData` 结构体，包含：
  - `principalAmount`: 用户本金
  - `totalBalance`: 总余额（本金 + 收益）
  - `lastCheckInTime`: 最后打卡时间
  - `checkInCount`: 打卡次数

### 2. 核心常量
- `YIELD_RATE = 50` (0.5% = 50/10000)
- `PENALTY_RATE = 1000` (10% = 1000/10000)
- `PENALTY_THRESHOLD = 48 hours`

### 3. 必须实现的函数

#### `deposit()` - 存款函数
- 接受用户存款（payable）
- 更新 `principalAmount` 和 `totalBalance`
- 记录 `lastCheckInTime`
- 触发 `Deposit` 事件

#### `checkIn()` - 打卡函数
- 计算 0.5% 虚拟收益
- 更新 `totalBalance`
- 更新 `lastCheckInTime`
- 增加 `checkInCount`
- 触发 `CheckIn` 事件

#### `mockCheckIn(address user)` - 演示后门 ⚠️ 重要
- **仅 owner 可调用**（使用 `onlyOwner` 修饰符）
- 为指定用户执行打卡操作
- 用于 hackathon 演示，防止翻车

#### `withdraw()` - 提款函数
- 转账全部 `totalBalance` 给用户
- 重置用户余额为 0
- 触发 `Withdrawal` 事件

#### `executePenalty(address[] calldata inactiveUsers)` - 惩罚机制
- 验证用户超过 48 小时未打卡
- 扣除 10% 本金
- 按比例分配给活跃用户
- 触发 `PenaltyDistributed` 事件

### 4. 事件定义
```solidity
event Deposit(address indexed user, uint256 amount, uint256 timestamp);
event CheckIn(address indexed user, uint256 newBalance, uint256 timestamp);
event PenaltyDistributed(address[] inactiveUsers, uint256 totalPenalty, uint256 timestamp);
event Withdrawal(address indexed user, uint256 amount, uint256 timestamp);
```

## 📖 参考文档

详细设计请参考：`.kiro/specs/zheng-dao/design.md` 的 Smart Contract 部分

## ✅ 输出要求

- 单文件完整代码
- 包含完整的注释
- 使用 Solidity ^0.8.0
- 包含 SPDX 许可证标识
