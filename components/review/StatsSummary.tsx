'use client';

import { motion } from 'framer-motion';

interface StatsSummaryProps {
  totalDays: number;
  yesDays: number;
  noDays: number;
  yesRatio: number;
  totalWords: number;
  avgWords: number;
}

/**
 * StatsSummary - 统计摘要
 *
 * 展示周期复盘的关键统计数据
 */
export default function StatsSummary({
  totalDays,
  yesDays,
  noDays,
  yesRatio,
  totalWords,
  avgWords,
}: StatsSummaryProps) {
  const stats = [
    {
      label: '打卡天数',
      value: totalDays.toString(),
      unit: '天',
      color: '#1a1a2e',
      bgColor: 'bg-black/5',
    },
    {
      label: '有意义天数',
      value: yesDays.toString(),
      unit: '天',
      color: '#D43628',
      bgColor: 'bg-[#D43628]/10',
    },
    {
      label: '有意义比例',
      value: yesRatio.toFixed(1),
      unit: '%',
      color: yesRatio >= 70 ? '#D43628' : yesRatio >= 50 ? '#6B7280' : '#1a1a2e',
      bgColor: yesRatio >= 70 ? 'bg-[#D43628]/10' : 'bg-black/5',
    },
  ];

  return (
    <motion.div
      className="w-full bg-white border-2 border-black p-6"
      style={{ borderRadius: 0, backgroundColor: '#FFFEF2' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <motion.h3
        className="text-xl font-bold text-black mb-2"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        统计摘要
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        本周期打卡数据概览
      </motion.p>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className={`
              border-2 border-black/20 p-4 text-center
              ${stat.bgColor}
            `}
            style={{ borderRadius: 0 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {/* 数值 */}
            <div
              className="text-3xl font-bold mb-1"
              style={{ fontFamily: 'Georgia, serif', color: stat.color }}
            >
              {stat.value}
            </div>

            {/* 单位 */}
            <div className="text-xs text-black/50 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {stat.unit}
            </div>

            {/* 标签 */}
            <div className="text-sm text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* 平均字数卡片 */}
      <motion.div
        className="mt-4 p-4 bg-black/5 border border-black/20"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              平均每日复盘字数
            </div>
            <div className="text-2xl font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
              {avgWords.toLocaleString()} 字
            </div>
          </div>
          <div className="text-4xl">📝</div>
        </div>
      </motion.div>

      {/* 表现评价 */}
      <motion.div
        className={`
          mt-4 p-4 border-2 text-center
          ${yesRatio >= 70
            ? 'border-[#D43628] bg-[#D43628]/10'
            : yesRatio >= 50
            ? 'border-black/30 bg-black/5'
            : 'border-black/30 bg-black/5'
          }
        `}
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div
          className="text-lg font-bold mb-1"
          style={{
            fontFamily: 'Georgia, serif',
            color: yesRatio >= 70 ? '#D43628' : '#1a1a2e',
          }}
        >
          {yesRatio >= 70 ? '🎉 优秀表现' : yesRatio >= 50 ? '💪 继续加油' : '📈 还有提升空间'}
        </div>
        <div className="text-sm text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          {yesRatio >= 70
            ? '你的生活质量很高，继续保持这种状态！'
            : yesRatio >= 50
            ? '大部分日子都很有意义，努力提升那些平凡的日子！'
            : '每个平凡的日子都有价值，调整状态，让生活更有意义！'}
        </div>
      </motion.div>
    </motion.div>
  );
}
