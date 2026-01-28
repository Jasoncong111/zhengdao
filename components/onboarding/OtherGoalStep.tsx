'use client';

/**
 * 其他目标步骤组件
 */

import { motion } from 'framer-motion';
import { OtherGoal } from '@/lib/db';
import {
  OTHER_LEARNING_OPTIONS,
  OTHER_SOCIAL_OPTIONS,
  OTHER_HOBBY_OPTIONS,
} from '@/lib/onboarding-service';

interface OtherGoalStepProps {
  /** 当前选择 */
  goals: OtherGoal;
  /** 更新选择 */
  onChange: (goals: OtherGoal) => void;
  /** 上一步 */
  onPrev: () => void;
  /** 下一步 */
  onNext: () => void;
}

export function OtherGoalStep({ goals, onChange, onPrev, onNext }: OtherGoalStepProps) {
  const isComplete =
    goals.learningGoals.length > 0 ||
    goals.socialGoals.length > 0 ||
    goals.hobbies.length > 0;

  /** 切换选项 */
  const toggleOption = (
    category: keyof OtherGoal,
    value: string
  ) => {
    const currentArray = goals[category] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];

    onChange({
      ...goals,
      [category]: newArray,
    });
  };

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
          其他目标
        </h2>
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          选择你想要发展的方向（可多选）
        </p>
      </div>

      {/* 学习成长 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          学习成长
        </label>
        <div className="grid grid-cols-2 gap-3">
          {OTHER_LEARNING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleOption('learningGoals', option.value)}
              className={`p-4 border-2 font-bold transition-all text-left ${
                goals.learningGoals.includes(option.value)
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

      {/* 社交关系 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          社交关系
        </label>
        <div className="grid grid-cols-3 gap-3">
          {OTHER_SOCIAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleOption('socialGoals', option.value)}
              className={`p-4 border-2 font-bold transition-all ${
                goals.socialGoals.includes(option.value)
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

      {/* 兴趣爱好 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          兴趣爱好
        </label>
        <div className="grid grid-cols-3 gap-3">
          {OTHER_HOBBY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleOption('hobbies', option.value)}
              className={`p-4 border-2 font-bold transition-all text-center ${
                goals.hobbies.includes(option.value)
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
