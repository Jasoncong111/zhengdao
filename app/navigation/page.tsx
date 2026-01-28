'use client';

/**
 * 导航页面 - 功能中心
 * 包含所有主要功能的导航入口
 */

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAccount, useDisconnect } from 'wagmi';
import { useSkipMode } from '@/lib/context/SkipModeContext';
import { OnboardingService } from '@/lib/onboarding-service';
import { ReflectionService } from '@/lib/storage';
import { useState, useEffect } from 'react';

interface QuickStats {
  totalCheckIns: number;
  meaningfulDays: number;
  currentStreak: number;
}

export default function NavigationPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isSkipMode, demoAddress, disableSkipMode } = useSkipMode();

  const [stats, setStats] = useState<QuickStats>({
    totalCheckIns: 0,
    meaningfulDays: 0,
    currentStreak: 0,
  });

  // 计算统计数据
  useEffect(() => {
    const calculateStats = async () => {
      const effectiveAddress = address || demoAddress;
      if (!effectiveAddress) return;

      try {
        const allReflections = await ReflectionService.getAllReflections(effectiveAddress);
        const totalCheckIns = allReflections.length;
        const meaningfulDays = allReflections.filter((r) => r.isMeaningful).length;

        // 计算连续打卡
        const sortedReflections = allReflections.sort((a, b) => b.date.localeCompare(a.date));
        let currentStreak = 0;
        const today = new Date();

        for (let i = 0; i < sortedReflections.length; i++) {
          const reflectionDate = new Date(sortedReflections[i].date);
          const expectedDate = new Date(today);
          expectedDate.setDate(today.getDate() - i);

          if (reflectionDate.toDateString() === expectedDate.toDateString()) {
            currentStreak++;
          } else {
            break;
          }
        }

        setStats({
          totalCheckIns,
          meaningfulDays,
          currentStreak,
        });
      } catch (error) {
        console.error('[NavigationPage] Failed to calculate stats:', error);
      }
    };

    calculateStats();
  }, [address, demoAddress]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* 顶部标题栏 */}
      <motion.div
        className="w-full pt-12 pb-6 border-b border-ink/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-center font-serif font-bold text-ink mb-2" style={{ fontSize: '3rem' }}>
          证道
        </h1>
        <p className="text-center font-serif text-ink/60" style={{ fontSize: '1rem' }}>
          功能导航
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* 用户状态卡片 */}
        <motion.div
          className="mb-8 p-6 border-2 border-ink bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{ borderRadius: 0 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-ink/60 font-serif mb-1">
                {isSkipMode ? '体验模式' : '已连接'}
              </p>
              <p className="text-lg font-bold text-ink font-serif">
                {isSkipMode ? 'Demo User' : truncateAddress(address || '')}
              </p>
            </div>

            <button
              onClick={() => {
                if (isSkipMode) {
                  disableSkipMode();
                } else {
                  disconnect();
                }
                router.push('/');
              }}
              className="px-4 py-2 text-sm border border-ink text-ink font-serif hover:bg-ink/5 transition-colors"
              style={{ borderRadius: 0 }}
            >
              返回首页
            </button>
          </div>

          {/* 快速统计 */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-ink/20">
            <div className="text-center">
              <div className="text-2xl font-bold text-ink font-serif">{stats.totalCheckIns}</div>
              <div className="text-xs text-ink/60 font-serif mt-1">总打卡</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ink font-serif">{stats.meaningfulDays}</div>
              <div className="text-xs text-ink/60 font-serif mt-1">有意义</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-ink font-serif">{stats.currentStreak}</div>
              <div className="text-xs text-ink/60 font-serif mt-1">连续天</div>
            </div>
          </div>
        </motion.div>

        {/* 核心功能导航 */}
        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-sm font-bold text-ink/60 font-serif tracking-widest uppercase mb-4">
            核心功能
          </h2>

          {/* 每日打卡 */}
          <motion.button
            onClick={() => router.push('/check-in')}
            className="w-full p-6 border-2 border-ink bg-ink text-white hover:bg-ink/90 transition-all group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            style={{ borderRadius: 0 }}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-serif font-bold text-2xl mb-1">每日打卡</div>
                <div className="font-serif text-sm text-white/80">记录今天的成长</div>
              </div>
              <div className="text-4xl">💭</div>
            </div>
          </motion.button>

          {/* 周期复盘 */}
          <motion.button
            onClick={() => router.push('/review/7d')}
            className="w-full p-6 border-2 border-ink bg-white hover:bg-ink hover:text-paper transition-all group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            style={{ borderRadius: 0 }}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-serif font-bold text-2xl mb-1 group-hover:text-paper">周期复盘</div>
                <div className="font-serif text-sm text-ink/60 group-hover:text-paper/80">查看成长趋势</div>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </motion.button>

          {/* 我的成就 */}
          <motion.button
            onClick={() => router.push('/achievements')}
            className="w-full p-6 border-2 border-ink bg-white hover:bg-ink hover:text-paper transition-all group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            style={{ borderRadius: 0 }}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-serif font-bold text-2xl mb-1 group-hover:text-paper">我的成就</div>
                <div className="font-serif text-sm text-ink/60 group-hover:text-paper/80">查看徽章和奖励</div>
              </div>
              <div className="text-4xl">🏆</div>
            </div>
          </motion.button>

          {/* 个人主页 */}
          <motion.button
            onClick={() => router.push('/profile')}
            className="w-full p-6 border-2 border-ink bg-white hover:bg-ink hover:text-paper transition-all group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.45 }}
            style={{ borderRadius: 0 }}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <div className="font-serif font-bold text-2xl mb-1 group-hover:text-paper">个人主页</div>
                <div className="font-serif text-sm text-ink/60 group-hover:text-paper/80">完整的数据统计</div>
              </div>
              <div className="text-4xl">👤</div>
            </div>
          </motion.button>
        </motion.div>

        {/* 更多功能 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <button
            onClick={() => router.push('/coming-soon')}
            className="w-full p-6 border-2 border-dashed border-ink/30 bg-ink/5 hover:border-ink/60 transition-colors"
            style={{ borderRadius: 0 }}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🚀</div>
              <div className="font-serif font-bold text-ink text-lg">更多功能</div>
              <div className="font-serif text-xs text-ink/60 mt-1">
                PVP对战 · NFT市场 · DAO治理
              </div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* 底部 */}
      <footer className="py-8 text-center border-t border-ink/10 mt-12">
        <p className="text-xs text-ink/40 font-serif">
          · 证道 ZhengDao · 修身 · 齐家 · 证道 ·
        </p>
      </footer>
    </div>
  );
}
