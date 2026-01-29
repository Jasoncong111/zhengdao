/**
 * 条件铸造系统
 * 验证用户是否满足铸造条件
 */

import { ACHIEVEMENT_LEVELS } from './achievement-system';
import { db } from './db';
import { SBTMintService } from './sbt-mint-service';

/**
 * 铸造条件接口
 */
export interface MintCondition {
  level: number;
  requiredDays: number;
  userDays: number;
  hasMintedOnBSC: boolean;
  hasMintedOnSolana: boolean;
  canMintOnBSC: boolean;
  canMintOnSolana: boolean;
}

/**
 * 条件铸造管理类
 */
export class ConditionMinter {
  /**
   * 检查铸造条件
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns 铸造条件详情
   */
  static async checkMintCondition(
    walletAddress: string,
    level: number
  ): Promise<MintCondition> {
    try {
      // 1. 获取等级信息
      const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
      if (!levelInfo) {
        throw new Error(`无效的等级: ${level}`);
      }

      // 2. 获取用户成就数据（从所有链聚合）
      const userAchievement = await db.userAchievements
        .where('walletAddress')
        .equals(walletAddress)
        .first();

      const userDays = userAchievement?.totalCheckInDays || 0;

      // 3. 检查是否已铸造（两条链分别检查）
      const bnbRecords = await db.sbtMintRecords
        .where('[walletAddress+level+chain]')
        .equals([walletAddress, level, 'bnb'])
        .count();

      const solanaRecords = await db.sbtMintRecords
        .where('[walletAddress+level+chain]')
        .equals([walletAddress, level, 'solana'])
        .count();

      const hasMintedOnBSC = bnbRecords > 0;
      const hasMintedOnSolana = solanaRecords > 0;

      // 4. 检查是否满足天数要求
      const meetsDaysRequirement = userDays >= levelInfo.requiredDays;

      return {
        level,
        requiredDays: levelInfo.requiredDays,
        userDays,
        hasMintedOnBSC,
        hasMintedOnSolana,
        canMintOnBSC: meetsDaysRequirement && !hasMintedOnBSC,
        canMintOnSolana: meetsDaysRequirement && !hasMintedOnSolana,
      };
    } catch (error) {
      console.error('[ConditionMinter] 检查铸造条件失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有可铸造的等级
   * @param walletAddress 钱包地址
   * @returns 可铸造的等级数组
   */
  static async getClaimableLevels(
    walletAddress: string
  ): Promise<number[]> {
    try {
      const claimableLevels: number[] = [];

      for (const levelInfo of ACHIEVEMENT_LEVELS) {
        const condition = await this.checkMintCondition(walletAddress, levelInfo.level);

        // 只要有一条链可以铸造就算可领取
        if (condition.canMintOnBSC || condition.canMintOnSolana) {
          claimableLevels.push(levelInfo.level);
        }
      }

      return claimableLevels;
    } catch (error) {
      console.error('[ConditionMinter] 获取可铸造等级失败:', error);
      return [];
    }
  }

  /**
   * 验证铸造条件并抛出错误
   * @param walletAddress 钱包地址
   * @param level 等级
   * @param chain 链类型
   * @throws 如果不满足条件则抛出错误
   */
  static async validateMintCondition(
    walletAddress: string,
    level: number,
    chain: 'bnb' | 'solana'
  ): Promise<void> {
    const condition = await this.checkMintCondition(walletAddress, level);

    // 检查天数要求
    if (condition.userDays < condition.requiredDays) {
      throw new Error(
        `未达到等级${level}要求，当前${condition.userDays}天，需要${condition.requiredDays}天`
      );
    }

    // 检查是否已铸造（指定链）
    if (chain === 'bnb' && condition.hasMintedOnBSC) {
      throw new Error(`等级${level}的SBT已在BSC链上铸造`);
    }
    if (chain === 'solana' && condition.hasMintedOnSolana) {
      throw new Error(`等级${level}的SBT已在Solana链上铸造`);
    }
  }

  /**
   * 获取用户在指定链上的铸造状态
   * @param walletAddress 钱包地址
   * @param level 等级
   * @param chain 链类型
   * @returns 是否可以铸造
   */
  static async canMintOnChain(
    walletAddress: string,
    level: number,
    chain: 'bnb' | 'solana'
  ): Promise<boolean> {
    try {
      const condition = await this.checkMintCondition(walletAddress, level);

      if (chain === 'bnb') {
        return condition.canMintOnBSC;
      } else {
        return condition.canMintOnSolana;
      }
    } catch (error) {
      console.error('[ConditionMinter] 检查链上铸造权限失败:', error);
      return false;
    }
  }

  /**
   * 格式化条件状态为用户友好的文本
   * @param condition 铸造条件
   * @returns 格式化的状态文本
   */
  static formatConditionStatus(condition: MintCondition): {
    daysStatus: string;
    daysMet: boolean;
    bscStatus: string;
    solanaStatus: string;
    canMintAny: boolean;
  } {
    const daysMet = condition.userDays >= condition.requiredDays;

    return {
      daysStatus: `${condition.userDays}/${condition.requiredDays} 天`,
      daysMet,
      bscStatus: condition.hasMintedOnBSC ? '已铸造' : condition.canMintOnBSC ? '可铸造' : '条件未满足',
      solanaStatus: condition.hasMintedOnSolana ? '已铸造' : condition.canMintOnSolana ? '可铸造' : '条件未满足',
      canMintAny: condition.canMintOnBSC || condition.canMintOnSolana,
    };
  }
}
