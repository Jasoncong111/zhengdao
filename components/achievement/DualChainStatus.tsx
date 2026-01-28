'use client';

import { motion } from 'framer-motion';
import { AchievementLevel } from '@/lib/achievement-system';
import { getLevelIcon } from '@/lib/achievement-system';

interface ChainStatus {
  chain: 'bnb' | 'solana';
  currentLevel: AchievementLevel | null;
  totalDays: number;
  progress: number;
  claimableLevels: number[];
}

interface DualChainStatusProps {
  bnbStatus: ChainStatus;
  solanaStatus: ChainStatus;
  onClaim?: (chain: 'bnb' | 'solana', level: number) => void;
  className?: string;
}

export function DualChainStatus({
  bnbStatus,
  solanaStatus,
  onClaim,
  className = ''
}: DualChainStatusProps) {
  const renderChainStatus = (status: ChainStatus) => {
    const chainColor = status.chain === 'bnb' ? '#F3BA2F' : '#9945FF';
    const chainName = status.chain === 'bnb' ? 'BNB Chain' : 'Solana';

    return (
      <motion.div
        key={status.chain}
        className="chain-status-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ borderTopColor: chainColor }}
      >
        <div className="chain-header">
          <div className="chain-info">
            <span className="chain-icon">{status.chain === 'bnb' ? '🟡' : '🟣'}</span>
            <h3 className="chain-name">{chainName}</h3>
          </div>
          {status.currentLevel && (
            <div className="level-badge" style={{ backgroundColor: chainColor }}>
              Level {status.currentLevel.level}
            </div>
          )}
        </div>

        {status.currentLevel ? (
          <div className="level-info">
            <div className="level-icon-wrapper">
              <span className="level-emoji">{getLevelIcon(status.currentLevel.icon)}</span>
            </div>
            <div className="level-details">
              <h4 className="level-title">{status.currentLevel.title}</h4>
              <p className="level-subtitle">{status.currentLevel.titleEn}</p>
            </div>
          </div>
        ) : (
          <div className="no-data">
            <p>暂无数据</p>
          </div>
        )}

        {status.currentLevel && (
          <div className="progress-section">
            <div className="progress-info">
              <span>打卡天数</span>
              <span className="days-count">{status.totalDays} 天</span>
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${status.progress}%` }}
                style={{ backgroundColor: chainColor }}
              />
            </div>
          </div>
        )}

        {status.claimableLevels.length > 0 && (
          <div className="claimable-section">
            <p className="claimable-title">可领取的SBT:</p>
            <div className="claimable-list">
              {status.claimableLevels.map((level) => (
                <motion.button
                  key={level}
                  className="claim-btn"
                  onClick={() => onClaim?.(status.chain, level)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ backgroundColor: chainColor }}
                >
                  Level {level}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className={`dual-chain-status ${className}`}>
      <h2 className="section-title">双链成就对比</h2>
      <div className="chains-container">
        {renderChainStatus(bnbStatus)}
        {renderChainStatus(solanaStatus)}
      </div>

      <style jsx>{`
        .dual-chain-status {
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .chains-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .chain-status-card {
          background: white;
          border: 2px solid #e0e0e0;
          border-top: 4px solid;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chain-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chain-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chain-icon {
          font-size: 1.5rem;
        }

        .chain-name {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0;
        }

        .level-badge {
          padding: 0.25rem 0.75rem;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }

        .level-info {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #f9f9f9;
        }

        .level-icon-wrapper {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 2px solid #e0e0e0;
        }

        .level-emoji {
          font-size: 2rem;
        }

        .level-details {
          flex: 1;
        }

        .level-title {
          font-size: 1.125rem;
          font-weight: bold;
          margin: 0 0 0.25rem;
        }

        .level-subtitle {
          font-size: 0.875rem;
          color: #666;
          margin: 0;
        }

        .no-data {
          padding: 2rem;
          text-align: center;
          color: #999;
        }

        .progress-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #666;
        }

        .days-count {
          font-weight: bold;
          color: #1a1a1a;
        }

        .progress-bar {
          height: 6px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.8s ease;
        }

        .claimable-section {
          padding: 1rem;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border: 2px solid #bae6fd;
        }

        .claimable-title {
          font-size: 0.875rem;
          font-weight: bold;
          color: #0369a1;
          margin: 0 0 0.5rem;
        }

        .claimable-list {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .claim-btn {
          padding: 0.5rem 1rem;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
        }

        .claim-btn:hover {
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .chains-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
