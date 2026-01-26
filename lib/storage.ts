/**
 * 反思数据存储服务
 * 封装所有数据库 CRUD 操作
 */

import { db, Reflection, MonthlyStats, handleDBError } from './db';

/**
 * 反思服务类
 * 提供所有反思数据的CRUD操作
 */
export class ReflectionService {
  /**
   * 保存反思数据
   * @param data 反思数据
   * @returns 新增记录的ID
   */
  static async saveReflection(data: Omit<Reflection, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    try {
      const now = new Date();
      const reflection: Reflection = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const id = await db.reflections.add(reflection);
      console.log('[Storage] 反思已保存:', id);
      return id;
    } catch (error) {
      handleDBError(error, 'saveReflection');
    }
  }

  /**
   * 更新反思数据
   * @param id 记录ID
   * @param data 要更新的字段
   */
  static async updateReflection(id: number, data: Partial<Reflection>): Promise<void> {
    try {
      await db.reflections.update(id, {
        ...data,
        updatedAt: new Date(),
      });
      console.log('[Storage] 反思已更新:', id);
    } catch (error) {
      handleDBError(error, 'updateReflection');
    }
  }

  /**
   * 根据日期获取反思数据
   * @param date 日期 YYYY-MM-DD
   * @param walletAddress 钱包地址
   * @returns 反思数据或null
   */
  static async getReflectionByDate(date: string, walletAddress: string): Promise<Reflection | undefined> {
    try {
      const reflection = await db.reflections
        .where('[date+walletAddress]')
        .equals([date, walletAddress])
        .first();

      return reflection;
    } catch (error) {
      handleDBError(error, 'getReflectionByDate');
    }
  }

  /**
   * 根据ID获取反思数据
   * @param id 记录ID
   * @returns 反思数据或null
   */
  static async getReflectionById(id: number): Promise<Reflection | undefined> {
    try {
      return await db.reflections.get(id);
    } catch (error) {
      handleDBError(error, 'getReflectionById');
    }
  }

  /**
   * 获取指定月份的所有反思数据
   * @param year 年份
   * @param month 月份 (1-12)
   * @param walletAddress 钱包地址
   * @returns 反思数据数组
   */
  static async getReflectionsByMonth(
    year: number,
    month: number,
    walletAddress: string
  ): Promise<Reflection[]> {
    try {
      // 生成月份范围: 2024-01-01 到 2024-01-31
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

      const reflections = await db.reflections
        .where('walletAddress')
        .equals(walletAddress)
        .and((reflection) => reflection.date >= startDate && reflection.date <= endDate)
        .toArray();

      // 按日期排序
      return reflections.sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      handleDBError(error, 'getReflectionsByMonth');
    }
  }

  /**
   * 获取所有反思数据（按钱包地址）
   * @param walletAddress 钱包地址
   * @returns 所有反思数据
   */
  static async getAllReflections(walletAddress: string): Promise<Reflection[]> {
    try {
      return await db.reflections
        .where('walletAddress')
        .equals(walletAddress)
        .toArray();
    } catch (error) {
      handleDBError(error, 'getAllReflections');
    }
  }

  /**
   * 删除反思数据
   * @param id 记录ID
   */
  static async deleteReflection(id: number): Promise<void> {
    try {
      await db.reflections.delete(id);
      console.log('[Storage] 反思已删除:', id);
    } catch (error) {
      handleDBError(error, 'deleteReflection');
    }
  }

