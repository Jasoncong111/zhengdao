# 证道 - 快速参考手册

**最后更新**: 2026-01-27

---

## 🚀 快速启动

```bash
# 启动开发服务器
npm run dev

# 访问应用
http://localhost:3000

# Demo模式
http://localhost:3000?demo=true
```

---

## 📁 核心文件速查

### 必读文档（按优先级）
1. `CURRENT_STATUS.md` - 项目当前状态 ⭐
2. `README.md` - 项目总览
3. `PROJECT_NOTES.md` - 核心决策和FAQ
4. `MVP_COMPLETION_REPORT.md` - MVP完成报告
5. `IMPLEMENTATION_ROADMAP.md` - 实施路线图

### 设计文档
- `FEATURE_MAPPING.md` - 五大模块功能对照
- `V3_REFLECTION_DESIGN.md` - V3详细设计
- `TOKENOMICS_DESIGN.md` - 经济模型
- `MARKETING_STRATEGY.md` - 营销策略

### 技术文档
- `.kiro/specs/zheng-dao/requirements.md` - 需求文档
- `.kiro/specs/zheng-dao/design.md` - 设计文档
- `.kiro/specs/zheng-dao/tasks.md` - 任务列表

---

## 🎯 产品定位

### 一句话介绍
```
证道 - 首个 AI 复盘挖矿 DApp
每天 3 分钟，让成长变现
```

### 核心逻辑闭环
```
想清楚（蓝图）→ 敢下注（挑战池）→ 做得到（挖矿）→ 想得深（复盘）→ 看得远（AI报告）
```

### 五大模块
1. **立心**（Genesis）- 人生蓝图 🔴 未实现
2. **入世**（Action & Staking）- 对赌挑战池 🟡 60%
3. **挖矿**（Proof of Effort）- 行为挖矿 🟢 90%
4. **省身**（Reflection）- 每日复盘 🟢 85%
5. **证道**（Analytics）- AI私董会 🟡 70%

---

## 🎨 品牌规范

### 品牌色
```css
--logo-red: #D43628;      /* 朱砂红 - 强调、CTA */
--logo-black: #000000;    /* 墨黑 - 文字、边框 */
--bg-paper: #FFFEF2;      /* 纸白 - 背景 */
```

### 字体
```
中文：思源黑体（Source Han Sans）
英文/数字：Georgia（衬线体）
```

### 设计原则
- 无圆角设计（border-radius: 0）
- 留白美学
- 印章元素（朱砂红圆形）
- 手机端优先（max-width: 430px）

---

## 💻 技术栈

### 前端
```
Next.js 15 + React 18 + TypeScript
Tailwind CSS + Framer Motion
Wagmi + Viem（区块链）
Recharts（图表）
Dexie（IndexedDB）
```

### AI服务
```
DeepSeek API（文本理解）
智谱 GLM-4V（图片识别）
OpenAI Whisper（语音，待实施）
```

### 区块链
```
BNB Chain Testnet
Solidity 0.8.20+
Foundry（开发工具）
```

---

## 🔧 环境配置

### 环境变量
```bash
# .env.local
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx  # 可选
ZHIPU_API_KEY=your_key_here        # 必需
```

### 获取API Key
- DeepSeek: https://platform.deepseek.com/
- 智谱AI: https://open.bigmodel.cn/

### 测试网配置
```
网络：BNB Chain Testnet
Chain ID：97
RPC：https://data-seed-prebsc-1-s1.binance.org:8545/
浏览器：https://testnet.bscscan.com
水龙头：https://testnet.bnbchain.org/faucet-smart
```

---

## 📊 功能完成度

| 功能 | 状态 | 完成度 |
|------|------|--------|
| V1.0 打卡工具 | ✅ 完成 | 100% |
| V3.0 复盘流程 | ✅ 完成 | 100% |
| AI结构化提取 | ✅ 完成 | 100% |
| 本地数据存储 | ✅ 完成 | 100% |
| 双池奖励系统 | ✅ 完成 | 100% |
| 月度报告 | ✅ 完成 | 100% |
| 人生蓝图 | 🔴 未开始 | 0% |
| 多挑战池 | 🔴 未开始 | 0% |
| V2.0积分系统 | 📋 设计完成 | 0% |
| 语音输入 | 🔴 未开始 | 0% |
| 照片分析 | 🔴 未开始 | 0% |
| 加密存储 | 🔴 未开始 | 0% |
| Google Sheets | 🔴 未开始 | 0% |

