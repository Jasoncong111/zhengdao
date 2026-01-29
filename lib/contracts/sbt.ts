/**
 * BNB Chain SBT合约交互封装
 * 使用wagmi v2进行合约调用
 */

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';

// 合约ABI（需要从实际合约文件导入或定义）
export const ZHENGDAO_SBT_ABI = [
  // 铸造SBT
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'level', type: 'uint256' },
      { internalType: 'uint256', name: 'days', type: 'uint256' },
      { internalType: 'string', name: 'metadataURI', type: 'string' }
    ],
    name: 'mintSBT',
    outputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  // 获取Token详情
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getTokenDetails',
    outputs: [
      { internalType: 'uint256', name: 'level', type: 'uint256' },
      { internalType: 'uint256', name: 'days', type: 'uint256' },
      { internalType: 'uint256', name: 'mintDate', type: 'uint256' },
      { internalType: 'string', name: 'metadataURI', type: 'string' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  // 获取用户所有Token
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserTokens',
    outputs: [{ internalType: 'uint256[]', name: 'tokenIds', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  // 检查Token是否存在
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenExists',
    outputs: [{ internalType: 'bool', name: 'exists', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  // 获取Token等级
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getTokenLevel',
    outputs: [{ internalType: 'uint256', name: 'level', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// 合约地址
const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ZHENGDAO_SBT_ADDRESS as `0x${string}`;

/**
 * 铸造SBT Hook
 * @returns 铸造相关状态和方法
 */
export function useMintSBT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  /**
   * 铸造SBT
   * @param to 接收地址
   * @param level 等级
   * @param days 天数
   * @param metadataURI 元数据URI
   */
  const mintSBT = async (
    to: `0x${string}`,
    level: number,
    days: number,
    metadataURI: string
  ) => {
    if (!SBT_CONTRACT_ADDRESS) {
      throw new Error('SBT合约地址未配置');
    }

    console.log('[SBT] 开始铸造流程...');
    console.log('[SBT] 合约地址:', SBT_CONTRACT_ADDRESS);
    console.log('[SBT] 接收地址:', to);
    console.log('[SBT] 等级:', level);
    console.log('[SBT] 天数:', days);
    console.log('[SBT] Metadata URI:', metadataURI);

    try {
      console.log('[SBT] 调用 writeContract...');
      const result = await writeContract({
        address: SBT_CONTRACT_ADDRESS,
        abi: ZHENGDAO_SBT_ABI,
        functionName: 'mintSBT',
        args: [to, BigInt(level), BigInt(days), metadataURI],
      } as any);

      console.log('[SBT] writeContract 返回:', result);
      console.log('[SBT] Mint transaction submitted:', hash);
      return result;
    } catch (err) {
      console.error('[SBT] Mint error:', err);
      console.error('[SBT] Error details:', JSON.stringify(err, null, 2));
      throw err;
    }
  };

  return {
    mintSBT,
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error
  };
}

/**
 * 读取SBT详情 Hook
 * @param tokenId Token ID
 * @returns SBT详情
 */
export function useSBTDetails(tokenId: number) {
  const { data, error, isLoading } = useReadContract({
    address: SBT_CONTRACT_ADDRESS,
    abi: ZHENGDAO_SBT_ABI,
    functionName: 'getTokenDetails',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId && tokenId > 0,
    }
  });

  return {
    details: data,
    error,
    isLoading
  };
}

/**
 * 获取用户所有SBT Hook
 * @param walletAddress 钱包地址
 * @returns Token ID列表
 */
export function useUserSBTs(walletAddress: `0x${string}`) {
  const { data, error, isLoading } = useReadContract({
    address: SBT_CONTRACT_ADDRESS,
    abi: ZHENGDAO_SBT_ABI,
    functionName: 'getUserTokens',
    args: [walletAddress],
    query: {
      enabled: !!walletAddress,
    }
  });

  return {
    tokenIds: data as bigint[] | undefined,
    error,
    isLoading
  };
}

/**
 * 获取Token等级 Hook
 * @param tokenId Token ID
 * @returns 等级
 */
export function useTokenLevel(tokenId: number) {
  const { data, error, isLoading } = useReadContract({
    address: SBT_CONTRACT_ADDRESS,
    abi: ZHENGDAO_SBT_ABI,
    functionName: 'getTokenLevel',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId && tokenId > 0,
    }
  });

  return {
    level: data !== undefined ? Number(data) : undefined,
    error,
    isLoading
  };
}

/**
 * 检查Token是否存在 Hook
 * @param tokenId Token ID
 * @returns 是否存在
 */
export function useTokenExists(tokenId: number) {
  const { data, error, isLoading } = useReadContract({
    address: SBT_CONTRACT_ADDRESS,
    abi: ZHENGDAO_SBT_ABI,
    functionName: 'tokenExists',
    args: [BigInt(tokenId)],
    query: {
      enabled: !!tokenId && tokenId > 0,
    }
  });

  return {
    exists: data as boolean | undefined,
    error,
    isLoading
  };
}

/**
 * 格式化Token ID
 * @param tokenId Token ID (bigint)
 * @returns 格式化的字符串
 */
export function formatTokenId(tokenId: bigint): string {
  return tokenId.toString();
}

/**
 * 格式化日期
 * @param timestamp Unix时间戳 (bigint)
 * @returns 格式化的日期字符串
 */
export function formatTokenDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * 获取合约地址
 * @returns 合约地址
 */
export function getSBTContractAddress(): string {
  if (!SBT_CONTRACT_ADDRESS) {
    throw new Error('SBT合约地址未配置');
  }
  return SBT_CONTRACT_ADDRESS;
}

/**
 * 验证合约地址配置
 * @returns 是否配置有效
 */
export function isContractConfigured(): boolean {
  return !!SBT_CONTRACT_ADDRESS && SBT_CONTRACT_ADDRESS.startsWith('0x');
}

/**
 * 获取区块浏览器URL
 * @param type 类型 'tx' | 'address' | 'token'
 * @param value 值
 * @returns 完整URL
 */
export function getExplorerUrl(
  type: 'tx' | 'address' | 'token',
  value: string
): string {
  const isTestnet = process.env.NEXT_PUBLIC_BNB_CHAIN_TESTNET === 'true';
  const baseUrl = isTestnet
    ? 'https://testnet.bscscan.com'
    : 'https://bscscan.com';

  return `${baseUrl}/${type}/${value}`;
}
