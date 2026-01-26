/**
 * 双池经济模型 - 奖励计算逻辑
 * - 奖金池：tBNB（测试网资金）
 * - 积分池：项目积分（虚拟积分）
 */

import { Reflection } from './db';

/**
 * 奖励结果
 */
export interface RewardResult {
  /** 奖金池奖励（tBNB） */
  tbnb: number;
  /** 积分池奖励（积分） */
  points: number;
  /** 奖励详情 */
  details: {
    base: { tbnb: number; points: number };
    qualityBonus: number; // 质量加成（有意义）
    depthBonus: number; // 深度加成（字数）
    totalMultiplier: number; // 总加成倍数
  };
}

/**
 * 基础奖励配置
 */
const BASE_REWARD = {
  tbnb: 0.005, // 0.005 tBNB
  points: 100, // 100积分
};

/**
 * 质量加成配置
 */
const QUALITY_BONUS = {
  meaningful: 1.2, // 有意义 +20%
};

/**
 * 深度加成配置（基于字数）
 */
const DEPTH_BONUS = {
  high: { threshold: 500, bonus: 1.3 }, // >500字 +30%
  low: { threshold: 200, penalty: 0.9 }, // <200字 -10%
};

/**
 * 计算奖励
 * @param reflection 反思数据
 * @returns 奖励结果
 */
export function calculateRewards(reflection: Pick<Reflection, 'isMeaningful' | 'rawContent'>): RewardResult {
  // 基础奖励
  let tbnb = BASE_REWARD.tbnb;
  let points = BASE_REWARD.points;
  let totalMultiplier = 1.0;

  // 质量加成
  if (reflection.isMeaningful) {
    totalMultiplier *= QUALITY_BONUS.meaningful;
  }

  // 深度加成（基于字数）
  const wordCount = reflection.rawContent.length;
  if (wordCount >= DEPTH_BONUS.high.threshold) {
    totalMultiplier *= DEPTH_BONUS.high.bonus;
  } else if (wordCount < DEPTH_BONUS.low.threshold) {
    totalMultiplier *= DEPTH_BONUS.low.penalty;
  }

  // 应用加成
  points = Math.round(points * totalMultiplier);

  return {
    tbnb,
    points,
    details: {
      base: BASE_REWARD,
      qualityBonus: reflection.isMeaningful ? QUALITY_BONUS.meaningful : 1.0,
      depthBonus:
        wordCount >= DEPTH_BONUS.high.threshold
          ? DEPTH_BONUS.high.bonus
          : wordCount < DEPTH_BONUS.low.threshold
          ? DEPTH_BONUS.low.penalty
          : 1.0,
      totalMultiplier,
    },
  };
}

/**
 * 格式化奖励显示
 * @param reward 奖励结果
 * @returns 格式化的字符串
 */
export function formatReward(reward: RewardResult): string {
  const parts: string[] = [];

  // 奖金池
  parts.push(`🎁 ${reward.tbnb} tBNB`);

  // 积分池
  parts.push(`⭐ ${reward.points} 积分`);

  // 加成说明
  if (reward.details.totalMultiplier > 1.0) {
    const bonusPercent = Math.round((reward.details.totalMultiplier - 1.0) * 100);
    parts.push(`(+${bonusPercent}%加成)`);
  } else if (reward.details.totalMultiplier < 1.0) {
    const penaltyPercent = Math.round((1.0 - reward.details.totalMultiplier) * 100);
    parts.push(`(-${penaltyPercent}%扣减)`);
  }

  return parts.join(' ');
}

/**
 * 获取奖励加成说明
 * @param reward 奖励结果
 * @returns 加成说明数组
 */
export function getBonusDescriptions(reward: RewardResult): string[] {
  const descriptions: string[] = [];

  // 质量加成
  if (reward.details.qualityBonus > 1.0) {
    descriptions.push('有意义 +20%');
  }

  // 深度加成
  if (reward.details.depthBonus > 1.0) {
    descriptions.push('深度复盘 +30%');
  } else if (reward.details.depthBonus < 1.0) {
    descriptions.push('简单复盘 -10%');
  }

  return descriptions;
}
