/**
 * 问卷流程服务
 * 管理用户问卷流程的状态和数据
 */

import { GoalsService } from './db-goals';
import type {
  WealthGoal,
  HealthGoal,
  FamilyGoal,
  OtherGoal,
} from './db';

/**
 * 问卷步骤类型
 */
export type OnboardingStep =
  | 'welcome'
  | 'wealth'
  | 'health'
  | 'family'
  | 'other'
  | 'confirm';

/**
 * 问卷数据结构
 */
export interface OnboardingData {
  /** 当前步骤 */
  currentStep: OnboardingStep;
  /** 财富目标 */
  wealthGoals: WealthGoal;
  /** 健康目标 */
  healthGoals: HealthGoal;
  /** 家庭目标 */
  familyGoals: FamilyGoal;
  /** 其他目标 */
  otherGoals: OtherGoal;
}

/**
 * 默认问卷数据
 */
export const defaultOnboardingData: OnboardingData = {
  currentStep: 'welcome',
  wealthGoals: {
    monthlyIncome: '',
    savings: '',
    investmentReturn: '',
  },
  healthGoals: {
    exerciseFrequency: '',
    weightManagement: '',
    sleepQuality: '',
  },
  familyGoals: {
    familyTime: '',
    parentChildRelationship: '',
    partnerRelationship: '',
  },
  otherGoals: {
    learningGoals: [],
    socialGoals: [],
    hobbies: [],
  },
};

/**
 * 财富目标选项
 */
export const WEALTH_INCOME_OPTIONS = [
  { value: '1万', label: '月入1万' },
  { value: '3万', label: '月入3万' },
  { value: '5万', label: '月入5万' },
  { value: '10万+', label: '月入10万+' },
];

export const WEALTH_SAVINGS_OPTIONS = [
  { value: '10万', label: '存款10万' },
  { value: '50万', label: '存款50万' },
  { value: '100万', label: '存款100万' },
  { value: '500万+', label: '存款500万+' },
];

export const WEALTH_INVESTMENT_OPTIONS = [
  { value: '稳健增值', label: '稳健增值（年化5-10%）' },
  { value: '平衡增长', label: '平衡增长（年化10-20%）' },
  { value: '激进成长', label: '激进成长（年化20%以上）' },
];

/**
 * 健康目标选项
 */
export const HEALTH_EXERCISE_OPTIONS = [
  { value: '每周1次', label: '每周运动1次' },
  { value: '每周3次', label: '每周运动3次' },
  { value: '每周5次', label: '每周运动5次' },
  { value: '每天', label: '每天运动' },
];

export const HEALTH_WEIGHT_OPTIONS = [
  { value: '减重', label: '减重5-10公斤' },
  { value: '维持', label: '维持当前体重' },
  { value: '增肌', label: '增肌塑形' },
];

export const HEALTH_SLEEP_OPTIONS = [
  { value: '6小时', label: '每天6小时' },
  { value: '7小时', label: '每天7小时' },
  { value: '8小时+', label: '每天8小时以上' },
];

/**
 * 家庭目标选项
 */
export const FAMILY_TIME_OPTIONS = [
  { value: '每天1小时', label: '每天陪伴1小时' },
  { value: '每天2小时', label: '每天陪伴2小时' },
  { value: '周末', label: '周末高质量陪伴' },
];

export const FAMILY_RELATIONSHIP_OPTIONS = [
  { value: '增进沟通', label: '增加日常沟通' },
  { value: '共同活动', label: '组织家庭活动' },
  { value: '深度交流', label: '深度思想交流' },
];

/**
 * 其他目标选项
 */
export const OTHER_LEARNING_OPTIONS = [
  { value: '读书', label: '📚 阅读' },
  { value: '课程', label: '🎓 在线课程' },
  { value: '技能', label: '💼 新技能' },
  { value: '语言', label: '🌍 外语学习' },
];

export const OTHER_SOCIAL_OPTIONS = [
  { value: '扩展人脉', label: '扩展职业人脉' },
  { value: '深度社交', label: '维护核心朋友圈' },
  { value: '社区参与', label: '参与社区活动' },
];

export const OTHER_HOBBY_OPTIONS = [
  { value: '运动', label: '🏃 运动' },
  { value: '音乐', label: '🎵 音乐' },
  { value: '绘画', label: '🎨 绘画' },
  { value: '写作', label: '✍️ 写作' },
  { value: '旅行', label: '✈️ 旅行' },
  { value: '摄影', label: '📷 摄影' },
];

/**
 * 问卷服务类
 */
export class OnboardingService {
  /**
   * 保存问卷数据
   * @param walletAddress 钱包地址
   * @param data 问卷数据
   */
  static async saveOnboardingData(
    walletAddress: string,
    data: OnboardingData
  ): Promise<void> {
    try {
      await GoalsService.updateGoals(walletAddress, {
        wealthGoals: data.wealthGoals,
        healthGoals: data.healthGoals,
        familyGoals: data.familyGoals,
        otherGoals: data.otherGoals,
      });
      console.log('[OnboardingService] 问卷数据已保存');
    } catch (error) {
      console.error('[OnboardingService] 保存失败:', error);
      throw error;
    }
  }

  /**
   * 检查用户是否完成问卷
   * @param walletAddress 钱包地址
   */
  static async hasCompletedOnboarding(walletAddress: string): Promise<boolean> {
    return GoalsService.hasCompletedOnboarding(walletAddress);
  }

  /**
   * 验证问卷数据是否完整
   * @param data 问卷数据
   */
  static validateOnboardingData(data: OnboardingData): boolean {
    const { wealthGoals, healthGoals, familyGoals, otherGoals } = data;

    // 验证财富目标
    if (!wealthGoals.monthlyIncome || !wealthGoals.savings || !wealthGoals.investmentReturn) {
      return false;
    }

    // 验证健康目标
    if (!healthGoals.exerciseFrequency || !healthGoals.weightManagement || !healthGoals.sleepQuality) {
      return false;
    }

    // 验证家庭目标
    if (!familyGoals.familyTime || !familyGoals.parentChildRelationship || !familyGoals.partnerRelationship) {
      return false;
    }

    // 验证其他目标（至少选择一项）
    if (
      otherGoals.learningGoals.length === 0 &&
      otherGoals.socialGoals.length === 0 &&
      otherGoals.hobbies.length === 0
    ) {
      return false;
    }

    return true;
  }
}
