'use client';

/**
 * 健康目标步骤组件
 */

import { motion } from 'framer-motion';
import { HealthGoal } from '@/lib/db';
import {
  HEALTH_EXERCISE_OPTIONS,
  HEALTH_WEIGHT_OPTIONS,
  HEALTH_SLEEP_OPTIONS,
} from '@/lib/onboarding-service';

interface HealthGoalStepProps {
  /** 当前选择 */
  goals: HealthGoal;
  /** 更新选择 */
  onChange: (goals: HealthGoal) => void;
  /** 上一步 */
  onPrev: () => void;
  /** 下一步 */
  onNext: () => void;
}

export function HealthGoalStep({ goals, onChange, onPrev, onNext }: HealthGoalStepProps) {
  const isComplete =
    goals.exerciseFrequency && goals.weightManagement && goals.sleepQuality;

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
          健康目标
        </h2>
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          设定未来五年的健康目标
        </p>
      </div>

      {/* 运动频率 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          运动频率
        </label>
        <div className="grid grid-cols-2 gap-3">
          {HEALTH_EXERCISE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, exerciseFrequency: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.exerciseFrequency === option.value
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

      {/* 体重管理 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          体重管理目标
        </label>
        <div className="grid grid-cols-3 gap-3">
          {HEALTH_WEIGHT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, weightManagement: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.weightManagement === option.value
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

      {/* 睡眠质量 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          睡眠质量目标
        </label>
        <div className="grid grid-cols-3 gap-3">
          {HEALTH_SLEEP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, sleepQuality: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.sleepQuality === option.value
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
