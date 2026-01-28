# SBT元数据文件说明

**目录**: `metadata/`
**用途**: 存储证道SBT 6个等级的元数据
**格式**: Metaplex标准JSON格式

---

## 📁 文件列表

| 文件 | 等级 | 名称 | 持续天数 | 稀有度 |
|-----|------|------|---------|--------|
| `level1.json` | 1 | 初级修行者 | 7天 | Common |
| `level2.json` | 2 | 中级修行者 | 30天 | Uncommon |
| `level3.json` | 3 | 高级修行者 | 90天 | Rare |
| `level4.json` | 4 | 大师 | 180天 | Epic |
| `level5.json` | 5 | 宗师 | 365天 | Legendary |
| `level6.json` | 6 | 道尊 | 1000天 | Mythic |

---

## 🎨 设计主题

### 五行元素
- Level 1: **木** (青) - 生机勃勃，初入修行
- Level 2: **火** (赤) - 热情精进，道心渐坚
- Level 3: **土** (黄) - 稳固厚重，道法初成
- Level 4: **金** (白) - 坚毅刚强，登堂入室
- Level 5: **水** (黑) - 灵动深邃，天人合一
- Level 6: **五行合一** (紫) - 至尊无上，得道成仙

### 境界体系
- Level 1: **入门** - 初识修行之道
- Level 2: **小成** - 心性渐定
- Level 3: **大成** - 道心稳固
- Level 4: **化境** - 登堂入室
- Level 5: **天人合一** - 宗师境界
- Level 6: **得道成仙** - 道尊之位

---

## 📋 元数据结构

### 标准字段
```json
{
  "name": "证道 · [等级名称]",
  "symbol": "ZHENGD",
  "description": "[修行描述]",
  "image": "https://gateway.arweave.net/[tx-id]",
  "external_url": "https://zhengdao.io/sbt/level[N]",
  "attributes": [
    {
      "trait_type": "Level",
      "value": 1-6
    },
    {
      "trait_type": "Title",
      "value": "[称号]"
    },
    {
      "trait_type": "Days",
      "value": [持续天数]
    },
    {
      "trait_type": "Element",
      "value": "[五行元素]"
    },
    {
      "trait_type": "Color",
      "value": "[颜色]"
    },
    {
      "trait_type": "Rarity",
      "value": "[稀有度]"
    },
    {
      "trait_type": "Stage",
      "value": "[境界]"
    }
  ],
  "collection": {
    "name": "证道 · 灵魂绑定代币",
    "family": "ZhengDAO SBT"
  },
  "properties": {
    "files": [
      {
        "uri": "https://gateway.arweave.net/[tx-id]",
        "type": "image/png"
      }
    ],
    "category": "image"
  }
}
```

---

## 🚀 使用方法

### 在Solana程序中使用

```typescript
import { PublicKey } from '@solana/web3.js';

// 定义元数据URI
const metadataURIs = {
  1: 'https://your-cdn.com/metadata/level1.json',
  2: 'https://your-cdn.com/metadata/level2.json',
  3: 'https://your-cdn.com/metadata/level3.json',
  4: 'https://your-cdn.com/metadata/level4.json',
  5: 'https://your-cdn.com/metadata/level5.json',
  6: 'https://your-cdn.com/metadata/level6.json'
};

// 铸造SBT时使用
await program.methods
  .mintSbt(
    level,          // 等级 1-6
    days,           // 持续天数
    metadataURIs[level]  // 元数据URI
  )
  .accounts({...})
  .rpc();
```

### 上传到Arweave

1. **准备图片文件**
   - 6个等级的SBT图片 (PNG格式)
   - 推荐尺寸: 1080x1080px
   - 文件大小: <5MB

2. **上传到Arweave**
   ```bash
   # 使用Arweave CLI或第三方服务
   # 如: Bundlr, NFT.Storage, Pinata等
   ```

3. **更新元数据文件**
   - 替换`image`字段中的`tx-id-placeholder`为实际交易ID
   - 上传元数据JSON文件到Arweave或CDN

4. **验证**
   - 在浏览器中访问元数据URL
   - 确认JSON格式正确
   - 确认图片可以正常显示

---

## 🎨 视觉设计建议

### 水墨风格统一
- 使用传统水墨画风格
- 每个等级体现不同的意境
- 颜色与五行元素对应
- 整体风格协调统一

### 等级递进
- **Level 1-2**: 简约朴素，初学者气息
- **Level 3-4**: 精致华丽，展现修行成就
- **Level 5-6**: 尊贵典雅，体现宗师风范

### 推荐元素
- 山水、云雾、松柏等自然意象
- 修行者剪影/人物形象
- 太极、八卦等道教符号
- 诗词、印章等文化元素

---

## 📝 后续任务

- [ ] 设计并生成6个等级的SBT图像
- [ ] 上传图像到Arweave
- [ ] 更新元数据文件中的image URI
- [ ] 上传元数据JSON到Arweave或CDN
- [ ] 测试元数据URL可访问性
- [ ] 在前端集成显示

---

## 📞 相关文档

- **Solana程序代码**: `../src/lib.rs`
- **测试文件**: `../tests/zhengdao-sbt.ts`
- **部署指南**: `../DEPLOYMENT-CHECKLIST.md`
- **完整文档**: `../README.md`

---

**版本**: v1.0
**创建时间**: 2026-01-27
**维护者**: AI #2 (Solana程序工程师)
