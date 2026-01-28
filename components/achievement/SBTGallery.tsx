'use client';

/**
 * SBTGallery - SBT展示墙组件
 * 以时间线形式展示用户获得的所有SBT
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AchievementLevel } from '@/lib/achievement-system';
import { getLevelIcon, getLevelSBTImage } from '@/lib/achievement-system';

interface SBTItem {
  tokenId: number;
  level: number;
  chain: 'bnb' | 'solana';
  title: string;
  image: string;
  achievedDate: Date;
  metadata: any;
}

interface SBTGalleryProps {
  sbts: SBTItem[];
  loading?: boolean;
  onSBTClick?: (sbt: SBTItem) => void;
  className?: string;
}

export function SBTGallery({
  sbts,
  loading = false,
  onSBTClick,
  className = ''
}: SBTGalleryProps) {
  const [filterChain, setFilterChain] = useState<'all' | 'bnb' | 'solana'>('all');
  const [selectedSBT, setSelectedSBT] = useState<SBTItem | null>(null);

  // 过滤SBT
  const filteredSBTs = sbts.filter(sbt => {
    if (filterChain === 'all') return true;
    return sbt.chain === filterChain;
  });

  // 按时间排序（最新的在前）
  const sortedSBTs = [...filteredSBTs].sort(
    (a, b) => b.achievedDate.getTime() - a.achievedDate.getTime()
  );

  const handleSBTClick = (sbt: SBTItem) => {
    setSelectedSBT(sbt);
    if (onSBTClick) {
      onSBTClick(sbt);
    }
  };

  const getChainColor = (chain: 'bnb' | 'solana') => {
    return chain === 'bnb' ? '#F3BA2F' : '#9945FF';
  };

  const getChainName = (chain: 'bnb' | 'solana') => {
    return chain === 'bnb' ? 'BNB Chain' : 'Solana';
  };

  const getChainIcon = (chain: 'bnb' | 'solana') => {
    return chain === 'bnb' ? '🟡' : '🟣';
  };

  return (
    <>
      <div className={`sbt-gallery ${className}`}>
        {/* 头部：筛选器 */}
        <motion.div
          className="gallery-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="gallery-title">
            我的SBT收藏 ({sortedSBTs.length})
          </h2>
          <div className="chain-filter">
            <button
              className={filterChain === 'all' ? 'active' : ''}
              onClick={() => setFilterChain('all')}
            >
              <span className="filter-icon">🌐</span>
              <span>全部</span>
            </button>
            <button
              className={filterChain === 'bnb' ? 'active' : ''}
              onClick={() => setFilterChain('bnb')}
            >
              <span className="filter-icon">🟡</span>
              <span>BNB Chain</span>
            </button>
            <button
              className={filterChain === 'solana' ? 'active' : ''}
              onClick={() => setFilterChain('solana')}
            >
              <span className="filter-icon">🟣</span>
              <span>Solana</span>
            </button>
          </div>
        </motion.div>

        {/* 加载状态 */}
        {loading && (
          <div className="gallery-loading">
            <div className="spinner" />
            <p>加载中...</p>
          </div>
        )}

        {/* 空状态 */}
        {!loading && sortedSBTs.length === 0 && (
          <motion.div
            className="gallery-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3>还没有SBT</h3>
            <p>完成打卡成就来获取你的第一个SBT吧！</p>
          </motion.div>
        )}

        {/* SBT网格 */}
        {!loading && sortedSBTs.length > 0 && (
          <motion.div
            className="sbt-grid"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence>
              {sortedSBTs.map((sbt, index) => (
                <motion.div
                  key={sbt.tokenId}
                  className="sbt-card"
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleSBTClick(sbt)}
                >
                  {/* SBT图像 */}
                  <div className="sbt-image">
                    <img
                      src={sbt.image || getLevelSBTImage(sbt.level)}
                      alt={sbt.title}
                    />
                    {/* 链标签 */}
                    <div
                      className="chain-badge"
                      style={{ backgroundColor: getChainColor(sbt.chain) }}
                    >
                      <span className="chain-icon">{getChainIcon(sbt.chain)}</span>
                      <span>{getChainName(sbt.chain)}</span>
                    </div>
                  </div>

                  {/* SBT信息 */}
                  <div className="sbt-info">
                    <div className="sbt-level">
                      <span className="level-icon">
                        {getLevelIcon('walking')}
                      </span>
                      Level {sbt.level}
                    </div>
                    <h4 className="sbt-title">{sbt.title}</h4>
                    <p className="sbt-date">
                      {sbt.achievedDate.toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* SBT详情模态框 */}
        <AnimatePresence>
          {selectedSBT && (
            <motion.div
              className="sbt-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSBT(null)}
            >
              <motion.div
                className="sbt-modal"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="modal-close"
                  onClick={() => setSelectedSBT(null)}
                >
                  ✕
                </button>

                <div className="modal-content">
                  <div className="modal-image">
                    <img
                      src={selectedSBT.image || getLevelSBTImage(selectedSBT.level)}
                      alt={selectedSBT.title}
                    />
                  </div>

                  <div className="modal-info">
                    <div
                      className="modal-chain-badge"
                      style={{ backgroundColor: getChainColor(selectedSBT.chain) }}
                    >
                      <span className="chain-icon">{getChainIcon(selectedSBT.chain)}</span>
                      <span>{getChainName(selectedSBT.chain)}</span>
                    </div>

                    <h2>{selectedSBT.title}</h2>
                    <p className="modal-level">Level {selectedSBT.level}</p>
                    <p className="modal-date">
                      获得时间: {selectedSBT.achievedDate.toLocaleString('zh-CN')}
                    </p>
                    <p className="modal-token-id">Token ID: {selectedSBT.tokenId}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx>{`
          .sbt-gallery {
            padding: 1rem;
          }

          .gallery-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .gallery-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0;
          }

          .chain-filter {
            display: flex;
            gap: 0.5rem;
          }

          .chain-filter button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border: 2px solid #e0e0e0;
            background: white;
            color: #666;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: 0;
          }

          .filter-icon {
            font-size: 1rem;
          }

          .chain-filter button:hover {
            border-color: #999;
          }

          .chain-filter button.active {
            background: #1a1a1a;
            color: white;
            border-color: #1a1a1a;
          }

          .gallery-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4rem 2rem;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid #f0f0f0;
            border-top-color: #1a1a1a;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to { transform: rotate(360deg); }
          }

          .gallery-empty {
            text-align: center;
            padding: 4rem 2rem;
          }

          .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .gallery-empty h3 {
            font-size: 1.5rem;
            color: #1a1a1a;
            margin-bottom: 0.5rem;
          }

          .gallery-empty p {
            color: #666;
          }

          .sbt-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.5rem;
          }

          .sbt-card {
            background: white;
            border: 2px solid #e0e0e0;
            cursor: pointer;
            transition: all 0.3s;
            overflow: hidden;
          }

          .sbt-card:hover {
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          }

          .sbt-image {
            position: relative;
            width: 100%;
            padding-top: 100%; /* 1:1 aspect ratio */
            background: #f5f5f5;
          }

          .sbt-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .chain-badge {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            color: white;
            font-size: 0.75rem;
            font-weight: bold;
          }

          .chain-badge .chain-icon {
            font-size: 0.875rem;
          }

          .sbt-info {
            padding: 1rem;
          }

          .sbt-level {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 0.5rem;
          }

          .level-icon {
            font-size: 1rem;
          }

          .sbt-title {
            font-size: 1.125rem;
            font-weight: bold;
            color: #1a1a1a;
            margin: 0.5rem 0;
          }

          .sbt-date {
            font-size: 0.875rem;
            color: #999;
            margin: 0;
          }

          /* 模态框 */
          .sbt-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 1rem;
          }

          .sbt-modal {
            background: white;
            max-width: 600px;
            width: 100%;
            position: relative;
          }

          .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            width: 2rem;
            height: 2rem;
            border: none;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .modal-close:hover {
            background: rgba(0, 0, 0, 0.8);
            transform: rotate(90deg);
          }

          .modal-content {
            display: flex;
            flex-direction: column;
          }

          .modal-image {
            width: 100%;
            padding-top: 100%;
            position: relative;
            background: #f5f5f5;
          }

          .modal-image img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .modal-info {
            padding: 2rem;
          }

          .modal-chain-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.25rem 0.75rem;
            color: white;
            font-size: 0.875rem;
            font-weight: bold;
            margin-bottom: 1rem;
          }

          .modal-chain-badge .chain-icon {
            font-size: 1rem;
          }

          .modal-info h2 {
            font-size: 2rem;
            margin: 0 0 0.5rem;
            color: #1a1a1a;
          }

          .modal-level {
            font-size: 1.25rem;
            color: #666;
            margin: 0.5rem 0;
          }

          .modal-date,
          .modal-token-id {
            font-size: 0.875rem;
            color: #999;
            margin: 0.25rem 0;
          }

          /* 响应式 */
          @media (max-width: 768px) {
            .gallery-header {
              flex-direction: column;
              align-items: stretch;
            }

            .chain-filter {
              justify-content: center;
            }

            .sbt-grid {
              grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
              gap: 1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
}
