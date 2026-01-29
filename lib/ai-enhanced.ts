/**
 * 增强版 AI 分析系统
 * 提供深度洞察、个性化建议、智能Mock等功能
 */

import { StructuredReflectionData } from './db';

/**
 * 扩展的AI分析结果
 */
export interface EnhancedReflectionData extends StructuredReflectionData {
  /** 深度洞察 */
  insights: string[];
  /** 明天可行动的建议 */
  actions: string[];
  /** 本日评分（1-10） */
  rating: number;
  /** 情绪详细描述 */
  emotionDetail: string;
  /** 时间使用分析 */
  timeAnalysis?: {
    productive: number;      // 高效时间占比
    wasted: number;          // 浪费时间占比
    rest: number;            // 休息时间占比
  };
  /** 模式识别 */
  patterns?: string[];
}

/**
 * 智能Mock响应 - 基于用户内容生成相关数据
 */
function generateSmartMock(content: string): EnhancedReflectionData {
  const words = content.split('');
  const hasKeywords = {
    work: /工作|学习|任务|项目|完成/.test(content),
    health: /运动|锻炼|跑步|健身|睡眠/.test(content),
    family: /家人|朋友|陪伴|聊天/.test(content),
    social: /社交|聚会|见面/.test(content),
    rest: /休息|放松|娱乐|游戏/.test(content),
    negative: /累|困|烦|不想|拖延/.test(content),
    positive: /开心|高兴|满足|充实|顺利/.test(content),
  };

  // 基于关键词生成gains
  const gains: string[] = [];
  if (hasKeywords.work) gains.push('完成了重要的工作任务');
  if (hasKeywords.health) gains.push('进行了身体锻炼');
  if (hasKeywords.family) gains.push('陪伴了家人朋友');
  if (hasKeywords.positive) gains.push('保持了积极心态');
  if (gains.length === 0) gains.push('度过了平凡的一天');

  // 基于关键词生成losses
  const losses: string[] = [];
  if (hasKeywords.negative) losses.push('情绪管理需要加强');
  if (hasKeywords.rest && words.length > 100) losses.push('花费了较多时间在娱乐上');
  if (!hasKeywords.work && !hasKeywords.health) losses.push('缺乏有效的自我提升');
  if (losses.length === 0) losses.push('仍有改进空间');

  // 生成深度洞察
  const insights: string[] = [];
  if (hasKeywords.work && hasKeywords.health) {
    insights.push('今天在工作与健康之间保持了较好的平衡');
  } else if (hasKeywords.work && !hasKeywords.health) {
    insights.push('工作投入较多，但也要注意身体健康');
  }
  if (hasKeywords.positive) {
    insights.push('积极的心态是今天最大的收获');
  }
  if (insights.length === 0) {
    insights.push('平凡的一天也有值得记录的细节');
  }

  // 生成可行动建议
  const actions: string[] = [];
  if (hasKeywords.work) actions.push('明天继续保持高效工作状态');
  if (!hasKeywords.health) actions.push('明天增加30分钟运动时间');
  if (hasKeywords.family) actions.push('主动联系一个重要的朋友');
  if (actions.length < 2) actions.push('早睡早起，保持规律作息');

  // 情绪判断
  let emotion = '平静';
  let emotionDetail = '情绪平稳';
  if (hasKeywords.positive) {
    emotion = '积极';
    emotionDetail = '心情愉悦，充满动力';
  } else if (hasKeywords.negative) {
    emotion = '焦虑';
    emotionDetail = '有些疲惫和压力';
  }

  // 评分（基于内容长度和关键词）
  const rating = Math.min(10, 5 +
    (hasKeywords.work ? 1 : 0) +
    (hasKeywords.health ? 1 : 0) +
    (hasKeywords.family ? 1 : 0) +
    (hasKeywords.positive ? 1 : 0) +
    (words.length > 200 ? 1 : 0)
  );

  // 关键词提取
  const keywords = Object.entries(hasKeywords)
    .filter(([key, value]) => value && key !== 'positive' && key !== 'negative')
    .slice(0, 4)
    .map(([key]) => {
      const map: Record<string, string> = {
        work: '工作',
        health: '健康',
        family: '家庭',
        social: '社交',
        rest: '休息',
      };
      return map[key];
    });

  return {
    gains,
    losses,
    ideas: ['继续保持今天的良好习惯', '明天可以尝试新的挑战'],
    insights,
    actions,
    emotion,
    emotionDetail,
    rating,
    keywords: keywords.length > 0 ? keywords : ['日常'],
    timeAnalysis: {
      productive: hasKeywords.work ? 60 : 40,
      wasted: hasKeywords.negative ? 30 : 20,
      rest: hasKeywords.rest ? 20 : 10,
    },
  };
}

