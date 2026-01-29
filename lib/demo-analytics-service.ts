/**
 * 数据分析服务
 * 提供内容数据和成就数据的统计分析
 */

import { db } from './db';
import { Reflection } from './db';
import { ContentAnalytics, AchievementAnalytics, UserWithStats, DemoUserProfile } from '@/types/demo-data';

/**
 * 数据分析服务
 */
export class DemoAnalyticsService {
  /**
   * 获取内容数据统计
   */
  async getContentAnalytics(): Promise<ContentAnalytics> {
    const allReflections = await db.reflections.toArray();

    if (allReflections.length === 0) {
      return this.getEmptyContentAnalytics();
    }

    return {
      totalCheckIns: allReflections.length,
      uniqueUsers: new Set(allReflections.map(r => r.walletAddress)).size,
      emotionDistribution: this.calculateEmotionDistribution(allReflections),
      keywordFrequency: this.calculateKeywordFrequency(allReflections),
      averageWordCount: this.calculateAverageWordCount(allReflections),
      meaningfulRate: this.calculateMeaningfulRate(allReflections),
      dailyTrend: this.calculateDailyTrend(allReflections),
      weeklyTrend: this.calculateWeeklyTrend(allReflections),
      monthlyTrend: this.calculateMonthlyTrend(allReflections),
    };
  }

  /**
   * 获取成就数据统计
   */
  async getAchievementAnalytics(): Promise<AchievementAnalytics> {
    const allAchievements = await db.userAchievements.toArray();
    const allReflections = await db.reflections.toArray();

    if (allAchievements.length === 0) {
      return this.getEmptyAchievementAnalytics();
    }

    const userStats = await this.calculateUserStats(allAchievements, allReflections);

    return {
      totalUsers: allAchievements.length,
      levelDistribution: this.calculateLevelDistribution(allAchievements),
      sbtClaimRate: this.calculateSBTClaimRate(allAchievements),
      averageLevel: this.calculateAverageLevel(allAchievements),
      averageCheckInDays: this.calculateAverageCheckInDays(allAchievements),
      topUsers: userStats.slice(0, 10),
      growthRate: 0, // TODO: 实现增长率计算
      newUsersThisWeek: 0, // TODO: 实现新增用户计算
      newUsersThisMonth: 0, // TODO: 实现新增用户计算
    };
  }

