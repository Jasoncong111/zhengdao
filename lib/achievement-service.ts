/**
 * 成就系统服务类
 * 提供成就相关的业务逻辑和数据处理
 */

import {
  ACHIEVEMENT_LEVELS,
  getLevelByDays,
  getNextLevel,
  getDaysToNextLevel,
  calculateProgress,
  getUnlockedLevels,
  getNextClaimableLevel
} from './achievement-system';
import { AchievementDB } from './db-achievement';

/**
 * 用户成就数据接口
 */
export interface UserAchievement {
  id?: number;
  walletAddress: string;
  chain: 'bnb' | 'solana';
  currentLevel: number;
  totalCheckInDays: number;
  sbtClaimed: boolean[];  // [false, true, false, ...] 索引0=level1
  lastUpdated: Date;
}

/**
 * 打卡记录接口
 */
export interface CheckInRecord {
  id?: number;
  walletAddress: string;
  chain: 'bnb' | 'solana';
  checkInDate: string;  // YYYY-MM-DD
  levelAtTime: number;
  timestamp: Date;
}

/**
 * 打卡统计信息
 */
export interface CheckInStats {
  totalDays: number;
  currentLevel: number;
  nextLevel: number | null;
  daysToNextLevel: number;
  progress: number;
  unlockedLevels: number[];
  claimableLevels: number[];
}

/**
 * SBT元数据
 */
