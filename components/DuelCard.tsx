'use client';

import { motion } from 'framer-motion';

interface LeaderboardEntry {
  address: string;
  balance: bigint;
  streak: number;
  rank: number;
}

interface DuelCardProps {
  leaderboard?: LeaderboardEntry[];
  currentUserAddress?: string;
}

/**
 * DuelCard - 论剑卡片组件（排行榜预览）
 *
 * 功能：
 * - 显示排行榜预览（前3名 + 当前用户）
 * - CZ 头像（占位图）
 * - 右上角 "Coming Soon" 红框标签
 *
 * 样式特性：
 * - 朱砂红色 #D43628
 * - 墨黑色 #000000
 * - 无圆角设计
 */
export default function DuelCard({
  leaderboard = [],
  currentUserAddress = '',
}: DuelCardProps) {
  // 朱砂红色
  const CINNABAR_RED = '#D43628';
  const INK_BLACK = '#000000';

  // 格式化钱包地址
  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 获取显示的排行榜数据（前3名 + 当前用户）
  const getDisplayLeaderboard = () => {
    const top3 = leaderboard.slice(0, 3);
    const currentUserIndex = leaderboard.findIndex(
      (entry) => entry.address.toLowerCase() === currentUserAddress.toLowerCase()
    );

    // 如果当前用户不在前3名，添加到显示列表
    if (currentUserIndex > 2) {
      const currentUserEntry = leaderboard[currentUserIndex];
      // 避免重复
      if (!top3.includes(currentUserEntry)) {
        return [...top3, currentUserEntry];
      }
    }

    return top3;
  };

  const displayLeaderboard = getDisplayLeaderboard();

  // 获取排名颜色
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return '#FFD700'; // 金色
      case 2:
        return '#C0C0C0'; // 银色
      case 3:
        return '#CD7F32'; // 铜色
      default:
        return INK_BLACK;
    }
  };

  return (
    <motion.div
      className="w-full bg-white border-2 relative overflow-hidden"
      style={{ borderColor: INK_BLACK, borderRadius: 0 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ y: -4 }}
    >
      {/* 右上角 "Coming Soon" 标签 */}
      <motion.div
        className="absolute top-0 right-0 z-10"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
      >
        <div
          className="px-4 py-2 text-sm font-bold text-white"
          style={{
            backgroundColor: CINNABAR_RED,
            fontFamily: 'serif',
            borderRadius: 0,
          }}
        >
          Coming Soon
        </div>
      </motion.div>

      {/* 卡片头部 */}
      <div className="border-b-2 px-4 py-4" style={{ borderColor: INK_BLACK }}>
        <div className="flex items-center space-x-3">
          {/* CZ 头像占位图 */}
          <motion.div
            className="w-12 h-12 border-2 flex items-center justify-center"
            style={{ borderColor: INK_BLACK, borderRadius: 0 }}
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span
              className="text-xl font-bold"
              style={{ fontFamily: 'serif', color: INK_BLACK }}
            >
              CZ
            </span>
          </motion.div>

          {/* 标题 */}
          <div className="flex-1">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: 'serif', color: INK_BLACK }}
            >
              论剑模式
            </h3>
            <p
              className="text-xs"
              style={{ fontFamily: 'serif', color: `${INK_BLACK}99` }}
            >
              与高手过招，证己之道
            </p>
          </div>
        </div>
      </div>

      {/* 排行榜列表 */}
      <div className="px-4 py-4 space-y-3">
        {displayLeaderboard.length === 0 ? (
          <motion.div
            className="text-center py-8"
            style={{ fontFamily: 'serif', color: `${INK_BLACK}80` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            暂无排行榜数据
          </motion.div>
        ) : (
          displayLeaderboard.map((entry, index) => {
            const isCurrentUser =
              entry.address.toLowerCase() === currentUserAddress.toLowerCase();

            return (
              <motion.div
                key={entry.address}
                className="flex items-center space-x-3 px-3 py-2 border relative overflow-hidden"
                style={{
                  borderColor: isCurrentUser ? CINNABAR_RED : `${INK_BLACK}20`,
                  backgroundColor: isCurrentUser ? `${CINNABAR_RED}10` : 'transparent',
                  borderRadius: 0,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 2 }}
              >
                {/* 排名 */}
                <div
                  className="w-8 h-8 flex items-center justify-center text-sm font-bold"
                  style={{
                    fontFamily: 'serif',
                    color: getRankColor(entry.rank),
                  }}
                >
                  #{entry.rank}
                </div>

                {/* 地址 */}
                <div className="flex-1">
                  <div
                    className="text-sm font-semibold truncate"
                    style={{ fontFamily: 'serif', color: INK_BLACK }}
                  >
                    {formatAddress(entry.address)}
                  </div>
                  <div
                    className="text-xs"
                    style={{ fontFamily: 'serif', color: `${INK_BLACK}60` }}
                  >
                    连续 {entry.streak} 天
                  </div>
                </div>

                {/* 余额 */}
                <div
                  className="text-sm font-bold text-right"
                  style={{ fontFamily: 'serif', color: INK_BLACK }}
                >
                  {entry.balance.toLocaleString()}
                </div>

                {/* 当前用户标记 */}
                {isCurrentUser && (
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: CINNABAR_RED }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* 底部提示 */}
      <motion.div
        className="px-4 py-3 border-t-2 text-center"
        style={{ borderColor: `${INK_BLACK}20` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p
          className="text-xs"
          style={{ fontFamily: 'serif', color: `${INK_BLACK}60` }}
        >
          实时更新 · 每48小时执行一次论剑
        </p>
      </motion.div>

      {/* 底部朱砂红装饰条 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ backgroundColor: CINNABAR_RED }}
      />
    </motion.div>
  );
}