/**
 * 清理AI返回的JSON（去除```json标记）
 */
function cleanAIResponse(text: string): string {
  // 去除可能的```json和```标记
  let cleaned = text.trim();

  // 尝试提取JSON部分
  const jsonMatch = cleaned.match(/```json\s*([\s\S]*?)\s*```/) ||
                   cleaned.match(/```\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  }

  // 尝试找到第一个{和最后一个}
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}

/**
 * 增强版系统Prompt - 深度洞察型
 */
const ENHANCED_SYSTEM_PROMPT = `你是一位专业的成长教练和心理学家，擅长通过日常反思帮助用户实现自我成长。

请深度分析用户的复盘内容，提取以下信息：

### 分析维度：

1. **核心收获（gains）** - 3-5条
   - 具体完成了什么有价值的事
   - 学到了什么新知识或技能
   - 突破了什么自我限制
   - 有什么意想不到的收获

2. **待改进点（losses）** - 3-5条
   - 哪些具体行为可以优化
   - 浪费了什么宝贵资源（时间、精力、情绪）
   - 犯了什么可避免的错误
   - 有什么重复出现的问题模式

3. **关键洞察（insights）** - 2-3条
   - 今天最重要的发现或感悟
   - 看似微小但影响深远的细节
   - 行为背后的深层原因
   - 值得延续的微习惯

4. **可行动建议（actions）** - 2-3条
   - 明天可以立即尝试的具体改变
   - 需要坚持的小习惯
   - 值得深入探索的方向

5. **情绪状态（emotion）** - 以下7个之一
   积极向上 | 平和稳定 | 略感焦虑 | 明显疲惫
   充满期待 | 略显沮丧 | 复杂混合

6. **情绪详情（emotionDetail）** - 15字内描述情绪

7. **本日评分（rating）** - 1-10分

8. **关键词（keywords）** - 3-5个最重要的标签

9. **想法（ideas）** - 2-3条闪现的灵感或新想法

10. **时间分析（timeAnalysis）** - 估算今天的
    - productive: 高效时间占比（0-100）
    - wasted: 浪费时间占比（0-100）
    - rest: 休息时间占比（0-100）

### 输出格式：
纯JSON，不要有其他文字或标记：
\`\`\`
{
  "gains": ["收获1", "收获2"],
  "losses": ["待改进1", "待改进2"],
  "ideas": ["想法1", "想法2"],
  "insights": ["洞察1", "洞察2"],
  "actions": ["行动建议1", "行动建议2"],
  "emotion": "积极向上",
  "emotionDetail": "心情愉悦，充满动力",
  "rating": 8,
  "keywords": ["关键词1", "关键词2"],
  "timeAnalysis": {
    "productive": 60,
    "wasted": 20,
    "rest": 20
  }
}
\`\`\``;

/**
 * 调用增强版AI分析
 */
export async function analyzeWithAI(
  content: string,
  history?: EnhancedReflectionData[]
): Promise<EnhancedReflectionData> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  // 如果没有API Key，使用智能Mock
  if (!apiKey) {
    console.warn('[AI] 未配置API Key，使用智能Mock');
    return generateSmartMock(content);
  }

  try {
    // 构建请求
    let prompt = content;

    // 如果有历史数据，添加到prompt中
    if (history && history.length > 0) {
      const recentHistory = history.slice(-3); // 最近3天
      const historyText = recentHistory.map((h, i) => `
第${i + 1}天：
- 评分：${h.rating}/10
- 情绪：${h.emotion}
- 收获：${h.gains.join('、')}
- 待改进：${h.losses.join('、')}
      `.trim()).join('\n');

      prompt = `${content}

【最近3天的复盘参考】
${historyText}

请结合用户最近的情况，给出更有针对性的分析和建议。`;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: ENHANCED_SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // 清理并解析JSON
    const cleaned = cleanAIResponse(result);
    const structuredData = JSON.parse(cleaned);

    console.log('[AI] 分析成功:', structuredData);
    return structuredData;
  } catch (error) {
    console.error('[AI] 分析失败，使用智能Mock:', error);
    return generateSmartMock(content);
  }
}

/**
 * 生成周报/月报
 */
export async function generatePeriodReport(
  reflections: Array<{
    date: string;
    isMeaningful: boolean;
    content: string;
    structuredData: EnhancedReflectionData;
  }>,
  period: 'week' | 'month'
): Promise<{
  summary: string;
  highlights: string[];
  challenges: string[];
  suggestions: string[];
  trendAnalysis: string;
  nextPeriodFocus: string[];
}> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 如果没有API Key，使用Mock
  if (!apiKey) {
    return generateMockReport(reflections, period);
  }

  try {
    const meaningfulCount = reflections.filter(r => r.isMeaningful).length;
    const avgRating = reflections.reduce((sum, r) => sum + (r.structuredData.rating || 5), 0) / reflections.length;

    // 情绪分布
    const emotions = reflections.map(r => r.structuredData.emotion);
    const emotionCounts = emotions.reduce((acc, e) => {
      acc[e] = (acc[e] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summaryData = {
      period,
      totalDays: reflections.length,
      meaningfulDays: meaningfulCount,
      meaningfulRate: Math.round((meaningfulCount / reflections.length) * 100),
      avgRating: Math.round(avgRating * 10) / 10,
      emotionDistribution: emotionCounts,
      topKeywords: reflections
        .flatMap(r => r.structuredData.keywords)
        .reduce((acc, k) => {
          acc[k] = (acc[k] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
    };

    const prompt = `基于以下${period === 'week' ? '周' : '月'}度复盘数据，生成报告：

${JSON.stringify(summaryData, null, 2)}

请生成：
1. 总体评价（150字内）
2. 3-5个亮点
3. 2-3个挑战
4. 3-5条改进建议
5. 趋势分析（情绪、状态等）
6. 下${period === 'week' ? '周' : '月'}关注重点

返回JSON格式。`;

    const response = await fetch(process.env.DEEPSEEK_API_URL!, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是专业的成长教练，善于从数据中发现模式和趋势。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    const cleaned = cleanAIResponse(result);
    const report = JSON.parse(cleaned);

    console.log('[AI] 报告生成成功:', report);
    return report;
  } catch (error) {
    console.error('[AI] 报告生成失败，使用Mock:', error);
    return generateMockReport(reflections, period);
  }
}

/**
 * Mock报告生成
 */
function generateMockReport(
  reflections: Array<{ isMeaningful: boolean }>,
  period: 'week' | 'month'
): {
  summary: string;
  highlights: string[];
  challenges: string[];
  suggestions: string[];
  trendAnalysis: string;
  nextPeriodFocus: string[];
} {
  const meaningfulCount = reflections.filter(r => r.isMeaningful).length;
  const rate = Math.round((meaningfulCount / reflections.length) * 100);

  return {
    summary: `本${period === 'week' ? '周' : '月'}共复盘${reflections.length}天，其中有意义${meaningfulCount}天，占比${rate}%。整体表现${rate >= 70 ? '优秀' : rate >= 50 ? '良好' : '有待提升'}，${rate >= 70 ? '保持了稳定的状态' : '仍有较大提升空间'}。`,
    highlights: [
      `坚持复盘${reflections.length}天，养成了良好习惯`,
      `有意义天数占比达到${rate}%`,
      '在工作和学习之间保持了平衡',
    ],
    challenges: [
      '情绪波动需要进一步稳定',
      '时间管理效率有待提升',
      '部分习惯需要加强坚持',
    ],
    suggestions: [
      '继续保持早起习惯',
      '每天至少30分钟运动',
      '减少社交媒体使用',
      '定期回顾目标进展',
    ],
    trendAnalysis: rate >= 70
      ? '整体呈上升趋势，状态稳定向好'
      : '波动较大，需要找到规律并坚持',
    nextPeriodFocus: [
      '提升工作效率',
      '加强情绪管理',
      '优化时间分配',
    ],
  };
}

// 导出智能Mock函数供外部使用
export { generateSmartMock };
