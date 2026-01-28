/**
 * Wagmi v2 Mock
 * 用于测试wagmi hooks和合约交互
 */

import { createMockAddress, createMockTxHash } from '../test-helpers';

export const mockAccount = {
  address: createMockAddress(),
  chain: {
    id: 97,
    name: 'BNB Chain Testnet',
    nativeCurrency: { name: 'tBNB', symbol: 'tBNB', decimals: 18 },
    rpcUrls: {
      default: { http: ['https://data-seed-prebsc-1-s1.binance.org:8545/'] },
    },
    blockExplorers: {
      default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
    },
  },
  connector: {
    id: 'mock',
    name: 'Mock Connector',
  },
};

export const mockWalletClient = {
  account: mockAccount,
  chain: mockAccount.chain,
  writeContract: jest.fn().mockResolvedValue(createMockTxHash()),
  waitForTransactionReceipt: jest.fn().mockResolvedValue({
    transactionHash: createMockTxHash(),
    blockHash: createMockAddress(),
    blockNumber: 12345n,
    logs: [],
    status: 'success',
  }),
};

export const mockPublicClient = {
  chain: mockAccount.chain,
  getBalance: jest.fn().mockResolvedValue(1000000000000000000n),
  readContract: jest.fn(),
  waitForTransactionReceipt: jest.fn().mockResolvedValue({
    transactionHash: createMockTxHash(),
    blockHash: createMockAddress(),
    blockNumber: 12345n,
    logs: [],
    status: 'success',
  }),
  simulateContract: jest.fn().mockResolvedValue({ result: undefined }),
};

export const mockUseAccount = {
  address: mockAccount.address,
  isConnected: true,
  chain: mockAccount.chain,
  connector: mockAccount.connector,
};

export const mockUseDisconnect = {
  disconnect: jest.fn(),
};

export const mockUseConnect = {
  connect: jest.fn(),
  connectors: [
    {
      id: 'injected',
      name: 'Injected',
      provider: undefined,
    },
  ],
  isPending: false,
};

export const mockUseReadContract = {
  data: undefined,
  error: null,
  isPending: false,
  isError: false,
  refetch: jest.fn(),
};

export const mockUseWriteContract = {
  writeContract: jest.fn(),
  isPending: false,
  isError: false,
  error: null,
};

export const mockUseWaitForTransactionReceipt = {
  data: {
    transactionHash: createMockTxHash(),
    blockHash: createMockAddress(),
    blockNumber: 12345n,
    logs: [],
    status: 'success',
  },
  error: null,
  isPending: false,
  isError: false,
};

/**
 * 模拟合约调用成功
 */
export function mockContractCallSuccess(result: any = undefined) {
  mockPublicClient.readContract.mockResolvedValue(result);
  mockUseReadContract.data = result;
  mockUseReadContract.error = null;
}

/**
 * 模拟合约调用失败
 */
export function mockContractCallFailure(error: Error) {
  mockPublicClient.readContract.mockRejectedValue(error);
  mockUseReadContract.data = undefined;
  mockUseReadContract.error = error;
  mockUseReadContract.isError = true;
}

/**
 * 模拟合约写入成功
 */
export function mockContractWriteSuccess(txHash?: string) {
  const hash = txHash || createMockTxHash();
  mockWalletClient.writeContract.mockResolvedValue(hash);
  mockUseWriteContract.isPending = false;
  mockUseWriteContract.isError = false;
  mockUseWriteContract.error = null;
}

/**
 * 模拟合约写入失败
 */
export function mockContractWriteFailure(error: Error) {
  mockWalletClient.writeContract.mockRejectedValue(error);
  mockUseWriteContract.isError = true;
  mockUseWriteContract.error = error;
}

/**
 * 重置所有mock
 */
export function resetWagmiMocks() {
  mockPublicClient.readContract.mockReset();
  mockPublicClient.getBalance.mockReset();
  mockWalletClient.writeContract.mockReset();
  mockWalletClient.waitForTransactionReceipt.mockReset();
  mockUseDisconnect.disconnect.mockReset();
  mockUseConnect.connect.mockReset();
}
