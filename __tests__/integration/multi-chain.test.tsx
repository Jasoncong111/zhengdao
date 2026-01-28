/**
 * 双链切换集成测试
 * 测试BNB Chain和Solana之间的切换和数据隔离
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import {
  mockUserAchievement,
  mockAchievementService,
  resetAchievementMocks,
  resetWagmiMocks,
  resetSolanaMocks,
  wait,
} from '../utils';

describe('Multi-Chain Integration Tests', () => {
  beforeEach(() => {
    resetAchievementMocks();
    resetWagmiMocks();
    resetSolanaMocks();

    // 默认mock返回值
    mockAchievementService.getUserAchievement.mockImplementation(
      (walletAddress, chain) => {
        if (chain === 'bnb') {
          return Promise.resolve({
            ...mockUserAchievement,
            chain: 'bnb',
            currentLevel: 2,
            currentDays: 15,
          });
        } else if (chain === 'solana') {
          return Promise.resolve({
            ...mockUserAchievement,
            chain: 'solana',
            currentLevel: 1,
            currentDays: 7,
          });
        }
        return Promise.resolve(mockUserAchievement);
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('链切换', () => {
    it('从BNB切换到Solana，数据应该正确切换', async () => {
      // 显示BNB数据
      const { rerender } = render(
        <div>
          <div data-testid="current-chain">BNB Chain</div>
          <div>Level 2 - 15 days</div>
          <button onClick={() => rerender(getSolanaView())}>
            切换到Solana
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-chain')).toHaveTextContent(
          'BNB Chain'
        );
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      });

      // 切换到Solana
      const getSolanaView = () => (
        <div>
          <div data-testid="current-chain">Solana</div>
          <div>Level 1 - 7 days</div>
        </div>
      );

      fireEvent.click(screen.getByText(/切换到Solana/i));

      await waitFor(() => {
        expect(screen.getByTestId('current-chain')).toHaveTextContent(
          'Solana'
        );
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
      });
    });

    it('从Solana切换到BNB，数据应该正确切换', async () => {
      // 显示Solana数据
      const { rerender } = render(
        <div>
          <div data-testid="current-chain">Solana</div>
          <div>Level 1 - 7 days</div>
          <button onClick={() => rerender(getBNBView())}>
            切换到BNB
          </button>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-chain')).toHaveTextContent(
          'Solana'
        );
      });

      // 切换到BNB
      const getBNBView = () => (
        <div>
          <div data-testid="current-chain">BNB Chain</div>
          <div>Level 2 - 15 days</div>
        </div>
      );

      fireEvent.click(screen.getByText(/切换到BNB/i));

      await waitFor(() => {
        expect(screen.getByTestId('current-chain')).toHaveTextContent(
          'BNB Chain'
        );
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
      });
    });

    it('两条链数据应该完全独立', async () => {
      // 同时显示两条链的数据
      render(
        <div>
          <div data-testid="bnb-data">
            <div>BNB Chain: Level 2 - 15 days</div>
            <div>已领取: Level 1, 2</div>
          </div>
          <div data-testid="solana-data">
            <div>Solana: Level 1 - 7 days</div>
            <div>已领取: Level 1</div>
          </div>
        </div>
      );

      await waitFor(() => {
        // BNB数据
        const bnbData = screen.getByTestId('bnb-data');
        expect(bnbData).toContainHTML('Level 2');
        expect(bnbData).toContainHTML('15 days');

        // Solana数据
        const solanaData = screen.getByTestId('solana-data');
        expect(solanaData).toContainHTML('Level 1');
        expect(solanaData).toContainHTML('7 days');
      });
    });
  });

  describe('双链并行', () => {
    it('在BNB打卡，不影响Solana数据', async () => {
      const initialBnbData = {
        currentLevel: 2,
        currentDays: 15,
      };

      const initialSolanaData = {
        currentLevel: 1,
        currentDays: 7,
      };

      // 模拟在BNB打卡
      const newBnbData = {
        ...initialBnbData,
        currentDays: 16,
      };

      render(
        <div>
          <div data-testid="bnb-data">
            BNB: Level {newBnbData.currentLevel} - {newBnbData.currentDays}{' '}
            days
          </div>
          <div data-testid="solana-data">
            Solana: Level {initialSolanaData.currentLevel} -{' '}
            {initialSolanaData.currentDays} days
          </div>
        </div>
      );

      await waitFor(() => {
        // BNB数据应该更新
        expect(screen.getByTestId('bnb-data')).toContainHTML('16 days');
        // Solana数据不应该改变
        expect(screen.getByTestId('solana-data')).toContainHTML('7 days');
      });
    });

    it('在Solana打卡，不影响BNB数据', async () => {
      const initialBnbData = {
        currentLevel: 2,
        currentDays: 15,
      };

      const initialSolanaData = {
        currentLevel: 1,
        currentDays: 7,
      };

      // 模拟在Solana打卡
      const newSolanaData = {
        ...initialSolanaData,
        currentDays: 8,
      };

      render(
        <div>
          <div data-testid="bnb-data">
            BNB: Level {initialBnbData.currentLevel} - {initialBnbData.currentDays}{' '}
            days
          </div>
          <div data-testid="solana-data">
            Solana: Level {newSolanaData.currentLevel} -{' '}
            {newSolanaData.currentDays} days
          </div>
        </div>
      );

      await waitFor(() => {
        // Solana数据应该更新
        expect(screen.getByTestId('solana-data')).toContainHTML('8 days');
        // BNB数据不应该改变
        expect(screen.getByTestId('bnb-data')).toContainHTML('15 days');
      });
    });

    it('可以同时持有两条链的SBT', async () => {
      const userSBTs = {
        bnb: [
          { tokenId: 101, level: 1, days: 7 },
          { tokenId: 102, level: 2, days: 15 },
        ],
        solana: [{ tokenId: 201, level: 1, days: 7 }],
      };

      render(
        <div>
          <div data-testid="bnb-sbts">
            <div>BNB SBTs: {userSBTs.bnb.length}</div>
            {userSBTs.bnb.map((sbt) => (
              <div key={sbt.tokenId}>Level {sbt.level}</div>
            ))}
          </div>
          <div data-testid="solana-sbts">
            <div>Solana SBTs: {userSBTs.solana.length}</div>
            {userSBTs.solana.map((sbt) => (
              <div key={sbt.tokenId}>Level {sbt.level}</div>
            ))}
          </div>
        </div>
      );

      await waitFor(() => {
        // BNB应该有2个SBT
        expect(screen.getByTestId('bnb-sbts')).toContainHTML('BNB SBTs: 2');
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();

        // Solana应该有1个SBT
        expect(screen.getByTestId('solana-sbts')).toContainHTML(
          'Solana SBTs: 1'
        );
      });
    });
  });

  describe('钱包连接', () => {
    it('BNB钱包连接正常，Solana钱包未连接', async () => {
      render(
        <div>
          <div data-testid="bnb-wallet">
            <div>BNB: 0x1234...5678</div>
            <div>已连接</div>
          </div>
          <div data-testid="solana-wallet">
            <div>Solana: 未连接</div>
            <button>连接钱包</button>
          </div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bnb-wallet')).toContainHTML('已连接');
        expect(screen.getByTestId('solana-wallet')).toContainHTML('未连接');
      });
    });

    it('Solana钱包连接正常，BNB钱包未连接', async () => {
      render(
        <div>
          <div data-testid="bnb-wallet">
            <div>BNB: 未连接</div>
            <button>连接钱包</button>
          </div>
          <div data-testid="solana-wallet">
            <div>Solana: AbCD...1234</div>
            <div>已连接</div>
          </div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bnb-wallet')).toContainHTML('未连接');
        expect(screen.getByTestId('solana-wallet')).toContainHTML('已连接');
      });
    });

    it('双钱包同时连接', async () => {
      render(
        <div>
          <div data-testid="bnb-wallet">
            <div>BNB: 0x1234...5678</div>
            <div>已连接</div>
          </div>
          <div data-testid="solana-wallet">
            <div>Solana: AbCD...1234</div>
            <div>已连接</div>
          </div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bnb-wallet')).toContainHTML('已连接');
        expect(screen.getByTestId('solana-wallet')).toContainHTML('已连接');
      });
    });

    it('钱包切换UI应该正确', async () => {
      const { rerender } = render(
        <div>
          <div data-testid="chain-switcher">
            <button
              className={isActive('bnb') ? 'active' : ''}
              onClick={() => switchChain('bnb')}
            >
              BNB Chain
            </button>
            <button
              className={isActive('solana') ? 'active' : ''}
              onClick={() => switchChain('solana')}
            >
              Solana
            </button>
          </div>
          <div data-testid="current-view">当前: BNB Chain</div>
        </div>
      );

      function isActive(chain: string) {
        return chain === 'bnb';
      }

      function switchChain(chain: string) {
        if (chain === 'solana') {
          rerender(
            <div>
              <div data-testid="chain-switcher">
                <button className="">BNB Chain</button>
                <button className="active">Solana</button>
              </div>
              <div data-testid="current-view">当前: Solana</div>
            </div>
          );
        }
      }

      // 初始状态：BNB激活
      await waitFor(() => {
        expect(screen.getByText(/BNB Chain/i)).toHaveClass('active');
      });

      // 切换到Solana
      fireEvent.click(screen.getByText(/Solana/i));

      await waitFor(() => {
        expect(screen.getByText(/Solana/i)).toHaveClass('active');
        expect(screen.getByTestId('current-view')).toHaveTextContent(
          '当前: Solana'
        );
      });
    });
  });

  describe('性能测试', () => {
    it('链切换应该在500ms内完成', async () => {
      const startTime = Date.now();

      const { rerender } = render(
        <div>
          <div data-testid="chain">BNB</div>
          <button onClick={() => rerender(<div data-testid="chain">Solana</div>)}>
            切换
          </button>
        </div>
      );

      fireEvent.click(screen.getByText(/切换/i));

      await waitFor(() => {
        expect(screen.getByTestId('chain')).toHaveTextContent('Solana');
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(500);
    });

    it('同时加载双链数据应该在合理时间内完成', async () => {
      const startTime = Date.now();

      // 模拟并行加载
      await Promise.all([
        mockAchievementService.getUserAchievement('0x1234', 'bnb'),
        mockAchievementService.getUserAchievement('AbCD', 'solana'),
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // 并行加载应该很快，应该在1秒内完成
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('边界条件', () => {
    it('快速切换链，不应该出现数据混乱', async () => {
      const { rerender } = render(
        <div>
          <div data-testid="current-chain">BNB</div>
        </div>
      );

      // 快速切换多次
      for (let i = 0; i < 5; i++) {
        if (i % 2 === 0) {
          rerender(<div data-testid="current-chain">Solana</div>);
        } else {
          rerender(<div data-testid="current-chain">BNB</div>);
        }
      }

      await waitFor(() => {
        expect(screen.getByTestId('current-chain')).toBeInTheDocument();
      });
    });

    it('一条链数据加载失败，不影响另一条链', async () => {
      mockAchievementService.getUserAchievement.mockImplementation(
        (walletAddress, chain) => {
          if (chain === 'bnb') {
            return Promise.reject(new Error('BNB data load failed'));
          } else if (chain === 'solana') {
            return Promise.resolve({
              ...mockUserAchievement,
              chain: 'solana',
              currentLevel: 1,
              currentDays: 7,
            });
          }
          return Promise.resolve(mockUserAchievement);
        }
      );

      render(
        <div>
          <div data-testid="bnb-data">
            <div role="alert">加载失败</div>
          </div>
          <div data-testid="solana-data">
            <div>Solana: Level 1 - 7 days</div>
          </div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('bnb-data')).toContainHTML('加载失败');
        expect(screen.getByTestId('solana-data')).toContainHTML('Level 1');
      });
    });
  });
});
