'use client';

/**
 * 用户信息组件
 * 展示钱包地址和头像
 */

import { useAccount, useDisconnect } from 'wagmi';
import { motion } from 'framer-motion';
import { useSkipMode } from '@/lib/context/SkipModeContext';
import { AchievementBadges, AchievementBadge } from './AchievementBadges';

interface UserInfoProps {
  /** 自定义钱包地址（可选） */
  customAddress?: string;
  /** SBT成就列表（可选） */
  sbts?: AchievementBadge[];
}

export function UserInfo({ customAddress, sbts = [] }: UserInfoProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isSkipMode, demoAddress, disableSkipMode } = useSkipMode();

  const displayAddress = customAddress || address || demoAddress;
  const shouldShow = isConnected || isSkipMode;

  /** 处理断开/退出按钮 */
  const handleDisconnect = () => {
    if (isSkipMode) {
      disableSkipMode();
      window.location.href = '/';
    } else {
      disconnect();
    }
  };

  /** 截断地址 */
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  /** 生成头像颜色（基于地址） */
  const getAvatarColor = (addr: string) => {
    const hash = addr.slice(0, 6);
    const colors = ['#D43628', '#1a1a2e', '#6B7280', '#000000'];
    const index = parseInt(hash, 16) % colors.length;
    return colors[index];
  };

  /** 生成头像首字母 */
  const getAvatarInitial = (addr: string) => {
    return addr.slice(2, 4).toUpperCase();
  };

  if (!shouldShow || !displayAddress) {
    return (
      <div className="text-center p-6 bg-paper border-2 border-ink/20">
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          请先连接钱包
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-paper border-2 border-ink/20 p-6"
    >
      <div className="flex items-center gap-4">
        {/* 头像 */}
        <div
          className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-white"
          style={{
            backgroundColor: getAvatarColor(displayAddress),
            fontFamily: 'Georgia, serif',
            borderRadius: 0,
          }}
        >
          {getAvatarInitial(displayAddress)}
        </div>

        {/* 信息 */}
        <div className="flex-1">
          <div className="text-sm text-ink/60 mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            钱包地址
          </div>
          <div className="text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
            {truncateAddress(displayAddress)}
          </div>

          {/* 成就徽章 */}
          {sbts && sbts.length > 0 && (
            <div className="mt-2">
              <AchievementBadges sbts={sbts} />
            </div>
          )}
        </div>

        {/* 断开/退出按钮 */}
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-xs border border-ink text-ink hover:bg-ink hover:text-paper transition-colors"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          {isSkipMode ? '退出' : '断开'}
        </button>
      </div>
    </motion.div>
  );
}