export interface SBTMetadata {
  level: number;
  title: string;
  image: string;
  description: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

/**
 * 成就服务类
 * 提供静态方法处理成就相关业务逻辑
 */
export class AchievementService {
  /**
   * 获取用户成就数据
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 用户成就数据，不存在返回null
   */
  static async getUserAchievement(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<UserAchievement | null> {
    try {
      const achievement = await AchievementDB.getUserAchievement(walletAddress, chain);
      return achievement;
    } catch (error) {
      console.error('[AchievementService] 获取用户成就失败:', error);
      return null;
    }
  }

  /**
   * 记录打卡并更新成就
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 打卡结果
   */
  static async recordCheckIn(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<{
    previousLevel: number;
    newLevel: number;
    leveledUp: boolean;
    totalDays: number;
  }> {
    try {
      // 1. 查询当前成就
      const achievement = await AchievementDB.getOrCreateUserAchievement(walletAddress, chain);
      const previousLevel = achievement.currentLevel;

      // 2. 检查今天是否已打卡
      const hasCheckedIn = await AchievementDB.hasCheckedInToday(walletAddress, chain);
      if (hasCheckedIn) {
        throw new Error('今天已经打卡了');
      }

      // 3. 计算新的总天数
      const newTotalDays = achievement.totalCheckInDays + 1;

      // 4. 计算新等级
      const newLevelObj = getLevelByDays(newTotalDays);
      const newLevel = newLevelObj.level;

      // 5. 保存到数据库
      await AchievementDB.updateUserAchievement(walletAddress, chain, {
        totalCheckInDays: newTotalDays,
        currentLevel: newLevel
      });

      // 6. 添加打卡记录
      await AchievementDB.addCheckInRecord(
        walletAddress,
        chain,
        new Date().toISOString().split('T')[0], // YYYY-MM-DD
        newLevel
      );

      // 7. 检查是否升级
      const leveledUp = newLevel > previousLevel;

      return {
        previousLevel,
        newLevel,
        leveledUp,
        totalDays: newTotalDays
      };
    } catch (error) {
      console.error('[AchievementService] 打卡失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否可以claim SBT
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级编号
   * @returns 是否可以claim
   */
  static async canClaimSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<boolean> {
    try {
      // 1. 获取用户成就数据
      const achievement = await AchievementDB.getOrCreateUserAchievement(walletAddress, chain);

      // 2. 检查该等级是否已达成
      const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
      if (!levelInfo) {
        return false;
      }

      if (achievement.totalCheckInDays < levelInfo.requiredDays) {
        return false; // 未达到该等级要求
      }

      // 3. 检查该等级是否已claim
      if (achievement.sbtClaimed[level - 1]) {
        return false; // 已领取
      }

      // 4. 返回是否可以claim
      return true;
    } catch (error) {
      console.error('[AchievementService] 检查SBT领取资格失败:', error);
      return false;
    }
  }

  /**
   * 标记SBT已claim
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级编号
   * @param tokenId SBT的tokenId
   */
  static async markSBTClaimed(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number,
    tokenId: number
  ): Promise<void> {
    try {
      // 更新数据库，标记SBT已领取
      await AchievementDB.markSBTClaimed(walletAddress, chain, level);
      console.log(`[AchievementService] SBT已标记为已领取: level=${level}, tokenId=${tokenId}`);
    } catch (error) {
      console.error('[AchievementService] 标记SBT失败:', error);
      throw error;
    }
  }

  /**
   * 获取打卡统计
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 统计信息
   */
  static async getCheckInStats(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<CheckInStats> {
    // TODO: 从数据库查询实际数据
    const achievement = await this.getUserAchievement(walletAddress, chain);
    
    if (!achievement) {
      return {
        totalDays: 0,
        currentLevel: 1,
        nextLevel: 2,
        daysToNextLevel: 7,
        progress: 0,
        unlockedLevels: [],
        claimableLevels: []
      };
    }

    const currentLevelObj = getLevelByDays(achievement.totalCheckInDays);
    const nextLevelObj = getNextLevel(currentLevelObj.level);
    const unlockedLevels = getUnlockedLevels(achievement.totalCheckInDays);
    
    const claimedSet = new Set(
      achievement.sbtClaimed
        .map((claimed, index) => claimed ? index + 1 : -1)
        .filter(level => level > 0)
    );
    
    const claimableLevels = unlockedLevels
      .filter(level => !claimedSet.has(level.level))
      .map(level => level.level);

    return {
      totalDays: achievement.totalCheckInDays,
      currentLevel: currentLevelObj.level,
      nextLevel: nextLevelObj?.level || null,
      daysToNextLevel: getDaysToNextLevel(achievement.totalCheckInDays),
      progress: calculateProgress(achievement.totalCheckInDays, currentLevelObj.level),
      unlockedLevels: unlockedLevels.map(l => l.level),
      claimableLevels
    };
  }

  /**
   * 生成SBT元数据
   * @param level 等级编号
   * @param days 总打卡天数
   * @param walletAddress 钱包地址
   * @returns SBT元数据
   */
  static generateSBTMetadata(
    level: number,
    days: number,
    walletAddress: string
  ): SBTMetadata {
    const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
    
    if (!levelInfo) {
      throw new Error(`Invalid level: ${level}`);
    }

    return {
      level: levelInfo.level,
      title: levelInfo.title,
      image: `https://your-domain.com/sbt-images/level-${level}.png`,
      description: levelInfo.description,
      attributes: [
        {
          trait_type: 'Level',
          value: levelInfo.level.toString()
        },
        {
          trait_type: 'Title',
          value: levelInfo.title
        },
        {
          trait_type: 'Check-In Days',
          value: days.toString()
        },
        {
          trait_type: 'Chain',
          value: 'BNB Chain'
        },
        {
          trait_type: 'Achievement Date',
          value: new Date().toISOString().split('T')[0]
        }
      ]
    };
  }

  /**
   * 计算下一等级所需天数
   * @param currentDays 当前总打卡天数
   * @returns 还需要的天数
   */
  static calculateDaysToNext(currentDays: number): number {
    return getDaysToNextLevel(currentDays);
  }

  /**
   * 计算当前等级进度
   * @param currentDays 当前总打卡天数
   * @returns 进度百分比 (0-100)
   */
  static calculateProgress(currentDays: number): number {
    const currentLevel = getLevelByDays(currentDays);
    return calculateProgress(currentDays, currentLevel.level);
  }
}
