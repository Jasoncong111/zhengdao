# 📚 证道项目 - 文件索引

## 🎯 快速导航

### 给投资人看 💰
1. **`PITCH_DECK.md`** - 完整的投资演示文档
2. **`README.md`** - 项目详细报告
3. **`TOKENOMICS_DESIGN.md`** - 经济模型设计

### 给开发者看 👨‍💻
1. **`QUICK_START.md`** - 快速启动指南
2. **`README.md`** - 技术架构说明
3. **`contracts/ZhengDaoV2.sol`** - 智能合约代码

### 给社区看 👥
1. **`COMMUNITY_DISCUSSION_GUIDE.md`** - 讨论指南
2. **`README.md`** - 项目介绍
3. **`V2_UPGRADE_SUMMARY.md`** - 最新进展

### 给设计师看 🎨
1. **`LAYOUT_DESIGN.md`** - 页面布局设计
2. **`app/page.tsx`** - 首页代码
3. **`app/analytics/page.tsx`** - 分析页面代码

---

## 📁 完整文件列表

### 📄 核心文档（必读）

| 文件名 | 位置 | 用途 | 优先级 |
|--------|------|------|--------|
| **README.md** | 根目录 | 完整的项目报告 | ⭐⭐⭐⭐⭐ |
| **PITCH_DECK.md** | 根目录 | 投资人演示文档 | ⭐⭐⭐⭐⭐ |
| **COMMUNITY_DISCUSSION_GUIDE.md** | 根目录 | 社区讨论指南 | ⭐⭐⭐⭐⭐ |

### 📄 设计文档

| 文件名 | 位置 | 用途 | 优先级 |
|--------|------|------|--------|
| **TOKENOMICS_DESIGN.md** | 根目录 | 经济模型详细设计 | ⭐⭐⭐⭐⭐ |
| **LAYOUT_DESIGN.md** | 根目录 | 页面布局设计 | ⭐⭐⭐⭐ |
| **V2_UPGRADE_SUMMARY.md** | 根目录 | V2 升级总结 | ⭐⭐⭐⭐ |

### 📄 开发文档

| 文件名 | 位置 | 用途 | 优先级 |
|--------|------|------|--------|
| **QUICK_START.md** | 根目录 | 快速启动指南 | ⭐⭐⭐⭐ |
| **START_NOW.md** | 根目录 | 立即开始指南 | ⭐⭐⭐ |

### 💻 智能合约

| 文件名 | 位置 | 说明 | 优先级 |
|--------|------|------|--------|
| **ZhengDao.sol** | contracts/ | V1 基础合约 | ⭐⭐⭐ |
| **ZhengDaoV2.sol** | contracts/ | V2 双池合约 | ⭐⭐⭐⭐⭐ |

### 🎨 前端页面

| 文件名 | 位置 | 说明 | 优先级 |
|--------|------|------|--------|
| **page.tsx** | app/ | 首页 | ⭐⭐⭐⭐⭐ |
| **page.tsx** | app/analytics/ | 分析页面 | ⭐⭐⭐⭐ |
| **route.ts** | app/api/verify/ | AI 验证 API | ⭐⭐⭐ |

### 🧩 React 组件

| 文件名 | 位置 | 说明 | 优先级 |
|--------|------|------|--------|
| **CheckInRing.tsx** | components/ | 打卡圆环 | ⭐⭐⭐⭐⭐ |
| **HeroStatus.tsx** | components/ | 资产看板 | ⭐⭐⭐⭐ |
| **WeekGrid.tsx** | components/ | 七日记录 | ⭐⭐⭐⭐ |
| **MockCamera.tsx** | components/ | 模拟相机 | ⭐⭐⭐ |
| **YieldChart.tsx** | components/ | 收益曲线 | ⭐⭐⭐⭐ |
| **PVPDemo.tsx** | components/ | PVP 演示 | ⭐⭐⭐⭐ |
| **DuelCard.tsx** | components/ | 对决卡片 | ⭐⭐⭐ |

### 📋 规范文档

| 文件名 | 位置 | 说明 | 优先级 |
|--------|------|------|--------|
| **requirements.md** | .kiro/specs/zheng-dao/ | 需求文档 | ⭐⭐⭐ |
| **design.md** | .kiro/specs/zheng-dao/ | 设计文档 | ⭐⭐⭐ |
| **tasks.md** | .kiro/specs/zheng-dao/ | 任务列表 | ⭐⭐⭐ |

---

## 🗺️ 文件关系图

```
证道项目
│
├─ 📄 核心文档
│  ├─ README.md ────────────────┐
│  ├─ PITCH_DECK.md ────────────┤
│  └─ COMMUNITY_DISCUSSION_GUIDE.md ─┤
│                                     │
├─ 📄 设计文档                        │
│  ├─ TOKENOMICS_DESIGN.md ──────────┤
│  ├─ LAYOUT_DESIGN.md ──────────────┤
│  └─ V2_UPGRADE_SUMMARY.md ─────────┤
│                                     │
├─ 💻 智能合约                        │
│  ├─ ZhengDao.sol ──────────────────┤
│  └─ ZhengDaoV2.sol ────────────────┤
│                                     │
├─ 🎨 前端代码                        │
│  ├─ app/page.tsx ──────────────────┤
│  ├─ app/analytics/page.tsx ────────┤
│  └─ components/*.tsx ──────────────┤
│                                     │
└─ 📋 规范文档                        │
   ├─ requirements.md ───────────────┤
   ├─ design.md ─────────────────────┤
   └─ tasks.md ──────────────────────┘
                                      │
                    所有文档都指向 ───┘
                    完整的项目体系
```

