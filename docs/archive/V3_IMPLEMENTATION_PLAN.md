# 证道 V3.0 - 技术实施方案

## 🎯 技术栈选择

### 前端技术

#### 移动端 (优先)
```typescript
// React Native - 跨平台开发
- React Native 0.73+
- TypeScript 5.0+
- React Navigation 6.x
- React Native Paper (UI 组件)
- React Native Voice (语音输入)
- React Native Encrypted Storage (加密存储)
- React Native Biometrics (生物识别)
```

#### Web 端
```typescript
// Next.js - 已有基础
- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Web Speech API (语音输入)
```

### 后端服务

```typescript
// API 服务
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL (主数据库)
- Redis (缓存)

// AI 服务
- 智谱 GLM-4 (文本理解和整理)
- Whisper API (语音转文字)
- OpenAI GPT-4 (备选)
```

### 数据存储

```typescript
// 本地存储
- SQLite + SQLCipher (移动端加密数据库)
- IndexedDB (Web 端)

// 云端同步
- Google Sheets API
- Google Drive API

// 区块链
- BNB Chain (打卡记录)
- IPFS (内容哈希)
```

---

## 📱 核心功能实现

### 1. 复盘界面组件

```typescript
// components/ReflectionDialog.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ReflectionDialogProps {
  onSubmit: (content: string) => void;
  onClose: () => void;
}

export default function ReflectionDialog({ onSubmit, onClose }: ReflectionDialogProps) {
  const [step, setStep] = useState<'question' | 'input' | 'processing' | 'preview'>('question');
  const [isMeaningful, setIsMeaningful] = useState<boolean | null>(null);
  const [content, setContent] = useState('');
  const [structuredData, setStructuredData] = useState(null);

  // 第一步：提问
  const renderQuestion = () => (
    <motion.div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        🌅 今天是有意义的一天吗？
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => {
            setIsMeaningful(true);
            setStep('input');
          }}
          className="py-4 bg-green-500 text-white"
        >
          是的 ✓
        </button>
        <button
          onClick={() => {
            setIsMeaningful(false);
            setStep('input');
          }}
          className="py-4 bg-gray-500 text-white"
        >
          不太是 ✗
        </button>
      </div>
    </motion.div>
  );

  // 第二步：输入
  const renderInput = () => (
    <motion.div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        📝 说说今天发生了什么吧
      </h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-48 p-4 border-2 border-black"
        placeholder="可以聊聊今天的收获、遇到的挑战、或者任何想法..."
      />
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleVoiceInput}
          className="flex-1 py-3 border-2 border-black"
        >
          🎤 语音输入
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 bg-black text-white"
          disabled={!content}
        >
          提交
        </button>
      </div>
    </motion.div>
  );

  // 第三步：AI 处理
  const renderProcessing = () => (
    <motion.div className="p-6 text-center">
      <div className="text-6xl mb-4">🤖</div>
      <h2 className="text-xl font-bold mb-4">
        AI 正在整理你的复盘...
      </h2>
      <div className="space-y-2">
        <div>✓ 识别关键事件</div>
        <div>✓ 提取情绪标签</div>
        <div>✓ 分析成长点</div>
        <div>✓ 生成结构化文档</div>
      </div>
    </motion.div>
  );

  // 第四步：预览确认
  const renderPreview = () => (
    <motion.div className="p-6">
      <h2 className="text-xl font-bold mb-4">📄 今日复盘</h2>
      {structuredData && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold">日期</h3>
            <p>{structuredData.date}</p>
          </div>
          <div>
            <h3 className="font-bold">情绪</h3>
            <p>{structuredData.emotion}</p>
          </div>
          <div>
            <h3 className="font-bold">主要事件</h3>
            <ul>
              {structuredData.events.map((event, i) => (
                <li key={i}>• {event}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold">收获与反思</h3>
            <p>{structuredData.insights}</p>
          </div>
        </div>
      )}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => setStep('input')}
          className="flex-1 py-3 border-2 border-black"
        >
          重新编辑
        </button>
        <button
          onClick={() => onSubmit(structuredData)}
          className="flex-1 py-3 bg-black text-white"
        >
          确认提交
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white max-w-2xl w-full">
        {step === 'question' && renderQuestion()}
        {step === 'input' && renderInput()}
        {step === 'processing' && renderProcessing()}
        {step === 'preview' && renderPreview()}
      </div>
    </div>
  );
}
```