  /**
   * 计算用户统计信息
   */
  private async calculateUserStats(
    achievements: any[],
    reflections: Reflection[]
  ): Promise<UserWithStats[]> {
    const userMap = new Map<string, any>();

    // 初始化成就数据
    achievements.forEach(achievement => {
      userMap.set(achievement.walletAddress, {
        id: achievement.walletAddress,
        name: `用户${achievement.walletAddress.slice(0, 6)}`,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${achievement.walletAddress}`,
        joinDate: new Date(), // 默认值
        currentLevel: achievement.currentLevel,
        checkInDays: achievement.totalCheckInDays,
        totalReflections: 0,
        meaningfulCount: 0,
        lastActiveDate: new Date(0),
      });
    });

    // 添加反思数据统计
    reflections.forEach(reflection => {
      const user = userMap.get(reflection.walletAddress);
      if (user) {
        user.totalReflections++;
        if (reflection.isMeaningful) {
          user.meaningfulCount++;
        }
        const date = new Date(reflection.date);
        if (date > user.lastActiveDate) {
          user.lastActiveDate = date;
        }
      }
    });

    // 计算额外指标
    Array.from(userMap.values()).forEach(user => {
      user.meaningfulRate = user.totalReflections > 0
        ? (user.meaningfulCount / user.totalReflections) * 100
        : 0;

      // 获取用户最常用情绪
      const userReflections = reflections.filter(r => r.walletAddress === user.id);
      const emotionCounts = new Map<string, number>();
      userReflections.forEach(r => {
        const emotion = r.structuredData.emotion;
        emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
      });
      user.favoriteEmotion = Array.from(emotionCounts.entries())
        .sort((a, b) => b[1] - a[1])[0]?.[0] || '平静';

      // 获取常用关键词
      const keywordCounts = new Map<string, number>();
      userReflections.forEach(r => {
        r.structuredData.keywords.forEach(k => {
          keywordCounts.set(k, (keywordCounts.get(k) || 0) + 1);
        });
      });
      user.topKeywords = Array.from(keywordCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(e => e[0]);
    });

    return Array.from(userMap.values());
  }

  /**
   * 计算情绪分布
   */
  private calculateEmotionDistribution(reflections: Reflection[]): Record<string, number> {
    const distribution: Record<string, number> = {
      积极: 0,
      平静: 0,
      焦虑: 0,
      疲惫: 0,
    };

    reflections.forEach(r => {
      const emotion = r.structuredData.emotion;
      if (emotion in distribution) {
        distribution[emotion]++;
      }
    });

    // 转换为百分比
    const total = reflections.length;
    Object.keys(distribution).forEach(key => {
      distribution[key] = (distribution[key] / total) * 100;
    });

    return distribution;
  }

  /**
   * 计算关键词频率
   */
  private calculateKeywordFrequency(reflections: Reflection[]): Array<{ word: string; count: number }> {
    const frequency: Record<string, number> = {};

    reflections.forEach(r => {
      r.structuredData.keywords.forEach(keyword => {
        frequency[keyword] = (frequency[keyword] || 0) + 1;
      });
    });

    return Object.entries(frequency)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  }

  /**
   * 计算平均字数
   */
  private calculateAverageWordCount(reflections: Reflection[]): number {
    const totalWords = reflections.reduce((sum, r) => sum + r.rawContent.length, 0);
    return Math.round(totalWords / reflections.length);
  }

  /**
   * 计算有意义率
   */
  private calculateMeaningfulRate(reflections: Reflection[]): number {
    const meaningfulCount = reflections.filter(r => r.isMeaningful).length;
    return (meaningfulCount / reflections.length) * 100;
  }

  /**
   * 计算日趋势
   */
  private calculateDailyTrend(reflections: Reflection[]): Array<{ date: string; count: number }> {
    const dateMap = new Map<string, number>();

    reflections.forEach(r => {
      const count = dateMap.get(r.date) || 0;
      dateMap.set(r.date, count + 1);
    });

    return Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // 最近30天
  }

  /**
   * 计算周趋势
   */
  private calculateWeeklyTrend(reflections: Reflection[]): Array<{ week: string; count: number }> {
    const weekMap = new Map<string, number>();

    reflections.forEach(r => {
      const date = new Date(r.date);
      const weekKey = this.getWeekKey(date);
      const count = weekMap.get(weekKey) || 0;
      weekMap.set(weekKey, count + 1);
    });

    return Array.from(weekMap.entries())
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12); // 最近12周
  }

  /**
   * 计算月趋势
   */
  private calculateMonthlyTrend(reflections: Reflection[]): Array<{ month: string; count: number }> {
    const monthMap = new Map<string, number>();

    reflections.forEach(r => {
      const monthKey = r.date.substring(0, 7); // YYYY-MM
      const count = monthMap.get(monthKey) || 0;
      monthMap.set(monthKey, count + 1);
    });

    return Array.from(monthMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // 最近6个月
  }

  /**
   * 获取周key
   */
  private getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  /**
   * 获取周数
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * 计算等级分布
   */
  private calculateLevelDistribution(achievements: any[]): Record<number, number> {
    const distribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };

    achievements.forEach(a => {
      const level = a.currentLevel;
      if (level >= 1 && level <= 6) {
        distribution[level]++;
      }
    });

    return distribution;
  }

  /**
   * 计算SBT领取率
   */
  private calculateSBTClaimRate(achievements: any[]): number {
    if (achievements.length === 0) return 0;

    let totalPossibleClaims = 0;
    let totalActualClaims = 0;

    achievements.forEach(a => {
      const currentLevel = a.currentLevel;
      totalPossibleClaims += currentLevel;
      totalActualClaims += a.sbtClaimed.filter(Boolean).length;
    });

    return totalPossibleClaims > 0 ? (totalActualClaims / totalPossibleClaims) * 100 : 0;
  }

  /**
   * 计算平均等级
   */
  private calculateAverageLevel(achievements: any[]): number {
    if (achievements.length === 0) return 0;

    const sum = achievements.reduce((total, a) => total + a.currentLevel, 0);
    return Math.round((sum / achievements.length) * 10) / 10;
  }

  /**
   * 计算平均打卡天数
   */
  private calculateAverageCheckInDays(achievements: any[]): number {
    if (achievements.length === 0) return 0;

    const sum = achievements.reduce((total, a) => total + a.totalCheckInDays, 0);
    return Math.round(sum / achievements.length);
  }

  /**
   * 获取空的内容分析
   */
  private getEmptyContentAnalytics(): ContentAnalytics {
    return {
      totalCheckIns: 0,
      uniqueUsers: 0,
      emotionDistribution: { 积极: 0, 平静: 0, 焦虑: 0, 疲惫: 0 },
      keywordFrequency: [],
      averageWordCount: 0,
      meaningfulRate: 0,
      dailyTrend: [],
      weeklyTrend: [],
      monthlyTrend: [],
    };
  }

  /**
   * 获取空的成就分析
   */
  private getEmptyAchievementAnalytics(): AchievementAnalytics {
    return {
      totalUsers: 0,
      levelDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      sbtClaimRate: 0,
      averageLevel: 0,
      averageCheckInDays: 0,
      topUsers: [],
      growthRate: 0,
      newUsersThisWeek: 0,
      newUsersThisMonth: 0,
    };
  }
}

/**
 * 单例实例
 */
export const demoAnalyticsService = new DemoAnalyticsService();
