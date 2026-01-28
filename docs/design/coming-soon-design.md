# Coming Soon界面设计规范

**设计师**: AI #5 (UI/UX Designer)
**设计时间**: 2026-01-27
**文档版本**: v1.0

---

## 设计理念

### 核心原则

Coming Soon界面需要传达：
1. **期待感**: 让用户对即将到来的功能感到兴奋
2. **清晰度**: 明确告诉用户这是什么功能
3. **一致性**: 与整体水墨风格保持一致
4. **信息性**: 简要说明功能价值

### 设计语言

- **水墨风格**: 淡雅的背景、传统元素
- **现代简约**: 清晰的排版、易读的文字
- **朱砂红强调**: 使用项目标志性的红色突出"Coming Soon"
- **占位美学**: 使用抽象图形或图标代表未完成功能

---

## 通用Coming Soon组件设计

### 组件结构

```
┌─────────────────────────────────────┐
│  功能标题                            │
│  ┌──────────┐                        │
│  │ 图标/插图 │                        │
│  └──────────┘                        │
│  ┌──────────────┐                   │
│  │Coming Soon   │  <- 朱砂红标签     │
│  └──────────────┘                   │
│  功能描述                            │
│  [简短文字说明]                      │
│  ┌──────────────────────┐          │
│  │ 🎁 期待值: ⭐⭐⭐⭐⭐  │          │
│  └──────────────────────┘          │
│  [预计上线时间: Q2 2026]            │
└─────────────────────────────────────┘
```

### CSS样式规范

```css
.coming-soon-card {
  position: relative;
  background: linear-gradient(135deg, #FFFEF2 0%, #F5F5DC 100%);
  border: 2px solid #000000;
  padding: 2rem;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.coming-soon-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #D43628;
  color: white;
  padding: 0.5rem 1rem;
  font-family: 'Georgia', serif;
  font-weight: bold;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

.coming-soon-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.coming-soon-title {
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #000000;
  margin-bottom: 1rem;
}

.coming-soon-description {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  color: #666666;
  max-width: 400px;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.coming-soon-expectation {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #D43628;
  font-weight: bold;
}

.coming-soon-timeline {
  font-size: 0.875rem;
  color: #999999;
  margin-top: 1rem;
}
```

---

## 功能1: 论剑 (PVP对决)

### 设计说明

**功能描述**: 用户之间的PVP对决，比拼打卡连续天数和资产增长

**核心价值**:
- 激发竞争动力
- 建立社区氛围
- 增加用户粘性

**视觉元素**:
- **图标**: ⚔️ 或 🏆
- **背景**: 淡墨晕染效果
- **装饰**: 竹简、卷轴元素

### 界面设计

```
┌─────────────────────────────────────┐
│                                     │
│      ⚔️ 论剑                        │
│                                     │
│    ┌──────────────────┐            │
│    │   Coming Soon    │            │
│    └──────────────────┘            │
│                                     │
│  与同道中人一决高下                  │
│  比拼打卡坚持、资产增长              │
│  赢取特别奖励和荣耀                  │
│                                     │
│  🎁 期待值: ⭐⭐⭐⭐⭐               │
│                                     │
│  📅 预计上线: Q2 2026                │
│                                     │
└─────────────────────────────────────┘
```

### 水墨装饰元素

```html
<!-- 背景装饰 -->
<div className="ink-decoration">
  <svg className="ink-splash-1" />
  <svg className="ink-splash-2" />
  <svg className="bamboo-leaves" />
</div>
```

---

## 功能2: 人生蓝图

### 设计说明

**功能描述**: 用户onboarding流程，通过5-10个问题设定人生目标

**核心价值**:
- 明确个人方向
- 生成"道心凭证"
- 定期回顾校准

**视觉元素**:
- **图标**: 🎯 或 📜
- **背景**: 祥云、山水画元素
- **装饰**: 卷轴、印章

### 界面设计

```
┌─────────────────────────────────────┐
│                                     │
│      🎯 人生蓝图                    │
│                                     │
│    ┌──────────────────┐            │
│    │   Coming Soon    │            │
│    └──────────────────┘            │
│                                     │
│  立下初心，明确方向                  │
│  生成你的"道心凭证"                  │
│  在修行路上时刻校准                  │
│                                     │
│  🎁 期待值: ⭐⭐⭐⭐⭐               │
│                                     │
│  📅 预计上线: Q1 2026                │
│                                     │
└─────────────────────────────────────┘
```

### 特殊设计元素

- **卷轴展开动画**: 使用CSS动画模拟卷轴展开
- **山水画背景**: 淡雅的山水作为背景装饰
- **印章元素**: 朱砂红印章作为装饰点缀

---

## 功能3: AI私董会高级版

### 设计说明

**功能描述**: 深度AI分析，提供个性化建议和洞察

**核心价值**:
- 智能分析用户数据
- 提供 actionable insights
- 生成月度/季度深度报告

**视觉元素**:
- **图标**: 🤖 或 📊
- **背景**: 数据可视化元素
- **装饰**: 算法图形、神经网络意象

### 界面设计

```
┌─────────────────────────────────────┐
│                                     │
│    🤖 AI私董会 高级版               │
│                                     │
│    ┌──────────────────┐            │
│    │   Coming Soon    │            │
│    └──────────────────┘            │
│                                     │
│  深度AI分析你的修行数据              │
│  发现隐藏的模式和趋势                │
│  获得个性化建议和洞察                │
│                                     │
│  🎁 期待值: ⭐⭐⭐⭐                 │
│                                     │
│  📅 预计上线: Q3 2026                │
│                                     │
└─────────────────────────────────────┘
```