  /**
   * 获取月度统计数据
   * @param year 年份
   * @param month 月份 (1-12)
   * @param walletAddress 钱包地址
   * @returns 月度统计数据
   */
  static async getMonthlyStats(
    year: number,
    month: number,
    walletAddress: string
  ): Promise<MonthlyStats> {
    try {
      const reflections = await this.getReflectionsByMonth(year, month, walletAddress);

      // 计算本月总天数
      const totalDays = new Date(year, month, 0).getDate();
      const reflectionCount = reflections.length;
      const meaningfulCount = reflections.filter((r) => r.isMeaningful).length;
      const meaningfulRate = reflectionCount > 0 ? (meaningfulCount / reflectionCount) * 100 : 0;

      // 统计情绪分布
      const emotions: Record<string, number> = {};
      reflections.forEach((r) => {
        const emotion = r.structuredData.emotion || '未知';
        emotions[emotion] = (emotions[emotion] || 0) + 1;
      });

      // 统计关键词频率
      const keywords: Record<string, number> = {};
      reflections.forEach((r) => {
        r.structuredData.keywords.forEach((keyword) => {
          keywords[keyword] = (keywords[keyword] || 0) + 1;
        });
      });

      // 收集所有收获、损失、想法
      const allGains: string[] = [];
      const allLosses: string[] = [];
      const allIdeas: string[] = [];

      reflections.forEach((r) => {
        allGains.push(...r.structuredData.gains);
        allLosses.push(...r.structuredData.losses);
        allIdeas.push(...r.structuredData.ideas);
      });

      return {
        totalDays,
        reflectionCount,
        meaningfulCount,
        meaningfulRate: Math.round(meaningfulRate * 10) / 10, // 保留一位小数
        emotions,
        keywords,
        allGains,
        allLosses,
        allIdeas,
      };
    } catch (error) {
      handleDBError(error, 'getMonthlyStats');
    }
  }

  /**
   * 获取最近N条反思数据
   * @param walletAddress 钱包地址
   * @param limit 数量限制
   * @returns 最近N条反思数据
   */
  static async getRecentReflections(walletAddress: string, limit: number = 10): Promise<Reflection[]> {
    try {
      return await db.reflections
        .where('walletAddress')
        .equals(walletAddress)
        .reverse() // 最新的在前
        .limit(limit)
        .toArray();
    } catch (error) {
      handleDBError(error, 'getRecentReflections');
    }
  }

  /**
   * 检查今天是否已复盘
   * @param walletAddress 钱包地址
   * @returns 是否已复盘
   */
  static async hasReflectedToday(walletAddress: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const reflection = await this.getReflectionByDate(today, walletAddress);
      return !!reflection;
    } catch (error) {
      handleDBError(error, 'hasReflectedToday');
    }
  }

  /**
   * 清空所有反思数据（危险操作，仅用于测试）
   * @param walletAddress 钱包地址
   */
  static async clearAllReflections(walletAddress: string): Promise<void> {
    try {
      await db.reflections.where('walletAddress').equals(walletAddress).delete();
      console.log('[Storage] 所有反思数据已清空');
    } catch (error) {
      handleDBError(error, 'clearAllReflections');
    }
  }

  /**
   * 导出所有反思数据为JSON
   * @param walletAddress 钱包地址
   * @returns JSON字符串
   */
  static async exportToJson(walletAddress: string): Promise<string> {
    try {
      const reflections = await this.getAllReflections(walletAddress);
      return JSON.stringify(reflections, null, 2);
    } catch (error) {
      handleDBError(error, 'exportToJson');
    }
  }

  /**
   * 从JSON导入反思数据
   * @param jsonData JSON字符串
   * @param walletAddress 钱包地址（用于验证）
   * @returns 导入的记录数
   */
  static async importFromJson(jsonData: string, walletAddress: string): Promise<number> {
    try {
      const reflections: Reflection[] = JSON.parse(jsonData);

      // 验证所有数据都属于该钱包
      const validReflections = reflections.filter((r) => r.walletAddress === walletAddress);

      if (validReflections.length !== reflections.length) {
        console.warn('[Storage] 部分数据被过滤（钱包地址不匹配）');
      }

      // 批量添加
      let count = 0;
      for (const reflection of validReflections) {
        await db.reflections.add(reflection);
        count++;
      }

      console.log(`[Storage] 已导入 ${count} 条反思数据`);
      return count;
    } catch (error) {
      handleDBError(error, 'importFromJson');
    }
  }
}
