'use client';

/**
 * 欢迎步骤组件
 * 介绍产品理念
 */

import { motion } from 'framer-motion';

interface WelcomeStepProps {
  /** 下一步回调 */
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* 标题 */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl font-bold text-ink"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          你想要过一个怎样的人生？
        </h1>
        <p
          className="text-lg text-ink/70"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          证道 · 五年人生规划
        </p>
      </div>

      {/* 核心理念 */}
      <div className="bg-paper border-2 border-ink/20 p-8 space-y-6">
        <div className="space-y-4">
          <h2
            className="text-2xl font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            吾日三省吾身
          </h2>
          <p className="text-ink/80 leading-relaxed">
            通过每日自省与复盘，帮助你达成人生目标。
            <br />
            让每一天都过得有意义。
          </p>
        </div>

        {/* 四个维度 */}
        <div className="grid grid-cols-2 gap-4 pt-6">
          <div className="text-center p-4 border border-ink/20">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
              财富
            </div>
          </div>
          <div className="text-center p-4 border border-ink/20">
            <div className="text-3xl mb-2">💪</div>
            <div className="font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
              健康
            </div>
          </div>
          <div className="text-center p-4 border border-ink/20">
            <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
            <div className="font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
              家庭
            </div>
          </div>
          <div className="text-center p-4 border border-ink/20">
            <div className="text-3xl mb-2">📚</div>
            <div className="font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
              成长
            </div>
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="text-center text-sm text-ink/60 space-y-2">
        <p>接下来的问卷将帮助你：</p>
        <ul className="space-y-1">
          <li>✓ 明确未来五年的目标</li>
          <li>✓ 规划财富、健康、家庭和成长方向</li>
          <li>✓ 为每日复盘提供参考基准</li>
        </ul>
      </div>

      {/* 开始按钮 */}
      <button
        onClick={onNext}
        className="w-full py-4 bg-ink text-paper font-bold text-lg"
        style={{
          borderRadius: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        开始规划
      </button>
    </motion.div>
  );
}
