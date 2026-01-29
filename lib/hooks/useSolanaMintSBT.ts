/**
 * useSolanaMintSBT - Solana SBT铸造Hook
 * 整合钱包连接和SBT铸造逻辑
 */

import { useCallback, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useSolanaWallet } from '@/lib/solana-wallet';
import { SolanaSBTService, MintSBTParams } from '@/lib/contracts/solana-sbt';
import { SBTMintService } from '@/lib/sbt-mint-service';

export interface SolanaMintResult {
  signature: string;
  level: number;
  chain: 'solana';
  txHash: string;
}

export interface UseSolanaMintSBTState {
  isPending: boolean;
  isConfirming: boolean;
  isConfirmed: boolean;
  error: Error | null;
  hash: string | null;
}

export function useSolanaMintSBT() {
  const solanaWallet = useSolanaWallet();
  const [state, setState] = useState<UseSolanaMintSBTState>({
    isPending: false,
    isConfirming: false,
    isConfirmed: false,
    error: null,
    hash: null,
  });

  /**
   * 铸造SBT
   * @param walletAddress 钱包地址
   * @param level 等级
   * @param days 天数
   * @param metadataURI 元数据URI
   * @returns 交易签名
   */
  const mintSolanaSBT = useCallback(async (
    walletAddress: string,
    level: number,
    days: number,
    metadataURI: string
  ): Promise<string> => {
    try {
      setState({
        isPending: true,
        isConfirming: false,
        isConfirmed: false,
        error: null,
        hash: null,
      });

      // 1. 检查钱包是否已连接
      if (!solanaWallet.isConnected || !solanaWallet.publicKey) {
        throw new Error('请先连接Solana钱包');
      }

      // 2. 验证钱包地址是否匹配
      if (solanaWallet.publicKey !== walletAddress) {
        throw new Error('钱包地址不匹配，请使用正确的钱包');
      }

      // 3. 创建SBT服务实例
      const sbtService = new SolanaSBTService();

      // 4. 检查程序是否已初始化
      const isInitialized = await sbtService.isInitialized();
      if (!isInitialized) {
        throw new Error('Solana SBT程序未初始化，请联系管理员');
      }

      // 5. 检查程序ID是否有效（不是占位符）
      const programId = sbtService.getProgramId();
      const programIdStr = programId.toBase58();
      if (programIdStr.includes('ComingSoon')) {
        throw new Error('Solana SBT功能即将推出，敬请期待');
      }

      // 6. 准备铸造参数
      const mintParams: MintSBTParams = {
        walletAddress,
        level,
        days,
        metadataURI,
      };

      // 7. 创建铸造交易
      const ownerPubkey = new PublicKey(walletAddress);
      const transaction = await sbtService.mintSBT(mintParams, ownerPubkey);

      setState({
        isPending: false,
        isConfirming: true,
        isConfirmed: false,
        error: null,
        hash: null,
      });

      // 8. 发送并确认交易
      const result = await solanaWallet.sendTransaction(transaction, 'confirmed');

      setState({
        isPending: false,
        isConfirming: false,
        isConfirmed: true,
        error: null,
        hash: result.signature,
      });

      // 9. 保存铸造记录到数据库
      await SBTMintService.saveMintRecord(
        walletAddress,
        'solana',
        level,
        result.signature,
        metadataURI
      );

      console.log('[useSolanaMintSBT] 铸造成功:', {
        signature: result.signature,
        level,
        days,
      });

      return result.signature;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setState({
        isPending: false,
        isConfirming: false,
        isConfirmed: false,
        error: errorObj,
        hash: null,
      });
      throw errorObj;
    }
  }, [solanaWallet]);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      isPending: false,
      isConfirming: false,
      isConfirmed: false,
      error: null,
      hash: null,
    });
  }, []);

  return {
    mintSolanaSBT,
    reset,
    ...state,
  };
}
