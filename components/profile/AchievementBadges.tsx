'use client';

/**
 * AchievementBadges - 成就徽章组件
 *
 * 在用户信息区域展示已获得的关键SBT徽章
 */

import { motion } from 'framer-motion';
import { getLevelSBTImage } from '@/lib/achievement-system';

export interface AchievementBadge {
  tokenId: number;
  level: number;
  chain: 'bnb' | 'solana';
  title: string;
  image: string;
}

interface AchievementBadgesProps {
  /** SBT列表 */
  sbts: AchievementBadge[];
}

export function AchievementBadges({ sbts }: AchievementBadgesProps) {
  // 只展示最高等级的3个徽章
  const topBadges = sbts
    .slice()
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);

  if (topBadges.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {topBadges.map((badge) => (
        <motion.div
          key={`${badge.chain}-${badge.tokenId}`}
          className="relative w-8 h-8 flex-shrink-0"
          whileHover={{ scale: 1.1 }}
          title={badge.title}
        >
          <img
            src={badge.image || getLevelSBTImage(badge.level)}
            alt={badge.title}
            className="w-full h-full object-cover rounded-full border-2 border-seal"
            style={{ borderColor: '#D43628' }}
          />
          {/* 等级角标 */}
          {badge.level >= 4 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-seal text-white text-xs rounded-full flex items-center justify-center">
              🌟
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
