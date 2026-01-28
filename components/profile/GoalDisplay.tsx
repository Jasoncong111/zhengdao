'use client';

/**
 * 目标展示组件
 * 展示用户的人生目标（来自问卷数据）
 */

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { GoalsService } from '@/lib/db-goals';
import { useSkipMode } from '@/lib/context/SkipModeContext';
import { demoLifeGoal } from '@/lib/demo-data';
import type { LifeGoal } from '@/lib/db';

interface GoalDisplayProps {
  /** 编辑回调 */
  onEdit?: () => void;
}

export function GoalDisplay({ onEdit }: GoalDisplayProps) {
  const { address } = useAccount();
  const { isSkipMode } = useSkipMode();
  const [goals, setGoals] = useState<LifeGoal | null>(null);
  const [loading, setLoading] = useState(true);

  /** 加载目标数据 */
  useEffect(() => {
    const loadGoals = async () => {
      setLoading(true);

      try {
        // 游客模式：使用演示数据
        if (isSkipMode) {
          console.log('[GoalDisplay] 游客模式，使用演示目标');
          setGoals(demoLifeGoal);
        }
        // 真实用户：从数据库加载
        else if (address) {
          const data = await GoalsService.getGoalsByWallet(address);
          setGoals(data || null);
        }
      } catch (error) {
        console.error('[GoalDisplay] 加载失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 只有在连接钱包或游客模式时才加载
    if (address || isSkipMode) {
      loadGoals();
    } else {
      setLoading(false);
    }
  }, [address, isSkipMode]);

  if (loading) {
    return (
      <div className="bg-paper border-2 border-ink/20 p-6">
        <div className="text-center text-ink/60">加载中...</div>
      </div>
    );
  }

  if (!goals) {
    return (
      <div className="bg-paper border-2 border-ink/20 p-6 text-center">
        <p className="text-ink/60 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          还未设置人生目标
        </p>
        <button
          onClick={() => (window.location.href = '/onboarding')}
          className="px-6 py-2 bg-ink text-paper font-bold"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          立即设置
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* 标题栏 */}
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold text-ink"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          人生目标
        </h2>
        {onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-ink/60 hover:text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            编辑
          </button>
        )}
      </div>

      {/* 财富目标 */}
      <div className="bg-paper border-2 border-ink/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💰</span>
          <h3
            className="text-lg font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            财富目标
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-ink/60">月收入</div>
            <div className="font-bold text-ink">{goals.wealthGoals.monthlyIncome}</div>
          </div>
          <div>
            <div className="text-ink/60">存款</div>
            <div className="font-bold text-ink">{goals.wealthGoals.savings}</div>
          </div>
          <div>
            <div className="text-ink/60">投资</div>
            <div className="font-bold text-ink">{goals.wealthGoals.investmentReturn}</div>
          </div>
        </div>
      </div>

      {/* 健康目标 */}
      <div className="bg-paper border-2 border-ink/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💪</span>
          <h3
            className="text-lg font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            健康目标
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-ink/60">运动</div>
            <div className="font-bold text-ink">{goals.healthGoals.exerciseFrequency}</div>
          </div>
          <div>
            <div className="text-ink/60">体重</div>
            <div className="font-bold text-ink">{goals.healthGoals.weightManagement}</div>
          </div>
          <div>
            <div className="text-ink/60">睡眠</div>
            <div className="font-bold text-ink">{goals.healthGoals.sleepQuality}</div>
          </div>
        </div>
      </div>

      {/* 家庭目标 */}
      <div className="bg-paper border-2 border-ink/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">👨‍👩‍👧‍👦</span>
          <h3
            className="text-lg font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            家庭目标
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="text-ink/60">陪伴时间</div>
            <div className="font-bold text-ink">{goals.familyGoals.familyTime}</div>
          </div>
          <div>
            <div className="text-ink/60">亲子关系</div>
            <div className="font-bold text-ink">{goals.familyGoals.parentChildRelationship}</div>
          </div>
          <div>
            <div className="text-ink/60">伴侣关系</div>
            <div className="font-bold text-ink">{goals.familyGoals.partnerRelationship}</div>
          </div>
        </div>
      </div>

      {/* 其他目标 */}
      <div className="bg-paper border-2 border-ink/20 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📚</span>
          <h3
            className="text-lg font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            成长目标
          </h3>
        </div>
        <div className="space-y-3 text-sm">
          {goals.otherGoals.learningGoals.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">学习成长</div>
              <div className="flex flex-wrap gap-2">
                {goals.otherGoals.learningGoals.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-ink/10 border border-ink/30 font-bold text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {goals.otherGoals.socialGoals.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">社交关系</div>
              <div className="flex flex-wrap gap-2">
                {goals.otherGoals.socialGoals.map((item, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-ink/10 border border-ink/30 font-bold text-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
          {goals.otherGoals.hobbies.length > 0 && (
            <div>
              <div className="text-ink/60 mb-1">兴趣爱好</div>
              <div className="flex flex-wrap gap-2">
                {goals.otherGoals.hobbies.map((item, index) => (
                  <span
                    key={index}
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
    </motion.div>
  );
}
