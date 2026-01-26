'use client';

/**
 * 月度报告组件
 * 展示打卡率、情绪趋势、关键成就、AI洞察
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ReflectionService, MonthlyStats } from '@/lib/storage';
import { generateMonthlyInsights } from '@/lib/deepseek';

interface MonthlyReportProps {
  /** 钱包地址 */
  walletAddress: string;
  /** 年份 */
  year?: number;
  /** 月份 */
  month?: number;
}

export function MonthlyReport({ walletAddress, year, month }: MonthlyReportProps) {
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [insights, setInsights] = useState<{ summary: string; suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(true);

  // 默认为当前年月
  const currentYear = year || new Date().getFullYear();
  const currentMonth = month || new Date().getMonth() + 1;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // 1. 获取月度统计数据
        const monthlyStats = await ReflectionService.getMonthlyStats(
          currentYear,
          currentMonth,
          walletAddress
        );
        setStats(monthlyStats);

        // 2. 获取本月所有反思数据
        const reflections = await ReflectionService.getReflectionsByMonth(
          currentYear,
          currentMonth,
          walletAddress
        );

        // 3. 生成AI洞察
        if (reflections.length > 0) {
          const aiInsights = await generateMonthlyInsights(reflections);
          setInsights(aiInsights);
        }
      } catch (error) {
        console.error('[MonthlyReport] 加载失败:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [walletAddress, currentYear, currentMonth]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <motion.div
          className="w-16 h-16 mx-auto border-4 border-black border-t-[#D43628] rounded-full mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-gray-600">加载中...</p>
      </div>
    );
  }

  if (!stats || stats.reflectionCount === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-bold text-black mb-2">
          {currentYear}年{currentMonth}月报告
        </h3>
        <p className="text-gray-600">本月还没有复盘数据</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-black mb-2 font-georgia">
          {currentYear}年{currentMonth}月 报告
        </h2>
        <p className="text-sm text-gray-600">修身 · 齐家 · 证道</p>
      </div>

      {/* 打卡率卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-2 border-black p-6 text-center"
      >
        <h3 className="text-lg font-bold text-black mb-4">本月打卡率</h3>
        <div className="text-5xl font-bold text-[#D43628] mb-2 font-georgia">
          {stats.meaningfulRate}%
        </div>
        <p className="text-gray-600">
          {stats.meaningfulCount}/{stats.reflectionCount} 天
        </p>
      </motion.div>

      {/* 情绪分布 */}
      {Object.keys(stats.emotions).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-black p-6"
        >
          <h3 className="text-lg font-bold text-black mb-4">情绪趋势</h3>
          <div className="space-y-2">
            {Object.entries(stats.emotions)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, count]) => {
                const percentage = ((count / stats.reflectionCount) * 100).toFixed(0);
                return (
                  <div key={emotion} className="flex items-center gap-3">
                    <span className="w-16 text-sm font-bold">{emotion}</span>
                    <div className="flex-1 h-4 bg-gray-200 border border-black">
                      <div
                        className="h-full bg-[#D43628]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-sm text-right">{percentage}%</span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* 关键成就 */}
      {stats.allGains.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border-2 border-black p-6"
        >
          <h3 className="text-lg font-bold text-black mb-4">关键成就</h3>
          <ul className="space-y-2">
            {stats.allGains.slice(0, 5).map((gain, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#D43628] text-xl mt-[-2px]">✓</span>
                <span className="text-black">{gain}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* 高频关键词 */}
      {Object.keys(stats.keywords).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border-2 border-black p-6"
        >
          <h3 className="text-lg font-bold text-black mb-4">高频关键词</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.keywords)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([keyword, count]) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-[#D43628] text-white text-sm font-bold border border-black"
                >
                  {keyword} ({count})
                </span>
              ))}
          </div>
        </motion.div>
      )}

      {/* AI洞察 */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#FFFEF2] border-2 border-[#D43628] p-6"
        >
          <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span>AI洞察</span>
          </h3>

          {/* 总体评价 */}
          <div className="mb-4">
            <h4 className="font-bold text-black mb-2">总体评价</h4>
            <p className="text-black leading-relaxed">{insights.summary}</p>
          </div>

          {/* 改进建议 */}
          <div>
            <h4 className="font-bold text-black mb-2">改进建议</h4>
            <ul className="space-y-2">
              {insights.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-[#D43628] font-bold">{index + 1}.</span>
                  <span className="text-black">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  );
}
