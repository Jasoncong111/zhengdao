/**
 * 演示数据生成服务
 *
 * 用于快速生成测试用的打卡数据，支持演示和开发调试
 */

import { Reflection, StructuredReflectionData } from './db';
import { ReflectionService } from './storage';
import { callAIService } from './ai-service';

/**
 * 演示数据生成配置
 */
export interface SeedDataConfig {
  /** 钱包地址 */
  walletAddress: string;
  /** 生成天数（默认60天） */
  days?: number;
  /** 打卡概率（0-1，默认0.8） */
  checkInProbability?: number;
  /** 有意义概率（0-1，默认0.7） */
  meaningfulProbability?: number;
  /** 进度回调 */
  onProgress?: (current: number, total: number, message: string) => void;
}

/**
 * 演示数据文本库
 */
const DEMO_TEXT_LIBRARY = {
  // 工作学习相关
  work: [
    '今天完成了重要的项目里程碑，感觉很有成就感',
    '深度学习了6小时，掌握了新的技术栈',
    '参与了团队讨论，提出了几个有价值的建议',
    '完成了季度报告的撰写，质量超出预期',
    '解决了困扰已久的bug，提升了系统性能',
    '阅读了专业书籍，做了详细的笔记',
    '参加了线上培训，学习了新的工作方法',
    '完成了代码重构，代码质量明显提升',
  ],
  // 健康运动相关
  health: [
    '晨跑5公里，全天精力充沛',
    '坚持了健康的饮食习惯，感觉身体轻盈',
    '完成了力量训练，肌肉酸痛但很充实',
    '冥想30分钟，内心平静了许多',
    '早睡早起，作息规律带来良好状态',
    '瑜伽练习让身体柔韧性和平衡感提升',
    '戒烟戒酒，健康意识增强',
    '定期体检，了解自己的身体状况',
  ],
  // 人际关系相关
  relationship: [
    '和家人深度交流，增进了彼此理解',
    '帮助朋友解决了问题，感到很开心',
    '参加了社交活动，认识了新朋友',
    '和老朋友聚会，回忆美好时光',
    '主动关心同事，建立了更好的工作关系',
    '陪伴父母聊天，感受到家庭的温暖',
    '解决了和伴侣的误会，关系更加亲密',
    '参加志愿者活动，帮助他人让我快乐',
  ],
  // 个人成长相关
  growth: [
    '反思了自己的不足，制定了改进计划',
    '克服了拖延症，效率大大提升',
    '学会了新的技能，拓展了自己的能力边界',
    '面对挑战没有退缩，成长了很多',
    '培养了新的兴趣爱好，生活更丰富多彩',
    '改进了时间管理方法，工作生活更平衡',
    '增强了自我意识，更了解自己的需求和目标',
    '培养了阅读习惯，知识面不断扩展',
  ],
  // 情绪管理相关
  emotion: [
    '保持了积极乐观的心态，即使遇到困难',
    '控制住了情绪，理性处理了冲突',
    '学会了感恩，对生活充满感激',
    '放下了过去的遗憾，轻装前行',
    '接纳了自己的不完美，更加自信',
    '在压力下保持了冷静，找到了解决方案',
    '学会了放松，不再过度焦虑',
    '培养了同理心，更好地理解他人',
  ],
};

/**
 * 情绪标签列表
 */
const EMOTIONS = ['积极', '平静', '焦虑', '疲惫', '开心', '充实', '沮丧', '希望'];

/**
 * 关键词列表
 */
const KEYWORDS = [
  '成长',
  '学习',
  '健康',
  '家庭',
  '工作',
  '反思',
  '坚持',
  '改变',
  '进步',
  '感恩',
  '挑战',
  '突破',
  '平衡',
  '专注',
  '效率',
  '创新',
  '沟通',
  '理解',
  '耐心',
  '勇气',
];

/**
 * 随机获取数组中的一个元素
 */
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 随机获取多个不重复的元素
 */
function randomChoices<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * 生成随机的复盘文本
 */
function generateRandomReflection(): string {
  // 随机选择2-3个主题
  const themes = randomChoices(Object.keys(DEMO_TEXT_LIBRARY), Math.floor(Math.random() * 2) + 2);

  // 从每个主题中随机选择一条内容
  const contents = themes.map(theme => randomChoice(DEMO_TEXT_LIBRARY[theme as keyof typeof DEMO_TEXT_LIBRARY]));

  // 用连接词组合
  const connectors = ['。', '。另外，', '。同时，', '。此外，'];
  let result = '';
  contents.forEach((content, index) => {
    if (index === 0) {
      result = content;
    } else {
      result += connectors[index % connectors.length] + content;
    }
  });

  return result + '。';
}

/**
 * 生成模拟的结构化数据（不调用AI，直接生成）
 */
function generateMockStructuredData(): StructuredReflectionData {
  return {
    gains: randomChoices(
      ['完成了重要任务', '学到了新知识', '提升了能力', '改善了关系', '增强了体质', '获得了新见解'],
      Math.floor(Math.random() * 3) + 1
    ),
    losses: randomChoices(
      ['浪费了一些时间', '情绪控制不够好', '沟通不够清晰', '计划执行不力', '注意力不够集中'],
      Math.floor(Math.random() * 2)
    ),
    ideas: randomChoices(
      [
        '可以优化工作流程',
        '尝试新的学习方法',
        '建立更好的习惯',
        '加强时间管理',
        '提升沟通技巧',
        '保持工作生活平衡',
      ],
      Math.floor(Math.random() * 2) + 1
    ),
    emotion: randomChoice(EMOTIONS),
    keywords: randomChoices(KEYWORDS, Math.floor(Math.random() * 3) + 3),
  };
}