### 2. AI 处理服务

```typescript
// app/api/reflection/process/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { content, isMeaningful } = await request.json();

  try {
    // 调用智谱 AI 进行内容整理
    const structuredData = await processReflection(content, isMeaningful);
    
    return NextResponse.json({
      success: true,
      data: structuredData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function processReflection(content: string, isMeaningful: boolean) {
  // 调用智谱 GLM-4 API
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的复盘助手。请将用户的复盘内容整理成结构化文档，包括：
1. 主要事件（列表形式）
2. 收获与反思（段落形式）
3. 明日计划（列表形式）
4. 情绪标签（如：积极、平静、焦虑等）
5. 关键词（3-5个）

请以 JSON 格式返回。`
        },
        {
          role: 'user',
          content: `今天${isMeaningful ? '是' : '不是'}有意义的一天。\n\n${content}`
        }
      ]
    })
  });

  const result = await response.json();
  const structuredData = JSON.parse(result.choices[0].message.content);

  return {
    date: new Date().toISOString().split('T')[0],
    isMeaningful,
    rawContent: content,
    ...structuredData
  };
}
```

### 3. 加密存储

```typescript
// lib/encryption.ts
import CryptoJS from 'crypto-js';

export class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: string;

  private constructor() {
    // 从用户密码派生密钥
    this.encryptionKey = this.deriveKey();
  }

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  private deriveKey(): string {
    // 使用 PBKDF2 从用户密码派生密钥
    const userPassword = this.getUserPassword();
    const salt = this.getSalt();
    return CryptoJS.PBKDF2(userPassword, salt, {
      keySize: 256/32,
      iterations: 10000
    }).toString();
  }

  encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.encryptionKey).toString();
  }

  decrypt(encryptedData: string): any {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8);
    return JSON.parse(jsonString);
  }

  // 存储加密数据
  async saveReflection(reflection: any): Promise<void> {
    const encrypted = this.encrypt(reflection);
    await this.saveToLocalDB(encrypted);
  }

  // 读取加密数据
  async getReflection(id: string): Promise<any> {
    const encrypted = await this.getFromLocalDB(id);
    return this.decrypt(encrypted);
  }
}
```

### 4. Google Sheets 同步

```typescript
// lib/google-sheets.ts
import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets: any;
  private spreadsheetId: string;

  constructor(credentials: any) {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    this.sheets = google.sheets({ version: 'v4', auth });
  }

  async syncReflection(reflection: any): Promise<void> {
    // 准备数据（只同步摘要，不同步完整内容）
    const row = [
      reflection.date,
      reflection.isMeaningful ? '是' : '否',
      reflection.emotion,
      reflection.keywords.join(', '),
      reflection.summary, // 摘要而非完整内容
      reflection.checkInHash // 区块链哈希
    ];

    // 追加到 Google Sheets
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: 'Reflections!A:F',
      valueInputOption: 'RAW',
      resource: {
        values: [row]
      }
    });
  }

  async generateMonthlyReport(year: number, month: number): Promise<any> {
    // 从 Google Sheets 读取数据
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: 'Reflections!A:F'
    });

    const rows = response.data.values;
    
    // 筛选指定月份的数据
    const monthlyData = rows.filter(row => {
      const date = new Date(row[0]);
      return date.getFullYear() === year && date.getMonth() === month - 1;
    });

    // 生成统计报告
    return this.analyzeMonthlyData(monthlyData);
  }
}
```

---

## 🔄 数据流程

### 完整数据流

```
用户输入
    ↓
前端验证
    ↓
发送到 API
    ↓
