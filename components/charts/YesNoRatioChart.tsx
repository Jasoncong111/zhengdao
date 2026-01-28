'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface YesNoRatioChartProps {
  data: { yes: number; no: number };
  period: '7d' | '30d' | '6m' | '1y' | 'all';
}

/**
 * YesNoRatioChart - 是/否比例饼图
 *
 * 展示用户"有意义的一天"的投票比例
 */
export default function YesNoRatioChart({ data, period }: YesNoRatioChartProps) {
  const total = data.yes + data.no;
  const yesPercentage = total > 0 ? ((data.yes / total) * 100).toFixed(1) : '0.0';
  const noPercentage = total > 0 ? ((data.no / total) * 100).toFixed(1) : '0.0';

  // 饼图数据
  const chartData = [
    { name: '是', value: data.yes, color: '#D43628' }, // 朱砂红
    { name: '否', value: data.no, color: '#1a1a2e' }, // 墨黑
  ];

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white border-2 border-black p-3 shadow-lg"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          <p className="text-sm font-bold mb-1">{payload[0].name}</p>
          <p className="text-sm text-black/70">
            {payload[0].value} 天 ({((payload[0].value / total) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // 周期标签映射
  const periodLabel: Record<string, string> = {
    '7d': '近7天',
    '30d': '近30天',
    '6m': '近半年',
    '1y': '近一年',
    'all': '全部',
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
        有意义的一天
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {periodLabel[period]}打卡统计
      </motion.p>

      {/* 饼图和中心文字 */}
      <div className="relative">
        <motion.div
          className="w-full h-64"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* 中心统计文字 */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-3xl font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {total}
          </div>
          <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            总天数
          </div>
        </motion.div>
      </div>

      {/* 图例 */}
      <motion.div
        className="flex justify-center gap-8 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border border-black/20"
            style={{ backgroundColor: '#D43628', borderRadius: 0 }}
          />
          <div>
            <div className="text-sm font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
              是
            </div>
            <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
              {data.yes} 天 ({yesPercentage}%)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 border border-black/20"
            style={{ backgroundColor: '#1a1a2e', borderRadius: 0 }}
          />
          <div>
            <div className="text-sm font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
              否
            </div>
            <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
              {data.no} 天 ({noPercentage}%)
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
        transition={{ delay: 0.7 }}
      >
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          {periodLabel[period]}共打卡 {total} 天，其中 {data.yes} 天认为有意义
        </p>
      </motion.div>
    </motion.div>
  );
}