### 特殊设计元素

- **数据流动画**: 模拟AI分析过程
- **图表装饰**: 简化的图表元素作为背景
- **科技感**: 结合水墨与科技元素

---

## 功能4: 社交功能

### 设计说明

**功能描述**: 好友系统、社区互动、分享成就

**核心价值**:
- 找到同路人
- 互相监督鼓励
- 分享修行成果

**视觉元素**:
- **图标**: 👥 或 🤝
- **背景**: 人物剪影、连接线元素
- **装饰**: 友谊线、网络图

### 界面设计

```
┌─────────────────────────────────────┐
│                                     │
│      👥 社交功能                    │
│                                     │
│    ┌──────────────────┐            │
│    │   Coming Soon    │            │
│    └──────────────────┘            │
│                                     │
│  找到同行的道友                      │
│  互相监督，共同成长                  │
│  分享你的修行成果                    │
│                                     │
│  🎁 期待值: ⭐⭐⭐⭐⭐               │
│                                     │
│  📅 预计上线: Q2 2026                │
│                                     │
└─────────────────────────────────────┘
```

### 特殊设计元素

- **连接线动画**: 模拟社交网络连接
- **人物剪影**: 淡化的人物形象作为装饰
- **手拉手意象**: 体现互助成长的概念

---

## 响应式设计

### 移动端适配

```css
@media (max-width: 768px) {
  .coming-soon-card {
    padding: 1.5rem;
    min-height: 250px;
  }

  .coming-soon-icon {
    font-size: 3rem;
  }

  .coming-soon-title {
    font-size: 1.25rem;
  }

  .coming-soon-description {
    font-size: 0.875rem;
  }
}
```

### 平板适配

```css
@media (min-width: 769px) and (max-width: 1024px) {
  .coming-soon-card {
    padding: 1.75rem;
  }

  .coming-soon-icon {
    font-size: 3.5rem;
  }
}
```

---

## 动画效果

### 淡入动画

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.coming-soon-card {
  animation: fadeInUp 0.6s ease-out;
}
```

### 徽章闪烁

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.coming-soon-badge {
  animation: pulse 2s ease-in-out infinite;
}
```

### 悬停效果

```css
.coming-soon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
```

---

## 使用示例

### React组件实现

```tsx
import { motion } from 'framer-motion';

interface ComingSoonCardProps {
  title: string;
  icon: string;
  description: string;
  expectation: number;
  timeline: string;
}

export function ComingSoonCard({
  title,
  icon,
  description,
  expectation,
  timeline
}: ComingSoonCardProps) {
  return (
    <motion.div
      className="coming-soon-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Coming Soon 徽章 */}
      <div className="coming-soon-badge">
        Coming Soon
      </div>

      {/* 图标 */}
      <div className="coming-soon-icon">
        {icon}
      </div>

      {/* 标题 */}
      <h3 className="coming-soon-title">
        {title}
      </h3>

      {/* 描述 */}
      <p className="coming-soon-description">
        {description}
      </p>

      {/* 期待值 */}
      <div className="coming-soon-expectation">
        <span>🎁 期待值:</span>
        <span>{'⭐'.repeat(expectation)}</span>
      </div>

      {/* 时间线 */}
      <div className="coming-soon-timeline">
        📅 预计上线: {timeline}
      </div>
    </motion.div>
  );
}
```

### 使用示例

```tsx
<ComingSoonCard
  title="论剑"
  icon="⚔️"
  description="与同道中人一决高下，比拼打卡坚持、资产增长，赢取特别奖励和荣耀"
  expectation={5}
  timeline="Q2 2026"
/>
```

---

## 设计资源

### 图标资源

推荐使用以下图标库：
- **Emoji**: 简单直接，跨平台兼容
- **Lucide Icons**: 现代简洁
- **Heroicons**: Tailwind CSS官方图标库
- **自定义SVG**: 完全定制

### 字体资源

- **标题**: Georgia, 'Noto Serif SC', serif
- **正文**: Georgia, 'Noto Sans SC', sans-serif
- **装饰**: 'KaiTi', 楷体（中文装饰字）

### 色彩资源

```css
:root {
  /* 项目主题色 */
  --color-bg: #FFFEF2;          /* 纸白 */
  --color-ink: #000000;         /* 墨黑 */
  --color-cinnabar: #D43628;    /* 朱砂红 */
  --color-gray: #999999;        /* 灰色 */

  /* Coming Soon 专用色 */
  --color-coming-soon-bg: #F5F5DC;
  --color-coming-soon-accent: #D43628;
  --color-coming-soon-text: #666666;
}
```

---

## 验收标准

- [x] 设计文档完整
- [x] 4个功能界面设计完成
- [x] CSS样式规范定义
- [x] React组件示例代码
- [x] 响应式适配方案
- [x] 动画效果定义
- [ ] 实际组件实现（待AI #4完成）
- [ ] 浏览器测试通过

---

## 后续工作

### AI #4 需要完成的任务

1. 创建 `/components/ComingSoonCard.tsx` 组件
2. 为每个功能创建独立的Coming Soon界面
3. 实现响应式布局
4. 添加framer-motion动画效果
5. 测试不同设备和浏览器

### 可选增强

1. **倒计时功能**: 显示距离预计上线的天数
2. **通知订阅**: 允许用户订阅功能上线通知
3. **进度提示**: 显示开发进度百分比
4. **用户反馈**: 收集用户对新功能的期待和建议

---

**设计完成时间**: 2026-01-27
**设计师**: AI #5 (UI/UX Designer)
**状态**: ✅ 设计完成，等待实现
