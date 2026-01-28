'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface YieldChartProps {
  days?: number;
  initialBalance?: number;
  yieldRate?: number;
}

/**
 * YieldChart - 收益曲线图组件
 * 
 * 展示多次打卡后的复利增长曲线
 */
export default function YieldChart({
  days = 30,
  initialBalance = 1000,
  yieldRate = 0.005, // 0.5%
}: YieldChartProps) {
  // 计算复利增长数据
  const generateChartData = () => {
    const data = [];
    let balance = initialBalance;

    for (let day = 0; day <= days; day++) {
      data.push({
        day,
        balance: Math.round(balance * 100) / 100,
        yield: Math.round((balance - initialBalance) * 100) / 100,
      });

      // 每天打卡，复利增长
      if (day < days) {
        balance = balance * (1 + yieldRate);
      }
    }

    return data;
  };

  const chartData = generateChartData();
  const finalBalance = chartData[chartData.length - 1].balance;
  const totalYield = chartData[chartData.length - 1].yield;
  const yieldPercentage = ((totalYield / initialBalance) * 100).toFixed(2);

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-white border-2 border-black p-3"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          <p className="text-sm font-bold mb-1">第 {payload[0].payload.day} 天</p>
          <p className="text-sm text-black/70">
            余额: {payload[0].payload.balance.toFixed(2)} ETH
          </p>
          <p className="text-sm text-[#D43628]">
            收益: +{payload[0].payload.yield.toFixed(2)} ETH
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="w-full bg-white border-2 border-black p-6"
      style={{ borderRadius: 0 }}
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
        收益增长曲线
      </motion.h3>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {days} 天连续打卡的复利效果
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
            初始本金
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {initialBalance}
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
            最终余额
          </div>
          <div className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
            {finalBalance.toFixed(2)}
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
            总收益
          </div>
          <div className="text-lg font-bold text-[#D43628]" style={{ fontFamily: 'Georgia, serif' }}>
            +{yieldPercentage}%
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
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D43628" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D43628" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis
              dataKey="day"
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
              label={{ value: '天数', position: 'insideBottom', offset: -5 }}
            />
            <YAxis
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
              label={{ value: 'ETH', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#D43628"
              strokeWidth={3}
              fill="url(#colorBalance)"
              animationDuration={2000}
            />
          </AreaChart>
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
          每次打卡获得 0.5% 收益，复利计算。{days} 天后总收益达到 {yieldPercentage}%
        </p>
      </motion.div>
    </motion.div>
  );
}
