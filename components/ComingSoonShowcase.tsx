'use client';

/**
 * ComingSoonShowcase - 展示所有即将推出的功能
 *
 * 包含4个功能的Coming Soon展示：
 * 1. DeFi挑战池
 * 2. 名人挑战赛
 * 3. 积分系统
 * 4. PVP论剑
 */

import { motion } from 'framer-motion';
import { ComingSoonCard } from './ComingSoonCard';

interface Feature {
  title: string;
  icon: string;
  description: string;
  rules: string[];
  expectation: number;
  timeline: string;
}

const FEATURES: Feature[] = [
  {
    title: '挑战池',
    icon: '💰',
    description: '入金参与挑战，完成打卡目标瓜分奖励池',
    rules: [
      '• 选择挑战周期（7天/30天/100天）',
      '• 入金到挑战池（最低0.1 BNB）',
      '• 每日完成打卡即视为成功',
      '• 周期结束后，成功者瓜分失败者的资金',
      '• 全员成功则资金原路返还'
    ],
    expectation: 5,
    timeline: 'Q2 2026'
  },
  {
    title: '名人挑战',
    icon: '⭐',
    description: '追踪名人自律情况，参与预测赢取奖励',
    rules: [
      '• 选择追踪的名人（KOL/创业者/明星）',
      '• 系统自动追踪名人每日推文/动态',
      '• 预测名人是否完成自律目标',
      '• 预测正确获得积分奖励',
      '• 名人未达标时，追踪者瓜分奖励池'
    ],
    expectation: 5,
    timeline: 'Q3 2026'
  },
  {
    title: '积分系统',
    icon: '🎯',
    description: '打卡获取积分，积分可兑换权益',
    rules: [
      '• 每日打卡获得10基础积分',
      '• 连续打卡加成（7天+20%，30天+50%，100天+100%）',
      '• 「有意义的一天」额外+5积分',
      '• 积分可兑换：高级SBT皮肤、挑战池入场券、名人挑战特权、专属头像框'
    ],
    expectation: 5,
    timeline: 'Q1 2026'
  },
  {
    title: '论剑',
    icon: '⚔️',
    description: '与好友PK打卡，胜者获得额外奖励',
    rules: [
      '• 发起挑战，邀请好友参与',
      '• 双方质押相同积分',
      '• 比拼周期内的打卡表现：打卡天数、有意义天数比例、复盘质量评分',
      '• 胜者获得对方质押的积分',
      '• 平局则各自取回'
    ],
    expectation: 5,
    timeline: 'Q2 2026'
  }
];

export function ComingSoonShowcase() {
  return (
    <div className="coming-soon-showcase">
      {/* 页面标题 */}
      <motion.div
        className="showcase-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="showcase-title">即将推出</h1>
        <p className="showcase-subtitle">
          更多精彩功能，敬请期待
        </p>
        <div className="showcase-divider" />
      </motion.div>

      {/* 功能卡片网格 */}
      <div className="features-grid">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ComingSoonCard
              title={feature.title}
              icon={feature.icon}
              description={feature.description}
              rules={feature.rules}
              expectation={feature.expectation}
              timeline={feature.timeline}
            />
          </motion.div>
        ))}
      </div>

      {/* 页脚提示 */}
      <motion.div
        className="showcase-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p>💡 提示：关注我们的动态，第一时间了解功能上线情况</p>
      </motion.div>

      <style jsx>{`
        .coming-soon-showcase {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        .showcase-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .showcase-title {
          font-family: 'Georgia', serif;
          font-size: 3rem;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .showcase-subtitle {
          font-family: 'Georgia', serif;
          font-size: 1.25rem;
          color: #666;
          margin-bottom: 2rem;
        }

        .showcase-divider {
          width: 80px;
          height: 3px;
          background: #D43628;
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .showcase-footer {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, #FFFEF2 0%, #F5F5DC 100%);
          border: 2px solid #e0e0e0;
        }

        .showcase-footer p {
          font-family: 'Georgia', serif;
          font-size: 1rem;
          color: #666;
          margin: 0;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .coming-soon-showcase {
            padding: 2rem 1rem;
          }

          .showcase-title {
            font-size: 2rem;
          }

          .showcase-subtitle {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}

export default ComingSoonShowcase;
