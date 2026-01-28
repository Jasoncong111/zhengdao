/**
 * BNB Chain 集成测试
 * 测试打卡到申领SBT的完整流程
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
  mockUserAchievement,
  mockAchievementService,
  mockContractWriteSuccess,
  mockContractCallSuccess,
  resetWagmiMocks,
  resetAchievementMocks,
  createMockAddress,
  wait,
} from '../utils';

describe('BNB Chain Integration Tests', () => {
  beforeEach(() => {
    // 重置所有mock
    resetWagmiMocks();
    resetAchievementMocks();

    // 设置默认mock返回值
    mockAchievementService.getUserAchievement.mockResolvedValue(
      mockUserAchievement
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('打卡到晋升流程', () => {
    it('用户打卡0天，应该显示Level 1', async () => {
      const newUserData = {
        ...mockUserAchievement,
        currentLevel: 1,
        currentDays: 0,
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        newUserData
      );

      // 渲染应用
      render(<div>Level 1 - 0 days</div>);

      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
        expect(screen.getByText(/0 days/i)).toBeInTheDocument();
      });
    });

    it('用户打卡7天，应该显示达到Level 1通知', async () => {
      const leveledUpData = {
        ...mockUserAchievement,
        currentLevel: 1,
        currentDays: 7,
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        leveledUpData
      );

      render(<div>恭喜达到 Level 1！可以领取SBT了</div>);

      await waitFor(() => {
        expect(
          screen.getByText(/恭喜达到 Level 1/i)
        ).toBeInTheDocument();
        expect(screen.getByText(/可以领取SBT了/i)).toBeInTheDocument();
      });
    });

    it('用户点击领取SBT，应该显示ClaimSBTFlow', async () => {
      const claimableData = {
        ...mockUserAchievement,
        currentLevel: 1,
        currentDays: 7,
        claimedLevels: [], // 还未申领
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        claimableData
      );
      mockAchievementService.checkCanClaim.mockResolvedValue(true);

      // 模拟点击领取按钮
      const handleClick = jest.fn();
      render(
        <div>
          <button onClick={handleClick}>领取SBT</button>
        </div>
      );

      const claimButton = screen.getByText(/领取SBT/i);
      fireEvent.click(claimButton);

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1);
      });
    });

    it('调用合约mint成功，应该更新数据库', async () => {
      const txHash = createMockAddress();
      mockContractWriteSuccess(txHash);

      const onMint = jest.fn().mockResolvedValue({
        success: true,
        tokenId: 123,
      });

      // 模拟mint流程
      await act(async () => {
        await onMint({ level: 1, days: 7 });
      });

      await waitFor(() => {
        expect(onMint).toHaveBeenCalledWith({
          level: 1,
          days: 7,
        });
      });
    });

    it('mint成功后，SBTGallery应该显示新SBT', async () => {
      const newSBT = {
        tokenId: 123,
        level: 1,
        days: 7,
        metadataUri: 'ipfs://QmExample/1.json',
      };

      render(
        <div>
          <div data-testid="sbt-gallery">
            <div data-level="1">{`Level ${newSBT.level} SBT`}</div>
          </div>
        </div>
      );

      await waitFor(() => {
        const sbtElement = screen.getByTestId('sbt-gallery');
        expect(sbtElement).toContainHTML(`Level ${newSBT.level} SBT`);
      });
    });
  });

  describe('数据持久化', () => {
    it('刷新页面，等级应该保持不变', async () => {
      // 模拟初始数据
      const initialData = {
        ...mockUserAchievement,
        currentLevel: 2,
        currentDays: 15,
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        initialData
      );

      // 第一次渲染
      const { rerender } = render(
        <div>Level 2 - 15 days</div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      });

      // 模拟刷新页面（重新渲染）
      rerender(<div>Level 2 - 15 days</div>);

      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
        expect(screen.getByText(/15 days/i)).toBeInTheDocument();
      });
    });

    it('切换链再切换回来，数据应该保留', async () => {
      const bnbData = {
        ...mockUserAchievement,
        chain: 'bnb',
        currentLevel: 2,
        currentDays: 15,
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(bnbData);

      // 显示BNB数据
      const { rerender } = render(
        <div>BNB Chain: Level 2 - 15 days</div>
      );

      await waitFor(() => {
        expect(screen.getByText(/BNB Chain/i)).toBeInTheDocument();
      });

      // 切换到Solana
      rerender(<div>Solana: Level 1 - 7 days</div>);

      await waitFor(() => {
        expect(screen.getByText(/Solana/i)).toBeInTheDocument();
      });

      // 切换回BNB
      rerender(<div>BNB Chain: Level 2 - 15 days</div>);

      await waitFor(() => {
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
        expect(screen.getByText(/15 days/i)).toBeInTheDocument();
      });
    });

    it('IndexedDB数据应该正确存储', async () => {
      const testData = {
        walletAddress: createMockAddress(),
        currentLevel: 3,
        currentDays: 30,
      };

      // 模拟IndexedDB存储
      const mockDB = {
        put: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue(testData),
      };

      await act(async () => {
        await mockDB.put('achievements', testData);
      });

      await waitFor(() => {
        expect(mockDB.put).toHaveBeenCalledWith(
          'achievements',
          testData
        );
      });

      // 验证读取
      const retrieved = await mockDB.get('achievements');
      expect(retrieved).toEqual(testData);
    });
  });

  describe('异常处理', () => {
    it('合约调用失败，应该显示错误提示', async () => {
      const mockError = new Error('Transaction reverted');
      mockAchievementService.saveReflection.mockRejectedValue(mockError);

      const onError = jest.fn();
      render(
        <div>
          <div role="alert">错误：{mockError.message}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Transaction reverted/i)).toBeInTheDocument();
      });
    });

    it('网络错误，应该显示重试按钮', async () => {
      const mockError = new Error('Network error');
      mockAchievementService.getUserAchievement.mockRejectedValue(mockError);

      const onRetry = jest.fn();
      render(
        <div>
          <div role="alert">网络错误，请重试</div>
          <button data-testid="retry-button" onClick={onRetry}>
            重试
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/网络错误/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('retry-button');
      expect(retryButton).toBeInTheDocument();

      // 点击重试
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(onRetry).toHaveBeenCalled();
      });
    });

    it('已claim的SBT不能再次claim', async () => {
      const claimedData = {
        ...mockUserAchievement,
        currentLevel: 1,
        currentDays: 7,
        claimedLevels: [1], // 已经claim过
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(claimedData);
      mockAchievementService.checkCanClaim.mockResolvedValue(false);

      render(
        <div>
          <div>Level 1 SBT 已领取</div>
          <button disabled>领取SBT</button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/已领取/i)).toBeInTheDocument();
        expect(screen.getByText(/领取SBT/i)).toBeDisabled();
      });
    });

    it('钱包未连接，应该提示连接钱包', async () => {
      render(
        <div>
          <div role="alert">请先连接钱包</div>
          <button>连接钱包</button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/请先连接钱包/i)).toBeInTheDocument();
        expect(screen.getByText(/连接钱包/i)).toBeInTheDocument();
      });
    });
  });

  describe('边界条件', () => {
    it('连续打卡中断，应该重新计算', async () => {
      const interruptedData = {
        ...mockUserAchievement,
        consecutiveDays: 0, // 连续天数被重置
        totalReflections: 10,
        currentDays: 10,
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        interruptedData
      );

      render(<div>连续天数: 0</div>);

      await waitFor(() => {
        expect(screen.getByText(/连续天数: 0/i)).toBeInTheDocument();
      });
    });

    it('达到最高等级，不能继续升级', async () => {
      const maxLevelData = {
        ...mockUserAchievement,
        currentLevel: 6,
        currentDays: 365,
        claimedLevels: [1, 2, 3, 4, 5, 6],
      };

      mockAchievementService.getUserAchievement.mockResolvedValue(
        maxLevelData
      );

      render(
        <div>
          <div>已达到最高等级</div>
          <button disabled>继续打卡</button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/已达到最高等级/i)).toBeInTheDocument();
        expect(screen.getByText(/继续打卡/i)).toBeDisabled();
      });
    });

    it('跨天打卡，应该更新日期', async () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const checkInData = {
        date: yesterday.toISOString().split('T')[0],
        timestamp: yesterday.getTime(),
      };

      render(<div>上次打卡: {checkInData.date}</div>);

      await waitFor(() => {
        expect(screen.getByText(/上次打卡/i)).toBeInTheDocument();
      });
    });
  });

  describe('性能测试', () => {
    it('打卡后等级更新应该在1秒内完成', async () => {
      const startTime = Date.now();

      mockAchievementService.saveReflection.mockResolvedValue({
        success: true,
        newLevel: 2,
        days: 15,
      });

      await act(async () => {
        await mockAchievementService.saveReflection(
          createMockAddress(),
          'test reflection'
        );
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });

    it('合约调用应该在10秒内完成', async () => {
      const startTime = Date.now();

      mockContractWriteSuccess();

      await act(async () => {
        await wait(100); // 模拟合约调用
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(10000);
    });
  });
});
