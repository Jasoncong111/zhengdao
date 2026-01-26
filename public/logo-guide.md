# 证道 Logo 使用指南

## 📁 文件格式

### 需要准备的文件

```
public/
├── logo.svg           # 矢量图（推荐，可无限缩放）
├── logo.png           # 高清 PNG（透明背景）
├── logo-512.png       # 512x512（PWA 图标）
├── logo-192.png       # 192x192（PWA 图标）
├── logo-180.png       # 180x180（Apple Touch Icon）
├── logo-32.png        # 32x32（Favicon）
├── logo-16.png        # 16x16（Favicon）
└── favicon.ico        # ICO 格式（兼容性）
```

## 🎨 使用场景

### 1. 网站 Header
```tsx
// app/layout.tsx
<header className="bg-[#FFFEF2] border-b border-black">
  <div className="container mx-auto px-4 py-4 flex items-center">
    <Image 
      src="/logo.svg" 
      alt="证道" 
      width={48} 
      height={48}
      className="mr-3"
    />
    <h1 className="text-2xl font-bold">证道</h1>
  </div>
</header>
```

### 2. 启动页面
```tsx
// app/loading.tsx
<div className="min-h-screen flex items-center justify-center bg-[#FFFEF2]">
  <div className="text-center">
    <Image 
      src="/logo.svg" 
      alt="证道" 
      width={200} 
      height={200}
      className="mx-auto mb-8 animate-pulse"
    />
    <h1 className="text-4xl font-bold mb-2">证道</h1>
    <p className="text-gray-600">修身 · 齐家 · 证道</p>
  </div>
</div>
```

### 3. PWA Manifest
```json
// public/manifest.json
{
  "name": "证道 - 首个 AI 复盘挖矿 DApp",
  "short_name": "证道",
  "description": "用区块链和 AI 重新定义自我修炼",
  "icons": [
    {
      "src": "/logo-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/logo-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#D43628",
  "background_color": "#FFFEF2",
  "display": "standalone"
}
```

### 4. HTML Meta Tags
```html
<!-- app/layout.tsx -->
<head>
  {/* Favicon */}
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" sizes="32x32" href="/logo-32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="/logo-16.png" />
  
  {/* Apple Touch Icon */}
  <link rel="apple-touch-icon" href="/logo-180.png" />
  
  {/* PWA Manifest */}
  <link rel="manifest" href="/manifest.json" />
  
  {/* Theme Color */}
  <meta name="theme-color" content="#D43628" />
  
  {/* Open Graph (社交媒体分享) */}
  <meta property="og:image" content="/logo-512.png" />
  <meta property="og:title" content="证道 - 首个 AI 复盘挖矿 DApp" />
  <meta property="og:description" content="每天 3 分钟，让成长变现" />
  
  {/* Twitter Card */}
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:image" content="/logo-512.png" />
</head>
```

### 5. 社交媒体
```
Twitter/X:
- 头像：logo-400.png (400x400)
- Banner：可以用 logo + slogan 组合

小红书:
- 头像：logo-400.png (400x400)
- 封面：logo + 品牌色背景

Discord:
- 服务器图标：logo-512.png (512x512)

Telegram:
- 群组图标：logo-512.png (512x512)
```

## 🎯 设计规范

### 颜色使用
```
主色：
- 墨黑：#000000（Logo 主体）
- 朱砂红：#D43628（点缀）
- 纸白：#FFFEF2（背景）

禁止：
- 不要改变 Logo 颜色
- 不要添加其他颜色
- 不要使用渐变
```

### 留白规范
```
最小留白：Logo 高度的 20%

示例：
- Logo 高度 100px
- 四周留白至少 20px
```

### 最小尺寸
```
网页：32x32px
打印：15mm x 15mm

小于此尺寸时，使用简化版
```

## 🚫 禁止事项

```
❌ 不要拉伸或压缩 Logo
❌ 不要旋转 Logo（除非设计需要）
❌ 不要改变 Logo 颜色
❌ 不要添加阴影或特效
❌ 不要在复杂背景上使用
❌ 不要与其他图形混合
```

## ✅ 正确示例

```
✅ 在纯色背景上使用
✅ 保持原始比例
✅ 使用足够的留白
✅ 使用高清图片
✅ 在深色背景上使用原版
✅ 在浅色背景上使用反色版
```

## 📐 尺寸参考

### 网站使用
```
Header Logo:     48x48px
Hero Section:    200x200px
Footer:          32x32px
Favicon:         32x32px, 16x16px
```

### 移动端
```
App Icon:        180x180px (iOS)
                 192x192px (Android)
Splash Screen:   512x512px
```

### 社交媒体
```
Twitter:         400x400px
小红书:          400x400px
Discord:         512x512px
```

### 打印
```
名片:            20mm x 20mm
海报:            100mm x 100mm
横幅:            300mm x 300mm
```

## 🎨 动画效果（可选）

### 加载动画
```tsx
// 脉冲效果
<Image 
  src="/logo.svg" 
  className="animate-pulse"
/>

// 旋转效果
<Image 
  src="/logo.svg" 
  className="animate-spin"
/>

// 自定义动画
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.logo-breathe {
  animation: breathe 2s ease-in-out infinite;
}
```

### 悬停效果
```tsx
<Image 
  src="/logo.svg" 
  className="transition-transform hover:scale-110"
/>
```

## 📱 响应式使用

```tsx
// 根据屏幕大小调整 Logo 尺寸
<Image 
  src="/logo.svg" 
  className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
/>
```

## 🌐 国际化

```
中文版：证道 + Logo
英文版：ZhengDao + Logo
日文版：証道 + Logo

Logo 保持不变，只改变文字
```

---

## 📞 联系方式

如需 Logo 源文件或有其他问题，请联系设计团队。

**修身 · 齐家 · 证道**
