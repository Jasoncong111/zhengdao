/**
 * 个人主页服务
 * 提供个人主页数据聚合服务
 */

import { GoalsService } from './db-goals';
import { ReflectionService } from './storage';
import { CheckInService } from './check-in-service';
import type { LifeGoal } from './db';
import type { Reflection } from './db';

/**
 * 个人主页数据接口
 */
export interface ProfileData {
  /** 人生目标 */
  goals: LifeGoal | null;
  /** 最近打卡记录 */
  recentReflections: Reflection[];
  /** 总打卡天数 */
  totalCheckInDays: number;
  /** 有意义天数 */
  meaningfulDays: number;
  /** 有意义率 */
  meaningfulRate: number;
  /** 连续打卡天数 */
  currentStreak: number;
}

/**
 * 个人主页服务类
 */
export class ProfileService {
  /**
   * 获取个人主页全部数据
   * @param walletAddress 钱包地址
   */
  static async getProfileData(walletAddress: string): Promise<ProfileData> {
    try {
      // 并行获取数据
      const [goals, reflections, stats] = await Promise.all([
        GoalsService.getGoalsByWallet(walletAddress),
        ReflectionService.getRecentReflections(walletAddress, 30),
        CheckInService.getMeaningfulDaysStats(walletAddress),
      ]);

      // 计算连续打卡天数
      const currentStreak = await this.calculateCurrentStreak(walletAddress);

      return {
        goals: goals || null,
        recentReflections: reflections,
        totalCheckInDays: stats.total,
        meaningfulDays: stats.meaningful,
        meaningfulRate: stats.ratio,
        currentStreak,
      };
    } catch (error) {
      console.error('[ProfileService] 获取数据失败:', error);
      throw error;
    }
  }

  /**
   * 计算连续打卡天数
   * @param walletAddress 钱包地址
   */
  static async calculateCurrentStreak(walletAddress: string): Promise<number> {
    try {
      const reflections = await ReflectionService.getAllReflections(walletAddress);

      if (reflections.length === 0) return 0;

      // 按日期倒序排序
      const sortedReflections = reflections.sort((a, b) => b.date.localeCompare(a.date));

      // 从最近的打卡开始向前计算连续天数
      let streak = 0;
      let currentDate = new Date();

      for (const reflection of sortedReflections) {
        const reflectionDate = new Date(reflection.date);
        const diffDays = Math.floor(
          (currentDate.getTime() - reflectionDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        // 如果日期差超过1天，说明连续打卡中断
        if (diffDays > 1) {
          // 检查是否是今天（diffDays=0）或昨天（diffDays=1）
          if (diffDays > streak + 1) {
            break;
          }
        }

        streak++;
        currentDate = reflectionDate;
      }

      return streak;
    } catch (error) {
      console.error('[ProfileService] 计算连续打卡失败:', error);
      return 0;
    }
  }

  /**
   * 获取打卡统计摘要
   * @param walletAddress 钱包地址
   */
  static async getCheckInSummary(walletAddress: string) {
    try {
      const stats = await CheckInService.getMeaningfulDaysStats(walletAddress);
      const currentStreak = await this.calculateCurrentStreak(walletAddress);

      return {
        totalDays: stats.total,
        meaningfulDays: stats.meaningful,
        meaningfulRate: stats.ratio,
        currentStreak,
      };
    } catch (error) {
      console.error('[ProfileService] 获取统计摘要失败:', error);
      throw error;
    }
  }
}
