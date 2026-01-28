/**
 * 成就系统数据库操作封装
 * 提供对UserAchievement和CheckInRecord表的CRUD操作
 */

import { db, UserAchievement, CheckInRecord } from './db';

/**
 * 成就数据库操作类
 */
export class AchievementDB {
  /**
   * 获取或创建用户成就记录
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 用户成就记录
   */
  static async getOrCreateUserAchievement(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<UserAchievement> {
    const existing = await db.userAchievements
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .first();

    if (existing) {
      return existing;
    }

    // 创建新记录
    const id = await db.userAchievements.add({
      walletAddress,
      chain,
      currentLevel: 1,
      totalCheckInDays: 0,
      sbtClaimed: [false, false, false, false, false, false],
      lastUpdated: new Date()
    });

    return (await db.userAchievements.get(id))!;
  }

  /**
   * 获取用户成就记录
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 用户成就记录，不存在返回null
   */
  static async getUserAchievement(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<UserAchievement | null> {
    const achievement = await db.userAchievements
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .first();

    return achievement || null;
  }

  /**
   * 更新用户成就
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param updates 要更新的字段
   */
  static async updateUserAchievement(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    updates: Partial<Pick<UserAchievement, 'currentLevel' | 'totalCheckInDays' | 'sbtClaimed'>>
  ): Promise<void> {
    await db.userAchievements
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .modify({
        ...updates,
        lastUpdated: new Date()
      });
  }

  /**
   * 添加打卡记录
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param checkInDate 打卡日期 YYYY-MM-DD
   * @param levelAtTime 打卡时的等级
   * @returns 新记录的ID
   */
  static async addCheckInRecord(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    checkInDate: string,
    levelAtTime: number
  ): Promise<number> {
    return await db.checkInRecords.add({
      walletAddress,
      chain,
      checkInDate,
      levelAtTime,
      timestamp: new Date()
    });
  }

  /**
   * 检查今天是否已打卡
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 是否已打卡
   */
  static async hasCheckedInToday(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];

    const record = await db.checkInRecords
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .and(record => record.checkInDate === today)
      .first();

    return !!record;
  }

  /**
   * 获取打卡历史（最近N条）
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param limit 返回条数
   * @returns 打卡记录列表
   */
  static async getRecentCheckIns(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    limit: number = 30
  ): Promise<CheckInRecord[]> {
    return await db.checkInRecords
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .reverse()  // 最新的在前
      .limit(limit)
      .toArray();
  }

  /**
   * 获取总打卡天数
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 总打卡天数
   */
  static async getTotalCheckInDays(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<number> {
    const achievement = await this.getOrCreateUserAchievement(walletAddress, chain);
    return achievement.totalCheckInDays;
  }

  /**
   * 标记SBT已领取
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级编号
   */
  static async markSBTClaimed(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<void> {
    const achievement = await this.getOrCreateUserAchievement(walletAddress, chain);

    // level 1对应索引0
    achievement.sbtClaimed[level - 1] = true;

    await db.userAchievements.update(achievement.id!, {
      sbtClaimed: achievement.sbtClaimed,
      lastUpdated: new Date()
    });
  }

  /**
   * 检查SBT是否已领取
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @param level 等级编号
   * @returns 是否已领取
   */
  static async isSBTClaimed(
    walletAddress: string,
    chain: 'bnb' | 'solana',
    level: number
  ): Promise<boolean> {
    const achievement = await this.getOrCreateUserAchievement(walletAddress, chain);
    return achievement.sbtClaimed[level - 1] || false;
  }

  /**
   * 获取已领取的SBT列表
   * @param walletAddress 钱包地址
   * @param chain 链类型
   * @returns 已领取的等级列表
   */
  static async getClaimedLevels(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<number[]> {
    const achievement = await this.getOrCreateUserAchievement(walletAddress, chain);
    
    return achievement.sbtClaimed
      .map((claimed, index) => claimed ? index + 1 : -1)
      .filter(level => level > 0);
  }

  /**
   * 清空所有成就数据（用于测试或重置）
   */
  static async clearAll(): Promise<void> {
    await db.userAchievements.clear();
    await db.checkInRecords.clear();
  }

  /**
   * 获取所有用户成就（管理员功能）
   * @returns 所有用户成就记录
   */
  static async getAllAchievements(): Promise<UserAchievement[]> {
    return await db.userAchievements.toArray();
  }

  /**
   * 删除用户成就数据
   * @param walletAddress 钱包地址
   * @param chain 链类型
   */
  static async deleteUserAchievement(
    walletAddress: string,
    chain: 'bnb' | 'solana'
  ): Promise<void> {
    await db.userAchievements
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .delete();
    
    await db.checkInRecords
      .where(['walletAddress+chain'])
      .equals([walletAddress, chain])
      .delete();
  }
}
