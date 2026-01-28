'use client';

/**
 * LevelDisplay - 等级展示组件
 * 显示用户当前等级、进度条、下一等级预览
 * 支持BNB Chain和Solana双链切换
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AchievementLevel } from '@/lib/achievement-system';
import { getLevelIcon, getDaysToNextLevel, calculateProgress } from '@/lib/achievement-system';
import { ChainSwitcher } from './ChainSwitcher';
import { useChainManager } from '@/lib/chain-manager';

interface LevelDisplayProps {
  bnbData: {
    currentDays: number;
    currentLevel: AchievementLevel;
    nextLevel: AchievementLevel | null;
  };
  solanaData: {
    currentDays: number;
    currentLevel: AchievementLevel;
    nextLevel: AchievementLevel | null;
  };
  className?: string;
}

export function LevelDisplay({
  bnbData,
  solanaData,
  className = ''
}: LevelDisplayProps) {
  const [currentChain, setCurrentChain] = useState<'bnb' | 'solana'>('bnb');
  const [progress, setProgress] = useState(0);
  const [animatedDays, setAnimatedDays] = useState(0);
  const { getCurrentChainInfo } = useChainManager();

  // 根据当前链选择数据
  const currentData = currentChain === 'bnb' ? bnbData : solanaData;
  const { currentDays, currentLevel, nextLevel } = currentData;

  const daysToNext = nextLevel
    ? nextLevel.requiredDays - currentDays
    : 0;

  // 处理链切换
  const handleChainChange = (chain: 'bnb' | 'solana') => {
    setCurrentChain(chain);
    // 重置动画
    setProgress(0);
    setAnimatedDays(0);
  };

  // 进度动画
  useEffect(() => {
    const targetProgress = nextLevel
      ? calculateProgress(currentDays, currentLevel.level + 1)
      : 100;

    const duration = 800;
    const steps = 30;
    const stepProgress = targetProgress / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setProgress(currentStep * stepProgress);
      } else {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentDays, currentLevel, nextLevel]);

  // 数字滚动动画
  useEffect(() => {
    const duration = 1000;
    const steps = 20;
    const stepDays = currentDays / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedDays(Math.floor(currentStep * stepDays));
      } else {
        setAnimatedDays(currentDays);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentDays]);

  return (
    <div className={`level-display ${className}`}>
      {/* 链切换器 */}
      <motion.div
        className="chain-switcher-wrapper"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChainSwitcher
          currentChain={currentChain}
          onChainChange={handleChainChange}
        />
        <div className="chain-info-badge">
          <span className="chain-icon">{currentChain === 'bnb' ? '🟡' : '🟣'}</span>
          <span className="chain-name">{currentChain === 'bnb' ? 'BNB Chain' : 'Solana'}</span>
        </div>
      </motion.div>

      {/* 当前等级 */}
      <motion.div
        className="level-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        key={currentChain} // key改变时重新触发动画
      >
        <motion.div
          className="level-icon"
          style={{
            backgroundColor: currentLevel.primaryColor,
            color: currentLevel.secondaryColor
          }}
          whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-4xl">{getLevelIcon(currentLevel.icon)}</span>
        </motion.div>

        <div className="level-info">
          <h2 className="level-title">{currentLevel.title}</h2>
          <p className="level-subtitle">
            Level {currentLevel.level} · {currentLevel.titleEn}
          </p>
        </div>
      </motion.div>

      {/* 打卡天数 */}
      <motion.div
        className="days-display"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span className="days-number">{animatedDays}</span>
        <span className="days-label">天</span>
      </motion.div>

      {/* 进度条 */}
      {nextLevel && (
        <motion.div
          className="progress-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                backgroundColor: nextLevel.primaryColor
              }}
            />
          </div>
          <p className="progress-text">
            距离 {nextLevel.title} 还需 {daysToNext} 天
          </p>
        </motion.div>
      )}

      {/* 奖励加成 */}
      {currentLevel.rewardBonus > 0 && (
        <motion.div
          className="reward-badge"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span>奖励加成 +{currentLevel.rewardBonus}%</span>
        </motion.div>
      )}

      {/* 关键词标签 */}
      <motion.div
        className="keywords-tags"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {currentLevel.keywords.map((keyword, index) => (
          <motion.span
            key={index}
            className="keyword-tag"
            style={{
              borderColor: currentLevel.primaryColor,
              color: currentLevel.primaryColor
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            {keyword}
          </motion.span>
        ))}
      </motion.div>

      {/* 等级描述 */}
      <motion.p
        className="level-description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {currentLevel.description}
      </motion.p>

      <style jsx>{`
        .level-display {
          padding: 1.5rem;
          border: 2px solid #1a1a1a;
          background: #fff;
          border-radius: 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .chain-switcher-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .chain-info-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f5f5f5;
          border: 2px solid #e0e0e0;
        }

        .chain-info-badge .chain-icon {
          font-size: 1.25rem;
        }

        .chain-info-badge .chain-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #666;
        }

        .level-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .level-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0;
          font-size: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .level-info {
          flex: 1;
        }

        .level-title {
          font-size: 1.5rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          color: #1a1a1a;
          margin: 0;
        }

        .level-subtitle {
          font-size: 0.875rem;
          color: #666;
          margin: 0.25rem 0 0;
        }

        .days-display {
          text-align: center;
          margin: 2rem 0;
        }

        .days-number {
          font-size: 4rem;
          font-weight: bold;
          font-family: 'Georgia', serif;
          color: #1a1a1a;
        }

        .days-label {
          font-size: 1rem;
          color: #666;
          margin-left: 0.5rem;
        }

        .progress-section {
          margin: 1.5rem 0;
        }

        .progress-bar {
          height: 8px;
          background: #f0f0f0;
          border-radius: 0;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .progress-text {
          text-align: center;
          font-size: 0.875rem;
          color: #666;
          margin: 0.5rem 0 0;
        }

        .reward-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: bold;
          margin-top: 1rem;
          border-radius: 0;
        }

        .keywords-tags {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .keyword-tag {
          padding: 0.25rem 0.75rem;
          border: 2px solid;
          font-size: 0.75rem;
          font-weight: bold;
          background: #f9f9f9;
          transition: all 0.2s;
        }

        .level-description {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: #666;
          text-align: center;
          font-style: italic;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .level-header {
            flex-direction: column;
            text-align: center;
          }

          .level-icon {
            width: 60px;
            height: 60px;
          }

          .days-number {
            font-size: 3rem;
          }

          .keywords-tags {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
