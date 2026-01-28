'use client';

/**
 * 财富目标步骤组件
 */

import { motion } from 'framer-motion';
import { WealthGoal } from '@/lib/db';
import {
  WEALTH_INCOME_OPTIONS,
  WEALTH_SAVINGS_OPTIONS,
  WEALTH_INVESTMENT_OPTIONS,
} from '@/lib/onboarding-service';

interface WealthGoalStepProps {
  /** 当前选择 */
  goals: WealthGoal;
  /** 更新选择 */
  onChange: (goals: WealthGoal) => void;
  /** 上一步 */
  onPrev: () => void;
  /** 下一步 */
  onNext: () => void;
}

export function WealthGoalStep({ goals, onChange, onPrev, onNext }: WealthGoalStepProps) {
  const isComplete =
    goals.monthlyIncome && goals.savings && goals.investmentReturn;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* 标题 */}
      <div className="text-center space-y-2">
        <h2
          className="text-3xl font-bold text-ink"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          财富目标
        </h2>
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          设定未来五年的财务目标
        </p>
      </div>

      {/* 月收入目标 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          月收入目标
        </label>
        <div className="grid grid-cols-2 gap-3">
          {WEALTH_INCOME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, monthlyIncome: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.monthlyIncome === option.value
                  ? 'border-seal bg-seal text-white'
                  : 'border-ink/30 bg-paper text-ink hover:border-ink'
              }`}
              style={{
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 存款目标 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          存款目标
        </label>
        <div className="grid grid-cols-2 gap-3">
          {WEALTH_SAVINGS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, savings: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.savings === option.value
                  ? 'border-seal bg-seal text-white'
                  : 'border-ink/30 bg-paper text-ink hover:border-ink'
              }`}
              style={{
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 投资收益目标 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          投资收益目标
        </label>
        <div className="grid grid-cols-1 gap-3">
          {WEALTH_INVESTMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, investmentReturn: option.value })}
              className={`p-4 border-2 font-bold text-left transition-all ${
                goals.investmentReturn === option.value
                  ? 'border-seal bg-seal text-white'
                  : 'border-ink/30 bg-paper text-ink hover:border-ink'
              }`}
              style={{
                borderRadius: 0,
                fontFamily: 'Georgia, serif',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={onPrev}
          className="flex-1 py-3 border-2 border-ink text-ink font-bold"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          上一步
        </button>
        <button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-1 py-3 bg-ink text-paper font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          下一步
        </button>
      </div>
    </motion.div>
  );
}
