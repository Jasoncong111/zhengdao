'use client';

import { motion } from 'framer-motion';

type ChainType = 'bnb' | 'solana';

interface ChainSwitcherProps {
  currentChain: ChainType;
  onChainChange?: (chain: ChainType) => void;
  disabled?: boolean;
  className?: string;
}

export function ChainSwitcher({
  currentChain,
  onChainChange,
  disabled = false,
  className = ''
}: ChainSwitcherProps) {
  const handleChainChange = (chain: ChainType) => {
    if (disabled) return;
    if (onChainChange) {
      onChainChange(chain);
    }
  };

  return (
    <div className={`chain-switcher ${className}`}>
      <motion.button
        className={`chain-option ${currentChain === 'bnb' ? 'active' : ''}`}
        onClick={() => handleChainChange('bnb')}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <span className="chain-icon">🟡</span>
        <span className="chain-name">BNB Chain</span>
      </motion.button>

      <motion.button
        className={`chain-option ${currentChain === 'solana' ? 'active' : ''}`}
        onClick={() => handleChainChange('solana')}
        disabled={disabled}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
      >
        <span className="chain-icon">🟣</span>
        <span className="chain-name">Solana</span>
      </motion.button>

      <style jsx>{`
        .chain-switcher {
          display: inline-flex;
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
          padding: 0.25rem;
          gap: 0.25rem;
        }

        .chain-option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-weight: 600;
          color: #666;
        }

        .chain-option:hover:not(:disabled) {
          color: #1a1a1a;
        }

        .chain-option.active {
          background: #1a1a1a;
          color: white;
        }

        .chain-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .chain-icon {
          font-size: 1.25rem;
        }

        .chain-name {
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
