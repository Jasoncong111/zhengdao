/**
 * 区块链管理器
 * 统一管理BNB Chain和Solana的钱包连接和交互
 */

import { useState, useCallback, useEffect } from 'react';
import { useAccount, useDisconnect as useWagmiDisconnect } from 'wagmi';
import { useSolanaWallet } from './solana-wallet';
import type { ChainType } from '@/types/achievement';

/**
 * 链信息接口
 */
export interface ChainInfo {
  type: ChainType;
  name: string;
  icon: string;
  color: string;
  isConnected: boolean;
  address: string | null;
}

/**
 * 使用链管理器Hook
 */
export function useChainManager() {
  const { address: bnbAddress, isConnected: bnbConnected } = useAccount();
  const { disconnect: wagmiDisconnect } = useWagmiDisconnect();
  const solanaWallet = useSolanaWallet();

  const [currentChain, setCurrentChain] = useState<ChainType>('bnb');
  const [chains, setChains] = useState<ChainInfo[]>([
    {
      type: 'bnb',
      name: 'BNB Chain',
      icon: '🟡',
      color: '#F3BA2F',
      isConnected: bnbConnected,
      address: bnbAddress || null
    },
    {
      type: 'solana',
      name: 'Solana',
      icon: '🟣',
      color: '#9945FF',
      isConnected: solanaWallet.isConnected,
      address: solanaWallet.publicKey || null
    }
  ]);

  // 更新链状态
  useEffect(() => {
    setChains([
      {
        type: 'bnb',
        name: 'BNB Chain',
        icon: '🟡',
        color: '#F3BA2F',
        isConnected: bnbConnected,
        address: bnbAddress || null
      },
      {
        type: 'solana',
        name: 'Solana',
        icon: '🟣',
        color: '#9945FF',
        isConnected: solanaWallet.isConnected,
        address: solanaWallet.publicKey || null
      }
    ]);
  }, [bnbConnected, bnbAddress, solanaWallet.isConnected, solanaWallet.publicKey]);

  /**
   * 切换当前链
   */
  const switchChain = useCallback((chain: ChainType) => {
    setCurrentChain(chain);
  }, []);

  /**
   * 获取当前链信息
   */
  const getCurrentChainInfo = useCallback((): ChainInfo | null => {
    return chains.find(c => c.type === currentChain) || null;
  }, [chains, currentChain]);

  /**
   * 获取指定链信息
   */
  const getChainInfo = useCallback((chain: ChainType): ChainInfo | null => {
    return chains.find(c => c.type === chain) || null;
  }, [chains]);

  /**
   * 连接指定链
   */
  const connectChain = useCallback(async (chain: ChainType) => {
    try {
      if (chain === 'solana') {
        await solanaWallet.connect();
      } else if (chain === 'bnb') {
        // BNB Chain连接由wagmi自动处理
        console.log('[ChainManager] BNB Chain连接由wagmi处理');
      }
    } catch (error) {
      console.error(`[ChainManager] 连接${chain}失败:`, error);
      throw error;
    }
  }, [solanaWallet]);

  /**
   * 断开指定链
   */
  const disconnectChain = useCallback(async (chain: ChainType) => {
    try {
      if (chain === 'solana') {
        await solanaWallet.disconnect();
      } else if (chain === 'bnb') {
        await wagmiDisconnect();
      }
    } catch (error) {
      console.error(`[ChainManager] 断开${chain}失败:`, error);
      throw error;
    }
  }, [solanaWallet, wagmiDisconnect]);

  /**
   * 断开所有链
   */
  const disconnectAll = useCallback(async () => {
    try {
      const promises = [];

      if (bnbConnected) {
        promises.push(wagmiDisconnect());
      }

      if (solanaWallet.isConnected) {
        promises.push(solanaWallet.disconnect());
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('[ChainManager] 断开所有链失败:', error);
      throw error;
    }
  }, [bnbConnected, solanaWallet, wagmiDisconnect]);

  /**
   * 检查链是否已连接
   */
  const isChainConnected = useCallback((chain: ChainType): boolean => {
    const chainInfo = getChainInfo(chain);
    return chainInfo?.isConnected || false;
  }, [getChainInfo]);

  /**
   * 获取已连接的链列表
   */
  const getConnectedChains = useCallback((): ChainType[] => {
    return chains
      .filter(c => c.isConnected)
      .map(c => c.type);
  }, [chains]);

  /**
   * 获取钱包地址
   */
  const getWalletAddress = useCallback((chain: ChainType): string | null => {
    const chainInfo = getChainInfo(chain);
    return chainInfo?.address || null;
  }, [getChainInfo]);

  /**
   * 检查是否有任何链已连接
   */
  const hasAnyConnection = useCallback((): boolean => {
    return chains.some(c => c.isConnected);
  }, [chains]);

  /**
   * 获取所有连接的钱包地址
   */
  const getAllAddresses = useCallback((): Record<ChainType, string | null> => {
    return {
      bnb: bnbAddress || null,
      solana: solanaWallet.publicKey || null
    };
  }, [bnbAddress, solanaWallet.publicKey]);

  return {
    // 状态
    currentChain,
    chains,
    // 方法
    switchChain,
    getCurrentChainInfo,
    getChainInfo,
    connectChain,
    disconnectChain,
    disconnectAll,
    isChainConnected,
    getConnectedChains,
    getWalletAddress,
    hasAnyConnection,
    getAllAddresses,
    setCurrentChain
  };
}

/**
 * 链管理器辅助函数类
 */
export class ChainManagerHelper {
  /**
   * 验证链类型
   */
  static isValidChain(chain: string): chain is ChainType {
    return chain === 'bnb' || chain === 'solana';
  }

  /**
   * 获取链的图标
   */
  static getChainIcon(chain: ChainType): string {
    return chain === 'bnb' ? '🟡' : '🟣';
  }

  /**
   * 获取链的颜色
   */
  static getChainColor(chain: ChainType): string {
    return chain === 'bnb' ? '#F3BA2F' : '#9945FF';
  }

  /**
   * 获取链的名称
   */
  static getChainName(chain: ChainType): string {
    return chain === 'bnb' ? 'BNB Chain' : 'Solana';
  }

  /**
   * 格式化地址（通用）
   */
  static formatAddress(address: string, length: number = 6): string {
    if (!address) return '';
    return `${address.slice(0, length)}...${address.slice(-length)}`;
  }

  /**
   * 比较两个地址是否相同
   */
  static isSameAddress(addr1: string, addr2: string): boolean {
    if (!addr1 || !addr2) return false;
    return addr1.toLowerCase() === addr2.toLowerCase();
  }

  /**
   * 检查地址是否有效
   */
  static isValidAddress(chain: ChainType, address: string): boolean {
    if (!address) return false;

    if (chain === 'bnb') {
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    } else if (chain === 'solana') {
      try {
        // Solana地址验证（Base58编码，32-44位）
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      } catch {
        return false;
      }
    }

    return false;
  }

  /**
   * 获取交易浏览器URL
   */
  static getExplorerUrl(
    chain: ChainType,
    type: 'tx' | 'address' | 'token',
    value: string
  ): string {
    if (chain === 'bnb') {
      const isTestnet = process.env.NEXT_PUBLIC_BNB_CHAIN_TESTNET === 'true';
      const baseUrl = isTestnet ? 'https://testnet.bscscan.com' : 'https://bscscan.com';
      return `${baseUrl}/${type}/${value}`;
    } else {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
      const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
      return `https://explorer.solana.com/${type === 'address' ? 'account' : type}/${value}${cluster}`;
    }
  }
}
