/**
 * Solana钱包连接和交互封装
 * 使用@solana/wallet-adapter-react
 */

import { useMemo, useCallback, useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
  Signer,
  Commitment
} from '@solana/web3.js';

/**
 * Solana网络配置
 */
export const SOLANA_NETWORKS = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com'
} as const;

/**
 * 交易状态
 */
export enum TransactionStatus {
  IDLE = 'idle',
  SIGNING = 'signing',
  SENDING = 'sending',
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

/**
 * 交易结果
 */
export interface TransactionResult {
  signature: string;
  status: TransactionStatus;
  error?: Error;
  confirmations?: number;
}

/**
 * 钱包错误类型
 */
export class SolanaWalletError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'SolanaWalletError';
  }
}

/**
 * 获取当前网络RPC URL
 */
export function getSolanaRPCUrl(): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  return SOLANA_NETWORKS[network as keyof typeof SOLANA_NETWORKS] || SOLANA_NETWORKS.devnet;
}

/**
 * 创建Solana连接
 */
export function createSolanaConnection(): Connection {
  const rpcUrl = getSolanaRPCUrl();
  return new Connection(rpcUrl, 'confirmed');
}

/**
 * Solana钱包Hook
 * 封装钱包交互方法
 * 增强版：支持交易状态管理和更好的错误处理
 */
