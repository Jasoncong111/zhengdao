'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type PeriodType = '7d' | '30d' | '6m' | '1y';

interface PeriodSelectorProps {
  currentPeriod: PeriodType;
}

/**
 * PeriodSelector - 周期选择器
 *
 * 用于切换不同的复盘周期（7天/30天/半年/一年）
 */
export default function PeriodSelector({ currentPeriod }: PeriodSelectorProps) {
  const router = useRouter();

  const periods: Array<{ value: PeriodType; label: string; description: string }> = [
    { value: '7d', label: '7日复盘', description: '短期反思' },
    { value: '30d', label: '30日复盘', description: '月度总结' },
    { value: '6m', label: '半年复盘', description: '中期回顾' },
    { value: '1y', label: '年度复盘', description: '深度分析' },
  ];

  const handlePeriodChange = (period: PeriodType) => {
    router.push(`/review/${period}`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {periods.map((period, index) => (
        <motion.button
          key={period.value}
          onClick={() => handlePeriodChange(period.value)}
          className={`
            relative p-4 border-2 text-left transition-all
            ${currentPeriod === period.value
              ? 'border-[#D43628] bg-[#D43628]/10'
              : 'border-black/30 hover:border-black/60 bg-white'
            }
          `}
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* 选中标记 */}
          {currentPeriod === period.value && (
            <motion.div
              className="absolute top-2 right-2 w-2 h-2"
              style={{ backgroundColor: '#D43628', borderRadius: '50%' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}

          {/* 标签 */}
          <div className="text-sm font-bold text-black mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {period.label}
          </div>

          {/* 描述 */}
          <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            {period.description}
          </div>

          {/* 选中时的高亮条 */}
          {currentPeriod === period.value && (
            <motion.div
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: '#D43628' }}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.2 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
