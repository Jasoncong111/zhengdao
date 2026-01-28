'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MonthlyReport } from '@/components/MonthlyReport';
import { ReflectionService } from '@/lib/storage';

/**
 * Analytics Page - 数据分析页面
 * 
 * 展示平台的各项数据统计和分析
 */

// 模拟数据
const overviewData = {
  totalUsers: 1234,
  totalLocked: 50234,
  totalYield: 2567,
  activeUsers: 856,
  todayCheckIns: 432,
  avgYield: 12.3,
};

// 用户增长数据
const userGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  users: Math.floor(100 + i * 35 + Math.random() * 50),
}));

// TVL 数据
const tvlData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  tvl: Math.floor(10000 + i * 1200 + Math.random() * 500),
}));

// 收益分布数据
const yieldDistributionData = [
  { name: '0-5%', value: 234, color: '#999999' },
  { name: '5-10%', value: 456, color: '#666666' },
  { name: '10-15%', value: 321, color: '#333333' },
  { name: '15%+', value: 223, color: '#D43628' },
];

// PVP 惩罚数据
const pvpData = Array.from({ length: 7 }, (_, i) => ({
  day: `第${i + 1}天`,
  penalties: Math.floor(Math.random() * 10 + 2),
}));

// 排行榜数据
const topUsers = [
  { address: '0x1234...5678', days: 365, rank: 1 },
  { address: '0xabcd...ef01', days: 287, rank: 2 },
  { address: '0x9876...5432', days: 234, rank: 3 },
  { address: '0xfedc...ba98', days: 198, rank: 4 },
  { address: '0x5555...6666', days: 156, rank: 5 },
];

