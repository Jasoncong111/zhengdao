/**
 * 成就系统核心定义
 * 定义6个等级的成就体系
 */

/**
 * 成就等级接口
 */
export interface AchievementLevel {
  /** 等级编号 1-6 */
  level: number;
  /** 中文称号 */
  title: string;
  /** 英文称号 */
  titleEn: string;
  /** 需要打卡的天数 */
  requiredDays: number;
  /** 图标名称 */
  icon: string;
  /** 主色调 */
  primaryColor: string;
  /** 辅助色 */
  secondaryColor: string;
  /** 关键词 */
  keywords: string[];
  /** 奖励加成百分比 */
  rewardBonus: number;
  /** 等级描述 */
  description: string;
}

/**
 * 6个成就等级定义
 */
export const ACHIEVEMENT_LEVELS: AchievementLevel[] = [
  {
    level: 1,
    title: "十一路奋斗者",
    titleEn: "BEGINNER",
    requiredDays: 1,
    icon: "walking",
    primaryColor: "#6B7280",
    secondaryColor: "#FFFFFF",
    keywords: ["坚持", "起步"],
    rewardBonus: 0,
    description: "开始你的证道之旅，完成首次打卡"
  },
  {
    level: 2,
    title: "笃行者",
    titleEn: "DEDICATED",
    requiredDays: 30,
    icon: "hiking",
    primaryColor: "#3B82F6",
    secondaryColor: "#DBEAFE",
    keywords: ["稳定", "进步"],
    rewardBonus: 5,
    description: "持续精进，连续打卡30天"
  },
  {
    level: 3,
    title: "持久力王者",
    titleEn: "PERSISTENT",
    requiredDays: 100,
    icon: "mountain",
    primaryColor: "#10B981",
    secondaryColor: "#D1FAE5",
    keywords: ["毅力", "突破"],
    rewardBonus: 10,
    description: "百里挑一，连续打卡100天"
  },
  {
    level: 4,
    title: "百里挑一",
    titleEn: "ELITE",
    requiredDays: 365,
    icon: "trophy",
    primaryColor: "#F59E0B",
    secondaryColor: "#FEF3C7",
    keywords: ["精英", "卓越"],
    rewardBonus: 20,
    description: "一年坚守，连续打卡365天"
  },
  {
    level: 5,
    title: "千里挑一",
    titleEn: "LEGEND",
    requiredDays: 1000,
    icon: "crown",
    primaryColor: "#8B5CF6",
    secondaryColor: "#EDE9FE",
    keywords: ["传奇", "不朽"],
    rewardBonus: 30,
    description: "千日不辍，连续打卡1000天"
  },
  {
    level: 6,
    title: "证道成圣",
    titleEn: "ENLIGHTENED",
    requiredDays: 3650,
    icon: "sparkles",
    primaryColor: "#EC4899",
    secondaryColor: "#FCE7F3",
    keywords: ["成圣", "永恒"],
    rewardBonus: 50,
    description: "十年如一日，连续打卡3650天（10年）"
  }
];

/**
 * 根据打卡天数获取当前等级
 * @param days 总打卡天数
 * @returns 对应的成就等级
 */
export function getLevelByDays(days: number): AchievementLevel {
  // 从高到低检查
  for (let i = ACHIEVEMENT_LEVELS.length - 1; i >= 0; i--) {
    if (days >= ACHIEVEMENT_LEVELS[i].requiredDays) {
      return ACHIEVEMENT_LEVELS[i];
    }
  }
  // 默认返回最低等级（即使0天也算level 1，只是未达成）
  return ACHIEVEMENT_LEVELS[0];
}

/**
 * 获取下一等级
 * @param currentLevel 当前等级编号
 * @returns 下一等级，如果已是最高级返回null
 */
export function getNextLevel(currentLevel: number): AchievementLevel | null {
  const nextLevel = ACHIEVEMENT_LEVELS.find(l => l.level === currentLevel + 1);
  return nextLevel || null;
}

