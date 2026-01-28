/**
 * 双链成就管理服务
 * 管理BNB Chain和Solana两条链的成就数据
 * 增强版：集成Solana SBT服务
 */

import { AchievementLevel } from './achievement-system';
import { AchievementDB } from './db-achievement';
import { SolanaSBTManager } from './solana-sbt-manager';

/**
 * 双链成就数据
 */
export interface MultiChainAchievement {
  bnb: {
    currentLevel: number;
    totalDays: number;
    sbtClaimed: boolean[];
  } | null;
  solana: {
    currentLevel: number;
    totalDays: number;
    sbtClaimed: boolean[];
  } | null;
}

/**
 * 双链统计数据
 */
export interface MultiChainStats {
  bnb: {
    currentLevel: AchievementLevel | null;
    totalDays: number;
    progress: number;
    claimableLevels: number[];
  };
  solana: {
    currentLevel: AchievementLevel | null;
    totalDays: number;
    progress: number;
    claimableLevels: number[];
  };
  combined: {
    totalDays: number;
    maxLevel: number;
  };
}

/**
 * 当前激活的链类型
 */
export type ChainType = 'bnb' | 'solana';

/**
 * 双链成就管理器
 */
export class MultiChainAchievementService {
  /**
   * 获取用户在两条链的成就数据
   */
  static async getMultiChainAchievement(
    walletAddress: string
  ): Promise<MultiChainAchievement> {
    const [bnbAchievement, solanaAchievement] = await Promise.all([
      AchievementDB.getUserAchievement(walletAddress, 'bnb'),
      AchievementDB.getUserAchievement(walletAddress, 'solana')
    ]);

    return {
      bnb: bnbAchievement ? {
        currentLevel: bnbAchievement.currentLevel,
        totalDays: bnbAchievement.totalCheckInDays,
        sbtClaimed: bnbAchievement.sbtClaimed
      } : null,
      solana: solanaAchievement ? {
        currentLevel: solanaAchievement.currentLevel,
        totalDays: solanaAchievement.totalCheckInDays,
        sbtClaimed: solanaAchievement.sbtClaimed
      } : null
    };
  }

  /**
   * 获取双链统计数据
   */
  static async getMultiChainStats(
    walletAddress: string
  ): Promise<MultiChainStats> {
    const [bnbAchievement, solanaAchievement] = await Promise.all([
      AchievementDB.getUserAchievement(walletAddress, 'bnb'),
      AchievementDB.getUserAchievement(walletAddress, 'solana')
    ]);

    // 动态导入避免循环依赖
    const { getLevelByDays, calculateProgress, getUnlockedLevels } = await import('./achievement-system');

    const bnbStats = bnbAchievement ? {
      currentLevel: getLevelByDays(bnbAchievement.totalCheckInDays),
      totalDays: bnbAchievement.totalCheckInDays,
      progress: calculateProgress(bnbAchievement.totalCheckInDays, bnbAchievement.currentLevel),
      claimableLevels: getUnlockedLevels(bnbAchievement.totalCheckInDays)
        .filter(level => !bnbAchievement.sbtClaimed[level.level - 1])
        .map(level => level.level)
    } : {
      currentLevel: null,
      totalDays: 0,
      progress: 0,
      claimableLevels: []
    };

    const solanaStats = solanaAchievement ? {
      currentLevel: getLevelByDays(solanaAchievement.totalCheckInDays),
      totalDays: solanaAchievement.totalCheckInDays,
      progress: calculateProgress(solanaAchievement.totalCheckInDays, solanaAchievement.currentLevel),
      claimableLevels: getUnlockedLevels(solanaAchievement.totalCheckInDays)
        .filter(level => !solanaAchievement.sbtClaimed[level.level - 1])
        .map(level => level.level)
    } : {
      currentLevel: null,
      totalDays: 0,
      progress: 0,
      claimableLevels: []
    };

    const combined = {
      totalDays: bnbStats.totalDays + solanaStats.totalDays,
      maxLevel: Math.max(
        bnbStats.currentLevel?.level || 0,
        solanaStats.currentLevel?.level || 0
      )
    };

    return {
      bnb: bnbStats,
      solana: solanaStats,
      combined
    };
  }

