# 📦 任务包 3：核心 UI 组件

## 🎯 你的任务

编写 4 个 React 组件，**严格按照以下路径输出代码**。

---

## 📂 组件 1：`components/HeroStatus.tsx`

### 功能：资产看板

### 要求：
1. **显示内容：**
   - 总余额（totalBalance）
   - 本金（principalAmount）
   - 收益（yieldAmount = totalBalance - principalAmount）
   - 打卡次数（checkInCount）
   - 连续打卡天数（currentStreak）

2. **样式要求：**
   - 数字使用**黑色衬线字体**（font-family: serif）
   - 使用 **Framer Motion** 实现数字跳动增长动画
   - 边框使用墨黑色（#000000）
   - 无圆角设计

3. **Props 接口：**
```typescript
interface HeroStatusProps {
  totalBalance: bigint;
  principalAmount: bigint;
  yieldAmount: bigint;
  checkInCount: number;
  currentStreak: number;
  walletAddress: string;
}
```

---

## 📂 组件 2：`components/CheckInRing.tsx`

### 功能：核心打卡圆环

### 要求：
1. **未完成状态：**
   - 黑色细线圆环
   - 显示距离惩罚的剩余时间（48小时倒计时）

2. **完成状态：**
   - **朱砂红实心印章**（#D43628）
   - 使用 **Framer Motion** 实现扩散动画
   - 显示"已打卡"文字

3. **交互：**
   - 点击圆环触发打卡流程
   - 打开相机或文件选择器
   - 显示图片预览
   - 上传到 `/api/verify`

4. **Props 接口：**
```typescript
interface CheckInRingProps {
  lastCheckInTime: number;
  onCheckIn: () => Promise<void>;
  isLoading: boolean;
}
```

---

## 📂 组件 3：`components/WeekGrid.tsx`

### 功能：七日修心记录

### 要求：
1. **显示内容：**
   - 显示最近 7 天的打卡记录
   - 每天一个方块

2. **样式：**
   - **已打卡：** 朱砂红实心方块（#D43628）
   - **未打卡：** 黑色叉号或空白方块
   - 显示日期（如：周一、周二）

3. **Props 接口：**
```typescript
interface WeekGridProps {
  checkInRecords: Array<{
    date: Date;
    completed: boolean;
    timestamp?: number;
  }>;
}
```

---

## 📂 组件 4：`components/DuelCard.tsx`

### 功能：论剑卡片（排行榜预览）

### 要求：
1. **显示内容：**
   - CZ 头像（占位图）
   - 右上角 **"Coming Soon"** 红框标签
   - 底部卡片样式

2. **样式：**
   - 边框：墨黑色（#000000）
   - 标签边框：朱砂红（#D43628）
   - 无圆角设计

3. **Props 接口：**
```typescript
interface DuelCardProps {
  leaderboard: Array<{
    address: string;
    balance: bigint;
    streak: number;
    rank: number;
  }>;
  currentUserAddress: string;
}
```

---

## 🎨 全局样式要求

- 颜色：白纸背景(#FFFFFF)、墨黑(#000000)、朱砂红(#D43628)
- 无圆角设计（border-radius: 0）
- 使用 Framer Motion 实现动画
- 响应式设计，适配手机屏幕（max-width: 430px）

## 📖 参考文档

详细设计请参考：`.kiro/specs/zheng-dao/design.md` 的 Components 部分

## ✅ 输出要求

- 4 个完整的 React 组件文件
- 使用 TypeScript
- 包含完整的类型定义
- 使用 Tailwind CSS 进行样式编写
