'use client';

/**
 * ComingSoonCard - Coming Soon界面卡片组件
 * 用于展示即将推出的功能
 *
 * 设计文档: docs/design/coming-soon-design.md
 */

import { motion } from 'framer-motion';

export interface ComingSoonCardProps {
  /** 功能标题 */
  title: string;
  /** 功能图标（emoji或图标组件） */
  icon: string;
  /** 功能描述 */
  description: string;
  /** 功能规则说明 */
  rules?: string[];
  /** 期待值（1-5星） */
  expectation?: number;
  /** 预计上线时间 */
  timeline: string;
  /** 额外的CSS类名 */
  className?: string;
}

export function ComingSoonCard({
  title,
  icon,
  description,
  rules = [],
  expectation = 5,
  timeline,
  className = ''
}: ComingSoonCardProps) {
  return (
    <motion.div
      className={`coming-soon-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -4 }}
    >
      {/* Coming Soon 徽章 */}
      <div className="coming-soon-badge">
        Coming Soon
      </div>

      {/* 图标 */}
      <div className="coming-soon-icon">
        {icon}
      </div>

      {/* 标题 */}
      <h3 className="coming-soon-title">
        {title}
      </h3>

      {/* 描述 */}
      <p className="coming-soon-description">
        {description}
      </p>

      {/* 规则说明 */}
      {rules && rules.length > 0 && (
        <div className="coming-soon-rules">
          <div className="rules-title">规则说明:</div>
          <ul className="rules-list">
            {rules.map((rule, index) => (
              <li key={index} className="rule-item">{rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 期待值 */}
      <div className="coming-soon-expectation">
        <span>期待值:</span>
        <span>{'⭐'.repeat(Math.min(expectation, 5))}</span>
      </div>

      {/* 时间线 */}
      <div className="coming-soon-timeline">
        预计上线: {timeline}
      </div>

      <style jsx>{`
        .coming-soon-card {
          position: relative;
          background: linear-gradient(135deg, #FFFEF2 0%, #F5F5DC 100%);
          border: 2px solid #000000;
          padding: 2rem;
          min-height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          transition: all 0.3s ease;
        }

        .coming-soon-card:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .coming-soon-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #D43628;
          color: white;
          padding: 0.5rem 1rem;
          font-family: 'Georgia', serif;
          font-weight: bold;
          font-size: 0.875rem;
          letter-spacing: 0.05em;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .coming-soon-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .coming-soon-title {
          font-family: 'Georgia', serif;
          font-size: 1.5rem;
          font-weight: bold;
          color: #000000;
          margin-bottom: 1rem;
        }

        .coming-soon-description {
          font-family: 'Georgia', serif;
          font-size: 1rem;
          color: #666666;
          max-width: 400px;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .coming-soon-rules {
          width: 100%;
          max-width: 400px;
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.03);
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }

        .rules-title {
          font-family: 'Georgia', serif;
          font-size: 0.875rem;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .rules-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .rule-item {
          font-family: 'Georgia', serif;
          font-size: 0.875rem;
          color: #666666;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          padding-left: 0.5rem;
        }

        .rule-item:last-child {
          margin-bottom: 0;
        }

        .coming-soon-expectation {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #D43628;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .coming-soon-timeline {
          font-size: 0.875rem;
          color: #999999;
          margin-top: 1rem;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .coming-soon-card {
            padding: 1.5rem;
            min-height: 320px;
          }

          .coming-soon-icon {
            font-size: 3rem;
          }

          .coming-soon-title {
            font-size: 1.25rem;
          }

          .coming-soon-description {
            font-size: 0.875rem;
          }

          .coming-soon-rules {
            padding: 0.75rem;
          }

          .rules-title {
            font-size: 0.8rem;
          }

          .rule-item {
            font-size: 0.75rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .coming-soon-card {
            padding: 1.75rem;
          }

          .coming-soon-icon {
            font-size: 3.5rem;
          }
        }
      `}</style>
    </motion.div>
  );
}

export default ComingSoonCard;