  /**
   * 记录双链打卡
   */
  static async recordCheckIn(
    walletAddress: string,
    chain: ChainType
  ): Promise<{
    leveledUp: boolean;
    newLevel: number;
  }> {
    // TODO: 实现实际的打卡逻辑
    const achievement = await AchievementDB.getOrCreateUserAchievement(walletAddress, chain);
    const oldLevel = achievement.currentLevel;
    const newDays = achievement.totalCheckInDays + 1;

    // 动态导入
    const { getLevelByDays } = await import('./achievement-system');
    const newLevel = getLevelByDays(newDays);

    await AchievementDB.updateUserAchievement(walletAddress, chain, {
      totalCheckInDays: newDays,
      currentLevel: newLevel.level
    });

    return {
      leveledUp: newLevel.level > oldLevel,
      newLevel: newLevel.level
    };
  }

  /**
   * 检查双链是否已打卡
   */
  static async hasCheckedInToday(
    walletAddress: string,
    chain: ChainType
  ): Promise<boolean> {
    return await AchievementDB.hasCheckedInToday(walletAddress, chain);
  }

  /**
   * 获取可领取的SBT列表（双链）
   */
  static async getClaimableSBTs(
    walletAddress: string
  ): Promise<{
    bnb: number[];
    solana: number[];
  }> {
    const [bnbAchievement, solanaAchievement] = await Promise.all([
      AchievementDB.getUserAchievement(walletAddress, 'bnb'),
      AchievementDB.getUserAchievement(walletAddress, 'solana')
    ]);

    // 动态导入
    const { getUnlockedLevels } = await import('./achievement-system');

    const bnbClaimable = bnbAchievement
      ? getUnlockedLevels(bnbAchievement.totalCheckInDays)
          .filter(level => !bnbAchievement.sbtClaimed[level.level - 1])
          .map(level => level.level)
      : [];

    const solanaClaimable = solanaAchievement
      ? getUnlockedLevels(solanaAchievement.totalCheckInDays)
          .filter(level => !solanaAchievement.sbtClaimed[level.level - 1])
          .map(level => level.level)
      : [];

    return {
      bnb: bnbClaimable,
      solana: solanaClaimable
    };
  }

  /**
   * 同步链上SBT数据到本地
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 同步的SBT数量
   */
  static async syncSBTsFromChain(
    walletAddress: string,
    chain: ChainType
  ): Promise<number> {
    try {
      console.log(`[MultiChain] 开始同步 ${chain} 链上SBT数据...`);

      let syncedCount = 0;

      if (chain === 'bnb') {
        // BNB Chain同步逻辑
        // 注意：由于无法在静态方法中使用React hooks，
        // 这里需要传入一个查询函数或使用直接的ethers.js调用
        console.warn('[MultiChain] BNB同步需要在React组件中调用useUserSBTs hook');

        // 临时方案：从本地数据库判断，假设本地数据是正确的
        const achievement = await AchievementDB.getUserAchievement(walletAddress, 'bnb');
        if (achievement) {
          syncedCount = achievement.sbtClaimed.filter(claimed => claimed).length;
        }

      } else if (chain === 'solana') {
        // Solana同步逻辑 - 使用SolanaSBTManager
        console.log('[MultiChain] 使用SolanaSBTManager同步Solana SBT...');

        try {
          // 调用SolanaSBTManager的同步方法
          syncedCount = await SolanaSBTManager.syncSBTsFromChain(walletAddress, 'solana');
          console.log(`[MultiChain] Solana同步成功，同步了${syncedCount}个SBT`);
        } catch (error) {
          console.error('[MultiChain] Solana SBT同步失败:', error);
          // 同步失败时，返回本地数据库中的数量
          const achievement = await AchievementDB.getUserAchievement(walletAddress, 'solana');
          if (achievement) {
            syncedCount = achievement.sbtClaimed.filter(claimed => claimed).length;
          }
        }
      }

      console.log(`[MultiChain] 同步完成，共 ${syncedCount} 个SBT`);
      return syncedCount;

    } catch (error) {
      console.error(`[MultiChain] 同步 ${chain} SBT失败:`, error);
      return 0;
    }
  }

  /**
   * 从React组件中调用的同步方法
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param chainSBTs 链上查询到的SBT列表（来自hooks）
   */
  static async syncChainSBTsFromComponent(
    walletAddress: string,
    chain: ChainType,
    chainSBTs: number[]
  ): Promise<void> {
    try {
      const achievement = await AchievementDB.getOrCreateUserAchievement(walletAddress, chain);

      // 更新sbtClaimed数组
      const newSBTClaimed = [...achievement.sbtClaimed];

      // 标记链上存在的SBT
      for (const level of chainSBTs) {
        if (level >= 1 && level <= 6) {
          newSBTClaimed[level - 1] = true;
        }
      }

      // 检查是否有变化
      const hasChanged = JSON.stringify(newSBTClaimed) !== JSON.stringify(achievement.sbtClaimed);

      if (hasChanged) {
        await AchievementDB.updateUserAchievement(walletAddress, chain, {
          sbtClaimed: newSBTClaimed
        });
        console.log(`[MultiChain] 已更新 ${chain} SBT状态:`, newSBTClaimed);
      } else {
        console.log(`[MultiChain] ${chain} SBT状态已是最新`);
      }

    } catch (error) {
      console.error(`[MultiChain] 同步${chain} SBT失败:`, error);
      throw error;
    }
  }

