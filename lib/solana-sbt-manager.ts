/**
 * Solana SBT管理器
 * 提供SBT铸造、查询、同步等功能的统一接口
 * 设计上与BNB版本的SBTManager保持接口一致
 */

import { ACHIEVEMENT_LEVELS } from './achievement-system';
import { AchievementDB } from './db-achievement';
import { PublicKey } from '@solana/web3.js';
import {
  SolanaSBTService,
  MintSBTParams,
  SolanaSBTTokenDetails,
  SolanaSBTError,
  getSolanaExplorerUrl,
  createSolanaSBTService
} from './contracts/solana-sbt';

// SBTItem接口定义（避免循环依赖）
interface SBTItem {
  tokenId: number;
  level: number;
  chain: 'bnb' | 'solana';
  title: string;
  image: string;
  achievedDate: string;
  metadata: {
    name: string;
    description: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
      display_type?: string;
    }>;
  };
}

/**
 * Solana SBT管理器类
 * 提供静态方法管理Solana SBT相关操作
 * 接口设计与BNB版本的SBTManager保持一致
 */
export class SolanaSBTManager {
  private static service: SolanaSBTService;

  /**
   * 获取SBT服务实例
   * @returns SolanaSBTService实例
   */
  private static getService(): SolanaSBTService {
    if (!this.service) {
      this.service = createSolanaSBTService();
    }
    return this.service;
  }

