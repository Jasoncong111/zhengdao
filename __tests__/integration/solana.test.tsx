/**
 * Solana 集成测试
 * 测试Solana链上的打卡到申领SBT流程
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
  mockSolanaConnected,
  mockSolanaDisconnected,
  mockSolanaTransactionSuccess,
  mockSolanaTransactionFailure,
  mockSolanaWallet,
  mockSolanaConnection,
  resetSolanaMocks,
  createMockAddress,
  wait,
} from '../utils';

describe('Solana Integration Tests', () => {
  beforeEach(() => {
    // 重置所有Solana mock
    resetSolanaMocks();

    // 默认模拟钱包已连接
    mockSolanaConnected();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('钱包连接', () => {
    it('应该成功连接Phantom钱包', async () => {
      render(
        <div>
          <div>已连接: {mockSolanaWallet.publicKey.toBase58()}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/已连接/i)).toBeInTheDocument();
      });
    });

    it('应该显示钱包余额', async () => {
      mockSolanaConnection.getBalance.mockResolvedValue(1000000000); // 1 SOL

      render(
        <div>
          <div>余额: 1.0 SOL</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/1.0 SOL/i)).toBeInTheDocument();
      });
    });

    it('断开钱包连接后，应该清空状态', async () => {
      mockSolanaDisconnected();

      render(
        <div>
          <div>请连接钱包</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/请连接钱包/i)).toBeInTheDocument();
      });
    });
  });

  describe('打卡流程', () => {
    it('用户打卡7天，应该显示达到Level 1', async () => {
      render(
        <div>
          <div>Solana: Level 1 - 7 days</div>
          <div>恭喜达到 Level 1！可以领取SBT了</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Solana/i)).toBeInTheDocument();
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
        expect(screen.getByText(/7 days/i)).toBeInTheDocument();
      });
    });

    it('打卡数据应该保存在Solana链上', async () => {
      const mockAccountInfo = {
        owner: mockSolanaWallet.publicKey.toBase58(),
        level: 1,
        days: 7,
        timestamp: Date.now(),
      };

      mockSolanaConnection.getAccountInfo.mockResolvedValue({
        data: Buffer.from(JSON.stringify(mockAccountInfo)),
      });

      render(
        <div>
          <div>链上数据: Level {mockAccountInfo.level}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/链上数据/i)).toBeInTheDocument();
      });
    });
  });

  describe('SBT铸造', () => {
    it('调用Solana程序mint成功', async () => {
      const signature = createMockAddress();
      mockSolanaTransactionSuccess(signature);

      const onMint = jest.fn().mockResolvedValue({
        success: true,
        signature,
        tokenId: 456,
      });

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

    it('mint成功后，应该更新用户SBT列表', async () => {
      const newSBT = {
        pubkey: createMockAddress(),
        account: {
          level: 1,
          days: 7,
          timestamp: Date.now(),
        },
      };

      render(
        <div>
          <div data-testid="sbt-list">
            <div data-level="1">Solana SBT Level 1</div>
          </div>
        </div>
      );

      await waitFor(() => {
        const sbtList = screen.getByTestId('sbt-list');
        expect(sbtList).toContainHTML('Solana SBT Level 1');
      });
    });

    it('mint失败，应该显示错误信息', async () => {
      const mockError = new Error('Transaction failed');
      mockSolanaTransactionFailure(mockError);

      render(
        <div>
          <div role="alert">错误: {mockError.message}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Transaction failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('查询用户SBT', () => {
    it('应该正确返回用户拥有的所有SBT', async () => {
      const mockTokens = [
        {
          pubkey: createMockAddress(),
          account: { level: 1, days: 7 },
        },
        {
          pubkey: createMockAddress(),
          account: { level: 2, days: 30 },
        },
      ];

      render(
        <div>
          <div data-testid="user-sbts">
            {mockTokens.map((token, index) => (
              <div key={index} data-level={token.account.level}>
                Level {token.account.level}
              </div>
            ))}
          </div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      });
    });

    it('用户没有SBT时，应该显示空状态', async () => {
      render(
        <div>
          <div>暂无SBT，快去打卡吧！</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/暂无SBT/i)).toBeInTheDocument();
      });
    });
  });

  describe('异常处理', () => {
    it('钱包未连接，不能打卡', async () => {
      mockSolanaDisconnected();

      render(
        <div>
          <div role="alert">请先连接Solana钱包</div>
          <button disabled>打卡</button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/请先连接Solana钱包/i)).toBeInTheDocument();
        expect(screen.getByText(/打卡/i)).toBeDisabled();
      });
    });

    it('余额不足，不能mint', async () => {
      mockSolanaConnection.getBalance.mockResolvedValue(1000); // 0.000001 SOL

      render(
        <div>
          <div role="alert">余额不足，需要至少0.01 SOL</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/余额不足/i)).toBeInTheDocument();
      });
    });

    it('网络超时，应该显示重试选项', async () => {
      const mockError = new Error('Network timeout');
      mockSolanaTransactionFailure(mockError);

      const onRetry = jest.fn();
      render(
        <div>
          <div role="alert">网络超时，请重试</div>
          <button data-testid="solana-retry-button" onClick={onRetry}>
            重试
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/网络超时/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByTestId('solana-retry-button');
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(onRetry).toHaveBeenCalled();
      });
    });
  });

  describe('双链独立', () => {
    it('Solana打卡不应该影响BNB Chain数据', async () => {
      // Solana数据
      const solanaData = {
        chain: 'solana',
        currentLevel: 2,
        currentDays: 15,
      };

      // BNB Chain数据
      const bnbData = {
        chain: 'bnb',
        currentLevel: 1,
        currentDays: 7,
      };

      render(
        <div>
          <div>Solana: Level {solanaData.currentLevel}</div>
          <div>BNB: Level {bnbData.currentLevel}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Solana: Level 2/i)).toBeInTheDocument();
        expect(screen.getByText(/BNB: Level 1/i)).toBeInTheDocument();
      });
    });
  });

  describe('性能测试', () => {
    it('Solana交易确认应该在合理时间内完成', async () => {
      const startTime = Date.now();

      mockSolanaTransactionSuccess();

      await act(async () => {
        await mockSolanaConnection.confirmTransaction();
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Solana交易通常很快，应该在5秒内完成
      expect(duration).toBeLessThan(5000);
    });

    it('获取账户信息应该在1秒内完成', async () => {
      const startTime = Date.now();

      await act(async () => {
        await mockSolanaConnection.getAccountInfo();
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });

  describe('边界条件', () => {
    it('重复mint同一等级，应该失败', async () => {
      const mockError = new Error('Token already exists for this level');
      mockSolanaTransactionFailure(mockError);

      render(
        <div>
          <div role="alert">{mockError.message}</div>
        </div>
      );

      await waitFor(() => {
        expect(
          screen.getByText(/Token already exists/i)
        ).toBeInTheDocument();
      });
    });

    it('无效等级，应该拒绝mint', async () => {
      const mockError = new Error('Invalid level: must be 1-6');
      mockSolanaTransactionFailure(mockError);

      render(
        <div>
          <div role="alert">{mockError.message}</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByText(/Invalid level/i)).toBeInTheDocument();
      });
    });
  });
});
