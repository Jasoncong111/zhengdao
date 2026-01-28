'use client';

/**
 * 家庭目标步骤组件
 */

import { motion } from 'framer-motion';
import { FamilyGoal } from '@/lib/db';
import {
  FAMILY_TIME_OPTIONS,
  FAMILY_RELATIONSHIP_OPTIONS,
} from '@/lib/onboarding-service';

interface FamilyGoalStepProps {
  /** 当前选择 */
  goals: FamilyGoal;
  /** 更新选择 */
  onChange: (goals: FamilyGoal) => void;
  /** 上一步 */
  onPrev: () => void;
  /** 下一步 */
  onNext: () => void;
}

export function FamilyGoalStep({ goals, onChange, onPrev, onNext }: FamilyGoalStepProps) {
  const isComplete =
    goals.familyTime &&
    goals.parentChildRelationship &&
    goals.partnerRelationship;

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
          家庭目标
        </h2>
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          设定未来五年的家庭目标
        </p>
      </div>

      {/* 家庭陪伴时间 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          家庭陪伴时间
        </label>
        <div className="grid grid-cols-3 gap-3">
          {FAMILY_TIME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, familyTime: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.familyTime === option.value
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

      {/* 亲子关系 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          亲子关系改善
        </label>
        <div className="grid grid-cols-3 gap-3">
          {FAMILY_RELATIONSHIP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, parentChildRelationship: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.parentChildRelationship === option.value
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

      {/* 伴侣关系 */}
      <div className="space-y-3">
        <label className="block text-lg font-bold text-ink" style={{ fontFamily: 'Georgia, serif' }}>
          伴侣关系维护
        </label>
        <div className="grid grid-cols-3 gap-3">
          {FAMILY_RELATIONSHIP_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange({ ...goals, partnerRelationship: option.value })}
              className={`p-4 border-2 font-bold transition-all ${
                goals.partnerRelationship === option.value
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
