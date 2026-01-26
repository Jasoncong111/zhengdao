/**
 * DeepSeek API 封装
 * 用于反思内容的结构化提取
 */

import { StructuredReflectionData } from './db';

/**
 * DeepSeek API 配置
 */
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_MODEL = 'deepseek-chat';

/**
 * AI 处理错误
 */
export class DeepSeekError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'DeepSeekError';
  }
}

/**
 * 系统 Prompt
 * 指导 AI 如何结构化提取反思内容
 */
const SYSTEM_PROMPT = `你是一个专业的复盘助手。请将用户的复盘内容整理成JSON格式。

要求：
1. gains（收获）和losses（损失）至少各提取2条
2. emotion（情绪）必须是以下4个之一：积极、平静、焦虑、疲惫
3. keywords（关键词）提取3-5个最重要的关键词
4. ideas（想法）提取1-3条

返回JSON格式，不要其他文字：
{
  "gains": ["学到了什么", "做到了什么"],
  "losses": ["浪费了什么", "犯了什么错"],
  "ideas": ["闪现的灵感", "新的想法"],
  "emotion": "积极",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}`;

/**
 * Mock AI 响应
 * 当API调用失败时的降级方案
 */
function getMockResponse(content: string): StructuredReflectionData {
  const wordCount = content.length;

  // 根据内容长度生成不同深度的Mock数据
  return {
    gains: wordCount > 200
      ? ['完成了重要工作', '学习了新知识', '锻炼了身体', '陪伴了家人']
      : ['完成了一项任务'],
    losses: wordCount > 200
      ? ['花费了太多时间在社交媒体', '熬夜影响了健康', '拖延了重要事项']
      : ['浪费了一些时间'],
    ideas: wordCount > 200
      ? ['尝试番茄工作法', '每天早起30分钟', '定期复盘总结']
      : ['明天改进'],
    emotion: ['积极', '平静', '焦虑', '疲惫'][Math.floor(Math.random() * 4)],
    keywords: ['成长', '效率', '健康', '学习', '复盘'].slice(0, 3 + Math.floor(Math.random() * 3)),
  };
}

/**
 * 调用 DeepSeek API 进行结构化提取
 * @param content 用户反思内容
 * @returns 结构化数据
 */
export async function processReflectionWithDeepSeek(content: string): Promise<StructuredReflectionData> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 如果没有API Key，使用Mock数据
  if (!apiKey) {
    console.warn('[DeepSeek] 未配置API Key，使用Mock数据');
    return getMockResponse(content);
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
      // 10秒超时
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new DeepSeekError(
        `API请求失败: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const result = data.choices[0].message.content;

    // 解析JSON
    const structuredData = JSON.parse(result);

    // 验证数据结构
    if (!structuredData.gains || !structuredData.losses || !structuredData.emotion) {
      throw new DeepSeekError('AI返回数据格式不正确');
    }

    console.log('[DeepSeek] AI处理成功:', structuredData);
    return structuredData;
  } catch (error) {
    // 网络错误或超时，使用Mock数据
    console.error('[DeepSeek] API调用失败，使用Mock数据:', error);
    return getMockResponse(content);
  }
}

/**
 * 生成月度洞察报告
 * @param reflections 本月所有反思数据
 * @returns AI生成的洞察报告
 */
export async function generateMonthlyInsights(
  reflections: Array<{
    date: string;
    isMeaningful: boolean;
    structuredData: StructuredReflectionData;
  }>
): Promise<{
  summary: string;
  suggestions: string[];
}> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  // 如果没有API Key，使用Mock数据
  if (!apiKey) {
    console.warn('[DeepSeek] 未配置API Key，使用Mock月度报告');
    return getMockMonthlyInsights(reflections);
  }

  try {
    // 准备数据摘要
    const summary = reflections.map((r) => ({
      date: r.date,
      isMeaningful: r.isMeaningful,
      emotion: r.structuredData.emotion,
      keywords: r.structuredData.keywords.join(', '),
      gains: r.structuredData.gains.slice(0, 2).join('; '),
    }));

    const prompt = `基于以下复盘数据，生成月度洞察报告：

${JSON.stringify(summary, null, 2)}

请生成：
1. 总体评价（100字以内）
2. 3-5条改进建议

返回JSON格式：
{
  "summary": "总体评价",
  "suggestions": ["建议1", "建议2", "建议3"]
}`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的成长教练，善于从日常反思中提炼洞察。',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
      // 15秒超时
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new DeepSeekError(`API请求失败: ${response.statusText}`, response.status);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    console.log('[DeepSeek] 月度洞察生成成功:', result);
    return result;
  } catch (error) {
    console.error('[DeepSeek] 月度洞察生成失败，使用Mock数据:', error);
    return getMockMonthlyInsights(reflections);
  }
}

/**
 * Mock 月度洞察报告
 */
function getMockMonthlyInsights(
  reflections: Array<{ isMeaningful: boolean }>
): {
  summary: string;
  suggestions: string[];
} {
  const meaningfulCount = reflections.filter((r) => r.isMeaningful).length;
  const rate = Math.round((meaningfulCount / reflections.length) * 100);

  return {
    summary: `本月共复盘${reflections.length}天，其中有意义${meaningfulCount}天，占比${rate}%。整体表现${rate >= 70 ? '优秀' : rate >= 50 ? '良好' : '有待提升'}，情绪波动${rate >= 70 ? '稳定' : '较大'}。`,
    suggestions: [
      '保持早起习惯，提升早晨效率',
      '增加运动时间，改善身体状态',
      '减少社交媒体使用，专注深度工作',
      '定期回顾目标，及时调整方向',
      '培养冥想习惯，保持内心平静',
    ].slice(0, 3 + Math.floor(Math.random() * 3)),
  };
}