AI 处理整理
    ↓
返回结构化数据
    ↓
用户确认
    ↓
┌─────────────────────┐
│ 多重存储            │
├─────────────────────┤
│ 1. 本地加密存储     │
│ 2. Google Sheets    │
│ 3. 区块链记录哈希   │
└─────────────────────┘
    ↓
生成每日分析
    ↓
更新统计数据
```

### 同步策略

```typescript
// lib/sync-strategy.ts
export class SyncStrategy {
  // 立即同步（重要数据）
  async syncImmediate(data: any): Promise<void> {
    await Promise.all([
      this.saveToLocal(data),
      this.syncToBlockchain(data.hash),
      this.syncToGoogleSheets(data.summary)
    ]);
  }

  // 批量同步（非关键数据）
  async syncBatch(dataList: any[]): Promise<void> {
    // 收集一批数据后统一同步
    await this.syncToGoogleSheets(dataList);
  }

  // 离线队列（网络不可用时）
  async queueForLater(data: any): Promise<void> {
    await this.addToSyncQueue(data);
    // 网络恢复后自动同步
  }
}
```

---

## 📊 分析功能实现

### 数据分析服务

```typescript
// lib/analytics.ts
export class AnalyticsService {
  // 情绪趋势分析
  async analyzeEmotionTrend(userId: string, days: number): Promise<any> {
    const reflections = await this.getReflections(userId, days);
    
    const emotionScores = reflections.map(r => ({
      date: r.date,
      score: this.emotionToScore(r.emotion)
    }));

    return {
      trend: this.calculateTrend(emotionScores),
      average: this.calculateAverage(emotionScores),
      chart: emotionScores
    };
  }

  // 时间分配分析
  async analyzeTimeAllocation(userId: string, period: string): Promise<any> {
    const reflections = await this.getReflections(userId, period);
    
    // 从关键词提取时间分配
    const categories = {
      work: 0,
      study: 0,
      exercise: 0,
      social: 0,
      rest: 0
    };

    reflections.forEach(r => {
      r.keywords.forEach(keyword => {
        const category = this.categorizeKeyword(keyword);
        if (category) {
          categories[category]++;
        }
      });
    });

    return categories;
  }

  // 成长指数计算
  async calculateGrowthIndex(userId: string): Promise<number> {
    const factors = {
      consistency: await this.getConsistencyScore(userId),
      quality: await this.getQualityScore(userId),
      depth: await this.getDepthScore(userId),
      emotion: await this.getEmotionScore(userId)
    };

    // 加权计算
    return (
      factors.consistency * 0.3 +
      factors.quality * 0.3 +
      factors.depth * 0.2 +
      factors.emotion * 0.2
    );
  }
}
```

---

## 🚀 部署方案

### 开发环境
```bash
# 本地开发
npm run dev

# 移动端开发
npm run ios
npm run android
```

### 测试环境
```bash
# 单元测试
npm run test

# 集成测试
npm run test:integration

# E2E 测试
npm run test:e2e
```

### 生产环境
```bash
# Web 端部署（Vercel）
vercel deploy --prod

# 移动端打包
npm run build:ios
npm run build:android

# 后端部署（Docker）
docker-compose up -d
```

---

## 📅 开发时间表

### Sprint 1 (Week 1-2): 基础架构
- Day 1-3: 数据库设计和加密存储
- Day 4-7: 复盘界面开发
- Day 8-10: AI 服务集成
- Day 11-14: 测试和优化

### Sprint 2 (Week 3-4): 核心功能
- Day 15-18: 语音输入功能
- Day 19-22: Google Sheets 同步
- Day 23-26: 区块链集成
- Day 27-28: 集成测试

### Sprint 3 (Week 5-6): 分析功能
- Day 29-32: 每日/每周分析
- Day 33-36: 月度/季度报告
- Day 37-40: 数据可视化
- Day 41-42: 性能优化

---

<div align="center">

**技术实现，稳步推进**

**修身 · 齐家 · 证道**

</div>