export function useSolanaWallet() {
  const wallet = useWallet();
  const [txStatus, setTxStatus] = useState<TransactionStatus>(TransactionStatus.IDLE);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [txError, setTxError] = useState<Error | null>(null);

  /**
   * 连接钱包
   */
  const connect = useCallback(async () => {
    try {
      await wallet.connect();
    } catch (error) {
      console.error('[Solana Wallet] 连接失败:', error);
      throw new SolanaWalletError(
        '钱包连接失败',
        'CONNECT_FAILED',
        error
      );
    }
  }, [wallet]);

  /**
   * 断开钱包
   */
  const disconnect = useCallback(async () => {
    try {
      await wallet.disconnect();
      // 重置交易状态
      setTxStatus(TransactionStatus.IDLE);
      setTxSignature(null);
      setTxError(null);
    } catch (error) {
      console.error('[Solana Wallet] 断开失败:', error);
      throw new SolanaWalletError(
        '钱包断开失败',
        'DISCONNECT_FAILED',
        error
      );
    }
  }, [wallet]);

  /**
   * 签名交易
   * @param transaction 交易对象
   * @returns 签名后的交易
   */
  const signTransaction = useCallback(async (transaction: Transaction): Promise<Transaction> => {
    if (!wallet.signTransaction) {
      throw new SolanaWalletError(
        '钱包不支持交易签名',
        'SIGN_NOT_SUPPORTED'
      );
    }

    try {
      setTxStatus(TransactionStatus.SIGNING);
      setTxError(null);

      const signedTx = await wallet.signTransaction(transaction);

      setTxStatus(TransactionStatus.IDLE);
      return signedTx;
    } catch (error) {
      setTxStatus(TransactionStatus.FAILED);
      const walletError = new SolanaWalletError(
        '交易签名失败',
        'SIGN_FAILED',
        error
      );
      setTxError(walletError);
      throw walletError;
    }
  }, [wallet]);

  /**
   * 签名多条交易
   * @param transactions 交易数组
   * @returns 签名后的交易数组
   */
  const signAllTransactions = useCallback(async (transactions: Transaction[]): Promise<Transaction[]> => {
    if (!wallet.signAllTransactions) {
      throw new SolanaWalletError(
        '钱包不支持批量交易签名',
        'SIGN_ALL_NOT_SUPPORTED'
      );
    }

    try {
      setTxStatus(TransactionStatus.SIGNING);
      setTxError(null);

      const signedTxs = await wallet.signAllTransactions(transactions);

      setTxStatus(TransactionStatus.IDLE);
      return signedTxs;
    } catch (error) {
      setTxStatus(TransactionStatus.FAILED);
      const walletError = new SolanaWalletError(
        '批量交易签名失败',
        'SIGN_ALL_FAILED',
        error
      );
      setTxError(walletError);
      throw walletError;
    }
  }, [wallet]);

  /**
   * 发送交易
   * @param transaction 交易对象
   * @param commitment 承诺级别
   * @returns 交易签名
   */
  const sendTransaction = useCallback(async (
    transaction: Transaction,
    commitment: Commitment = 'confirmed'
  ): Promise<TransactionResult> => {
    if (!wallet.sendTransaction) {
      throw new SolanaWalletError(
        '钱包未连接或不支持发送交易',
        'SEND_NOT_SUPPORTED'
      );
    }

    try {
      setTxStatus(TransactionStatus.SENDING);
      setTxError(null);

      const connection = createSolanaConnection();
      const signature = await wallet.sendTransaction(transaction, connection);

      setTxSignature(signature);
      setTxStatus(TransactionStatus.CONFIRMING);

      // 等待交易确认
      const confirmation = await connection.confirmTransaction(signature, commitment);

      if (confirmation.value.err) {
        throw new SolanaWalletError(
          '交易确认失败',
          'CONFIRMATION_FAILED',
          confirmation.value.err
        );
      }

      setTxStatus(TransactionStatus.CONFIRMED);

      return {
        signature,
        status: TransactionStatus.CONFIRMED,
        confirmations: 1
      };
    } catch (error) {
      setTxStatus(TransactionStatus.FAILED);
      const walletError = new SolanaWalletError(
        '发送交易失败',
        'SEND_FAILED',
        error
      );
      setTxError(walletError);
      throw walletError;
    }
  }, [wallet]);

  /**
   * 签名并发送交易
   * @param transaction 交易对象
   * @param commitment 承诺级别
   * @returns 交易签名
   */
  const signAndSendTransaction = useCallback(async (
    transaction: Transaction,
    commitment: Commitment = 'confirmed'
  ): Promise<TransactionResult> => {
    try {
      // 先签名
      const signedTx = await signTransaction(transaction);

      // 再发送
      return await sendTransaction(signedTx, commitment);
    } catch (error) {
      throw error;
    }
  }, [signTransaction, sendTransaction]);

  /**
   * 获取余额
   */
  const getBalance = useCallback(async (publicKey?: PublicKey): Promise<number> => {
    try {
      const targetPubkey = publicKey || wallet.publicKey;
      if (!targetPubkey) {
        throw new SolanaWalletError(
          '公钥不存在',
          'PUBLIC_KEY_MISSING'
        );
      }

      const connection = createSolanaConnection();
      const balance = await connection.getBalance(targetPubkey);
      return balance / 1e9; // 转换为SOL
    } catch (error) {
      console.error('[Solana Wallet] 获取余额失败:', error);
      if (error instanceof SolanaWalletError) {
        throw error;
      }
      throw new SolanaWalletError(
        '获取余额失败',
        'GET_BALANCE_FAILED',
        error
      );
    }
  }, [wallet.publicKey]);

  /**
   * 获取钱包地址（简化格式）
   */
  const getShortAddress = useCallback((address?: string, length: number = 4): string => {
    const targetAddress = address || wallet.publicKey?.toBase58();
    if (!targetAddress) return '';
    return `${targetAddress.slice(0, length)}...${targetAddress.slice(-length)}`;
  }, [wallet.publicKey]);

  /**
   * 重置交易状态
   */
  const resetTransactionState = useCallback(() => {
    setTxStatus(TransactionStatus.IDLE);
    setTxSignature(null);
    setTxError(null);
  }, []);

  /**
   * 获取交易状态
   */
  const getTransactionStatus = useCallback(async (signature: string): Promise<TransactionResult> => {
    try {
      const connection = createSolanaConnection();
      const status = await connection.getSignatureStatus(signature);

      if (!status.value) {
        return {
          signature,
          status: TransactionStatus.CONFIRMING
        };
      }

      if (status.value.err) {
        return {
          signature,
          status: TransactionStatus.FAILED,
          error: new Error('Transaction failed')
        };
      }

      return {
        signature,
        status: TransactionStatus.CONFIRMED,
        confirmations: 1
      };
    } catch (error) {
      throw new SolanaWalletError(
        '获取交易状态失败',
        'GET_TX_STATUS_FAILED',
        error
      );
    }
  }, []);

  return {
    ...wallet,
    connect,
    disconnect,
    signTransaction,
    signAllTransactions,
    sendTransaction,
    signAndSendTransaction,
    getBalance,
    getShortAddress,
    getTransactionStatus,
    resetTransactionState,
    // 交易状态
    txStatus,
    txSignature,
    txError,
    isTransactionPending: txStatus === TransactionStatus.SIGNING ||
                          txStatus === TransactionStatus.SENDING ||
                          txStatus === TransactionStatus.CONFIRMING,
    isTransactionConfirmed: txStatus === TransactionStatus.CONFIRMED,
    isTransactionFailed: txStatus === TransactionStatus.FAILED,
    // 钱包状态
    isConnected: wallet.connected,
    publicKey: wallet.publicKey?.toBase58() || null
  };
}