  /**
   * 铸造SBT并更新数据库
   * @param walletAddress 钱包地址（Base58格式）
   * @param chain 链类型（必须是'solana'）
   * @param level 等级
   * @returns 交易签名
   * @throws Error 如果链类型不是Solana
   */
  static async mintAndSaveSBT(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<string> {
    // 1. 验证链类型
    if (chain !== 'solana') {
      throw new Error('此方法仅支持Solana链，BNB Chain请使用SBTManager');
    }

    // 2. 验证等级
    const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
    if (!levelInfo) {
      throw new Error(`无效的等级: ${level}`);
    }

    // 3. 获取用户成就数据
    const achievement = await AchievementDB.getOrCreateUserAchievement(
      walletAddress,
      chain
    );

    // 4. 检查是否已铸造
    if (achievement.sbtClaimed[level - 1]) {
      throw new Error(`等级${level}的SBT已铸造`);
    }

    // 5. 检查是否达到要求
    if (achievement.totalCheckInDays < levelInfo.requiredDays) {
      throw new Error(
        `未达到等级${level}要求，当前${achievement.totalCheckInDays}天，需要${levelInfo.requiredDays}天`
      );
    }

    // 6. 获取元数据URI
    const metadataURI = this.getMetadataURI(level, chain);

    // 7. 准备铸造参数
    const params: MintSBTParams = {
      walletAddress,
      level,
      days: levelInfo.requiredDays,
      metadataURI
    };

    // 8. 创建交易（需要在组件中用钱包签名并发送）
    const ownerPubkey = new PublicKey(walletAddress);
    const transaction = await this.getService().mintSBT(params, ownerPubkey);

    // 注意：这里返回交易对象，实际发送需要在React组件中使用钱包完成
    throw new Error('请在React组件中使用钱包签名并发送此交易');
  }

  /**
   * 仅创建铸造交易（不发送）
   * 用于在React组件中获取交易后用钱包签名
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns 交易对象
   */
  static async createMintTransaction(
    walletAddress: string,
    level: number
  ): Promise<{ transaction: any; metadataURI: string; fee: number }> {
    try {
      // 1. 验证等级
      const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
      if (!levelInfo) {
        throw new Error(`无效的等级: ${level}`);
      }

      // 2. 获取元数据URI
      const metadataURI = this.getMetadataURI(level, 'solana');

      // 3. 准备铸造参数
      const params: MintSBTParams = {
        walletAddress,
        level,
        days: levelInfo.requiredDays,
        metadataURI
      };

      // 4. 创建交易
      const ownerPubkey = new PublicKey(walletAddress);
      const transaction = await this.getService().mintSBT(params, ownerPubkey);

      // 5. 估算交易费用
      const fee = await this.getService().estimateFee(transaction);

      return {
        transaction,
        metadataURI,
        fee
      };
    } catch (error) {
      console.error('[SolanaSBTManager] 创建铸造交易失败:', error);
      throw error;
    }
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
      1: 'QmPlaceholderSolana1',
      2: 'QmPlaceholderSolana2',
      3: 'QmPlaceholderSolana3',
      4: 'QmPlaceholderSolana4',
      5: 'QmPlaceholderSolana5',
      6: 'QmPlaceholderSolana6'
    };
    return cids[level] || 'QmPlaceholderSolana';
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
    // 1. 检查本地数据库
    const achievement = await AchievementDB.getOrCreateUserAchievement(
      walletAddress,
      chain
    );

    if (achievement.sbtClaimed[level - 1]) {
      return true;
    }

    // 2. 如果本地没有记录，尝试从链上查询
    if (chain === 'solana') {
      try {
        const ownerPubkey = new PublicKey(walletAddress);
        const sbt = await this.getService().getSBT(ownerPubkey, level);
        if (sbt) {
          // 同步到本地数据库
          await AchievementDB.markSBTClaimed(walletAddress, chain, level);
          return true;
        }
      } catch (error) {
        console.error('[SolanaSBTManager] 检查链上SBT失败:', error);
      }
    }

    return false;
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
    if (chain !== 'solana') {
      throw new Error('此方法仅支持Solana链，BNB Chain请使用SBTManager');
    }

    try {
      // 1. 先从本地数据库获取
      const achievement = await AchievementDB.getOrCreateUserAchievement(
        walletAddress,
        chain
      );

      // 2. 从链上同步最新数据
      const ownerPubkey = new PublicKey(walletAddress);
      const chainSBTs = await this.getService().getAllSBTs(ownerPubkey);

      // 3. 合并链上和本地数据
      const sbts: SBTItem[] = [];

      for (const chainSBT of chainSBTs) {
        const level = chainSBT.level;
        const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
        if (!levelInfo) continue;

        // 更新本地数据库
        if (!achievement.sbtClaimed[level - 1]) {
          await AchievementDB.markSBTClaimed(walletAddress, chain, level);
        }

        sbts.push({
          tokenId: level, // Solana使用等级作为ID
          level,
          chain,
          title: levelInfo.title,
          image: `/sbt-images/level-${level}/level-${level}.png`,
          achievedDate: new Date(chainSBT.mintDate * 1000).toISOString(),
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
                value: 'Solana'
              },
              {
                trait_type: 'Check-In Days',
                value: chainSBT.days
              },
              {
                trait_type: 'Mint Date',
                value: new Date(chainSBT.mintDate * 1000).toISOString().split('T')[0]
              }
            ]
          }
        });
      }

      return sbts;
    } catch (error) {
      console.error('[SolanaSBTManager] 获取SBT列表失败:', error);
      return [];
    }
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
    if (chain !== 'solana') {
      console.warn('[SolanaSBTManager] 仅支持Solana链同步');
      return 0;
    }

    try {
      const ownerPubkey = new PublicKey(walletAddress);
      const chainSBTs = await this.getService().getAllSBTs(ownerPubkey);

      let syncedCount = 0;

      for (const sbt of chainSBTs) {
        const achievement = await AchievementDB.getOrCreateUserAchievement(
          walletAddress,
          chain
        );

        if (!achievement.sbtClaimed[sbt.level - 1]) {
          await AchievementDB.markSBTClaimed(walletAddress, chain, sbt.level);
          syncedCount++;
        }
      }

      console.log(`[SolanaSBTManager] 同步了${syncedCount}个SBT`);
      return syncedCount;
    } catch (error) {
      console.error('[SolanaSBTManager] 同步SBT失败:', error);
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
        },
        {
          trait_type: 'Collection',
          value: 'ZhengDao SBT'
        }
      ],
      properties: {
        category: 'achievement',
        chain: chain,
        level: level,
        days: days,
        minted_by: walletAddress
      }
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
   * @param value 值（签名或地址）
   * @param chain 链类型
   * @returns 完整URL
   */
  static getBlockExplorerUrl(
    type: 'tx' | 'address' | 'token',
    value: string,
    chain: 'bnb' | 'solana'
  ): string {
    if (chain === 'solana') {
      return getSolanaExplorerUrl(type as 'tx' | 'address', value);
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
   * 验证SBT元数据
   * @param metadata 元数据对象
   * @returns 是否有效
   */
  static validateMetadata(metadata: any): boolean {
    if (!metadata || typeof metadata !== 'object') {
      console.error('[SolanaSBTManager] 元数据必须是对象');
      return false;
    }

    const requiredFields = ['name', 'description', 'image', 'attributes'];
    for (const field of requiredFields) {
      if (!metadata[field]) {
        console.error(`[SolanaSBTManager] 缺少必需字段: ${field}`);
        return false;
      }
    }

    if (!Array.isArray(metadata.attributes)) {
      console.error('[SolanaSBTManager] attributes必须是数组');
      return false;
    }

    return true;
  }

  /**
   * 计算铸造交易费用（估算）
   * @param level 等级
   * @returns 交易费用（lamports）
   */
  static async estimateMintGas(level: number): Promise<number> {
    try {
      // 创建一个临时交易来估算费用
      const dummyAddress = new PublicKey(
        '11111111111111111111111111111111'
      );

      const params: MintSBTParams = {
        walletAddress: dummyAddress.toBase58(),
        level,
        days: 30,
        metadataURI: this.getMetadataURI(level, 'solana')
      };

      const transaction = await this.getService().mintSBT(params, dummyAddress);
      const fee = await this.getService().estimateFee(transaction);

      // Solana交易费通常很低，约5000 lamports（0.000005 SOL）
      return fee;
    } catch (error) {
      console.error('[SolanaSBTManager] 估算费用失败:', error);
      // 返回默认值
      return 5000;
    }
  }

  /**
   * 格式化交易费用
   * @param lamports 费用（lamports）
   * @returns 格式化的字符串
   */
  static formatGasFee(lamports: number): string {
    const sol = lamports / 1e9;
    return `${sol.toFixed(6)} SOL`;
  }

  /**
   * 获取SBT详情
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns SBT详情或null
   */
  static async getSBTDetails(
    walletAddress: string,
    level: number
  ): Promise<SolanaSBTTokenDetails | null> {
    try {
      const ownerPubkey = new PublicKey(walletAddress);
      return await this.getService().getSBT(ownerPubkey, level);
    } catch (error) {
      console.error('[SolanaSBTManager] 获取SBT详情失败:', error);
      return null;
    }
  }

  /**
   * 检查程序是否已初始化
   * @returns 是否已初始化
   */
  static async isProgramInitialized(): Promise<boolean> {
    try {
      return await this.getService().isInitialized();
    } catch (error) {
      console.error('[SolanaSBTManager] 检查程序初始化状态失败:', error);
      return false;
    }
  }

  /**
   * 获取程序配置信息
   * @returns 配置信息
   */
  static async getProgramConfig(): Promise<{
    programId: string;
    network: string;
    isInitialized: boolean;
  }> {
    const service = this.getService();
    return {
      programId: service.getProgramId().toBase58(),
      network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
      isInitialized: await service.isInitialized()
    };
  }
}

/**
 * Solana SBT铸造辅助Hook（用于React组件）
 * 注意：实际交易发送需要使用钱包适配器
 */
export interface SolanaSBTMintResult {
  createTransaction: () => Promise<any>;
  metadataURI: string;
  estimatedFee: number;
  isReady: boolean;
  error: Error | null;
}

/**
 * 准备Solana SBT铸造（不在组件中）
 * 实际铸造交易发送需要在React组件中使用钱包完成
 */
export async function prepareSolanaSBTMint(
  walletAddress: string,
  level: number
): Promise<SolanaSBTMintResult> {
  try {
    const result = await SolanaSBTManager.createMintTransaction(
      walletAddress,
      level
    );

    return {
      createTransaction: async () => result.transaction,
      metadataURI: result.metadataURI,
      estimatedFee: result.fee,
      isReady: true,
      error: null
    };
  } catch (error) {
    return {
      createTransaction: async () => { throw error; },
      metadataURI: '',
      estimatedFee: 0,
      isReady: false,
      error: error as Error
    };
  }
}

/**
 * 格式化Solana地址
 * @param address 完整地址
 * @param length 前后保留字符数
 * @returns 格式化后的地址
 */
export function formatSolanaAddress(address: string, length: number = 4): string {
  if (!address || address.length < length * 2) {
    return address;
  }
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * 验证Solana地址
 * @param address 地址字符串
 * @returns 是否有效
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
