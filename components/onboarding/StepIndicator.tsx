'use client';

/**
 * 步骤指示器组件
 * 显示问卷进度
 */

import { OnboardingStep } from '@/lib/onboarding-service';

interface StepIndicatorProps {
  /** 当前步骤 */
  currentStep: OnboardingStep;
}

/** 步骤定义 */
const STEPS: { key: OnboardingStep; label: string }[] = [
  { key: 'welcome', label: '欢迎' },
  { key: 'wealth', label: '财富' },
  { key: 'health', label: '健康' },
  { key: 'family', label: '家庭' },
  { key: 'other', label: '其他' },
  { key: 'confirm', label: '确认' },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === currentStep);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* 步骤圆点 */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                isCompleted
                  ? 'bg-seal text-white'
                  : isCurrent
                    ? 'bg-ink text-white'
                    : 'bg-gray-300 text-gray-600'
              }`}
              style={{
                fontFamily: 'Georgia, serif',
              }}
            >
              {isCompleted ? '✓' : index + 1}
            </div>

            {/* 步骤标签（仅当前步骤显示） */}
            {isCurrent && (
              <span
                className="ml-2 text-sm font-bold text-ink"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {step.label}
              </span>
            )}

            {/* 连接线（非最后一个步骤） */}
            {index < STEPS.length - 1 && (
              <div
                className={`w-12 h-1 mx-2 transition-all duration-300 ${
                  isCompleted ? 'bg-seal' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
