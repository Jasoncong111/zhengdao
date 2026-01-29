/**
 * AI 复盘功能测试脚本
 *
 * 用途：验证 AI 复盘 API 的实际效果
 * 运行：npx tsx scripts/test-ai-review.ts
 */

import dotenv from 'dotenv';
import path from 'path';

// 加载环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { generateGoalComparisonAnalysis, generateProblemAnalysis, getGoalComparisonData, analyzeProblemMonths } from '../lib/review-service';
import { isAIServiceAvailable, getCurrentProvider } from '../lib/ai-service';

// 模拟用户数据
const mockComparisonData = {
  goals: [
    {
      id: '1',
      walletAddress: '0x1234567890abcdef',
      year: 2026,
      wealthGoals: {
        monthlyIncome: 50000,
        savings: 10000,
        investmentReturn: 5000,
      },
      healthGoals: {
        exerciseFrequency: '每周3-4次',
        weightManagement: '保持65kg',
        sleepQuality: '每天7-8小时',
      },
      familyGoals: {
        familyTime: '每周2小时',
        parentChildRelationship: '提升沟通',
        partnerRelationship: '每周约会',
      },
      otherGoals: {
        learningGoals: ['学习React', '学习智能合约'],
        socialGoals: ['参加技术聚会'],
        hobbies: ['阅读', '跑步'],
      },
      createdAt: new Date('2026-01-01'),
    },
  ],
  yearlyStats: {
    totalDays: 180,
    meaningfulDays: 126,
    meaningfulRatio: 70,
  },
  monthlyData: [
    { month: '1月', total: 25, meaningful: 20, ratio: 80 },
    { month: '2月', total: 20, meaningful: 18, ratio: 90 },
    { month: '3月', total: 22, meaningful: 15, ratio: 68.2 },
    { month: '4月', total: 18, meaningful: 10, ratio: 55.6 },
    { month: '5月', total: 20, meaningful: 8, ratio: 40 },
    { month: '6月', total: 15, meaningful: 5, ratio: 33.3 },
    { month: '7月', total: 25, meaningful: 18, ratio: 72 },
    { month: '8月', total: 20, meaningful: 16, ratio: 80 },
    { month: '9月', total: 0, meaningful: 0, ratio: 0 },
    { month: '10月', total: 0, meaningful: 0, ratio: 0 },
    { month: '11月', total: 0, meaningful: 0, ratio: 0 },
    { month: '12月', total: 15, meaningful: 16, ratio: 106.7 },
  ],
};

const mockProblemMonths = [
  { month: '6月', total: 15, meaningful: 5, ratio: 33.3 },
  { month: '5月', total: 20, meaningful: 8, ratio: 40 },
  { month: '4月', total: 18, meaningful: 10, ratio: 55.6 },
];

async function main() {
  console.log('🤖 AI 复盘功能测试\n');
  console.log('='.repeat(60));

  // 1. 检查 AI 服务可用性
  console.log('\n📊 第一步：检查 AI 服务配置');
  console.log('-'.repeat(60));

  const isAvailable = isAIServiceAvailable();
  const currentProvider = getCurrentProvider();

  console.log(`✅ AI 服务可用: ${isAvailable ? '是' : '否'}`);
  console.log(`🔧 当前 AI 提供商: ${currentProvider || '无'}`);

  if (!isAvailable) {
    console.error('\n❌ 错误：没有可用的 AI API Key');
    console.log('请在 .env.local 中配置以下任意一个：');
    console.log('  - GLM_API_KEY (推荐)');
    console.log('  - MINIMAX_API_KEY + MINIMAX_GROUP_ID');
    console.log('  - DEEPSEEK_API_KEY');
    console.log('  - GEMINI_API_KEY');
    process.exit(1);
  }

  // 2. 测试年度目标对比分析
  console.log('\n📈 第二步：测试年度目标对比分析');
  console.log('-'.repeat(60));

  try {
    console.log('🔍 正在生成年度目标对比分析...');
    const startTime = Date.now();

    const goalAnalysis = await generateGoalComparisonAnalysis(mockComparisonData);

    const duration = Date.now() - startTime;
    console.log(`✅ 年度目标对比分析生成成功 (耗时: ${duration}ms)\n`);
    console.log('📝 分析结果：');
    console.log('─'.repeat(60));
    console.log(goalAnalysis);
    console.log('─'.repeat(60));

    // 验证结果质量
    if (goalAnalysis.includes('降级') || goalAnalysis.includes('今年你已打卡')) {
      console.log('\n⚠️  警告：使用的是降级文案，AI API 可能未生效');
    } else {
      console.log('\n✅ AI 生成的内容符合预期');
    }
  } catch (error) {
    console.error('\n❌ 年度目标对比分析生成失败:', error);
  }

  // 3. 测试问题分析报告
  console.log('\n🔍 第三步：测试问题分析报告');
  console.log('-'.repeat(60));

  try {
    console.log('正在生成问题分析报告...');
    const startTime = Date.now();

    const problemAnalysis = await generateProblemAnalysis(mockProblemMonths);

    const duration = Date.now() - startTime;
    console.log(`✅ 问题分析报告生成成功 (耗时: ${duration}ms)\n`);
    console.log('📝 分析结果：');
    console.log('─'.repeat(60));
    console.log(problemAnalysis);
    console.log('─'.repeat(60));

    // 验证结果质量
    if (problemAnalysis.includes('降级') || problemAnalysis.includes('目前数据不足')) {
      console.log('\n⚠️  警告：使用的是降级文案，AI API 可能未生效');
    } else {
      console.log('\n✅ AI 生成的内容符合预期');
    }
  } catch (error) {
    console.error('\n❌ 问题分析报告生成失败:', error);
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 测试完成！');
  console.log('='.repeat(60));
}

main().catch((error) => {
  console.error('\n❌ 测试失败:', error);
  process.exit(1);
});
