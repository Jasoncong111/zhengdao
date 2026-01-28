'use client';

import { motion } from 'framer-motion';

interface Goal {
  category: string; // 财富/健康/家庭/其他
  target: string; // 目标描述
  progress: number; // 0-100
}

interface GoalProgressChartProps {
  goals: Goal[];
}

/**
 * GoalProgressChart - 目标进度条
 *
 * 展示用户在各维度的人生目标完成度
 */
export default function GoalProgressChart({ goals }: GoalProgressChartProps) {
  // 为不同维度定义颜色
  const categoryColors: Record<string, string> = {
    财富: '#D43628', // 朱砂红
    健康: '#1a1a2e', // 墨黑
    家庭: '#6B7280', // 青灰
    其他: '#8B5CF6', // 紫色（用于其他目标）
  };

  // 为不同维度定义图标
  const categoryIcons: Record<string, string> = {
    财富: '💰',
    健康: '💪',
    家庭: '👨‍👩‍👧‍👦',
    其他: '🎯',
  };

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
        人生目标进度
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        追踪各维度目标完成情况
      </motion.p>

      {/* 目标列表 */}
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            {/* 目标标题 */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryIcons[goal.category] || '🎯'}</span>
                <div>
                  <div className="text-sm font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
                    {goal.category}
                  </div>
                  <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                    {goal.target}
                  </div>
                </div>
              </div>
              <div className="text-sm font-bold" style={{ fontFamily: 'Georgia, serif', color: categoryColors[goal.category] }}>
                {goal.progress}%
              </div>
            </div>

            {/* 进度条背景 */}
            <div className="w-full h-4 border-2 border-black" style={{ borderRadius: 0, backgroundColor: '#ffffff' }}>
              {/* 进度条填充 */}
              <motion.div
                className="h-full"
                style={{
                  backgroundColor: categoryColors[goal.category],
                  borderRadius: 0,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, goal.progress))}%` }}
                transition={{ delay: 0.6 + index * 0.1, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 统计摘要 */}
      <motion.div
        className="mt-6 p-4 bg-black/5"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              平均完成度
            </div>
            <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
              {goals.length > 0
                ? (goals.reduce((sum, g) => sum + g.progress, 0) / goals.length).toFixed(1)
                : 0}
              %
            </div>
          </div>
          <div>
            <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
              已达成目标
            </div>
            <div className="text-lg font-bold text-[#D43628]" style={{ fontFamily: 'Georgia, serif' }}>
              {goals.filter(g => g.progress >= 100).length} / {goals.length}
            </div>
          </div>
        </div>
      </motion.div>

      {/* 说明文字 */}
      <motion.div
        className="mt-4 p-3 bg-black/5"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          {goals.length > 0
            ? `共追踪 ${goals.length} 个目标，已完成 ${goals.filter(g => g.progress >= 100).length} 个`
            : '暂无目标数据，请先完成人生规划问卷'}
        </p>
      </motion.div>
    </motion.div>
  );
}