---

## 🎯 按角色查看

### 👔 投资人
**必读文档：**
1. `PITCH_DECK.md` - 了解项目全貌
2. `TOKENOMICS_DESIGN.md` - 了解经济模型
3. `README.md` - 了解技术实力

**关注重点：**
- 市场规模和机会
- 商业模式和收入
- 团队背景
- 融资计划

### 👨‍💻 开发者
**必读文档：**
1. `QUICK_START.md` - 快速上手
2. `README.md` - 技术架构
3. `contracts/ZhengDaoV2.sol` - 合约代码

**关注重点：**
- 技术栈
- 代码结构
- API 文档
- 部署流程

### 👥 社区成员
**必读文档：**
1. `COMMUNITY_DISCUSSION_GUIDE.md` - 如何参与
2. `README.md` - 项目介绍
3. `V2_UPGRADE_SUMMARY.md` - 最新进展

**关注重点：**
- 项目愿景
- 当前进展
- 如何贡献
- 奖励机制

### 🎨 设计师
**必读文档：**
1. `LAYOUT_DESIGN.md` - 设计规范
2. `app/page.tsx` - 实现代码
3. `components/*.tsx` - 组件代码

**关注重点：**
- 设计风格
- 配色方案
- 组件库
- 交互流程

### 📊 产品经理
**必读文档：**
1. `README.md` - 产品功能
2. `TOKENOMICS_DESIGN.md` - 产品逻辑
3. `.kiro/specs/zheng-dao/requirements.md` - 需求文档

**关注重点：**
- 用户需求
- 功能设计
- 数据指标
- 优化方向

---

## 📍 文件位置速查

### 在项目根目录
```
zhengdao/
├── README.md                    ← 项目报告
├── PITCH_DECK.md               ← 演示文档
├── COMMUNITY_DISCUSSION_GUIDE.md ← 讨论指南
├── TOKENOMICS_DESIGN.md        ← 经济模型
├── LAYOUT_DESIGN.md            ← 页面布局
├── V2_UPGRADE_SUMMARY.md       ← V2 总结
├── QUICK_START.md              ← 快速启动
├── START_NOW.md                ← 立即开始
└── FILE_INDEX.md               ← 本文件
```

### 在 contracts/ 目录
```
contracts/
├── ZhengDao.sol                ← V1 合约
└── ZhengDaoV2.sol              ← V2 合约
```

### 在 app/ 目录
```
app/
├── page.tsx                    ← 首页
├── analytics/
│   └── page.tsx                ← 分析页面
└── api/verify/
    └── route.ts                ← AI 验证
```

### 在 components/ 目录
```
components/
├── CheckInRing.tsx             ← 打卡圆环
├── HeroStatus.tsx              ← 资产看板
├── WeekGrid.tsx                ← 七日记录
├── MockCamera.tsx              ← 模拟相机
├── YieldChart.tsx              ← 收益曲线
├── PVPDemo.tsx                 ← PVP 演示
└── DuelCard.tsx                ← 对决卡片
```

### 在 .kiro/specs/zheng-dao/ 目录
```
.kiro/specs/zheng-dao/
├── requirements.md             ← 需求文档
├── design.md                   ← 设计文档
└── tasks.md                    ← 任务列表
```

---

## 🔍 快速搜索

### 想了解经济模型？
→ `TOKENOMICS_DESIGN.md`

### 想看页面设计？
→ `LAYOUT_DESIGN.md`

### 想快速启动项目？
→ `QUICK_START.md`

### 想参与社区讨论？
→ `COMMUNITY_DISCUSSION_GUIDE.md`

### 想看完整项目报告？
→ `README.md`

### 想看投资演示？
→ `PITCH_DECK.md`

### 想看最新进展？
→ `V2_UPGRADE_SUMMARY.md`

### 想看智能合约？
→ `contracts/ZhengDaoV2.sol`

### 想看前端代码？
→ `app/page.tsx` 和 `components/`

---

## 📞 获取帮助

### 找不到文件？
- 查看本文件索引
- 使用 `git ls-files` 命令
- 联系团队：support@zhengdao.io

### 文档有问题？
- 提交 GitHub Issue
- 在 Discord 反馈
- 发送邮件：docs@zhengdao.io

### 需要更多信息？
- 访问官网：zhengdao.io
- 加入 Discord：discord.gg/zhengdao
- 关注 Twitter：@ZhengDao_io

---

<div align="center">

**所有文档都在这里！**

**修身 · 齐家 · 证道**

</div>
