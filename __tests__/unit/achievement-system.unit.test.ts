/**
 * 成就系统单元测试示例
 * 测试成就系统核心逻辑
 */

import { ACHIEVEMENT_LEVELS } from '@/lib/achievement-system';

describe('Achievement System Unit Tests', () => {
  describe('ACHIEVEMENT_LEVELS 常量', () => {
    it('应该有6个等级', () => {
      expect(ACHIEVEMENT_LEVELS).toHaveLength(6);
    });

    it('每个等级应该有正确的属性', () => {
      ACHIEVEMENT_LEVELS.forEach((level) => {
        expect(level).toHaveProperty('level');
        expect(level).toHaveProperty('name');
        expect(level).toHaveProperty('minDays');
        expect(level).toHaveProperty('description');
        expect(level).toHaveProperty('color');
      });
    });

    it('等级应该从1开始递增', () => {
      ACHIEVEMENT_LEVELS.forEach((level, index) => {
        expect(level.level).toBe(index + 1);
      });
    });

    it('每个等级的最小天数应该递增', () => {
      for (let i = 1; i < ACHIEVEMENT_LEVELS.length; i++) {
        expect(ACHIEVEMENT_LEVELS[i].minDays).toBeGreaterThan(
          ACHIEVEMENT_LEVELS[i - 1].minDays
        );
      }
    });

    it('Level 1应该要求7天', () => {
      expect(ACHIEVEMENT_LEVELS[0].level).toBe(1);
      expect(ACHIEVEMENT_LEVELS[0].minDays).toBe(7);
    });

    it('Level 6应该要求365天', () => {
      expect(ACHIEVEMENT_LEVELS[5].level).toBe(6);
      expect(ACHIEVEMENT_LEVELS[5].minDays).toBe(365);
    });
  });

  describe('等级计算逻辑', () => {
    it('0天应该是Level 0（未开始）', () => {
      const level = calculateLevel(0);
      expect(level).toBe(0);
    });

    it('6天应该是Level 0', () => {
      const level = calculateLevel(6);
      expect(level).toBe(0);
    });

    it('7天应该是Level 1', () => {
      const level = calculateLevel(7);
      expect(level).toBe(1);
    });

    it('29天应该是Level 1', () => {
      const level = calculateLevel(29);
      expect(level).toBe(1);
    });

    it('30天应该是Level 2', () => {
      const level = calculateLevel(30);
      expect(level).toBe(2);
    });

    it('90天应该是Level 3', () => {
      const level = calculateLevel(90);
      expect(level).toBe(3);
    });

    it('180天应该是Level 4', () => {
      const level = calculateLevel(180);
      expect(level).toBe(4);
    });

    it('270天应该是Level 5', () => {
      const level = calculateLevel(270);
      expect(level).toBe(5);
    });

    it('365天应该是Level 6', () => {
      const level = calculateLevel(365);
      expect(level).toBe(6);
    });

    it('400天应该是Level 6（最高等级）', () => {
      const level = calculateLevel(400);
      expect(level).toBe(6);
    });
  });

  describe('进度计算', () => {
    it('Level 1进度: 0天应该0%', () => {
      const progress = calculateProgress(0, 1);
      expect(progress).toBe(0);
    });

    it('Level 1进度: 7天应该100%', () => {
      const progress = calculateProgress(7, 1);
      expect(progress).toBe(100);
    });

    it('Level 1进度: 3天应该约43%', () => {
      const progress = calculateProgress(3, 1);
      expect(progress).toBeCloseTo(42.86, 1);
    });

    it('Level 2进度: 30天应该100%', () => {
      const progress = calculateProgress(30, 2);
      expect(progress).toBe(100);
    });

    it('Level 2进度: 15天应该50%', () => {
      const progress = calculateProgress(15, 2);
      expect(progress).toBe(50);
    });
  });

  describe('是否可以升级', () => {
    it('7天应该可以升级到Level 1', () => {
      const canLevelUp = checkCanLevelUp(7, 0);
      expect(canLevelUp).toBe(true);
    });

    it('6天不应该可以升级到Level 1', () => {
      const canLevelUp = checkCanLevelUp(6, 0);
      expect(canLevelUp).toBe(false);
    });

    it('30天应该可以升级到Level 2', () => {
      const canLevelUp = checkCanLevelUp(30, 1);
      expect(canLevelUp).toBe(true);
    });

    it('已经Level 6不应该再升级', () => {
      const canLevelUp = checkCanLevelUp(400, 6);
      expect(canLevelUp).toBe(false);
    });
  });

  describe('等级名称和描述', () => {
    it('Level 1: 初识证道', () => {
      const level1 = ACHIEVEMENT_LEVELS[0];
      expect(level1.name).toBe('初识证道');
    });

    it('Level 2: 渐入佳境', () => {
      const level2 = ACHIEVEMENT_LEVELS[1];
      expect(level2.name).toBe('渐入佳境');
    });

    it('Level 3: 笃行不怠', () => {
      const level3 = ACHIEVEMENT_LEVELS[2];
      expect(level3.name).toBe('笃行不怠');
    });

    it('Level 4: 精进不休', () => {
      const level4 = ACHIEVEMENT_LEVELS[3];
      expect(level4.name).toBe('精进不休');
    });

    it('Level 5: 证道有成', () => {
      const level5 = ACHIEVEMENT_LEVELS[4];
      expect(level5.name).toBe('证道有成');
    });

    it('Level 6: 证道大成', () => {
      const level6 = ACHIEVEMENT_LEVELS[5];
      expect(level6.name).toBe('证道大成');
    });
  });
});

// 辅助函数（这些函数应该在实际的achievement-system.ts中实现）
function calculateLevel(days: number): number {
  if (days < 7) return 0;
  if (days < 30) return 1;
  if (days < 90) return 2;
  if (days < 180) return 3;
  if (days < 270) return 4;
  if (days < 365) return 5;
  return 6;
}

function calculateProgress(days: number, targetLevel: number): number {
  const currentLevelData = ACHIEVEMENT_LEVELS[targetLevel - 2];
  const targetLevelData = ACHIEVEMENT_LEVELS[targetLevel - 1];

  if (!currentLevelData || !targetLevelData) return 0;

  const range = targetLevelData.minDays - currentLevelData.minDays;
  const progress = days - currentLevelData.minDays;

  return Math.min(100, Math.max(0, (progress / range) * 100));
}

function checkCanLevelUp(days: number, currentLevel: number): boolean {
  if (currentLevel >= 6) return false;
  const nextLevelData = ACHIEVEMENT_LEVELS[currentLevel];
  return days >= nextLevelData.minDays;
}
