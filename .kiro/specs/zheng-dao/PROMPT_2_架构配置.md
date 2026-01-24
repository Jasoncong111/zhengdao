# 📦 任务包 2：架构配置

## 🎯 你的任务

为项目生成 3 个关键配置文件，并明确标出它们的文件路径。

---

## 📂 文件 1：`app/globals.css`

### 要求：
1. 设置 CSS 变量：
   ```css
   --bg-paper: #FFFFFF
   --ink-black: #000000
   --seal-red: #D43628
   ```

2. 强制所有元素 `border-radius: 0`（无圆角）

3. 设置 body 背景为白纸色，文字为墨黑色

4. 数字显示使用衬线字体（serif）

### 当前状态：
✅ 基础框架已创建，需要你完善样式细节

---

## 📂 文件 2：`public/manifest.json`

### 要求：
1. 配置 PWA 应用信息：
   - `name`: "证道 ZhengDao"
   - `short_name`: "证道"
   - `display`: "standalone"（全屏模式）

2. 设置主题色：
   - `background_color`: "#FFFFFF"
   - `theme_color`: "#000000"

3. 配置图标（192x192 和 512x512）

### 当前状态：
✅ 基础配置已创建，需要你完善细节

---

## 📂 文件 3：`app/layout.tsx`

### 要求：
1. 限制内容最大宽度 `max-w-[430px]` 并居中（模拟手机屏幕）

2. 配置 viewport meta 标签：
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
   ```

3. 设置语言为中文 `lang="zh-CN"`

4. 引入 `globals.css`

### 当前状态：
✅ 基础布局已创建，需要你完善响应式设计

---

## 📖 参考文档

详细设计请参考：`.kiro/specs/zheng-dao/design.md`

## ✅ 输出要求

- 3 个完整的配置文件
- 确保符合 PWA 标准
- 确保移动端体验优化