  /**
   * 获取链上SBT列表（直接查询）
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns SBT列表
   */
  static async getChainSBTs(
    walletAddress: string,
    chain: ChainType
  ): Promise<any[]> {
    try {
      if (chain === 'solana') {
        // 使用SolanaSBTManager获取链上SBT
        return await SolanaSBTManager.getMintedSBTs(walletAddress, 'solana');
      } else {
        // BNB Chain需要在组件中使用hooks
        console.warn('[MultiChain] BNB SBT查询需要在React组件中调用useUserSBTs hook');
        return [];
      }
    } catch (error) {
      console.error(`[MultiChain] 获取${chain}链上SBT失败:`, error);
      return [];
    }
  }

  /**
   * 检查是否已铸造SBT（支持双链）
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级
   * @returns 是否已铸造
   */
  static async hasMintedSBT(
    walletAddress: string,
    chain: ChainType,
    level: number
  ): Promise<boolean> {
    try {
      if (chain === 'solana') {
        // 使用SolanaSBTManager检查
        return await SolanaSBTManager.hasMintedSBT(walletAddress, 'solana', level);
      } else {
        // BNB Chain从本地数据库检查
        const achievement = await AchievementDB.getUserAchievement(walletAddress, 'bnb');
        return achievement ? achievement.sbtClaimed[level - 1] : false;
      }
    } catch (error) {
      console.error(`[MultiChain] 检查${chain} SBT状态失败:`, error);
      return false;
    }
  }

  /**
   * 创建SBT铸造交易（用于Solana）
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns 交易对象和元数据
   */
  static async createMintTransaction(
    walletAddress: string,
    level: number
  ): Promise<{
    transaction: any;
    metadataURI: string;
    estimatedFee: number;
  } | null> {
    try {
      // 使用SolanaSBTManager创建交易
      const result = await SolanaSBTManager.createMintTransaction(walletAddress, level);

      // 转换属性名以匹配返回类型
      return {
        transaction: result.transaction,
        metadataURI: result.metadataURI,
        estimatedFee: result.fee
      };
    } catch (error) {
      console.error('[MultiChain] 创建Solana铸造交易失败:', error);
      return null;
    }
  }

  /**
   * 估算铸造费用（支持双链）
   * @param chain 链类型
   * @param level 等级
   * @returns 格式化的费用字符串
   */
  static async estimateMintFee(
    chain: ChainType,
    level: number
  ): Promise<string> {
    try {
      if (chain === 'solana') {
        // 使用SolanaSBTManager估算
        const feeLamports = await SolanaSBTManager.estimateMintGas(level);
        return SolanaSBTManager.formatGasFee(feeLamports);
      } else {
        // BNB Chain费用估算（TODO: 集成SBTManager）
        return '0.001 BNB (估算)';
      }
    } catch (error) {
      console.error(`[MultiChain] 估算${chain}铸造费用失败:`, error);
      return 'N/A';
    }
  }

  /**
   * 生成SBT元数据（支持双链）
   * @param chain 链类型
   * @param level 等级
   * @param days 天数
   * @param walletAddress 钱包地址
   * @returns 元数据对象
   */
  static generateSBTMetadata(
    chain: ChainType,
    level: number,
    days: number,
    walletAddress: string
  ): Record<string, any> {
    if (chain === 'solana') {
      // 使用SolanaSBTManager生成元数据
      return SolanaSBTManager.generateSBTMetadata(level, 'solana', days, walletAddress);
    } else {
      // BNB Chain元数据（TODO: 集成SBTManager）
      return {
        name: `Level ${level}`,
        description: `成就等级 ${level}`,
        attributes: [
          { trait_type: 'Level', value: level },
          { trait_type: 'Chain', value: 'BNB Chain' }
        ]
      };
    }
  }

