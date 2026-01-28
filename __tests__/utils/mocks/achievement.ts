/**
 * 成就系统 Mock
 * 用于测试成就系统相关功能
 */

import { ACHIEVEMENT_LEVELS } from '@/lib/achievement-system';

export const mockUserAchievement = {
  walletAddress: '0x1234567890123456789012345678901234567890',
  currentLevel: 2,
  currentDays: 15,
  consecutiveDays: 5,
  totalReflections: 15,
  claimedLevels: [1, 2],
  sbtTokenIds: [101, 102],
  chain: 'bnb',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-16'),
};

export const mockAchievementLevels = ACHIEVEMENT_LEVELS;

export const mockLevelProgress = {
  currentLevel: 2,
  currentDays: 15,
  nextLevel: 3,
  nextLevelDays: 30,
  progress: 50, // (15 / 30) * 100
  canClaim: false,
  canLevelUp: false,
};

export const mockCheckInHistory = [
  {
    date: '2024-01-16',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    level: 2,
    chain: 'bnb',
  },
  {
    date: '2024-01-15',
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    level: 2,
    chain: 'bnb',
  },
];

/**
 * 创建mock用户成就数据
 */
export function createMockUserAchievement(
  overrides?: Partial<typeof mockUserAchievement>
) {
  return {
    ...mockUserAchievement,
    ...overrides,
  };
}

/**
 * 创建mock等级进度
 */
export function createMockLevelProgress(
  currentDays: number,
  targetLevel: number
) {
  const currentLevelData = ACHIEVEMENT_LEVELS[targetLevel - 1];
  const nextLevelData = ACHIEVEMENT_LEVELS[targetLevel];

  return {
    currentLevel: targetLevel,
    currentDays,
    nextLevel: targetLevel < 6 ? targetLevel + 1 : 6,
    nextLevelDays: nextLevelData?.minDays || 0,
    progress: nextLevelData
      ? Math.min(100, (currentDays / nextLevelData.minDays) * 100)
      : 100,
    canClaim: currentLevelData
      ? currentDays >= currentLevelData.minDays
      : false,
    canLevelUp: false,
  };
}

/**
 * Mock AchievementService
 */
export const mockAchievementService = {
  getUserAchievement: jest.fn().mockResolvedValue(mockUserAchievement),
  saveReflection: jest.fn().mockResolvedValue({
    success: true,
    newLevel: 2,
    days: 15,
    progress: 50,
  }),
  checkCanClaim: jest.fn().mockResolvedValue(true),
  markAsClaimed: jest.fn().mockResolvedValue(true),
  getCheckInHistory: jest.fn().mockResolvedValue(mockCheckInHistory),
  getLevelProgress: jest.fn().mockResolvedValue(mockLevelProgress),
  resetUser: jest.fn().mockResolvedValue(true),
};

/**
 * 模拟用户达到某个等级
 */
export function mockUserReachesLevel(level: number) {
  const levelData = ACHIEVEMENT_LEVELS[level - 1];
  return createMockUserAchievement({
    currentLevel: level,
    currentDays: levelData.minDays,
    claimedLevels: Array.from({ length: level }, (_, i) => i + 1),
  });
}

/**
 * 模拟用户可以申领SBT
 */
export function mockUserCanClaim(level: number) {
  const levelData = ACHIEVEMENT_LEVELS[level - 1];
  return {
    ...mockUserAchievement,
    currentLevel: level,
    currentDays: levelData.minDays,
    claimedLevels: Array.from({ length: level - 1 }, (_, i) => i + 1),
  };
}

/**
 * 重置achievement mocks
 */
export function resetAchievementMocks() {
  mockAchievementService.getUserAchievement.mockReset();
  mockAchievementService.saveReflection.mockReset();
  mockAchievementService.checkCanClaim.mockReset();
  mockAchievementService.markAsClaimed.mockReset();
  mockAchievementService.getCheckInHistory.mockReset();
  mockAchievementService.getLevelProgress.mockReset();
  mockAchievementService.resetUser.mockReset();
}
