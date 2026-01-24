'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface HeroStatusProps {
  totalBalance: bigint;
  principalAmount: bigint;
  yieldAmount: bigint;
  checkInCount: number;
  currentStreak: number;
  walletAddress: string;
}

/**
 * HeroStatus - 资产看板组件
 *
 * 显示内容：
 * - 总余额（totalBalance）
 * - 本金（principalAmount）
 * - 收益（yieldAmount = totalBalance - principalAmount）
 * - 打卡次数（checkInCount）
 * - 连续打卡天数（currentStreak）
 *
 * 样式特性：
 * - 黑色衬线字体（font-family: serif）
 * - Framer Motion 数字跳动增长动画
 * - 墨黑色边框（#000000）
 * - 无圆角设计
 */
export default function HeroStatus({
  totalBalance,
  principalAmount,
  yieldAmount,
  checkInCount,
  currentStreak,
  walletAddress,
}: HeroStatusProps) {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentYield, setCurrentYield] = useState(0);
  const [currentStreakValue, setCurrentStreakValue] = useState(0);

  // 弹性动画配置
  const springTotal = useSpring(currentTotal, {
    bounce: 0.2,
    duration: 2000,
  });

  const springYield = useSpring(currentYield, {
    bounce: 0.2,
    duration: 2000,
  });

  const springStreak = useSpring(currentStreakValue, {
    bounce: 0.3,
    duration: 1500,
  });

  // 格式化数字显示
  const displayTotal = useTransform(springTotal, (latest) => {
    return Math.floor(latest).toLocaleString();
  });

  const displayYield = useTransform(springYield, (latest) => {
    return Math.floor(latest).toLocaleString();
  });

  const displayStreak = useTransform(springStreak, (latest) => {
    return Math.floor(latest);
  });

  // 更新数值时触发动画
  useEffect(() => {
    setCurrentTotal(Number(totalBalance));
    setCurrentYield(Number(yieldAmount));
    setCurrentStreakValue(currentStreak);
  }, [totalBalance, yieldAmount, currentStreak]);

  // 格式化钱包地址（显示前6位和后4位）
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.div
      className="w-full bg-white border-2 border-black"
      style={{ fontFamily: 'serif' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 顶部：钱包地址 */}
      <div className="border-b-2 border-black px-4 py-3">
        <motion.div
          className="text-sm text-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {formatAddress(walletAddress)}
        </motion.div>
      </div>

      {/* 主要数据区域 */}
      <div className="px-4 py-6 space-y-6">
        {/* 总余额 */}
        <div className="space-y-2">
          <motion.div
            className="text-xs text-black/50 uppercase tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            总余额
          </motion.div>
          <motion.div
            className="text-5xl font-bold text-black"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          >
            {displayTotal}
          </motion.div>
        </div>

        {/* 分割线 */}
        <div className="h-px bg-black/20" />

        {/* 本金和收益 */}
        <div className="space-y-4">
          {/* 本金 */}
          <div className="flex justify-between items-center">
            <motion.span
              className="text-sm text-black/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              本金
            </motion.span>
            <motion.span
              className="text-lg font-semibold text-black"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {principalAmount.toLocaleString()}
            </motion.span>
          </div>

          {/* 收益 */}
          <div className="flex justify-between items-center">
            <motion.span
              className="text-sm text-black/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              收益
            </motion.span>
            <motion.span
              className="text-lg font-semibold text-black"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {displayYield}
            </motion.span>
          </div>
        </div>

        {/* 分割线 */}
        <div className="h-px bg-black/20" />

        {/* 打卡统计 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 打卡次数 */}
          <motion.div
            className="border border-black/20 px-4 py-3 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-xs text-black/50 mb-1">打卡次数</div>
            <div className="text-2xl font-bold text-black">{checkInCount}</div>
          </motion.div>

          {/* 连续打卡 */}
          <motion.div
            className="border border-black/20 px-4 py-3 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-xs text-black/50 mb-1">连续打卡</div>
            <div className="text-2xl font-bold text-black">
              <motion.span>{displayStreak}</motion.span>天
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
