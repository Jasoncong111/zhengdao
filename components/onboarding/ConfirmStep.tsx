'use client';

/**
 * 确认步骤组件
 * 汇总展示所有选择
 */

import { motion } from 'framer-motion';
import { WealthGoal, HealthGoal, FamilyGoal, OtherGoal } from '@/lib/db';

interface ConfirmStepProps {
  /** 财富目标 */
  wealthGoals: WealthGoal;
  /** 健康目标 */
  healthGoals: HealthGoal;
  /** 家庭目标 */
  familyGoals: FamilyGoal;
  /** 其他目标 */
  otherGoals: OtherGoal;
  /** 上一步 */
  onPrev: () => void;
  /** 确认提交 */
  onConfirm: () => void;
  /** 重新开始 */
  onRestart: () => void;
  /** 保存中状态 */
  isSaving?: boolean;
}

export function ConfirmStep({
  wealthGoals,
  healthGoals,
  familyGoals,
  otherGoals,
  onPrev,
  onConfirm,
  onRestart,
  isSaving = false,
}: ConfirmStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-6"
    >
      {/* 标题 */}
      <div className="text-center space-y-2">
        <h2
          className="text-3xl font-bold text-ink"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          确认你的目标
        </h2>
        <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
          请确认未来五年的目标设定
        </p>
      </div>

      {/* 财富目标 */}
      <div className="bg-paper border-2 border-ink/20 p-6 space-y-3">
        <h3
          className="text-xl font-bold text-ink flex items-center gap-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span>💰</span>
          <span>财富目标</span>
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-ink/60 mb-1">月收入</div>
            <div className="font-bold text-ink">{wealthGoals.monthlyIncome}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">存款</div>
            <div className="font-bold text-ink">{wealthGoals.savings}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">投资</div>
            <div className="font-bold text-ink">{wealthGoals.investmentReturn}</div>
          </div>
        </div>
      </div>

      {/* 健康目标 */}
      <div className="bg-paper border-2 border-ink/20 p-6 space-y-3">
        <h3
          className="text-xl font-bold text-ink flex items-center gap-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span>💪</span>
          <span>健康目标</span>
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-ink/60 mb-1">运动</div>
            <div className="font-bold text-ink">{healthGoals.exerciseFrequency}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">体重</div>
            <div className="font-bold text-ink">{healthGoals.weightManagement}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">睡眠</div>
            <div className="font-bold text-ink">{healthGoals.sleepQuality}</div>
          </div>
        </div>
      </div>

      {/* 家庭目标 */}
      <div className="bg-paper border-2 border-ink/20 p-6 space-y-3">
        <h3
          className="text-xl font-bold text-ink flex items-center gap-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span>👨‍👩‍👧‍👦</span>
          <span>家庭目标</span>
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-ink/60 mb-1">陪伴时间</div>
            <div className="font-bold text-ink">{familyGoals.familyTime}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">亲子关系</div>
            <div className="font-bold text-ink">{familyGoals.parentChildRelationship}</div>
          </div>
          <div>
            <div className="text-ink/60 mb-1">伴侣关系</div>
            <div className="font-bold text-ink">{familyGoals.partnerRelationship}</div>
          </div>
        </div>
      </div>

      {/* 其他目标 */}
      <div className="bg-paper border-2 border-ink/20 p-6 space-y-3">
        <h3
          className="text-xl font-bold text-ink flex items-center gap-2"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          <span>📚</span>
          <span>成长目标</span>
        </h3>
        <div className="space-y-3 text-sm">
          {otherGoals.learningGoals.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">学习成长</div>
              <div className="flex flex-wrap gap-2">
                {otherGoals.learningGoals.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-ink/10 border border-ink/30 font-bold text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {otherGoals.socialGoals.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">社交关系</div>
              <div className="flex flex-wrap gap-2">
                {otherGoals.socialGoals.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-ink/10 border border-ink/30 font-bold text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {otherGoals.hobbies.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">兴趣爱好</div>
              <div className="flex flex-wrap gap-2">
                {otherGoals.hobbies.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1 bg-ink/10 border border-ink/30 font-bold text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 提示文字 */}
      <div className="text-center text-sm text-ink/60">
        <p>你可以在个人主页随时修改这些目标</p>
      </div>

      {/* 导航按钮 */}
      <div className="grid grid-cols-3 gap-3 pt-4">
        <button
          onClick={onRestart}
          disabled={isSaving}
          className="py-3 border-2 border-ink/40 text-ink/70 font-bold disabled:opacity-50 hover:border-ink hover:text-ink transition-colors"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          重新开始
        </button>
        <button
          onClick={onPrev}
          disabled={isSaving}
          className="py-3 border-2 border-ink text-ink font-bold disabled:opacity-50"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          返回修改
        </button>
        <button
          onClick={onConfirm}
          disabled={isSaving}
          className="py-3 bg-seal text-paper font-bold disabled:opacity-50"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          {isSaving ? '保存中...' : '确认提交'}
        </button>
      </div>
    </motion.div>
  );
}
