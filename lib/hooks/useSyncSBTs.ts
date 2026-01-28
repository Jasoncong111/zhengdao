/**
 * 同步链上SBT数据的Hook
 * 用于在React组件中同步链上数据到本地数据库
 */

import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useUserSBTs } from '../contracts/sbt';
import { MultiChainAchievementService } from '../multi-chain-achievement-service';
import type { ChainType } from '@/types/achievement';

/**
 * 同步SBT Hook
 */
export function useSyncSBTs() {
  const { address: bnbAddress } = useAccount();

  /**
   * 同步BNB Chain上的SBT
   */
  const syncBNBSBTs = useCallback(async (walletAddress: string) => {
    try {
      if (!walletAddress) {
        console.warn('[useSyncSBTs] 钱包地址为空');
        return 0;
      }

      // TODO: 这里需要在实际使用时传入useUserSBTs的结果
      // 由于hook不能在另一个hook的回调中调用，
      // 需要在组件层面处理
      console.warn('[useSyncSBTs] 请在组件中使用useUserSBTs获取数据，然后调用syncChainSBTsFromComponent');
      return 0;

    } catch (error) {
      console.error('[useSyncSBTs] 同步BNB SBT失败:', error);
      return 0;
    }
  }, []);

  /**
   * 同步指定链的SBT
   * @param chain 链类型
   * @param walletAddress 钱包地址
   * @param chainSBTs 链上查询到的SBT等级列表
   */
  const syncChainSBTs = useCallback(async (
    chain: ChainType,
    walletAddress: string,
    chainSBTs: number[]
  ) => {
    try {
      await MultiChainAchievementService.syncChainSBTsFromComponent(
        walletAddress,
        chain,
        chainSBTs
      );
      console.log(`[useSyncSBTs] ${chain} SBT同步成功`);
      return true;
    } catch (error) {
      console.error(`[useSyncSBTs] ${chain} SBT同步失败:`, error);
      return false;
    }
  }, []);

  /**
   * 批量同步双链SBT
   */
  const syncAllChains = useCallback(async (
    walletAddress: string,
    bnbSBTs: number[],
    solanaSBTs: number[]
  ) => {
    try {
      const results = await Promise.allSettled([
        syncChainSBTs('bnb', walletAddress, bnbSBTs),
        syncChainSBTs('solana', walletAddress, solanaSBTs)
      ]);

      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
      console.log(`[useSyncSBTs] 批量同步完成，成功 ${successCount}/2`);

      return successCount;
    } catch (error) {
      console.error('[useSyncSBTs] 批量同步失败:', error);
      return 0;
    }
  }, [syncChainSBTs]);

  return {
    syncBNBSBTs,
    syncChainSBTs,
    syncAllChains
  };
}

/**
 * 使用示例：
 *
 * function MyComponent() {
 *   const { address } = useAccount();
 *   const { tokenIds } = useUserSBTs(address);
 *   const { syncChainSBTs } = useSyncSBTs();
 *
 *   const handleSync = async () => {
 *     // 假设从tokenIds解析出等级列表
 *     const levels = [1, 2, 3]; // 从链上数据获取
 *     await syncChainSBTs('bnb', address, levels);
 *   };
 *
 *   return <button onClick={handleSync}>同步SBT</button>;
 * }
 */
