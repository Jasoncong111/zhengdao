/**
 * Solana Mock
 * 用于测试Solana钱包和程序交互
 */

import { createMockAddress, createMockTxHash } from '../test-helpers';

export const mockSolanaPublicKey = createMockAddress().replace('0x', '');
export const mockSolanaWallet = {
  publicKey: {
    toBase58: () => mockSolanaPublicKey,
    toString: () => mockSolanaPublicKey,
  },
  signTransaction: jest.fn(),
  signAllTransactions: jest.fn(),
};

export const mockSolanaConnection = {
  getBalance: jest.fn().mockResolvedValue(1000000000), // 1 SOL in lamports
  getAccountInfo: jest.fn().mockResolvedValue(null),
  sendTransaction: jest.fn().mockResolvedValue(createMockTxHash()),
  confirmTransaction: jest.fn().mockResolvedValue({
    value: {
      err: null,
    },
  }),
};

export const mockUseSolanaWallet = {
  connected: true,
  publicKey: mockSolanaWallet.publicKey,
  wallet: {
    adapter: {
      name: 'Phantom',
      url: 'https://phantom.app',
      icon: 'https://phantom.app/icon.png',
    },
  },
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  select: jest.fn(),
};

/**
 * Mock Solana SBT Program
 */
export const mockSolanaSBTProgram = {
  methods: {
    mint: jest.fn().mockResolvedValue({
      signature: createMockTxHash(),
    }),
    getAccount: jest.fn().mockResolvedValue({
      owner: mockSolanaPublicKey,
      level: 1,
      days: 7,
      mintedAt: Date.now(),
    }),
    getUserTokens: jest.fn().mockResolvedValue([
      {
        pubkey: createMockAddress(),
        account: {
          level: 1,
          days: 7,
        },
      },
    ]),
  },
};

/**
 * 模拟Solana钱包已连接
 */
export function mockSolanaConnected() {
  mockUseSolanaWallet.connected = true;
  mockUseSolanaWallet.publicKey = mockSolanaWallet.publicKey;
}

/**
 * 模拟Solana钱包未连接
 */
export function mockSolanaDisconnected() {
  mockUseSolanaWallet.connected = false;
  mockUseSolanaWallet.publicKey = null;
}

/**
 * 模拟Solana交易成功
 */
export function mockSolanaTransactionSuccess(signature?: string) {
  const sig = signature || createMockTxHash();
  mockSolanaConnection.sendTransaction.mockResolvedValue(sig);
  mockSolanaConnection.confirmTransaction.mockResolvedValue({
    value: { err: null },
  });
}

/**
 * 模拟Solana交易失败
 */
export function mockSolanaTransactionFailure(error: Error) {
  mockSolanaConnection.sendTransaction.mockRejectedValue(error);
  mockSolanaConnection.confirmTransaction.mockResolvedValue({
    value: { err: error },
  });
}

/**
 * 重置Solana mocks
 */
export function resetSolanaMocks() {
  mockSolanaConnection.getBalance.mockReset();
  mockSolanaConnection.getAccountInfo.mockReset();
  mockSolanaConnection.sendTransaction.mockReset();
  mockSolanaConnection.confirmTransaction.mockReset();
  mockUseSolanaWallet.connect.mockReset();
  mockUseSolanaWallet.disconnect.mockReset();
  mockSolanaSBTProgram.methods.mint.mockReset();
  mockSolanaSBTProgram.methods.getAccount.mockReset();
  mockSolanaSBTProgram.methods.getUserTokens.mockReset();
}
