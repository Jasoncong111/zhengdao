/**
 * SBT管理器
 * 提供SBT铸造、查询、同步等功能的封装
 */

import { ACHIEVEMENT_LEVELS } from './achievement-system';
import { AchievementDB } from './db-achievement';
import {
  useMintSBT,
  useUserSBTs,
  useSBTDetails,
  getExplorerUrl,
  isContractConfigured
} from './contracts/sbt';
import type { SBTItem } from '@/types/achievement';

/**
 * SBT管理器类
 * 提供静态方法管理SBT相关操作
 */
export class SBTManager {
  /**
   * 铸造SBT并更新数据库
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级
   * @returns 交易Hash
   */
  static async mintAndSaveSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<string> {
    // 1. 验证合约配置
    if (chain === 'bnb' && !isContractConfigured()) {
      throw new Error('BNB Chain SBT合约未配置');
    }

    if (chain !== 'bnb') {
      throw new Error('当前仅支持BNB Chain');
    }

    // 2. 获取元数据URI
    const metadataURI = this.getMetadataURI(level, chain);

    // 3. 获取等级信息
    const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
    if (!levelInfo) {
      throw new Error(`无效的等级: ${level}`);
    }

    const days = levelInfo.requiredDays;

    // 4. 调用合约铸造（需要在组件中使用hook）
    // 这里只返回参数，实际调用需要在React组件中完成
    throw new Error('请在React组件中使用useMintSBT hook进行铸造');
  }

  /**
   * 获取元数据URI
   * @param level 等级
   * @param chain 链类型
   * @returns 元数据URI
   */
  static getMetadataURI(level: number, chain: 'bnb' | 'solana'): string {
    // 如果使用IPFS
    if (process.env.NEXT_PUBLIC_USE_IPFS === 'true') {
      const cid = this.getIPFSCID(level);
      return `ipfs://${cid}`;
    }

    // 如果使用本地路径（开发环境）
    return `/sbt-metadata/level-${level}-${chain}.json`;
  }

  /**
   * 获取IPFS CID
   * @param level 等级
   * @returns IPFS CID
   */
  private static getIPFSCID(level: number): string {
    // TODO: 从IPFS上传日志中获取实际CID
    const cids: Record<number, string> = {
      1: 'QmPlaceholder1',
      2: 'QmPlaceholder2',
      3: 'QmPlaceholder3',
      4: 'QmPlaceholder4',
      5: 'QmPlaceholder5',
      6: 'QmPlaceholder6'
    };
    return cids[level] || 'QmPlaceholder';
  }

  /**
   * 检查用户是否已铸造某等级SBT
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级
   * @returns 是否已铸造
   */
  static async hasMintedSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<boolean> {
    // 检查本地数据库
    const achievement = await AchievementDB.getOrCreateUserAchievement(
      walletAddress,
      chain
    );

    return achievement.sbtClaimed[level - 1];
  }

