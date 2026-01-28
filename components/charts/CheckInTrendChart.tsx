'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CheckInTrendChartProps {
  data: Array<{ date: string; wordCount: number }>;
  period: '7d' | '30d' | '6m' | '1y';
}

/**
 * CheckInTrendChart - 打卡趋势曲线
 *
 * 展示用户打卡数据量（字数）的变化趋势
 */
export default function CheckInTrendChart({ data, period }: CheckInTrendChartProps) {
  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white border-2 border-black p-3 shadow-lg"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          <p className="text-sm font-bold mb-1">{payload[0].payload.date}</p>
          <p className="text-sm text-black/70">
            字数: {payload[0].value} 字
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
  };

  // 计算统计数据
  const totalWords = data.reduce((sum, item) => sum + item.wordCount, 0);
  const avgWords = data.length > 0 ? Math.round(totalWords / data.length) : 0;
  const maxWords = data.length > 0 ? Math.max(...data.map(d => d.wordCount)) : 0;

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
        打卡数据量趋势
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {periodLabel[period]}每日复盘字数变化
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
            总字数
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {totalWords.toLocaleString()}
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
            平均字数
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {avgWords.toLocaleString()}
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
            最高字数
          </div>
          <div className="text-lg font-bold text-[#D43628]" style={{ fontFamily: 'Georgia, serif' }}>
            {maxWords.toLocaleString()}
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
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis
              dataKey="date"
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
              tickFormatter={(value) => {
                // 根据数据密度调整日期显示
                if (period === '7d' || period === '30d') {
                  return value.slice(5); // 只显示 MM-DD
                }
                return value.slice(0, 7); // 只显示 YYYY-MM
              }}
            />
            <YAxis
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
              label={{ value: '字数', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="wordCount"
              stroke="#D43628"
              strokeWidth={3}
              dot={{ fill: '#D43628', r: 4 }}
              activeDot={{ r: 6, stroke: '#1a1a2e', strokeWidth: 2 }}
              animationDuration={2000}
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* 说明文字 */}
      <motion.div
        className="mt-4 p-3 bg-black/5"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-black/70" style={{ fontFamily: 'Georgia, serif' }}>
          共记录 {data.length} 次打卡，累计 {totalWords.toLocaleString()} 字，平均每日 {avgWords} 字
        </p>
      </motion.div>
    </motion.div>
  );
}
