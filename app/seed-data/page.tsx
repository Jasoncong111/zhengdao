'use client';

/**
 * 测试数据展示中心
 * 直接预览真实数据库中的复盘数据
 */

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ReflectionService } from '@/lib/storage';
import { OnboardingService } from '@/lib/onboarding-service';
import { GoalsService } from '@/lib/db-goals';
import { db } from '@/lib/db';
import type { Reflection } from '@/lib/db';

export default function SeedDataPage() {
  const { address } = useAccount();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'7d' | '30d' | '6m' | '1y'>('7d');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * 加载真实数据
   */
  useEffect(() => {
    const loadData = async () => {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        const allReflections = await ReflectionService.getAllReflections(address);
        // 按日期倒序排列
        allReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReflections(allReflections);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [address]);

  /**
   * 生成测试数据
   */
  const generateTestData = async () => {
    if (!address) {
      toast.error('请先连接钱包');
      return;
    }

    setIsGenerating(true);

    try {
      // 1. 生成人生目标数据（如果还没有）
      const hasGoals = await OnboardingService.hasCompletedOnboarding(address);
      if (!hasGoals) {
        await GoalsService.saveGoals({
          walletAddress: address,
          wealthGoals: {
            monthlyIncome: '5万+',
            savings: '100万+',
            investmentReturn: '15%+',
          },
          healthGoals: {
            exerciseFrequency: '每周5次',
            weightManagement: '保持65kg',
            sleepQuality: '8小时+',
          },
          familyGoals: {
            familyTime: '每天2小时',
            parentChildRelationship: '每周家庭活动',
            partnerRelationship: '每月约会2次',
          },
          otherGoals: {
            learningGoals: ['每月读2本书'],
            socialGoals: ['每周社交1次'],
            hobbies: ['每周画画1次'],
          },
        });
        toast.success('人生目标已生成');
      }

      // 2. 生成固定的测试数据（90天，覆盖所有周期）
      const today = new Date();
      const mockReflections = [];

      // 固定测试数据 - 一个真实的故事线
      const fixedData = [
        // === 最近一周（7天） - 展示正常工作周的起伏 ===
        { offset: 0, meaningful: true, text: '周日虽然休息了，但花了3小时复盘本周工作，为下周做好了详细规划。感觉很有方向感！' },
        { offset: 1, meaningful: false, text: '周六睡到中午，刷了一下午短视频。虽然放松了，但感觉时间浪费得有点可惜。' },
        { offset: 2, meaningful: true, text: '周五完成了季度报告，老板很满意。团队一起聚餐庆祝，氛围很好。这周努力值了！' },
        { offset: 3, meaningful: true, text: '周四早起跑了个5公里，然后高效完成了2个重要任务。运动和工作双丰收！' },
        { offset: 4, meaningful: false, text: '周三状态不太好，被一个紧急bug折腾了一整天。晚上加班到10点，有点疲惫。' },
        { offset: 5, meaningful: true, text: '周二参加了公司的技术分享会，学到了新的架构思路。回来立即应用到项目中，效果不错！' },
        { offset: 6, meaningful: true, text: '周一早上列了本周计划，按优先级完成了3项重要任务。这种掌控感真好！' },

        // === 第2周（第8-14天）- 适应期，逐渐进入状态 ===
        { offset: 7, meaningful: true, text: '周日带孩子去公园，陪他放风筝、骑自行车。看到他的笑容，觉得这就是幸福。' },
        { offset: 8, meaningful: true, text: '周六整理了书房，把堆积的文件都分类归档。清爽的环境让心情也变好了。' },
        { offset: 9, meaningful: true, text: '周五完成了那个拖延了一周的任务，如释重负。下次要早点开始，不能拖延。' },
        { offset: 10, meaningful: false, text: '周四开了6个小时的会，实际工作没做多少。感觉有点虚度。' },
        { offset: 11, meaningful: true, text: '周三和同事brainstorm，想出了一个不错的创意方案。团队合作真的很重要！' },
        { offset: 12, meaningful: true, text: '周二坚持冥想15分钟，虽然思绪有点乱，但坚持下来就是胜利。' },
        { offset: 13, meaningful: false, text: '周一因为周末没休息好，整天都有点困。效率偏低，需要调整作息。' },

        // === 第3周（第15-21天）- 低谷期，工作压力大 ===
        { offset: 14, meaningful: false, text: '周日一直在焦虑下周的工作进度，没有好好休息。这种状态不对。' },
        { offset: 15, meaningful: false, text: '周六本想学习，但被各种琐事打断。最后只看了几页书，有点挫败感。' },
        { offset: 16, meaningful: true, text: '周五终于把那个紧急项目交付了，虽然过程很痛苦，但学到了很多危机处理的经验。' },
        { offset: 17, meaningful: false, text: '周四被客户要求改了5版方案，最后还是用了第一版。有点无语。' },
        { offset: 18, meaningful: false, text: '周三加班到深夜，回到家只想躺平。这种生活节奏不可持续。' },
        { offset: 19, meaningful: true, text: '周二虽然压力很大，但还是抽时间给父母打了个电话。听到他们的声音，心情好了一些。' },
        { offset: 20, meaningful: false, text: '周一早上系统崩溃，搞了一上午才恢复。一整天的节奏都被打乱了。' },

        // === 第4周（第22-28天）- 恢复期，调整方法 ===
        { offset: 21, meaningful: true, text: '周日制定了新的时间管理策略：早上2小时专注工作，晚上留出学习时间。试试效果！' },
        { offset: 22, meaningful: true, text: '周六去上了一节瑜伽课，身体放松了很多。运动真的能缓解压力。' },
        { offset: 23, meaningful: true, text: '周五主动和同事沟通了工作流程的问题，达成了共识。沟通比憋着好多了。' },
        { offset: 24, meaningful: true, text: '周四尝试番茄工作法，效率提升明显。完成了4个重要任务！' },
        { offset: 25, meaningful: true, text: '周三拒绝了两个不必要的会议，把时间留给了深度工作。学会说no很重要。' },
        { offset: 26, meaningful: true, text: '周二重新规划了任务优先级，把精力集中在最重要的事情上。感觉思路清晰多了。' },
        { offset: 27, meaningful: true, text: '周一换了新的思路，不再纠结完美，先完成再迭代。结果出奇地好！' },

        // === 第5-8周（第29-56天）- 稳定期，习惯逐渐养成 ===
        { offset: 28, meaningful: true, text: '周日回顾了这个月的成长，虽然有很多起伏，但整体在进步。继续加油！' },
        { offset: 29, meaningful: true, text: '周六参加了一个线上讲座，主题是个人成长。收获了很多新想法。' },
        { offset: 30, meaningful: true, text: '周五给团队做了技术分享，大家都说很实用。分享知识让自己也更深入理解。' },
        { offset: 31, meaningful: true, text: '周四早起跑了步，然后读了一个小时书。早起的时间质量真好！' },
        { offset: 32, meaningful: false, text: '周三晚上聚餐喝多了，今天有点难受。需要控制饮酒量。' },
        { offset: 33, meaningful: true, text: '周二完成了一个小目标：连续打卡30天！给自己买了个小礼物奖励。' },
        { offset: 34, meaningful: true, text: '周一制定了下个月的OKR，目标更清晰了。有目标才有方向。' },
        { offset: 35, meaningful: true, text: '周日和家人一起做饭，享受了温馨的家庭时光。' },
        { offset: 36, meaningful: true, text: '周六整理了照片，回忆起很多美好时刻。感恩生活。' },
        { offset: 37, meaningful: true, text: '周五帮助新同事熟悉系统，教学相长，自己也复习了一遍。' },
        { offset: 38, meaningful: true, text: '周四尝试了新的工作方式，效率提升了30%。创新很有价值！' },
        { offset: 39, meaningful: false, text: '周三下午有点懈怠，刷了不少社交媒体。需要加强自律。' },
        { offset: 40, meaningful: true, text: '周二读完了一本好书，写下了详细的读书笔记。知识需要沉淀。' },
        { offset: 41, meaningful: true, text: '周一早会主动分享了自己的工作经验，得到了认可。勇于表达！' },

        // === 第9-12周（第57-90天）- 突破期，达到新高度 ===
        { offset: 56, meaningful: true, text: '周日规划了季度目标，想要在技能上有新突破。' },
        { offset: 60, meaningful: true, text: '周三完成了一个重要的技能认证，花了2个月准备，终于拿到了！' },
        { offset: 70, meaningful: true, text: '周日总结了这季度的收获：工作更高效了，身体更健康了，心态更积极了。' },
        { offset: 80, meaningful: true, text: '周三成功主导了一个跨部门项目，展现了领导力。成长看得见！' },
        { offset: 89, meaningful: true, text: '今天是个里程碑：连续打卡90天！坚持真的能改变很多事情。' },
      ];

      // 生成固定数据
      for (const item of fixedData) {
        const date = new Date(today);
        date.setDate(date.getDate() - item.offset);
        const dateStr = date.toISOString().split('T')[0];

        mockReflections.push({
          date: dateStr,
          isMeaningful: item.meaningful,
          rawContent: item.text,
          structuredData: {
            emotion: '平静',
            keywords: ['反思', '成长'],
            gains: [],
            losses: [],
            ideas: [],
          },
          walletAddress: address,
          createdAt: date,
          updatedAt: date,
        });
      }

      // 3. 批量保存到数据库
      for (const reflection of mockReflections) {
        await ReflectionService.saveReflection(reflection);
      }

      toast.success(`成功生成90天测试数据（含完整故事线）！`);

      // 重新加载数据以显示预览
      const allReflections = await ReflectionService.getAllReflections(address);
      allReflections.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReflections(allReflections);
    } catch (error) {
      console.error('生成测试数据失败:', error);
      toast.error('生成失败，请查看控制台');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * 清空所有数据
   */
  const clearAllData = async () => {
    if (!address) {
      toast.error('请先连接钱包');
      return;
    }

    if (!confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      return;
    }

    try {
      await ReflectionService.clearAllReflections(address);
      setReflections([]);
      toast.success('数据已清空');
    } catch (error) {
      console.error('清空数据失败:', error);
      toast.error('清空失败');
    }
  };

  /**
   * 计算统计数据
   */
  const getWeekData = () => {
    const last7Days = reflections.slice(0, 7);
    return last7Days.map(r => {
      const date = new Date(r.date);
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return {
        day: weekdays[date.getDay()],
        date: r.date.substring(5),
        meaningful: r.isMeaningful,
        summary: r.rawContent.substring(0, 30) + (r.rawContent.length > 30 ? '...' : ''),
      };
    }).reverse();
  };

  const getMonthData = () => {
    const last30Days = reflections.slice(0, 30);
    return last30Days.map((r, i) => {
      const weekNum = Math.ceil((i + 1) / 7);
      return {
        day: `第${i + 1}天`,
        date: r.date.substring(5),
        week: `第${weekNum}周`,
        meaningful: r.isMeaningful,
        summary: r.isMeaningful ? '有意义的进步' : '需要改进',
      };
    }).reverse();
  };

  const getQuarterData = () => {
    // 按周聚合
    const weeks: { [key: string]: { total: number; meaningful: number } } = {};
    reflections.slice(0, 84).forEach((r, i) => {
      const weekNum = Math.floor(i / 7) + 1;
      const key = `第${weekNum}周`;
      if (!weeks[key]) {
        weeks[key] = { total: 0, meaningful: 0 };
      }
      weeks[key].total++;
      if (r.isMeaningful) weeks[key].meaningful++;
    });

    return Object.entries(weeks).map(([week, data]) => ({
      week,
      days: data.total,
      meaningful: data.meaningful,
      ratio: parseFloat(((data.meaningful / data.total) * 100).toFixed(1)),
      status: data.meaningful / data.total < 0.4 ? '低谷' : data.meaningful / data.total >= 0.85 ? '优秀' : '良好',
    }));
  };

  const getYearData = () => {
    // 按月聚合
    const months: { [key: string]: { total: number; meaningful: number } } = {};
    reflections.forEach(r => {
      const month = r.date.substring(0, 7);
      if (!months[month]) {
        months[month] = { total: 0, meaningful: 0 };
      }
      months[month].total++;
      if (r.isMeaningful) months[month].meaningful++;
    });

    return Object.entries(months).map(([month, data]) => {
      const ratio = (data.meaningful / data.total) * 100;
      const monthNum = parseInt(month.split('-')[1]);
      return {
        month: `${monthNum}月`,
        total: data.total,
        meaningful: data.meaningful,
        ratio: parseFloat(ratio.toFixed(1)),
        status: ratio >= 90 ? '年度巅峰' : ratio >= 80 ? '高效期' : ratio >= 60 ? '进步期' : '起步期',
      };
    }).sort((a, b) => parseInt(a.month) - parseInt(b.month));
  };

  return (
    <div className="min-h-screen bg-[#FFFEF2] p-6">
      <div className="max-w-7xl mx-auto py-12">
        {/* 标题 */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-4xl font-bold text-black mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            测试数据展示中心
          </h1>
          <p className="text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            预览所有维度的复盘数据展示效果
          </p>
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          className="flex gap-4 mb-8 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={generateTestData}
            disabled={!address || isGenerating}
            className={`px-6 py-3 font-bold text-lg ${
              isGenerating || !address
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            {isGenerating ? '生成中...' : '生成到数据库'}
          </button>

          <button
            onClick={() => window.location.href = '/review'}
            disabled={reflections.length === 0}
            className={`px-6 py-3 font-bold ${
              reflections.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#D43628] text-white hover:bg-[#B82818]'
            }`}
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            查看复盘页面
          </button>

          <button
            onClick={clearAllData}
            disabled={!address}
            className={`px-6 py-3 font-bold ${
              !address
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black border-2 border-black hover:bg-gray-100'
            }`}
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            清空数据
          </button>
        </motion.div>

        {/* 周期切换标签 */}
        <motion.div
          className="flex gap-2 mb-6 border-b-2 border-black pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { key: '7d' as const, label: '7天' },
            { key: '30d' as const, label: '30天' },
            { key: '6m' as const, label: '季度' },
            { key: '1y' as const, label: '年度' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-bold ${
                activeTab === tab.key
                  ? 'bg-black text-white'
                  : 'bg-white text-black border-2 border-black hover:bg-gray-100'
              }`}
              style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* 数据展示区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="bg-white border-2 border-black p-12 text-center" style={{ borderRadius: 0 }}>
              <p className="text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                加载中...
              </p>
            </div>
          ) : reflections.length === 0 ? (
            <div className="bg-white border-2 border-black p-12 text-center" style={{ borderRadius: 0 }}>
              <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                暂无数据
              </h3>
              <p className="text-black/60 mb-6" style={{ fontFamily: 'Georgia, serif' }}>
                请先点击"生成到数据库"按钮创建测试数据
              </p>
              {!address && (
                <p className="text-sm text-black/40" style={{ fontFamily: 'Georgia, serif' }}>
                  请先连接钱包
                </p>
              )}
            </div>
          ) : (
            <>
              {activeTab === '7d' && (
                <div className="bg-white border-2 border-black p-6" style={{ borderRadius: 0 }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    7天复盘数据展示
                  </h2>
                  {(() => {
                    const weekData = getWeekData();
                    const meaningfulCount = weekData.filter(d => d.meaningful).length;
                    return (
                      <>
                        <div className="mb-4 p-4 bg-black/5" style={{ borderRadius: 0 }}>
                          <p className="text-sm">
                            <strong>统计：</strong>
                            打卡{weekData.length}天 | 有意义{meaningfulCount}天 ({((meaningfulCount / weekData.length) * 100).toFixed(1)}%) | 需改进{weekData.length - meaningfulCount}天
                          </p>
                        </div>
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b-2 border-black">
                              <th className="text-left p-3">星期</th>
                              <th className="text-left p-3">日期</th>
                              <th className="text-center p-3">状态</th>
                              <th className="text-left p-3">内容摘要</th>
                            </tr>
                          </thead>
                          <tbody>
                            {weekData.map((item, idx) => (
                              <tr key={idx} className="border-b border-black/20">
                                <td className="p-3 font-bold">{item.day}</td>
                                <td className="p-3">{item.date}</td>
                                <td className="p-3 text-center">
                                  <span
                                    className={`px-3 py-1 text-sm font-bold ${
                                      item.meaningful
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                    style={{ borderRadius: 0 }}
                                  >
                                    {item.meaningful ? '✓ 有意义' : '✗ 需改进'}
                                  </span>
                                </td>
                                <td className="p-3">{item.summary}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === '30d' && (
                <div className="bg-white border-2 border-black p-6" style={{ borderRadius: 0 }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    30天复盘数据展示
                  </h2>
                  {(() => {
                    const monthData = getMonthData();
                    const meaningfulCount = monthData.filter(d => d.meaningful).length;
                    return (
                      <>
                        <div className="mb-4 p-4 bg-black/5" style={{ borderRadius: 0 }}>
                          <p className="text-sm">
                            <strong>统计：</strong>
                            打卡{monthData.length}天 | 有意义{meaningfulCount}天 ({((meaningfulCount / monthData.length) * 100).toFixed(1)}%) | 需改进{monthData.length - meaningfulCount}天
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="border-b-2 border-black">
                                <th className="text-left p-2">日期</th>
                                <th className="text-center p-2">周次</th>
                                <th className="text-center p-2">状态</th>
                                <th className="text-left p-2">评价</th>
                              </tr>
                            </thead>
                            <tbody>
                              {monthData.map((item, idx) => (
                                <tr key={idx} className="border-b border-black/10">
                                  <td className="p-2">{item.date}</td>
                                  <td className="p-2 text-center">{item.week}</td>
                                  <td className="p-2 text-center">
                                    <span
                                      className={`px-2 py-1 text-xs font-bold ${
                                        item.meaningful
                                          ? 'bg-green-100 text-green-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                      style={{ borderRadius: 0 }}
                                    >
                                      {item.meaningful ? '✓' : '✗'}
                                    </span>
                                  </td>
                                  <td className="p-2">{item.summary}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === '6m' && (
                <div className="bg-white border-2 border-black p-6" style={{ borderRadius: 0 }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    季度复盘数据展示（按周）
                  </h2>
                  {(() => {
                    const quarterData = getQuarterData();
                    const totalDays = quarterData.reduce((sum, w) => sum + w.days, 0);
                    const totalMeaningful = quarterData.reduce((sum, w) => sum + w.meaningful, 0);
                    return (
                      <>
                        <div className="mb-4 p-4 bg-black/5" style={{ borderRadius: 0 }}>
                          <p className="text-sm">
                            <strong>统计：</strong>
                            {quarterData.length}周 | 打卡{totalDays}天 | 有意义{totalMeaningful}天 ({((totalMeaningful / totalDays) * 100).toFixed(1)}%)
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {quarterData.map((week) => (
                            <div
                              key={week.week}
                              className={`border-2 p-4 ${
                                week.status === '低谷'
                                  ? 'border-red-300 bg-red-50'
                                  : week.status === '优秀'
                                  ? 'border-green-300 bg-green-50'
                                  : 'border-black/20 bg-white'
                              }`}
                              style={{ borderRadius: 0 }}
                            >
                              <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold">{week.week}</h3>
                                <span
                                  className={`px-2 py-1 text-xs font-bold ${
                                    week.status === '低谷'
                                      ? 'bg-red-500 text-white'
                                      : week.status === '优秀'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-200 text-black'
                                  }`}
                                  style={{ borderRadius: 0 }}
                                >
                                  {week.status}
                                </span>
                              </div>
                              <div className="text-sm space-y-1">
                                <p>打卡：{week.days}天</p>
                                <p>有意义：{week.meaningful}天</p>
                                <p className="font-bold">比例：{week.ratio}%</p>
                              </div>
                              <div className="mt-2 w-full h-2 bg-black/10" style={{ borderRadius: 0 }}>
                                <div
                                  className="h-full"
                                  style={{
                                    width: `${week.ratio}%`,
                                    backgroundColor: week.ratio < 50 ? '#D43628' : '#10B981',
                                    borderRadius: 0,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === '1y' && (
                <div className="bg-white border-2 border-black p-6" style={{ borderRadius: 0 }}>
                  <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                    年度复盘数据展示（按月）
                  </h2>
                  {(() => {
                    const yearData = getYearData();
                    const totalDays = yearData.reduce((sum, m) => sum + m.total, 0);
                    const totalMeaningful = yearData.reduce((sum, m) => sum + m.meaningful, 0);
                    return (
                      <>
                        <div className="mb-4 p-4 bg-black/5" style={{ borderRadius: 0 }}>
                          <p className="text-sm">
                            <strong>统计：</strong>
                            {yearData.length}个月 | 打卡{totalDays}天 | 有意义{totalMeaningful}天 ({((totalMeaningful / totalDays) * 100).toFixed(1)}%)
                          </p>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b-2 border-black">
                                <th className="text-left p-3">月份</th>
                                <th className="text-center p-3">打卡天数</th>
                                <th className="text-center p-3">有意义天数</th>
                                <th className="text-center p-3">比例</th>
                                <th className="text-center p-3">状态</th>
                                <th className="text-left p-3">趋势</th>
                              </tr>
                            </thead>
                            <tbody>
                              {yearData.map((month) => (
                                <tr key={month.month} className="border-b border-black/20">
                                  <td className="p-3 font-bold">{month.month}</td>
                                  <td className="p-3 text-center">{month.total}</td>
                                  <td className="p-3 text-center">{month.meaningful}</td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`px-2 py-1 text-sm font-bold ${
                                        month.ratio >= 80
                                          ? 'bg-green-100 text-green-800'
                                          : month.ratio >= 60
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-red-100 text-red-800'
                                      }`}
                                      style={{ borderRadius: 0 }}
                                    >
                                      {month.ratio.toFixed(1)}%
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <span
                                      className={`px-2 py-1 text-xs ${
                                        month.status === '年度巅峰'
                                          ? 'bg-black text-white'
                                          : 'bg-black/5 text-black'
                                      }`}
                                      style={{ borderRadius: 0 }}
                                    >
                                      {month.status}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <div className="w-full h-2 bg-black/10" style={{ borderRadius: 0 }}>
                                      <div
                                        className="h-full"
                                        style={{
                                          width: `${month.ratio}%`,
                                          backgroundColor:
                                            month.ratio >= 80
                                              ? '#10B981'
                                              : month.ratio >= 60
                                              ? '#F59E0B'
                                              : '#D43628',
                                          borderRadius: 0,
                                        }}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <a
            href="/"
            className="inline-block px-6 py-2 text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            ← 返回首页
          </a>
        </motion.div>
      </div>
    </div>
  );
}