/**
 * 计算距离下一等级还需要多少天
 * @param currentDays 当前总打卡天数
 * @returns 还需要的天数（已达到最高级返回0）
 */
export function getDaysToNextLevel(currentDays: number): number {
  const currentLevel = getLevelByDays(currentDays);
  const nextLevel = getNextLevel(currentLevel.level);

  if (!nextLevel) {
    return 0; // 已达最高级
  }

  return nextLevel.requiredDays - currentDays;
}

/**
 * 计算到目标等级的进度百分比
 * @param currentDays 当前总打卡天数
 * @param targetLevel 目标等级编号
 * @returns 进度百分比 (0-100)
 */
export function calculateProgress(currentDays: number, targetLevel: number): number {
  const level = ACHIEVEMENT_LEVELS.find(l => l.level === targetLevel);
  if (!level) return 0;

  // 获取上一级
  const prevLevel = ACHIEVEMENT_LEVELS.find(l => l.level === targetLevel - 1);
  const prevRequiredDays = prevLevel ? prevLevel.requiredDays : 0;

  // 计算范围
  const range = level.requiredDays - prevRequiredDays;
  if (range === 0) return 100; // 避免除零

  // 计算进度
  const progress = currentDays - prevRequiredDays;
  const percentage = (progress / range) * 100;

  return Math.min(100, Math.max(0, percentage));
}

/**
 * 计算当前等级的进度百分比
 * @param currentDays 当前总打卡天数
 * @returns 当前进度百分比 (0-100)
 */
export function calculateCurrentLevelProgress(currentDays: number): number {
  const currentLevel = getLevelByDays(currentDays);
  return calculateProgress(currentDays, currentLevel.level);
}

/**
 * 检查是否达成某个等级
 * @param days 总打卡天数
 * @param level 要检查的等级
 * @returns 是否达成
 */
export function hasAchievedLevel(days: number, level: number): boolean {
  const levelInfo = ACHIEVEMENT_LEVELS.find(l => l.level === level);
  if (!levelInfo) return false;

  return days >= levelInfo.requiredDays;
}

/**
 * 获取已解锁的所有等级
 * @param days 总打卡天数
 * @returns 已解锁的等级列表
 */
export function getUnlockedLevels(days: number): AchievementLevel[] {
  return ACHIEVEMENT_LEVELS.filter(level => days >= level.requiredDays);
}

/**
 * 获取下一个可领取的等级
 * @param days 总打卡天数
 * @param claimedLevels 已领取的等级集合
 * @returns 下一个可领取的等级，如果没有返回null
 */
export function getNextClaimableLevel(
  days: number,
  claimedLevels: Set<number>
): AchievementLevel | null {
  const unlockedLevels = getUnlockedLevels(days);

  for (const level of unlockedLevels) {
    if (!claimedLevels.has(level.level)) {
      return level;
    }
  }

  return null;
}

/**
 * 图标映射表
 * 将图标名称映射到 emoji 图标
 */
const ICON_MAP: Record<string, string> = {
  walking: '🚶',
  running: '🏃',
  cycling: '🚴',
  climbing: '🧗',
  flying: '🦅',
  meditation: '🧘'
};

/**
 * 获取等级图标
 * @param iconName 图标名称
 * @returns 对应的 emoji 图标
 */
export function getLevelIcon(iconName: string): string {
  return ICON_MAP[iconName] || '🎖️';
}

/**
 * 获取等级SBT图片URL
 * @param level 等级编号 (1-6)
 * @returns 对应的SBT图片路径
 */
export function getLevelSBTImage(level: number): string {
  const validLevels = [1, 2, 3, 4, 5, 6];
  if (validLevels.includes(level)) {
    return `/sbt-levels/level-${level}.png`;
  }
  // 默认返回 level-1 图片
  return `/sbt-levels/level-1.png`;
}
