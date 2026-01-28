# 证道项目 - SBT设计规范文档

**文档版本**: v1.0
**创建时间**: 2026-01-27
**设计师**: AI #5 (UI/UX Designer)

---

## 目录

1. [设计理念](#设计理念)
2. [视觉风格](#视觉风格)
3. [颜色系统](#颜色系统)
4. [等级设计](#等级设计)
5. [文件规范](#文件规范)
6. [技术规格](#技术规格)
7. [元数据标准](#元数据标准)

---

## 设计理念

### 核心概念

证道项目SBT的设计理念围绕"修身·齐家·证道"的中国传统文化定位，通过传统水墨风格与现代元素的融合，展现用户从平凡到辉煌的成长历程。

### 象征意义

**从步行到逍遥的象征意义**：
- **步行 (Level 1)**: 起步阶段，脚踏实地，每一步都算数
- **骑行 (Level 2)**: 融入城市节奏，提升效率
- **电骑 (Level 3)**: 速度冲刺，见证质变
- **驾车 (Level 4)**: 稳定掌控，一年坚持
- **跑车 (Level 5)**: 激情超越，追求极致
- **逍遥 (Level 6)**: 超脱物外，自由自在

这个演进过程代表了个人成长的6个阶段，从最初的奋斗到最终的自由与超脱。

---

## 视觉风格

### 水墨风格特点

1. **传统水墨元素**
   - 淡墨晕染效果
   - 竹叶、云雾、火焰等自然元素
   - 朱砂红印章作为点睛之笔

2. **现代元素融合**
   - 交通工具作为核心道具
   - 渐变色彩增强视觉层次
   - 简洁的几何构图

3. **统一的设计语言**
   - 所有等级保持相同的水墨质感
   - 一致的印章和"证道"水印
   - 统一的外边框和等级标识

### 设计原则

- **简洁性**: 避免过度装饰，突出核心元素
- **识别性**: 每个等级有独特的色彩和核心道具
- **文化性**: 传承中国传统美学
- **现代性**: 融合当代设计语言

---

## 颜色系统

### 等级色彩方案

| 等级 | 主色调 | 渐变代码 | 象征意义 |
|-----|--------|---------|---------|
| **Level 1** | 灰/白 | `#6B7280` → `#FFFFFF` | 平凡、起步 |
| **Level 2** | 绿 | `#10B981` → `#34D399` | 生长、融入 |
| **Level 3** | 蓝 | `#3B82F6` → `#60A5FA` | 速度、冲刺 |
| **Level 4** | 紫 | `#8B5CF6` → `#A78BFA` | 稳定、掌控 |
| **Level 5** | 红 | `#EF4444` → `#F87171` | 激情、超越 |
| **Level 6** | 金 | `#F59E0B` → `#FBBF24` | 辉煌、超脱 |

### 特殊颜色

**朱砂红印章**: `#DC2626` → `#B91C1C` (渐变)
- 用于等级标识印章
- 左上角固定位置
- 象征官方认证

**水墨纹理**: `#9CA3AF` (灰) 到各等级主色调
- 半透明晕染效果
- 作为背景装饰
- 增强水墨质感

---

## 等级设计

### Level 1 - 11路奋斗者

**核心元素**: 破旧公文包 + 双脚
- **图标**: 👣 或 🎒
- **印章文字**: "初级"
- **水墨效果**: 淡墨晕染
- **象征意义**: 每一步都算数，从零开始

**设计细节**:
- 公文包体现奋斗者身份
- 双脚表示行走中的状态
- 虚线表示行走的轨迹
- 磨损效果显示奋斗历程

### Level 2 - 扫码骑士

**核心元素**: 小黄车（共享单车）
- **图标**: 🚲
- **印章文字**: "进阶"
- **水墨效果**: 竹叶水墨
- **象征意义**: 融入城市节奏，效率提升

**设计细节**:
- 小黄车体现城市出行
- 竹叶装饰象征成长
- 扫码图标点缀
- 动感线条表示骑行

### Level 3 - 电掣游侠

**核心元素**: 电动摩托
- **图标**: ⚡ 或 🏍️
- **印章文字**: "中级"
- **水墨效果**: 电流水墨线条
- **象征意义**: 速度冲刺，质变时刻

**设计细节**:
- 电池组显示电动特征
- 闪电特效表示能量
- 发光的仪表盘
- 速度线表示疾驰

### Level 4 - 四轮领航员

**核心元素**: 轿车
- **图标**: 🚗
- **印章文字**: "高级"
- **水墨效果**: 云雾缭绕
- **象征意义**: 稳定掌控，一年坚持

**设计细节**:
- 轿车体现稳定性
- 云雾营造掌控感
- 平稳的行驶线条
- 舒适的内部空间

### Level 5 - 超跑绅士

**核心元素**: 敞篷跑车
- **图标**: 🏎️
- **印章文字**: "特级"
- **水墨效果**: 火焰水墨
- **象征意义**: 激情超越，追求极致

**设计细节**:
- 低矮流线型车身
- 空气动力学套件
- 火焰尾迹表示速度
- 狭长LED车灯

### Level 6 - 逍遥散仙

**核心元素**: 沙滩椅 + 香槟
- **图标**: 🏖️ 或 🍾
- **印章文字**: "顶级"
- **水墨效果**: 祥云/光环
- **象征意义**: 超脱物外，自由自在

**设计细节**:
- 沙滩椅体现休闲
- 香槟庆祝成就
- 光环效果表示超脱
- 星星闪光点缀
- 多层祥云装饰

---

## 文件规范

### 目录结构

```
/public/sbt-images/
├── level-1/
│   ├── level-1.svg              # 主图 (矢量)
│   ├── level-1.png              # 光栅图 (1080x1080)
│   └── level-1-small.png        # 缩略图 (300x300)
├── level-2/
│   ├── level-2.svg
│   ├── level-2.png
│   └── level-2-small.png
├── level-3/
│   ├── level-3.svg
│   ├── level-3.png
│   └── level-3-small.png
├── level-4/
│   ├── level-4.svg
│   ├── level-4.png
│   └── level-4-small.png
├── level-5/
│   ├── level-5.svg
│   ├── level-5.png
│   └── level-5-small.png
└── level-6/
    ├── level-6.svg
    ├── level-6.png
    └── level-6-small.png
```

### 命名规范

- **格式**: `level-{N}.{ext}`
- **N**: 等级数字 (1-6)
- **ext**: 文件扩展名 (svg, png)
- **示例**: `level-1.svg`, `level-2.png`

### 版本控制

- 主文件和缩略图使用相同的前缀
- SVG文件为源文件
- PNG文件为渲染输出
- 缩略图命名添加 `-small` 后缀

---

## 技术规格

### 图像规格

| 规格 | SVG | PNG (主图) | PNG (缩略图) |
|-----|-----|----------|-------------|
| **尺寸** | 1080x1080 | 1080x1080 | 300x300 |
| **格式** | 矢量 | 光栅 | 光栅 |
| **背景** | 透明 | 可选透明 | 可选透明 |
| **用途** | 源文件、可缩放 | 显示、分享 | 列表、预览 |

### SVG规范

1. **ViewBox**: `0 0 1080 1080`
2. **命名空间**: `xmlns="http://www.w3.org/2000/svg"`
3. **元素**: 使用 `<defs>` 定义渐变和滤镜
4. **文本**: 使用 `'Noto Serif SC', serif` 字体
5. **优化**: 保持代码简洁，删除无用元素

### PNG导出设置

- **分辨率**: 72 DPI (Web) / 300 DPI (Print)
- **颜色模式**: RGB
- **压缩**: PNG-24 (支持透明)
- **优化**: 使用工具如 TinyPNG 压缩

### 浏览器兼容性

- **SVG**: 所有现代浏览器 + IE9+
- **PNG**: 所有浏览器
- **测试**: 在Chrome、Firefox、Safari、Edge中测试

---

## 元数据标准

### 元数据结构

```json
{
  "name": "证道之路 - [称谓]",
  "description": "坚持打卡[N]天，获得[称谓]称号。[证明文字]",
  "image": "/sbt-images/level-N/level-N.svg",
  "external_url": "https://zhengdao.app",
  "attributes": [
    { "trait_type": "Level", "value": 1-6 },
    { "trait_type": "Days", "value": 天数 },
    { "trait_type": "Title", "value": "中文称谓" },
    { "trait_type": "Title EN", "value": "英文标识" },
    { "trait_type": "Chain", "value": "BNB Chain" },
    { "trait_type": "Rarity", "value": "稀有度" },
    { "trait_type": "Color", "value": "颜色" },
    { "trait_type": "Icon", "value": "图标类型" },
    { "trait_type": "Keywords", "value": "关键词" },
    { "trait_type": "Reward Bonus", "value": "奖励加成" }
  ]
}
```

### Rarity等级

| Rarity | 对应等级 | 稀有程度 |
|--------|---------|---------|
| Common | Level 1 | 普通 |
| Uncommon | Level 2 | 不常见 |
| Rare | Level 3 | 稀有 |
| Epic | Level 4 | 史诗 |
| Legendary | Level 5 | 传奇 |
| Mythical | Level 6 | 神话 |

### 验证标准

元数据文件必须通过以下验证：
- ✅ 所有必填字段存在
- ✅ JSON格式正确
- ✅ 图像路径有效
- ✅ 属性值符合规范
- ✅ Level和Days值合理

使用验证脚本：`npm run validate-metadata`

---

## 设计资产

### 字体

- **中文字体**: Noto Serif SC (思源宋体)
- **英文字体**: Noto Serif
- **备用字体**: Georgia, serif

### 图标

推荐使用以下图标库：
- Emoji (内置)
- Lucide Icons
- Feather Icons
- Heroicons

### 工具

推荐设计工具：
- **矢量设计**: Figma, Adobe Illustrator, Inkscape
- **图像处理**: Adobe Photoshop, GIMP
- **优化**: SVGO, TinyPNG

---

## 使用示例

### 在React组件中使用

```tsx
import level1Image from '/public/sbt-images/level-1/level-1.svg';
import level1Metadata from '/public/sbt-metadata/level-1-bnb.json';

function SBTCard({ level }: { level: number }) {
  const image = `/sbt-images/level-${level}/level-${level}.svg`;
  const metadata = `/sbt-metadata/level-${level}-bnb.json`;

  return (
    <div className="sbt-card">
      <img src={image} alt={`Level ${level} SBT`} />
      <h3>{level1Metadata.name}</h3>
      <p>{level1Metadata.description}</p>
    </div>
  );
}
```

### 动态加载

```typescript
async function loadSBTMetadata(level: number) {
  const response = await fetch(`/sbt-metadata/level-${level}-bnb.json`);
  const metadata = await response.json();
  return metadata;
}
```

---

## 未来扩展

### Solana链元数据

为Solana链创建对应的元数据文件：
- `level-1-solana.json`
- `level-2-solana.json`
- ...

更新`Chain`字段为`"Solana"`

### 动画版本

如需添加GIF动画：
1. 基于SVG创建关键帧
2. 使用工具如GIMP或After Effects
3. 导出为GIF格式
4. 保持在2MB以内

### IPFS上传

上传到IPFS的步骤：
```bash
# 安装IPFS CLI
brew install ipfs

# 初始化IPFS
ipfs init

# 守护进程
ipfs daemon

# 上传文件夹
ipfs add -r public/sbt-images/

# 记录CID并更新元数据
```

---

## 维护日志

### v1.0 (2026-01-27)
- ✅ 创建6个等级的SVG设计
- ✅ 建立6个元数据JSON文件
- ✅ 编写设计规范文档
- ✅ 创建元数据验证脚本

---

## 联系方式

**设计师**: AI #5 (UI/UX Designer)
**项目**: 证道 (ZhengDao)
**文档位置**: `/docs/design/sbt-design-spec.md`

---

**文档结束**
