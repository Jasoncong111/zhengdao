'use client';

/**
 * ClaimSBTFlow - SBT申领流程组件
 * 3步申领流程：确认 → 连接钱包 → 申领成功
 * 支持BNB Chain和Solana双链
 * 使用真实的合约mint功能
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementLevel } from '@/lib/achievement-system';
import { getLevelIcon } from '@/lib/achievement-system';
import { useChainManager } from '@/lib/chain-manager';
import { useAccount } from 'wagmi';
import { useMintSBT } from '@/lib/contracts/sbt';
import { SBTMintService } from '@/lib/sbt-mint-service';
import toast from 'react-hot-toast';

type ClaimStep = 'confirm' | 'connecting' | 'claiming' | 'success' | 'error';

interface ClaimSBTFlowProps {
  level: AchievementLevel;
  days: number;
  chain: 'bnb' | 'solana';
  onClaim?: (level: number, chain: 'bnb' | 'solana') => Promise<boolean>;
  onClose?: () => void;
  className?: string;
}

export function ClaimSBTFlow({
  level,
  days,
  chain,
  onClaim,
  onClose,
  className = ''
}: ClaimSBTFlowProps) {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('confirm');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [selectedChain, setSelectedChain] = useState<'bnb' | 'solana'>(chain || 'bnb');
  const [hasMinted, setHasMinted] = useState(false);

  // 使用链管理器
  const { isChainConnected, connectChain, getChainInfo, switchChain } = useChainManager();

  // 使用wagmi获取钱包地址
  const { address } = useAccount();

  // 使用mint SBT Hook
  const { mintSBT, isPending, isConfirming, isConfirmed, hash } = useMintSBT();

  // 检查是否已铸造
  useEffect(() => {
    const checkMintStatus = async () => {
      if (address && level.level) {
        const minted = await SBTMintService.hasMinted(address, level.level);
        setHasMinted(minted);
        if (minted) {
          setError('此等级SBT已铸造，每个等级只能铸造一次');
          setCurrentStep('error');
        }
      }
    };

    checkMintStatus();
  }, [address, level.level]);

  // 确保当前链与选中的链一致
  useEffect(() => {
    if (selectedChain) {
      switchChain(selectedChain);
    }
  }, [selectedChain, switchChain]);

  // 监听交易确认状态
  useEffect(() => {
    if (hash && isConfirmed) {
      setTxHash(hash);
      setCurrentStep('success');

      // 保存铸造记录
      if (address) {
        const metadataURI = `https://zhengdao.io/metadata/${level.level}/${address}`;
        SBTMintService.saveMintRecord(
          address,
          selectedChain,
          level.level,
          hash,
          metadataURI
        ).catch(err => {
          console.error('[ClaimSBTFlow] 保存铸造记录失败:', err);
        });
      }

      if (onClaim) {
        onClaim(level.level, selectedChain);
      }
      toast.success('SBT铸造成功！');
    }
  }, [hash, isConfirmed, level, selectedChain, address, onClaim]);

  // 监听交易状态
  useEffect(() => {
    if (isPending || isConfirming) {
      setCurrentStep('claiming');
    }
  }, [isPending, isConfirming]);

  const handleConfirm = () => {
    setCurrentStep('connecting');
  };

  const handleWalletConnect = async (walletType: string) => {
    setIsProcessing(true);
    setError('');

    try {
      // 再次检查是否已铸造
      if (address && hasMinted) {
        throw new Error('此等级SBT已铸造，每个等级只能铸造一次');
      }

      // 检查钱包是否已连接
      const isConnected = isChainConnected(selectedChain);

      if (!isConnected) {
        // 尝试连接指定链
        await connectChain(selectedChain);
      }

      // 检查钱包地址
      if (!address) {
        throw new Error('请先连接钱包');
      }

      // 进入申领流程
      setCurrentStep('claiming');

      // 只支持BNB Chain的合约mint
      if (selectedChain !== 'bnb') {
        throw new Error('目前仅支持BNB Chain的SBT铸造，Solana支持即将推出');
      }

      // 准备metadata URI
      const metadataURI = `https://zhengdao.io/metadata/${level.level}/${address}`;

      // 调用真实的合约mint函数
      toast.loading('正在确认钱包交易...', { id: 'mint-toast' });

      await mintSBT(
        address as `0x${string}`,
        level.level,
        days,
        metadataURI
      );

      // 交易已提交，等待确认
      toast.loading('交易已提交，正在确认...', { id: 'mint-toast' });
    } catch (err) {
      console.error('[ClaimSBTFlow] Mint error:', err);
      const errorMessage = err instanceof Error ? err.message : '申领失败';
      setError(errorMessage);
      setCurrentStep('error');
      toast.error(errorMessage, { id: 'mint-toast' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setCurrentStep('confirm');
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const getChainName = (chain: 'bnb' | 'solana') => {
    return chain === 'bnb' ? 'BNB Chain' : 'Solana';
  };

  const getChainIcon = (chain: 'bnb' | 'solana') => {
    return chain === 'bnb' ? '🟡' : '🟣';
  };

  // 根据链类型获取钱包选项
  const getWalletOptions = () => {
    if (chain === 'bnb') {
      return [
        { id: 'metamask', name: 'MetaMask', icon: '🦊' },
        { id: 'walletconnect', name: 'WalletConnect', icon: '🌐' },
        { id: 'trust', name: 'Trust Wallet', icon: '🛡️' }
      ];
    } else {
      return [
        { id: 'phantom', name: 'Phantom', icon: '👻' },
        { id: 'solflare', name: 'Solflare', icon: '🌞' },
        { id: 'ledger', name: 'Ledger', icon: '🔒' }
      ];
    }
  };

  const chainInfo = getChainInfo(chain);
  const isWalletConnected = chainInfo?.isConnected || false;

  return (
    <div className={`claim-sbt-flow ${className}`}>
      <AnimatePresence mode="wait">
        {/* 步骤1: 确认信息 */}
        {currentStep === 'confirm' && (
          <motion.div
            key="confirm"
            className="claim-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <span className="step-number">1</span>
              <h2>确认申领信息</h2>
            </div>

            <div className="claim-preview">
              <div className="preview-icon">
                <span className="level-emoji">{getLevelIcon(level.icon)}</span>
              </div>

              <div className="preview-info">
                <h3>{level.title}</h3>
                <p>Level {level.level} · {level.titleEn}</p>

                <div className="preview-details">
                  <div className="detail-item">
                    <span className="detail-label">打卡天数</span>
                    <span className="detail-value">{days} 天</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">区块链</span>
                    <span className="detail-value">
                      {getChainIcon(selectedChain)} {getChainName(selectedChain)}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">奖励加成</span>
                    <span className="detail-value bonus">
                      +{level.rewardBonus}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 链选择器 */}
            <div className="chain-selector">
              <p className="selector-label">选择区块链网络：</p>
              <div className="chain-options">
                <button
                  className={`chain-option ${selectedChain === 'bnb' ? 'active' : ''}`}
                  onClick={() => setSelectedChain('bnb')}
                  type="button"
                >
                  <span className="chain-icon">🟡</span>
                  <span className="chain-name">BNB Chain</span>
                  <span className="chain-status">可用</span>
                </button>
                <button
                  className={`chain-option ${selectedChain === 'solana' ? 'active' : ''}`}
                  onClick={() => setSelectedChain('solana')}
                  type="button"
                  disabled
                >
                  <span className="chain-icon">🟣</span>
                  <span className="chain-name">Solana</span>
                  <span className="chain-status coming-soon">即将推出</span>
                </button>
              </div>
            </div>

            {/* Free Mint 标识 */}
            <div className="free-mint-banner">
              <span className="free-mint-icon">🎁</span>
              <span className="free-mint-text">Free Mint - 完全免费铸造</span>
            </div>

            <div className="claim-actions">
              <button className="btn-secondary" onClick={handleClose}>
                取消
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirm}
                disabled={hasMinted}
              >
                {hasMinted ? '已铸造' : '确认申领'}
              </button>
            </div>
          </motion.div>
        )}

        {/* 步骤2: 连接钱包 */}
        {currentStep === 'connecting' && (
          <motion.div
            key="connecting"
            className="claim-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="step-header">
              <span className="step-number">2</span>
              <h2>连接钱包</h2>
            </div>

            {/* 如果钱包已连接，显示提示 */}
            {isWalletConnected ? (
              <div className="wallet-connected">
                <div className="connected-info">
                  <span className="wallet-status-icon">✓</span>
                  <div>
                    <h3>钱包已连接</h3>
                    <p>{getChainName(selectedChain)} 钱包已就绪</p>
                  </div>
                </div>
                <button
                  className="btn-primary btn-full"
                  onClick={() => handleWalletConnect('current')}
                  disabled={isProcessing || hasMinted}
                >
                  {hasMinted ? '已铸造' : isProcessing ? '申领中...' : '开始申领'}
                </button>
              </div>
            ) : (
              <div className="wallet-connect">
                <p className="wallet-instruction">
                  请选择您的{getChainName(selectedChain)}钱包：
                </p>
                <div className="wallet-options">
                  {getWalletOptions().map((wallet) => (
                    <button
                      key={wallet.id}
                      className="wallet-option"
                      onClick={() => handleWalletConnect(wallet.id)}
                      disabled={isProcessing}
                    >
                      <span className="wallet-icon">{wallet.icon}</span>
                      <span>{wallet.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="claim-actions">
              <button
                className="btn-secondary"
                onClick={() => setCurrentStep('confirm')}
              >
                返回
              </button>
            </div>
          </motion.div>
        )}

        {/* 步骤3: 申领中 */}
        {currentStep === 'claiming' && (
          <motion.div
            key="claiming"
            className="claim-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="claim-loading">
              <div className="loading-spinner" />
              <h3>正在申领SBT...</h3>
              <p>请确认钱包交易</p>
            </div>
          </motion.div>
        )}

        {/* 步骤4: 申领成功 */}
        {currentStep === 'success' && (
          <motion.div
            key="success"
            className="claim-step"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="claim-success">
              <h2>申领成功！</h2>
              <p>恭喜你在 {getChainIcon(selectedChain)} {getChainName(selectedChain)} 上获得了 {level.title} SBT</p>

              {txHash && (
                <div className="tx-hash">
                  <span className="tx-label">交易哈希:</span>
                  <span className="tx-value">{txHash.slice(0, 10)}...{txHash.slice(-8)}</span>
                </div>
              )}

              <div className="success-reward">
                <span>奖励加成 +{level.rewardBonus}% 已激活</span>
              </div>
            </div>

            <div className="claim-actions">
              <button className="btn-primary" onClick={handleClose}>
                完成
              </button>
            </div>
          </motion.div>
        )}

        {/* 错误状态 */}
        {currentStep === 'error' && (
          <motion.div
            key="error"
            className="claim-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="claim-error">
              <h2>申领失败</h2>
              <p className="error-message">{error}</p>
            </div>

            <div className="claim-actions">
              <button className="btn-secondary" onClick={handleClose}>
                取消
              </button>
              <button className="btn-primary" onClick={handleRetry}>
                重试
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .claim-sbt-flow {
          background: white;
          border: 2px solid #1a1a1a;
          padding: 2rem;
          max-width: 500px;
        }

        .claim-step {
          min-height: 400px;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .step-number {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #1a1a1a;
          color: white;
          font-weight: bold;
          font-size: 1.25rem;
        }

        .step-header h2 {
          font-size: 1.5rem;
          margin: 0;
        }

        .claim-preview {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          margin-bottom: 2rem;
        }

        .preview-icon {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 2px solid #e0e0e0;
          flex-shrink: 0;
        }

        .level-emoji {
          font-size: 3rem;
        }

        .preview-info {
          flex: 1;
        }

        .preview-info h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem;
          color: #1a1a1a;
        }

        .preview-info > p {
          color: #666;
          margin: 0 0 1rem;
        }

        .preview-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: white;
        }

        .detail-label {
          color: #666;
        }

        .detail-value {
          font-weight: 600;
          color: #1a1a1a;
        }

        .detail-value.bonus {
          color: #10B981;
        }

        .chain-selector {
          margin-bottom: 1.5rem;
        }

        .selector-label {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .chain-options {
          display: flex;
          gap: 1rem;
        }

        .chain-option {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }

        .chain-option:hover:not(:disabled) {
          border-color: #1a1a1a;
          background: #f9f9f9;
        }

        .chain-option.active {
          border-color: #1a1a1a;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chain-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f5f5f5;
        }

        .chain-icon {
          font-size: 1.5rem;
        }

        .chain-name {
          font-weight: 600;
        }

        .chain-status {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          background: #10B981;
          color: white;
        }

        .chain-status.coming-soon {
          background: #9CA3AF;
        }

        .free-mint-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
          font-weight: bold;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          border-radius: 0;
        }

        .free-mint-icon {
          font-size: 1.5rem;
        }

        .free-mint-text {
          font-family: 'Georgia', serif;
        }

        .wallet-connect {
          margin-bottom: 2rem;
        }

        .wallet-instruction {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 1rem;
          text-align: center;
        }

        .wallet-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .wallet-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid #e0e0e0;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .wallet-option:hover:not(:disabled) {
          border-color: #1a1a1a;
          background: #f9f9f9;
        }

        .wallet-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .wallet-icon {
          font-size: 2rem;
        }

        .wallet-connected {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #bae6fd;
        }

        .connected-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .wallet-status-icon {
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #10B981;
          color: white;
          font-size: 1.5rem;
          font-weight: bold;
          border-radius: 50%;
        }

        .connected-info h3 {
          font-size: 1.125rem;
          margin: 0 0 0.25rem;
          color: #0369a1;
        }

        .connected-info p {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }

        .btn-full {
          width: 100%;
        }

        .claim-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
        }

        .loading-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid #f0f0f0;
          border-top-color: #1a1a1a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 2rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .claim-loading h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .claim-loading p {
          color: #666;
        }

        .claim-success {
          text-align: center;
          padding: 2rem;
        }

        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .claim-success h2 {
          font-size: 2rem;
          color: #10B981;
          margin-bottom: 1rem;
        }

        .claim-success > p {
          color: #666;
          margin-bottom: 2rem;
        }

        .tx-hash {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border: 2px solid #e0e0e0;
          margin-bottom: 1rem;
          text-align: left;
        }

        .tx-label {
          font-size: 0.875rem;
          color: #666;
        }

        .tx-value {
          font-family: monospace;
          font-size: 0.875rem;
          color: #1a1a1a;
        }

        .success-reward {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: bold;
        }

        .claim-error {
          text-align: center;
          padding: 2rem;
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .claim-error h2 {
          font-size: 2rem;
          color: #EF4444;
          margin-bottom: 1rem;
        }

        .error-message {
          color: #666;
          margin-bottom: 2rem;
        }

        .claim-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-primary,
        .btn-secondary {
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0;
        }

        .btn-primary {
          background: #1a1a1a;
          color: white;
          border: 2px solid #1a1a1a;
        }

        .btn-primary:hover:not(:disabled) {
          background: #333;
        }

        .btn-secondary {
          background: white;
          color: #1a1a1a;
          border: 2px solid #e0e0e0;
        }

        .btn-secondary:hover:not(:disabled) {
          border-color: #1a1a1a;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