// 打卡热力图数据
const heatmapData = Array.from({ length: 4 }, (_, week) =>
  Array.from({ length: 7 }, (_, day) => ({
    week: week + 1,
    day: day + 1,
    intensity: Math.random() > 0.2 ? 'high' : 'low',
  }))
).flat();

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [showPersonalReport, setShowPersonalReport] = useState(false);
  const { address, isConnected } = useAccount();

  // 检查用户是否有复盘数据
  useEffect(() => {
    async function checkHasData() {
      if (isConnected && address) {
        const reflections = await ReflectionService.getAllReflections(address);
        setShowPersonalReport(reflections.length > 0);
      }
    }
    checkHasData();
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-paper p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            数据分析
          </h1>
          <p
            className="text-sm text-ink/60"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            平台数据统计与分析
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 border-2 border-ink text-ink font-bold"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          返回首页
        </Link>
      </div>

      {/* Time Range Selector */}
      <div className="flex gap-2">
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 font-bold ${
              timeRange === range
                ? 'bg-ink text-paper'
                : 'border-2 border-ink text-ink'
            }`}
            style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
          >
            {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
          </button>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            总用户数
          </div>
          <div
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {overviewData.totalUsers.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            总锁仓量
          </div>
          <div
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {(overviewData.totalLocked / 1000).toFixed(1)}K
          </div>
          <div
            className="text-xs text-ink/60"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            BNB
          </div>
        </motion.div>

        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            总收益
          </div>
          <div
            className="text-3xl font-bold text-[#D43628]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {(overviewData.totalYield / 1000).toFixed(1)}K
          </div>
          <div
            className="text-xs text-ink/60"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            BNB
          </div>
        </motion.div>

        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            活跃用户
          </div>
          <div
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {overviewData.activeUsers}
          </div>
        </motion.div>

        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            今日打卡
          </div>
          <div
            className="text-3xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {overviewData.todayCheckIns}
          </div>
        </motion.div>

        <motion.div
          className="border-2 border-ink p-4"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div
            className="text-xs text-ink/60 mb-2"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            平均收益
          </div>
          <div
            className="text-3xl font-bold text-[#D43628]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            +{overviewData.avgYield}%
          </div>
        </motion.div>
      </div>

      {/* User Growth Chart */}
      <motion.div
        className="border-2 border-ink p-6"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h3
          className="text-xl font-bold text-ink mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          用户增长趋势
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis
              dataKey="day"
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
            />
            <YAxis
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                border: '2px solid #000000',
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#D43628"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Check-In Heatmap */}
      <motion.div
        className="border-2 border-ink p-6"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3
          className="text-xl font-bold text-ink mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          打卡活跃度热力图
        </h3>
        <div className="space-y-2">
          <div className="flex gap-2 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="w-12"></div>
            {['一', '二', '三', '四', '五', '六', '日'].map((day) => (
              <div key={day} className="w-8 text-center">
                {day}
              </div>
            ))}
          </div>
          {[1, 2, 3, 4].map((week) => (
            <div key={week} className="flex gap-2 items-center">
              <div
                className="w-12 text-xs text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Week {week}
              </div>
              {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const data = heatmapData.find(
                  (d) => d.week === week && d.day === day
                );
                return (
                  <div
                    key={day}
                    className="w-8 h-8 border border-ink"
                    style={{
                      backgroundColor:
                        data?.intensity === 'high' ? '#D43628' : '#FFFFFF',
                      borderRadius: 0,
                    }}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex gap-4 mt-4 text-xs" style={{ fontFamily: 'Georgia, serif' }}>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border border-ink"
                style={{ backgroundColor: '#D43628', borderRadius: 0 }}
              />
              高活跃
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 border border-ink"
                style={{ backgroundColor: '#FFFFFF', borderRadius: 0 }}
              />
              低活跃
            </div>
          </div>
        </div>
      </motion.div>

      {/* TVL Chart */}
      <motion.div
        className="border-2 border-ink p-6"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3
          className="text-xl font-bold text-ink mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          总锁仓量 (TVL)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tvlData}>
            <defs>
              <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D43628" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D43628" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
            <XAxis
              dataKey="day"
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
            />
            <YAxis
              stroke="#000000"
              style={{ fontFamily: 'Georgia, serif', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                border: '2px solid #000000',
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            />
            <Area
              type="monotone"
              dataKey="tvl"
              stroke="#D43628"
              strokeWidth={3}
              fill="url(#colorTvl)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div
          className="mt-4 text-sm text-ink/60"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          当前: {overviewData.totalLocked.toLocaleString()} BNB
        </div>
      </motion.div>

      {/* Yield Distribution & PVP Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yield Distribution */}
        <motion.div
          className="border-2 border-ink p-6"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3
            className="text-xl font-bold text-ink mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            收益分布统计
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={yieldDistributionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {yieldDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  border: '2px solid #000000',
                  borderRadius: 0,
                  fontFamily: 'Georgia, serif',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {yieldDistributionData.map((item) => (
              <div
                key={item.name}
                className="flex justify-between text-sm"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: item.color, borderRadius: 0 }}
                  />
                  {item.name}
                </div>
                <div>{item.value} 用户</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PVP Statistics */}
        <motion.div
          className="border-2 border-ink p-6"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <h3
            className="text-xl font-bold text-ink mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            PVP 惩罚统计
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div
                className="text-xs text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                总惩罚次数
              </div>
              <div
                className="text-2xl font-bold text-ink"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                45
              </div>
            </div>
            <div>
              <div
                className="text-xs text-ink/60"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                总惩罚金额
              </div>
              <div
                className="text-2xl font-bold text-[#D43628]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                4.5K BNB
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={pvpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
              <XAxis
                dataKey="day"
                stroke="#000000"
                style={{ fontFamily: 'Georgia, serif', fontSize: 10 }}
              />
              <YAxis
                stroke="#000000"
                style={{ fontFamily: 'Georgia, serif', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  border: '2px solid #000000',
                  borderRadius: 0,
                  fontFamily: 'Georgia, serif',
                }}
              />
              <Bar dataKey="penalties" fill="#D43628" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Top Users */}
      <motion.div
        className="border-2 border-ink p-6"
        style={{ borderRadius: 0 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <h3
          className="text-xl font-bold text-ink mb-4"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          打卡排行榜
        </h3>
        <div className="space-y-3">
          {topUsers.map((user) => (
            <div
              key={user.address}
              className="flex justify-between items-center p-3 border border-ink/20"
              style={{ borderRadius: 0 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-8 flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: user.rank <= 3 ? '#D43628' : '#999999',
                    color: '#FFFFFF',
                    borderRadius: 0,
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  {user.rank}
                </div>
                <div
                  className="font-mono text-sm"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {user.address}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="text-lg font-bold text-ink"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {user.days}
                </div>
                <div
                  className="text-sm text-ink/60"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  天
                </div>
                {user.rank <= 3 && <span className="text-yellow-500 font-bold">TOP</span>}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Personal Monthly Report */}
      {showPersonalReport && address && (
        <motion.div
          className="border-2 border-[#D43628] p-6 bg-[#FFFEF2]"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <h3
            className="text-xl font-bold text-black mb-4"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            我的月度成长报告
          </h3>
          <MonthlyReport walletAddress={address} />
        </motion.div>
      )}

      {/* Footer */}
      <footer className="pt-8 pb-4 text-center">
        <p
          className="text-xs text-ink/40"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          · 证道 ZhengDao ·
        </p>
      </footer>
    </div>
  );
}