/**
 * 使用AI生成结构化数据
 */
async function generateAIStructuredData(rawContent: string): Promise<StructuredReflectionData> {
  try {
    const prompt = `
请分析以下每日反思内容，提取关键信息并以JSON格式返回：

用户反思：
${rawContent}

请返回以下格式的JSON（不要包含其他文字）：
{
  "gains": ["收获1", "收获2"],
  "losses": ["损失1"],
  "ideas": ["想法1"],
  "emotion": "情绪标签",
  "keywords": ["关键词1", "关键词2", "关键词3"]
}

要求：
- gains: 学到了什么、做到了什么（1-3条）
- losses: 浪费了什么、犯了什么错（0-2条）
- ideas: 闪现的灵感、新的想法（1-2条）
- emotion: 积极/平静/焦虑/疲惫/开心/充实/沮丧/希望 之一
- keywords: 3-5个最重要的关键词
`;

    const response = await callAIService(prompt, 500);

    // 尝试解析AI返回的JSON
    let jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }

    jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // 如果AI返回格式不正确，使用模拟数据
    console.warn('[Seed Data] AI返回格式不正确，使用模拟数据');
    return generateMockStructuredData();
  } catch (error) {
    console.error('[Seed Data] AI生成失败，使用模拟数据:', error);
    return generateMockStructuredData();
  }
}

/**
 * 生成一天的演示数据
 */
async function generateOneDayData(
  date: Date,
  walletAddress: string,
  checkInProbability: number,
  meaningfulProbability: number,
  useAI: boolean
): Promise<Reflection | null> {
  // 根据概率决定是否打卡
  if (Math.random() > checkInProbability) {
    return null;
  }

  const dateStr = date.toISOString().split('T')[0];
  const isMeaningful = Math.random() < meaningfulProbability;

  // 生成原始内容
  const rawContent = generateRandomReflection();

  // 生成结构化数据
  const structuredData = useAI
    ? await generateAIStructuredData(rawContent)
    : generateMockStructuredData();

  return {
    date: dateStr,
    isMeaningful,
    rawContent,
    structuredData,
    walletAddress,
    createdAt: date,
    updatedAt: date,
  };
}

/**
 * 生成演示数据
 *
 * @param config 生成配置
 * @returns 生成的反思数据数组
 */
export async function generateSeedData(config: SeedDataConfig): Promise<Reflection[]> {
  const {
    walletAddress,
    days = 60,
    checkInProbability = 0.8,
    meaningfulProbability = 0.7,
    onProgress,
  } = config;

  console.log('[Seed Data] 开始生成演示数据...');
  console.log(`[Seed Data] 钱包地址: ${walletAddress}`);
  console.log(`[Seed Data] 生成天数: ${days}`);
  console.log(`[Seed Data] 打卡概率: ${checkInProbability * 100}%`);
  console.log(`[Seed Data] 有意义概率: ${meaningfulProbability * 100}%`);

  const results: Reflection[] = [];
  const today = new Date();

  // 检查AI服务是否可用
  const useAI = await import('./ai-service').then(m => m.isAIServiceAvailable());
  console.log(`[Seed Data] AI服务${useAI ? '可用' : '不可用，将使用模拟数据'}`);

  // 从今天往前推N天
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    // 更新进度
    if (onProgress) {
      onProgress(i + 1, days, `正在生成 ${date.toISOString().split('T')[0]} 的数据...`);
    }

    // 生成一天的数据
    const reflection = await generateOneDayData(
      date,
      walletAddress,
      checkInProbability,
      meaningfulProbability,
      useAI
    );

    if (reflection) {
      results.push(reflection);

      // 保存到数据库
      try {
        // 检查是否已存在该日期的数据
        const existing = await ReflectionService.getReflectionByDate(reflection.date, walletAddress);

        if (existing) {
          // 更新现有数据
          await ReflectionService.updateReflection(existing.id!, reflection);
          console.log(`[Seed Data] 更新 ${reflection.date} 的数据`);
        } else {
          // 添加新数据
          await ReflectionService.saveReflection(reflection);
          console.log(`[Seed Data] 保存 ${reflection.date} 的数据`);
        }
      } catch (error) {
        console.error(`[Seed Data] 保存 ${reflection.date} 的数据失败:`, error);
        throw error;
      }
    }

    // 添加延迟，避免AI API调用过快
    if (useAI && i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`[Seed Data] 生成完成，共生成 ${results.length} 条数据`);
  return results;
}

/**
 * 清除演示数据
 *
 * @param walletAddress 钱包地址
 */
export async function clearSeedData(walletAddress: string): Promise<void> {
  console.log('[Seed Data] 清除演示数据...');
  const { db } = await import('./db');
  await db.reflections.where('walletAddress').equals(walletAddress).delete();
  console.log('[Seed Data] 清除完成');
}