  /**
   * 获取区块浏览器URL（支持双链）
   * @param chain 链类型
   * @param type 类型
   * @param value 值
   * @returns 完整URL
   */
  static getBlockExplorerUrl(
    chain: ChainType,
    type: 'tx' | 'address' | 'token',
    value: string
  ): string {
    if (chain === 'solana') {
      // 使用SolanaSBTManager获取浏览器URL
      return SolanaSBTManager.getBlockExplorerUrl(type, value, 'solana');
    } else {
      // BNB Chain浏览器
      const isTestnet = process.env.NEXT_PUBLIC_BNB_CHAIN_TESTNET === 'true';
      const baseUrl = isTestnet
        ? 'https://testnet.bscscan.com'
        : 'https://bscscan.com';
      return `${baseUrl}/${type}/${value}`;
    }
  }

  /**
   * 批量同步双链SBT
   * @param walletAddress 钱包地址
   * @returns 同步结果
   */
  static async syncAllChains(
    walletAddress: string
  ): Promise<{
    bnb: number;
    solana: number;
    total: number;
  }> {
    try {
      console.log('[MultiChain] 开始批量同步双链SBT...');

      const [bnbCount, solanaCount] = await Promise.all([
        this.syncSBTsFromChain(walletAddress, 'bnb'),
        this.syncSBTsFromChain(walletAddress, 'solana')
      ]);

      const total = bnbCount + solanaCount;

      console.log(`[MultiChain] 批量同步完成: BNB ${bnbCount}个, Solana ${solanaCount}个, 总计 ${total}个`);

      return {
        bnb: bnbCount,
        solana: solanaCount,
        total
      };
    } catch (error) {
      console.error('[MultiChain] 批量同步失败:', error);
      return {
        bnb: 0,
        solana: 0,
        total: 0
      };
    }
  }

  /**
   * 获取双链SBT统计
   * @param walletAddress 钱包地址
   * @returns 统计信息
   */
  static async getSBTStatistics(
    walletAddress: string
  ): Promise<{
    bnb: { total: number; claimed: number; unclaimed: number };
    solana: { total: number; claimed: number; unclaimed: number };
    combined: { total: number; claimed: number; unclaimed: number };
  }> {
    try {
      const [bnbAchievement, solanaAchievement] = await Promise.all([
        AchievementDB.getUserAchievement(walletAddress, 'bnb'),
        AchievementDB.getUserAchievement(walletAddress, 'solana')
      ]);

      const { getUnlockedLevels } = await import('./achievement-system');

      // BNB统计
      const bnbUnlocked = bnbAchievement
        ? getUnlockedLevels(bnbAchievement.totalCheckInDays)
        : [];
      const bnbClaimed = bnbAchievement
        ? bnbAchievement.sbtClaimed.filter(claimed => claimed).length
        : 0;
      const bnbStats = {
        total: bnbUnlocked.length,
        claimed: bnbClaimed,
        unclaimed: bnbUnlocked.length - bnbClaimed
      };

      // Solana统计
      const solanaUnlocked = solanaAchievement
        ? getUnlockedLevels(solanaAchievement.totalCheckInDays)
        : [];
      const solanaClaimed = solanaAchievement
        ? solanaAchievement.sbtClaimed.filter(claimed => claimed).length
        : 0;
      const solanaStats = {
        total: solanaUnlocked.length,
        claimed: solanaClaimed,
        unclaimed: solanaUnlocked.length - solanaClaimed
      };

      // 合并统计
      const combined = {
        total: bnbStats.total + solanaStats.total,
        claimed: bnbStats.claimed + solanaStats.claimed,
        unclaimed: bnbStats.unclaimed + solanaStats.unclaimed
      };

      return {
        bnb: bnbStats,
        solana: solanaStats,
        combined
      };
    } catch (error) {
      console.error('[MultiChain] 获取SBT统计失败:', error);
      return {
        bnb: { total: 0, claimed: 0, unclaimed: 0 },
        solana: { total: 0, claimed: 0, unclaimed: 0 },
        combined: { total: 0, claimed: 0, unclaimed: 0 }
      };
    }
  }

  /**
   * 检查程序是否已初始化（Solana专用）
   * @returns 是否已初始化
   */
  static async isSolanaProgramInitialized(): Promise<boolean> {
    try {
      return await SolanaSBTManager.isProgramInitialized();
    } catch (error) {
      console.error('[MultiChain] 检查Solana程序状态失败:', error);
      return false;
    }
  }

  /**
   * 获取Solana程序配置
   * @returns 程序配置信息
   */
  static async getSolanaProgramConfig(): Promise<{
    programId: string;
    network: string;
    isInitialized: boolean;
  } | null> {
    try {
      return await SolanaSBTManager.getProgramConfig();
    } catch (error) {
      console.error('[MultiChain] 获取Solana程序配置失败:', error);
      return null;
    }
  }
}
