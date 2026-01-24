'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface CheckInRingProps {
  isCompleted?: boolean;
  onToggle?: (completed: boolean) => void;
  size?: number;
}

/**
 * CheckInRing - 核心打卡组件
 *
 * 特性：
 * - 未完成：黑细线圈，简约克制
 * - 已完成：朱砂红实心印章扩散动画
 * - 点击切换状态
 */
export default function CheckInRing({
  isCompleted: initialCompleted = false,
  onToggle,
  size = 120,
}: CheckInRingProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [rippleKey, setRippleKey] = useState(0);

  // 朱砂红色 (#D43628)
  const cinnabarRed = '#D43628';

  const handleClick = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);

    // 如果完成打卡，触发涟漪动画
    if (newState) {
      setRippleKey((prev) => prev + 1);
    }

    onToggle?.(newState);
  };

  return (
    <div
      className="relative cursor-pointer select-none"
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      {/* 未完成状态：黑细线圈 */}
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="incomplete"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {/* 外圈 */}
            <div
              className="rounded-full border-2 border-black"
              style={{ width: size, height: size, borderRadius: 0 }}
            />

            {/* 中心文字 */}
            <motion.span
              className="absolute text-sm font-medium text-black/80"
              style={{ fontFamily: 'Georgia, serif' }}
              whileHover={{ scale: 1.05 }}
            >
              打卡
            </motion.span>
          </motion.div>
        ) : (
          // 已完成状态：朱砂红印章
          <motion.div
            key="completed"
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* 朱砂红实心圆 */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{
                width: size,
                height: size,
                backgroundColor: cinnabarRed,
                borderRadius: 0,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
              }}
            >
              {/* 涟漪扩散效果 */}
              <motion.div
                key={rippleKey}
                className="absolute"
                style={{
                  width: size,
                  height: size,
                  backgroundColor: cinnabarRed,
                  borderRadius: 0,
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />

              {/* 印章文字 */}
              <motion.span
                className="absolute text-white font-bold text-lg"
                style={{ fontFamily: 'Georgia, serif' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              >
                ✓
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 悬浮提示 */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-black/50 whitespace-nowrap opacity-0"
        whileHover={{ opacity: 1 }}
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {isCompleted ? '已完成' : '点击打卡'}
      </motion.div>
    </div>
  );
}
