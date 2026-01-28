/**
 * 成就系统类型定义
 * 统一管理所有成就相关的TypeScript类型
 */

import { AchievementLevel } from '@/lib/achievement-system';

/**
 * 用户成就数据结构
 */
export interface UserAchievement {
  id?: number;
  /** 用户钱包地址 */
  walletAddress: string;
  /** 区块链 'bnb' | 'solana' */
  chain: 'bnb' | 'solana';
  /** 当前等级 */
  currentLevel: number;
  /** 总打卡天数 */
  totalCheckInDays: number;
  /** SBT领取状态 [false, true, false, ...] 索引0=level1 */
  sbtClaimed: boolean[];
  /** 最后更新时间 */
  lastUpdated: Date;
}

/**
 * 打卡记录数据结构
 */
export interface CheckInRecord {
  id?: number;
  /** 用户钱包地址 */
  walletAddress: string;
  /** 区块链 'bnb' | 'solana' */
  chain: 'bnb' | 'solana';
  /** 打卡日期 YYYY-MM-DD */
  checkInDate: string;
  /** 当时等级 */
  levelAtTime: number;
  /** 打卡时间戳 */
  timestamp: Date;
}

/**
 * 打卡统计数据结构
 */
export interface CheckInStats {
  /** 总打卡天数 */
  totalDays: number;
  /** 当前等级 */
  currentLevel: number;
  /** 当前等级信息 */
  currentLevelInfo: AchievementLevel;
  /** 下一等级（如果已是最高级则为null） */
  nextLevel: AchievementLevel | null;
  /** 距离下一等级还需要多少天 */
  daysToNextLevel: number;
  /** 当前进度百分比 */
  progress: number;
  /** 是否可以领取SBT */
  canClaimSBT: boolean;
  /** 可领取的等级列表 */
  claimableLevels: number[];
}

/**
 * 打卡结果数据结构
 */
export interface CheckInResult {
  /** 之前的等级 */
  previousLevel: number;
  /** 新的等级 */
  newLevel: number;
  /** 是否升级 */
  leveledUp: boolean;
  /** 打卡日期 */
  checkInDate: string;
}

/**
 * SBT数据结构
 */
export interface SBTItem {
  /** Token ID */
  tokenId: number;
  /** 等级 */
  level: number;
  /** 区块链 */
  chain: 'bnb' | 'solana';
  /** 标题 */
  title: string;
  /** 图像URL */
  image: string;
  /** 达成日期 */
  achievedDate: Date;
  /** 元数据 */
  metadata: SBTMetadata;
}

/**
 * SBT元数据结构
 */
export interface SBTMetadata {
  /** 名称 */
  name: string;
  /** 描述 */
  description: string;
  /** 外部URL */
  external_url?: string;
  /** 属性列表 */
  attributes: SBTAttribute[];
  /** 本地图像路径 */
  image?: string;
}

/**
 * SBT属性结构
 */
export interface SBTAttribute {
  /** 属性类型 */
  trait_type: string;
  /** 属性值 */
  value: string | number;
  /** 显示类型 */
  display_type?: 'number' | 'boost_number' | 'boost_percentage' | 'date';
  /** 最大值（用于进度条） */
  max_value?: number;
}

/**
 * 链类型
 */
export type ChainType = 'bnb' | 'solana';

/**
 * 等级编号（1-6）
 */
export type LevelNumber = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * SBT铸造状态
 */
export type MintStatus = 'idle' | 'confirming' | 'minting' | 'success' | 'error';

/**
 * SBT铸造请求参数
 */
export interface MintSBTRequest {
  /** 钱包地址 */
  walletAddress: string;
  /** 区块链 */
  chain: ChainType;
  /** 等级 */
  level: LevelNumber;
  /** 元数据URI */
  metadataURI?: string;
}

/**
 * SBT铸造结果
 */
export interface MintSBTResult {
  /** 是否成功 */
  success: boolean;
  /** 交易哈希 */
  txHash?: string;
  /** Token ID */
  tokenId?: number;
  /** 错误信息 */
  error?: string;
}

/**
 * 成就系统配置
 */
export interface AchievementConfig {
  /** 是否启用SBT */
  enableSBT: boolean;
  /** 是否启用IPFS */
  useIPFS: boolean;
  /** IPFS Gateway */
  ipfsGateway: string;
  /** BNB Chain合约地址 */
  bnbContractAddress?: `0x${string}`;
  /** Solana程序地址 */
  solanaProgramAddress?: string;
}
