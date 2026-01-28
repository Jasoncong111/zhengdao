/**
 * SBT铸造记录管理服务
 * 管理SBT铸造记录，确保一个等级只能铸造一次
 */

import { db } from './db';
import type { SBTMintRecord } from './db';
import { handleDBError } from './db';

export class SBTMintService {
  /**
   * 保存SBT铸造记录
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级
   * @param txHash 交易哈希
   * @param metadataURI metadata URI
   */
  static async saveMintRecord(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number,
    txHash: string,
    metadataURI: string
  ): Promise<number> {
    try {
      const record: Omit<SBTMintRecord, 'id'> = {
        walletAddress,
        chain,
        level,
        txHash,
        metadataURI,
        mintedAt: new Date(),
      };

      const id = await db.sbtMintRecords.add(record);
      console.log(`[SBTMint] 铸造记录已保存: Level ${level} on ${chain}`, id);
      return id;
    } catch (error) {
      handleDBError(error, 'saveMintRecord');
    }
  }

  /**
   * 检查某个等级是否已铸造
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns 是否已铸造
   */
  static async hasMinted(walletAddress: string, level: number): Promise<boolean> {
    try {
      const count = await db.sbtMintRecords
        .where('[walletAddress+level]')
        .equals([walletAddress, level])
        .count();

      return count > 0;
    } catch (error) {
      handleDBError(error, 'hasMinted');
    }
  }

  /**
   * 获取用户所有铸造记录
   * @param walletAddress 钱包地址
   * @returns 铸造记录列表
   */
  static async getUserMintRecords(walletAddress: string): Promise<SBTMintRecord[]> {
    try {
      return await db.sbtMintRecords
        .where('walletAddress')
        .equals(walletAddress)
        .toArray();
    } catch (error) {
      handleDBError(error, 'getUserMintRecords');
    }
  }

  /**
   * 获取用户在指定链上的铸造记录
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 铸造记录列表
   */
  static async getMintRecordsByChain(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<SBTMintRecord[]> {
    try {
      return await db.sbtMintRecords
        .where('[walletAddress+chain]')
        .equals([walletAddress, chain])
        .toArray();
    } catch (error) {
      handleDBError(error, 'getMintRecordsByChain');
    }
  }

  /**
   * 获取用户已铸造的等级列表
   * @param walletAddress 钱包地址
   * @returns 已铸造的等级数组
   */
  static async getMintedLevels(walletAddress: string): Promise<number[]> {
    try {
      const records = await db.sbtMintRecords
        .where('walletAddress')
        .equals(walletAddress)
        .toArray();

      const levels = records.map(r => r.level);
      // 去重
      return Array.from(new Set(levels));
    } catch (error) {
      handleDBError(error, 'getMintedLevels');
    }
  }

  /**
   * 检查用户是否可以在指定等级铸造
   * @param walletAddress 钱包地址
   * @param level 等级
   * @returns 是否可以铸造
   */
  static async canMint(walletAddress: string, level: number): Promise<boolean> {
    const hasMinted = await this.hasMinted(walletAddress, level);
    return !hasMinted;
  }
}