  /**
   * 获取所有已铸造的SBT
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns SBT列表
   */
  static async getMintedSBTs(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<SBTItem[]> {
    const achievement = await AchievementDB.getOrCreateUserAchievement(
      walletAddress,
      chain
    );

    const sbts: SBTItem[] = [];

    for (let i = 0; i < achievement.sbtClaimed.length; i++) {
      if (achievement.sbtClaimed[i]) {
        const level = i + 1;
        const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
        if (!levelInfo) continue;

        sbts.push({
          tokenId: 0, // 实际需要从链上获取
          level,
          chain,
          title: levelInfo.title,
          image: `/sbt-images/level-${level}/level-${level}.png`,
          achievedDate: achievement.lastUpdated,
          metadata: {
            name: levelInfo.title,
            description: levelInfo.description,
            attributes: [
              {
                trait_type: 'Level',
                value: level
              },
              {
                trait_type: 'Chain',
                value: chain === 'bnb' ? 'BNB Chain' : 'Solana'
              }
            ]
          }
        });
      }
    }

    return sbts;
  }

  /**
   * 同步链上SBT到本地数据库
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 同步的SBT数量
   */
  static async syncSBTsFromChain(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<number> {
    if (chain !== 'bnb') {
      console.warn('[SBTManager] Solana SBT同步尚未实现');
      return 0;
    }

    try {
      // 注意：这个方法不能直接在服务器端使用useUserSBTs hook
      // 需要在React组件中调用，或者使用直接的ethers.js调用
      console.warn('[SBTManager] 请在React组件中使用useUserSBTs hook');
      return 0;
    } catch (error) {
      console.error('[SBTManager] 同步SBT失败:', error);
      return 0;
    }
  }

  /**
   * 生成SBT元数据JSON
   * @param level 等级
   * @param chain 链类型
   * @param days 天数
   * @param walletAddress 钱包地址
   * @returns 元数据对象
   */
  static generateSBTMetadata(
    level: number,
    chain: 'bnb' | 'solana',
    days: number,
    walletAddress: string
  ): Record<string, any> {
    const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
    if (!levelInfo) {
      throw new Error(`无效的等级: ${level}`);
    }

    return {
      name: levelInfo.title,
      description: levelInfo.description,
      external_url: 'https://zhengdao.example.com',
      image: `/sbt-images/level-${level}/level-${level}.png`,
      attributes: [
        {
          trait_type: 'Level',
          value: level
        },
        {
          trait_type: 'Title',
          value: levelInfo.title
        },
        {
          trait_type: 'Check-In Days',
          value: days,
          display_type: 'number'
        },
        {
          trait_type: 'Chain',
          value: chain === 'bnb' ? 'BNB Chain' : 'Solana'
        },
        {
          trait_type: 'Achievement Date',
          value: new Date().toISOString().split('T')[0],
          display_type: 'date'
        },
        {
          trait_type: 'Primary Color',
          value: levelInfo.primaryColor
        },
        {
          trait_type: 'Reward Bonus',
          value: levelInfo.rewardBonus,
          display_type: 'boost_percentage'
        }
      ]
    };
  }

  /**
   * 获取SBT图像URL
   * @param level 等级
   * @param size 尺寸 'small' | 'medium' | 'large'
   * @returns 图像URL
   */
  static getSBTImageUrl(level: number, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizeSuffix = size === 'small' ? '-small' : size === 'large' ? '-large' : '';
    return `/sbt-images/level-${level}/level-${level}${sizeSuffix}.png`;
  }

  /**
   * 获取区块浏览器URL
   * @param type 类型
   * @param value 值
   * @param chain 链类型
   * @returns 完整URL
   */
  static getBlockExplorerUrl(
    type: 'tx' | 'address' | 'token',
    value: string,
    chain: 'bnb' | 'solana'
  ): string {
    if (chain === 'bnb') {
      return getExplorerUrl(type, value);
    } else {
      // Solana Explorer
      const cluster = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' ? '' : '?cluster=devnet';
      return `https://explorer.solana.com/${type}/${value}${cluster}`;
    }
  }

  /**
   * 验证SBT元数据
   * @param metadata 元数据对象
   * @returns 是否有效
   */
  static validateMetadata(metadata: any): boolean {
    if (!metadata || typeof metadata !== 'object') {
      return false;
    }

    const requiredFields = ['name', 'description', 'image', 'attributes'];
    for (const field of requiredFields) {
      if (!metadata[field]) {
        console.error(`[SBTManager] 缺少必需字段: ${field}`);
        return false;
      }
    }

    if (!Array.isArray(metadata.attributes)) {
      console.error('[SBTManager] attributes必须是数组');
      return false;
    }

    return true;
  }

  /**
   * 计算铸造Gas费（估算）
   * @param chain 链类型
   * @returns Gas费用（单位：wei）
   */
  static estimateMintGas(chain: 'bnb' | 'solana'): bigint {
    // BNB Chain Gas估算
    if (chain === 'bnb') {
      // 大约200,000 gas * 5 gwei = 0.001 BNB
      return BigInt(200000) * BigInt(5 * 10 ** 9);
    }

    // Solana交易费用（非常低）
    return BigInt(0);
  }

  /**
   * 格式化Gas费
   * @param gasWei Gas费用（wei）
   * @param chain 链类型
   * @returns 格式化的字符串
   */
  static formatGasFee(gasWei: bigint, chain: 'bnb' | 'solana'): string {
    if (chain === 'bnb') {
      const bnb = Number(gasWei) / 10 ** 18;
      return `${bnb.toFixed(6)} BNB`;
    } else {
      return `${gasWei} lamports`;
    }
  }
}

/**
 * SBT铸造辅助函数（用于React组件）
 */
export function useSBTMint() {
  const { mintSBT, isPending, isConfirming, isConfirmed, hash, error } = useMintSBT();

  /**
   * 铸造SBT
   */
  const mint = async (
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ) => {
    // 1. 获取用户数据
    const achievement = await AchievementDB.getOrCreateUserAchievement(walletAddress, chain);
    const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);

    if (!levelInfo) {
      throw new Error('无效的等级');
    }

    // 2. 检查是否已铸造
    if (achievement.sbtClaimed[level - 1]) {
      throw new Error('该等级SBT已铸造');
    }

    // 3. 检查是否达到要求
    if (achievement.totalCheckInDays < levelInfo.requiredDays) {
      throw new Error('未达到该等级要求');
    }

    // 4. 生成元数据URI
    const metadataURI = SBTManager.getMetadataURI(level, chain);

    // 5. 调用合约铸造
    await mintSBT(walletAddress as `0x${string}`, level, levelInfo.requiredDays, metadataURI);

    // 6. 标记为已铸造（在交易确认后）
    if (isConfirmed) {
      await AchievementDB.markSBTClaimed(walletAddress, chain, level);
    }
  };

  return {
    mint,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error
  };
}
