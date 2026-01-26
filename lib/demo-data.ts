/**
 * Demo 数据生成脚本
 * 用于生成模拟复盘数据，方便演示和测试
 */

import { ReflectionService } from './storage';
import type { Reflection } from './db';

/**
 * Demo 模板数据
 */
const DEMO_TEMPLATES = {
  gains: [
    '完成了项目的核心功能开发',
    '坚持早起，感觉精力充沛',
    '学习了新的设计模式',
    '和家人度过了愉快的时光',
    '完成了重要的工作汇报',
    '坚持健身，身体状态良好',
    '阅读了技术书籍，提升了技能',
    '解决了困扰已久的Bug',
    '团队协作更加顺畅',
    '学会了使用新的开发工具',
  ],
  losses: [
    '花费太多时间在社交媒体上',
    '熬夜影响了第二天的状态',
    '拖延了重要的任务',
    '情绪波动较大，需要调整',
    '工作中容易分心',
    '饮食不规律，影响健康',
    '沟通不够及时，造成误解',
    '没有坚持冥想习惯',
    '代码质量需要提升',
    '时间管理有待改进',
  ],
  ideas: [
    '尝试番茄工作法提高效率',
    '每天早起30分钟进行晨练',
    '定期进行代码审查',
    '建立更好的沟通机制',
    '培养阅读习惯',
    '尝试新的技术栈',
    '优化工作流程',
    '加强团队建设',
    '保持学习热情',
    '平衡工作和生活',
  ],
  emotions: ['积极', '平静', '焦虑', '疲惫'],
  keywords: [
    '成长',
    '效率',
    '健康',
    '学习',
    '复盘',
    '团队',
    '技术',
    '健身',
    '早起',
    '阅读',
  ],
};

/**
 * 生成随机日期（最近30天）
 */
function getRandomDate(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - offset);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * 随机选择数组中的元素
 */
function randomChoice<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * 生成单条反思数据
 */
function generateReflection(dayOffset: number, walletAddress: string): Omit<Reflection, 'id'> {
  const isMeaningful = Math.random() > 0.2; // 80%概率有意义
  const date = getRandomDate(dayOffset);

  // 根据是否有意义决定字数
  const wordCount = isMeaningful
    ? 300 + Math.floor(Math.random() * 400) // 300-700字
    : 100 + Math.floor(Math.random() * 200); // 100-300字

  const rawContent = `
${isMeaningful ? '今天是有意义的一天。' : '今天遇到了一些挑战。'}

${randomChoice(DEMO_TEMPLATES.gains, isMeaningful ? 3 : 1).join('\n')}

${randomChoice(DEMO_TEMPLATES.losses, Math.random() > 0.5 ? 2 : 1).join('\n')}

${randomChoice(DEMO_TEMPLATES.ideas, 2).join('\n')}

总结：${isMeaningful ? '继续保持，明天会更好！' : '需要改进，加油！'}
  `.trim();

  return {
    date,
    isMeaningful,
    rawContent,
    structuredData: {
      gains: randomChoice(DEMO_TEMPLATES.gains, isMeaningful ? 3 : 1),
      losses: randomChoice(DEMO_TEMPLATES.losses, 2),
      ideas: randomChoice(DEMO_TEMPLATES.ideas, 2),
      emotion: randomChoice(DEMO_TEMPLATES.emotions, 1)[0],
      keywords: randomChoice(DEMO_TEMPLATES.keywords, 3 + Math.floor(Math.random() * 3)),
    },
    walletAddress,
    createdAt: new Date(date),
    updatedAt: new Date(date),
  };
}

/**
 * 生成指定天数的Demo数据
 * @param walletAddress 钱包地址
 * @param days 天数（默认30天）
 * @returns 生成的数据数量
 */
export async function generateDemoData(walletAddress: string, days: number = 30): Promise<number> {
  console.log(`[Demo Data] 开始生成 ${days} 天的模拟数据...`);

  // 清空现有数据
  await ReflectionService.clearAllReflections(walletAddress);

  // 生成新数据
  let count = 0;
  for (let i = days - 1; i >= 0; i--) {
    // 80%概率有数据
    if (Math.random() > 0.2) {
      const reflection = generateReflection(i, walletAddress);
      await ReflectionService.saveReflection(reflection);
      count++;
    }
  }

  console.log(`[Demo Data] 生成完成，共 ${count} 条数据`);
  return count;
}

/**
 * 快速生成Demo数据（浏览器控制台使用）
 * 使用方法：
 * 1. 打开浏览器控制台
 * 2. 复制粘贴以下代码：
 *
 * import('./lib/demo-data.ts').then(module => {
 *   const address = '0x1234567890123456789012345678901234567890'; // 替换为你的钱包地址
 *   module.generateDemoData(address, 30);
 * });
 */
export function setupDemoDataHelper() {
  (window as any).generateDemoData = async (walletAddress: string, days: number = 30) => {
    return await generateDemoData(walletAddress, days);
  };

  console.log('[Demo Data] Demo数据生成助手已启用');
  console.log('[Demo Data] 使用方法: generateDemoData(walletAddress, days)');
  console.log('[Demo Data] 示例: generateDemoData("0x123...", 30)');
}

/**
 * 检查是否需要生成Demo数据
 * @param walletAddress 钱包地址
 * @returns 是否需要生成
 */
export async function shouldGenerateDemoData(walletAddress: string): Promise<boolean> {
  const hasReflected = await ReflectionService.hasReflectedToday(walletAddress);
  const allReflections = await ReflectionService.getAllReflections(walletAddress);
  return !hasReflected && allReflections.length === 0;
}
