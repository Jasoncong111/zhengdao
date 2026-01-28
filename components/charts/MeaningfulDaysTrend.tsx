'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MeaningfulDaysTrendProps {
  data: Array<{ period: string; ratio: number }>;
  groupBy: 'week' | 'month';
}

/**
 * MeaningfulDaysTrend - 有意义天数趋势
 *
 * 展示"有意义的一天"比例的时间变化趋势
 */
export default function MeaningfulDaysTrend({ data, groupBy }: MeaningfulDaysTrendProps) {
  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white border-2 border-black p-3 shadow-lg"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          <p className="text-sm font-bold mb-1">{payload[0].payload.period}</p>
          <p className="text-sm text-[#D43628]">
            有意义天数: {payload[0].value.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // 周期标签映射
  const groupByLabel: Record<string, string> = {
    week: '按周统计',
    month: '按月统计',
  };

  // 计算统计数据
  const avgRatio = data.length > 0
    ? (data.reduce((sum, item) => sum + item.ratio, 0) / data.length).toFixed(1)
    : '0.0';
  const maxRatio = data.length > 0 ? Math.max(...data.map(d => d.ratio)).toFixed(1) : '0.0';
  const minRatio = data.length > 0 ? Math.min(...data.map(d => d.ratio)).toFixed(1) : '0.0';

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
        有意义天数趋势
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {groupByLabel[groupBy]}的"有意义的一天"比例变化
      </motion.p>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <motion.div
          className="border border-black/20 p-3 text-center"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            平均比例
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {avgRatio}%
          </div>
        </motion.div>

        <motion.div
          className="border border-black/20 p-3 text-center"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            最高比例
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {maxRatio}%
          </div>
        </motion.div>

        <motion.div
          className="border border-black/20 p-3 text-center bg-[#D43628]/5"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-xs text-black/50 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            最低比例
          </div>
          <div className="text-lg font-bold text-[#D43628]" style={{ fontFamily: 'Georgia, serif' }}>
            {minRatio}%
          </div>
        </motion.div>
      </div>

      {/* 图表 */}
      <motion.div
        className="w-full h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D43628" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D43628" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis
              dataKey="period"
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
            />
            <YAxis
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
              domain={[0, 100]}
              label={{ value: '比例 (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="ratio"
              stroke="#D43628"
              strokeWidth={3}
              fill="url(#colorRatio)"
              animationDuration={2000}
              animationBegin={0}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 趋势分析 */}
      <motion.div
        className="mt-4 p-4 bg-black/5"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="text-sm font-bold text-black mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          趋势分析
        </div>
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          {data.length > 1 ? (
            <>
              {data[data.length - 1].ratio > data[data.length - 2].ratio
                ? '📈 近期趋势上升，保持良好状态'
                : data[data.length - 1].ratio < data[data.length - 2].ratio
                ? '📉 近期趋势下降，需要调整状态'
                : '➡️ 近期趋势平稳，继续保持'}
            </>
          ) : (
            '数据不足，无法分析趋势'
          )}
        </p>
      </motion.div>

      {/* 说明文字 */}
      <motion.div
        className="mt-4 p-3 bg-black/5"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          共记录 {data.length} 个{groupBy === 'week' ? '周' : '月'}，平均 {avgRatio}% 的天数认为有意义
        </p>
      </motion.div>
    </motion.div>
  );
}
