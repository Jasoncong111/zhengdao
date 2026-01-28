/**
 * 数据库操作单元测试示例
 * 测试IndexedDB操作
 */

import {
  initDB,
  getUserAchievement,
  saveUserAchievement,
  updateUserAchievement,
  deleteUserAchievement,
} from '@/lib/db-achievement';

describe('Database Unit Tests', () => {
  beforeEach(async () => {
    // 每个测试前清空数据库
    await clearAllDatabases();
  });

  afterEach(async () => {
    // 每个测试后清空数据库
    await clearAllDatabases();
  });

  describe('initDB', () => {
    it('应该成功初始化数据库', async () => {
      const db = await initDB();
      expect(db).toBeDefined();
      expect(db.name).toBe('ZhengDaoDB');
    });

    it('应该创建achievements表', async () => {
      const db = await initDB();
      const tx = db.transaction('achievements', 'readonly');
      expect(tx).toBeDefined();
    });

    it('重复初始化应该返回同一个实例', async () => {
      const db1 = await initDB();
      const db2 = await initDB();
      expect(db1).toBe(db2);
    });
  });

  describe('getUserAchievement', () => {
    it('应该返回用户的成就数据', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 2,
        currentDays: 15,
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result).toBeDefined();
      expect(result?.currentLevel).toBe(2);
      expect(result?.currentDays).toBe(15);
    });

    it('不存在的用户应该返回null', async () => {
      const result = await getUserAchievement('nonexistent', 'bnb');
      expect(result).toBeNull();
    });

    it('应该支持查询不同链的数据', async () => {
      const bnbData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 2,
        currentDays: 15,
      };

      const solanaData = {
        walletAddress: '0x1234567890',
        chain: 'solana',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(bnbData);
      await saveUserAchievement(solanaData);

      const bnbResult = await getUserAchievement('0x1234567890', 'bnb');
      const solanaResult = await getUserAchievement('0x1234567890', 'solana');

      expect(bnbResult?.currentLevel).toBe(2);
      expect(solanaResult?.currentLevel).toBe(1);
    });
  });

  describe('saveUserAchievement', () => {
    it('应该保存新用户的成就数据', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
        consecutiveDays: 7,
        totalReflections: 7,
        claimedLevels: [],
        sbtTokenIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result).toBeDefined();
      expect(result?.currentLevel).toBe(1);
      expect(result?.currentDays).toBe(7);
    });

    it('应该自动生成创建时间和更新时间', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.updatedAt).toBeInstanceOf(Date);
    });

    it('应该处理保存失败的情况', async () => {
      // Mock一个会失败的情况
      const invalidData = {
        walletAddress: '', // 无效的地址
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await expect(
        saveUserAchievement(invalidData as any)
      ).rejects.toThrow();
    });
  });

  describe('updateUserAchievement', () => {
    it('应该更新已存在的用户数据', async () => {
      const initialData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(initialData);

      const updatedData = {
        ...initialData,
        currentLevel: 2,
        currentDays: 15,
      };

      await updateUserAchievement('0x1234567890', 'bnb', updatedData);

      const result = await getUserAchievement('0x1234567890', 'bnb');
      expect(result?.currentLevel).toBe(2);
      expect(result?.currentDays).toBe(15);
    });

    it('应该更新updatedAt时间戳', async () => {
      const initialData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(initialData);

      // 等待一毫秒确保时间戳不同
      await new Promise((resolve) => setTimeout(resolve, 1));

      const updatedData = {
        currentLevel: 2,
        currentDays: 15,
      };

      await updateUserAchievement('0x1234567890', 'bnb', updatedData);

      const result = await getUserAchievement('0x1234567890', 'bnb');
      expect(result?.updatedAt.getTime()).toBeGreaterThan(
        result?.createdAt.getTime() || 0
      );
    });

    it('更新不存在的用户应该创建新记录', async () => {
      const newData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await updateUserAchievement('0x1234567890', 'bnb', newData);

      const result = await getUserAchievement('0x1234567890', 'bnb');
      expect(result).toBeDefined();
      expect(result?.currentLevel).toBe(1);
    });
  });

  describe('deleteUserAchievement', () => {
    it('应该删除指定用户的数据', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(mockData);
      let result = await getUserAchievement('0x1234567890', 'bnb');
      expect(result).toBeDefined();

      await deleteUserAchievement('0x1234567890', 'bnb');
      result = await getUserAchievement('0x1234567890', 'bnb');
      expect(result).toBeNull();
    });

    it('删除不存在的数据不应该报错', async () => {
      await expect(
        deleteUserAchievement('nonexistent', 'bnb')
      ).resolves.not.toThrow();
    });
  });

  describe('边界条件', () => {
    it('应该处理特殊字符的钱包地址', async () => {
      const specialAddress = '0xABC...123';
      const mockData = {
        walletAddress: specialAddress,
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement(specialAddress, 'bnb');

      expect(result).toBeDefined();
    });

    it('应该处理大数值的天数', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 6,
        currentDays: 1000, // 超过365天
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result?.currentDays).toBe(1000);
    });

    it('应该处理空的claimedLevels数组', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
        claimedLevels: [],
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result?.claimedLevels).toEqual([]);
    });

    it('应该处理完整的claimedLevels数组', async () => {
      const mockData = {
        walletAddress: '0x1234567890',
        chain: 'bnb',
        currentLevel: 6,
        currentDays: 365,
        claimedLevels: [1, 2, 3, 4, 5, 6],
      };

      await saveUserAchievement(mockData);
      const result = await getUserAchievement('0x1234567890', 'bnb');

      expect(result?.claimedLevels).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });
});

// 辅助函数
async function clearAllDatabases(): Promise<void> {
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.map((db) => {
      if (db.name) {
        return new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase(db.name);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
      return Promise.resolve();
    })
  );
}
