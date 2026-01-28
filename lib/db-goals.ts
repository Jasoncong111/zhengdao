/**
 * 人生目标数据库服务
 * 封装所有目标相关的数据库操作
 */

import { db, LifeGoal, handleDBError } from './db';

/**
 * 目标服务类
 * 提供所有人生目标数据的CRUD操作
 */
export class GoalsService {
  /**
   * 保存人生目标
   * @param data 目标数据
   * @returns 新增记录的ID
   */
  static async saveGoals(data: Omit<LifeGoal, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    try {
      const now = new Date();
      const goal: LifeGoal = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const id = await db.lifeGoals.add(goal);
      console.log('[GoalsService] 人生目标已保存:', id);
      return id;
    } catch (error) {
      handleDBError(error, 'saveGoals');
    }
  }

  /**
   * 更新人生目标
   * @param walletAddress 钱包地址
   * @param data 要更新的目标数据
   */
  static async updateGoals(
    walletAddress: string,
    data: Partial<Omit<LifeGoal, 'id' | 'walletAddress' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const existingGoal = await this.getGoalsByWallet(walletAddress);

      if (existingGoal) {
        await db.lifeGoals.update(existingGoal.id!, {
          ...data,
          updatedAt: new Date(),
        });
        console.log('[GoalsService] 人生目标已更新:', walletAddress);
      } else {
        // 如果不存在，则创建新的
        await this.saveGoals({
          walletAddress,
          wealthGoals: data.wealthGoals || {
            monthlyIncome: '',
            savings: '',
            investmentReturn: '',
          },
          healthGoals: data.healthGoals || {
            exerciseFrequency: '',
            weightManagement: '',
            sleepQuality: '',
          },
          familyGoals: data.familyGoals || {
            familyTime: '',
            parentChildRelationship: '',
            partnerRelationship: '',
          },
          otherGoals: data.otherGoals || {
            learningGoals: [],
            socialGoals: [],
            hobbies: [],
          },
        });
      }
    } catch (error) {
      handleDBError(error, 'updateGoals');
    }
  }

  /**
   * 根据钱包地址获取人生目标
   * @param walletAddress 钱包地址
   * @returns 人生目标数据或null
   */
  static async getGoalsByWallet(walletAddress: string): Promise<LifeGoal | undefined> {
    try {
      const goal = await db.lifeGoals.where('walletAddress').equals(walletAddress).first();
      return goal;
    } catch (error) {
      handleDBError(error, 'getGoalsByWallet');
    }
  }

  /**
   * 检查用户是否已完成问卷
   * @param walletAddress 钱包地址
   * @returns 是否已完成问卷
   */
  static async hasCompletedOnboarding(walletAddress: string): Promise<boolean> {
    try {
      const goal = await this.getGoalsByWallet(walletAddress);
      return !!goal;
    } catch (error) {
      handleDBError(error, 'hasCompletedOnboarding');
    }
  }

  /**
   * 删除人生目标
   * @param walletAddress 钱包地址
   */
  static async deleteGoals(walletAddress: string): Promise<void> {
    try {
      const goal = await this.getGoalsByWallet(walletAddress);
      if (goal) {
        await db.lifeGoals.delete(goal.id!);
        console.log('[GoalsService] 人生目标已删除:', walletAddress);
      }
    } catch (error) {
      handleDBError(error, 'deleteGoals');
    }
  }

  /**
   * 导出目标数据为JSON
   * @param walletAddress 钱包地址
   * @returns JSON字符串
   */
  static async exportToJson(walletAddress: string): Promise<string> {
    try {
      const goal = await this.getGoalsByWallet(walletAddress);
      if (!goal) {
        throw new Error('未找到目标数据');
      }
      return JSON.stringify(goal, null, 2);
    } catch (error) {
      handleDBError(error, 'exportToJson');
    }
  }

  /**
   * 从JSON导入目标数据
   * @param jsonData JSON字符串
   * @param walletAddress 钱包地址（用于验证）
   * @returns 导入的记录数
   */
  static async importFromJson(jsonData: string, walletAddress: string): Promise<number> {
    try {
      const goal: LifeGoal = JSON.parse(jsonData);

      // 验证数据属于该钱包
      if (goal.walletAddress !== walletAddress) {
        throw new Error('钱包地址不匹配');
      }

      // 删除旧数据（如果存在）
      await this.deleteGoals(walletAddress);

      // 添加新数据
      const id = await db.lifeGoals.add(goal);
      console.log('[GoalsService] 已导入目标数据:', id);
      return 1;
    } catch (error) {
      handleDBError(error, 'importFromJson');
    }
  }
}