/**
 * Solana交易辅助类
 */
export class SolanaTransactionHelper {
  private connection: Connection;

  constructor() {
    this.connection = createSolanaConnection();
  }

  /**
   * 创建转账交易
   */
  createTransferTransaction(
    from: PublicKey,
    to: PublicKey,
    amount: number
  ): Transaction {
    const transaction = new Transaction();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: to,
        lamports: amount * 1e9 // 转换为lamports
      })
    );

    return transaction;
  }

  /**
   * 创建批量交易
   * @param instructions 指令数组
   * @param payer 支付者公钥
   * @returns 交易对象
   */
  async createBatchTransaction(
    instructions: TransactionInstruction[],
    payer: PublicKey
  ): Promise<Transaction> {
    const transaction = new Transaction();
    instructions.forEach(instruction => transaction.add(instruction));

    // 获取最新的blockhash
    const { blockhash } = await this.connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    return transaction;
  }

  /**
   * 获取交易状态
   */
  async getTransactionStatus(signature: string) {
    try {
      const status = await this.connection.getSignatureStatus(signature);
      return status.value;
    } catch (error) {
      console.error('[Solana Transaction] 获取状态失败:', error);
      return null;
    }
  }

  /**
   * 等待交易确认
   */
  async waitForConfirmation(
    signature: string,
    maxAttempts: number = 30,
    delay: number = 1000
  ): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getTransactionStatus(signature);

      if (status) {
        if (status.confirmationStatus === 'confirmed' || status.confirmationStatus === 'finalized') {
          return true;
        }

        if (status.err) {
          throw new SolanaWalletError(
            '交易失败',
            'TX_FAILED',
            status.err
          );
        }
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }

    throw new SolanaWalletError(
      '交易确认超时',
      'TX_TIMEOUT'
    );
  }

  /**
   * 批量等待交易确认
   * @param signatures 交易签名数组
   * @returns 成功/失败映射
   */
  async waitForMultipleConfirmations(
    signatures: string[]
  ): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    const promises = signatures.map(async (signature) => {
      try {
        const success = await this.waitForConfirmation(signature);
        results.set(signature, success);
      } catch (error) {
        console.error(`[Solana Transaction] 交易${signature}确认失败:`, error);
        results.set(signature, false);
      }
    });

    await Promise.all(promises);
    return results;
  }

  /**
   * 获取账户信息
   */
  async getAccountInfo(publicKey: PublicKey) {
    try {
      const accountInfo = await this.connection.getAccountInfo(publicKey);
      return accountInfo;
    } catch (error) {
      console.error('[Solana Transaction] 获取账户信息失败:', error);
      return null;
    }
  }

  /**
   * 批量获取账户信息
   * @param publicKeys 公钥数组
   * @returns 账户信息数组
   */
  async getMultipleAccountsInfo(publicKeys: PublicKey[]) {
    try {
      const accountInfos = await this.connection.getMultipleAccountsInfo(publicKeys);
      return accountInfos;
    } catch (error) {
      console.error('[Solana Transaction] 批量获取账户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取最新的blockhash
   */
  async getLatestBlockhash() {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash();
      return blockhash;
    } catch (error) {
      console.error('[Solana Transaction] 获取blockhash失败:', error);
      throw error;
    }
  }

  /**
   * 估算交易费用
   * @param transaction 交易对象
   * @returns 费用（lamports）
   */
  async estimateFee(transaction: Transaction): Promise<number> {
    try {
      const { feeCalculator } = await this.connection.getRecentBlockhash();
      return transaction.compileMessage().serialize().length * feeCalculator.lamportsPerSignature;
    } catch (error) {
      console.error('[Solana Transaction] 估算费用失败:', error);
      // 默认返回5000 lamports
      return 5000;
    }
  }

  /**
   * 模拟交易
   * @param transaction 交易对象
   * @param signer 签名者公钥
   * @returns 模拟结果
   */
  async simulateTransaction(
    transaction: Transaction,
    signer: PublicKey
  ): Promise<{
    returnData?: any;
    unitsConsumed?: number;
    error?: Error;
  }> {
    try {
      const result = await this.connection.simulateTransaction(transaction);
      return {
        returnData: result.value.returnData,
        unitsConsumed: result.value.unitsConsumed,
        error: result.value.err ? new Error(JSON.stringify(result.value.err)) : undefined
      };
    } catch (error) {
      console.error('[Solana Transaction] 模拟交易失败:', error);
      throw error;
    }
  }

  /**
   * 获取交易详情
   * @param signature 交易签名
   * @returns 交易详情
   */
  async getTransaction(signature: string) {
    try {
      const transaction = await this.connection.getTransaction(signature, {
        maxSupportedTransactionVersion: 0
      });
      return transaction;
    } catch (error) {
      console.error('[Solana Transaction] 获取交易详情失败:', error);
      return null;
    }
  }

  /**
   * 获取Solana余额
   * @param publicKey 公钥
   * @returns 余额（SOL）
   */
  async getBalance(publicKey: PublicKey): Promise<number> {
    try {
      const balance = await this.connection.getBalance(publicKey);
      return balance / 1e9;
    } catch (error) {
      console.error('[Solana Transaction] 获取余额失败:', error);
      throw error;
    }
  }

  /**
   * 获取最小余额
   * @param dataLength 数据长度
   * @returns 最小余额（lamports）
   */
  async getMinimumBalanceForRentExemption(dataLength: number): Promise<number> {
    try {
      const balance = await this.connection.getMinimumBalanceForRentExemption(dataLength);
      return balance;
    } catch (error) {
      console.error('[Solana Transaction] 获取最小余额失败:', error);
      throw error;
    }
  }
}

/**
 * 批量交易辅助类
 * 支持并发执行多个交易
 */
export class SolanaBatchTransactionHelper extends SolanaTransactionHelper {
  /**
   * 批量发送交易
   * @param transactions 交易数组
   * @param signer 签名者函数
   * @param concurrency 并发数（默认3）
   * @returns 交易签名数组
   */
  async sendBatchTransactions(
    transactions: Transaction[],
    signer: (transaction: Transaction) => Promise<string>,
    concurrency: number = 3
  ): Promise<string[]> {
    const signatures: string[] = [];
    const errors: Array<{ index: number; error: Error }> = [];

    // 分批处理交易
    for (let i = 0; i < transactions.length; i += concurrency) {
      const batch = transactions.slice(i, i + concurrency);

      const promises = batch.map(async (tx, batchIndex) => {
        const globalIndex = i + batchIndex;
        try {
          const signature = await signer(tx);
          signatures[globalIndex] = signature;
          return signature;
        } catch (error) {
          errors.push({ index: globalIndex, error: error as Error });
          throw error;
        }
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.error('[Batch Transaction] 批次执行失败:', error);
      }
    }

    if (errors.length > 0) {
      console.error(`[Batch Transaction] ${errors.length}个交易失败:`, errors);
    }

    return signatures.filter(sig => sig !== undefined);
  }

  /**
   * 创建并发送批量交易（原子性）
   * @param instructions 指令数组
   * @param payer 支付者
   * @param signer 签名函数
   * @returns 交易签名
   */
  async createAndSendAtomicTransaction(
    instructions: TransactionInstruction[],
    payer: PublicKey,
    signer: (transaction: Transaction) => Promise<string>
  ): Promise<string> {
    try {
      // 创建批量交易
      const transaction = await this.createBatchTransaction(instructions, payer);

      // 发送交易
      const signature = await signer(transaction);

      // 等待确认
      await this.waitForConfirmation(signature);

      return signature;
    } catch (error) {
      console.error('[Batch Transaction] 原子交易失败:', error);
      throw error;
    }
  }

  /**
   * 估算批量交易费用
   * @param instructions 指令数组
   * @param payer 支付者
   * @returns 总费用（lamports）
   */
  async estimateBatchTransactionFee(
    instructions: TransactionInstruction[],
    payer: PublicKey
  ): Promise<number> {
    try {
      const transaction = await this.createBatchTransaction(instructions, payer);
      return await this.estimateFee(transaction);
    } catch (error) {
      console.error('[Batch Transaction] 估算费用失败:', error);
      // 默认返回每个指令5000 lamports
      return instructions.length * 5000;
    }
  }
}

/**
 * Solana地址验证
 */
export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * 格式化Solana地址
 */
export function formatSolanaAddress(address: string, length: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

/**
 * 获取Solana浏览器URL
 */
export function getSolanaExplorerUrl(
  type: 'tx' | 'address' | 'account',
  value: string
): string {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
  return `https://explorer.solana.com/${type}/${value}${cluster}`;
}

/**
 * SOL转换为Lamports
 */
export function solToLamports(sol: number): number {
  return sol * 1e9;
}

/**
 * Lamports转换为SOL
 */
export function lamportsToSol(lamports: number): number {
  return lamports / 1e9;
}

/**
 * 格式化SOL余额
 */
export function formatSolBalance(lamports: number, decimals: number = 4): string {
  const sol = lamportsToSol(lamports);
  return `${sol.toFixed(decimals)} SOL`;
}
