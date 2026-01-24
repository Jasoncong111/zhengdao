'use client';

import { motion } from 'framer-motion';

export type WeekDayStatus = 'victory' | 'defeat' | 'pending';

interface WeekGridProps {
  weekData?: WeekDayStatus[];
  onDayClick?: (dayIndex: number) => void;
  showLabels?: boolean;
}

// 星期标签
const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

/**
 * WeekGrid - 七日修心组件
 *
 * 特性：
 * - 7个方块代表一周7天
 * - 实心朱砂红块 = 胜利
 * - 黑色叉 = 失败
 * - 空心灰块 = 待完成
 * - 可点击交互
 */
export default function WeekGrid({
  weekData = ['pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
  onDayClick,
  showLabels = true,
}: WeekGridProps) {
  // 朱砂红色
  const cinnabarRed = '#D43628';

  // 渲染单个方块
  const renderDay = (status: WeekDayStatus, index: number) => {
    const dayNumber = index + 1;

    return (
      <motion.div
        key={index}
        className="relative aspect-square cursor-pointer"
        onClick={() => onDayClick?.(index)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 方块主体 */}
        <motion.div
          className="w-full h-full flex items-center justify-center border-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          style={{
            backgroundColor: status === 'victory' ? cinnabarRed : 'transparent',
            borderColor:
              status === 'victory'
                ? cinnabarRed
                : status === 'defeat'
                ? '#000'
                : '#d1d5db',
            borderRadius: 0,
          }}
        >
          {/* 胜利状态：实心红块 */}
          {status === 'victory' && (
            <motion.span
              className="text-white font-bold"
              style={{ fontFamily: 'Georgia, serif' }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {dayNumber}
            </motion.span>
          )}

          {/* 失败状态：黑色叉 */}
          {status === 'defeat' && (
            <motion.svg
              className="w-1/2 h-1/2"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </motion.svg>
          )}

          {/* 待完成状态：浅灰数字 */}
          {status === 'pending' && (
            <span
              className="text-gray-400 font-medium"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {dayNumber}
            </span>
          )}
        </motion.div>

        {/* 星期标签（可选显示） */}
        {showLabels && (
          <motion.span
            className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-black/60"
            style={{ fontFamily: 'Georgia, serif' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            {WEEK_LABELS[index]}
          </motion.span>
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <motion.h3
        className="text-lg font-semibold text-center text-black"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        七日修心
      </motion.h3>

      {/* 7日网格 */}
      <div className="grid grid-cols-7 gap-2 px-2 pb-6">
        {weekData.map((status, index) => renderDay(status, index))}
      </div>

      {/* 统计信息 */}
      <motion.div
        className="flex justify-center gap-6 text-sm text-black/70"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>
          胜:{' '}
          <strong className="text-black">
            {weekData.filter((d) => d === 'victory').length}
          </strong>
        </span>
        <span>
          败:{' '}
          <strong className="text-black">
            {weekData.filter((d) => d === 'defeat').length}
          </strong>
        </span>
      </motion.div>
    </div>
  );
}