**总体进度**: 约70%

---

## 🎬 演示流程

### 完整用户流程（1分钟）
```
1. 连接钱包
2. 点击"今日打卡"
3. 完成4步复盘
   - 今天有意义吗？（Yes）
   - 输入复盘内容
   - AI自动整理
   - 预览确认
4. 保存到本地
5. 拍照打卡
6. 获得奖励（0.005 tBNB + 150积分）
7. 查看月度报告
```

### Demo数据生成
```javascript
// 在浏览器控制台执行
fetch('/api/demo/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    walletAddress: '0x1234567890123456789012345678901234567890',
    days: 30
  })
});
```

---

## 🐛 常见问题

### Q1: 如何启动项目？
```bash
npm install
npm run dev
```

### Q2: 没有API Key怎么办？
A: 可以不配置，系统会自动使用Mock数据演示

### Q3: 如何获取测试币？
A: 访问 https://testnet.bnbchain.org/faucet-smart

### Q4: 数据存储在哪里？
A: 浏览器IndexedDB（本地存储，隐私保护）

### Q5: 如何清除测试数据？
A: 浏览器开发者工具 → Application → IndexedDB → 删除数据库

### Q6: 如何部署到生产环境？
```bash
# Vercel部署
vercel deploy

# 或使用Vercel CLI
npm i -g vercel
vercel
```

---

## 📝 Git提交规范

```bash
# 格式：<type>(<scope>): <subject>

# 类型：
feat:     新功能
fix:      修复Bug
docs:     文档更新
style:    代码格式
refactor: 重构
test:     测试
chore:    构建/工具

# 示例：
git commit -m "feat(reflection): 添加语音输入功能"
git commit -m "fix(checkin): 修复打卡按钮无响应"
git commit -m "docs(readme): 更新快速启动指南"
```

---

## 🔗 重要链接

### 开发工具
- Next.js: https://nextjs.org/
- Tailwind CSS: https://tailwindcss.com/
- Wagmi: https://wagmi.sh/
- Dexie: https://dexie.org/

### AI服务
- DeepSeek: https://platform.deepseek.com/
- 智谱AI: https://open.bigmodel.cn/

### 区块链
- BNB Chain: https://www.bnbchain.org/
- BNB Testnet: https://testnet.bscscan.com/
- Foundry: https://book.getfoundry.sh/

### 设计资源
- 思源黑体: https://github.com/adobe-fonts/source-han-sans
- Framer Motion: https://www.framer.com/motion/

---

## 📞 下一步行动

### 立即可做（今天）
- [ ] 测试MVP完整流程
- [ ] 修复发现的Bug
- [ ] 录制1分钟演示视频

### 本周计划
- [ ] 部署到Vercel测试环境
- [ ] 添加Logo文件到public/
- [ ] 开始开发"人生蓝图"模块

### 本月目标
- [ ] 完成五大模块闭环
- [ ] 实施V2.0经济模型
- [ ] 小范围用户测试（50-100人）

---

## 💡 核心优势

1. **独特定位** - 首个AI复盘挖矿DApp
2. **技术创新** - AI + 区块链 + 隐私保护
3. **文化共鸣** - "吾日三省吾身"
4. **商业价值** - TAM $50B，高LTV/CAC

---

## 🎯 成功指标

### 产品指标
- 日活用户（DAU）
- 打卡完成率
- 复盘质量分数
- 用户留存率（7天/30天）

### 经济指标
- TVL（总锁仓价值）
- 日均奖励分配
- 积分兑换率
- 用户LTV

### 增长指标
- 新用户注册
- 推荐转化率
- 社交媒体关注
- 媒体曝光

---

**证道 - 让每一天都有意义**

**修身 · 齐家 · 证道**

---

*快速参考手册 v1.0*
*最后更新: 2026-01-27*
