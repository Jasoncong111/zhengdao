'use client';

/**
 * 是/否按钮组件
 * 可独立使用的简版按钮
 */

import { motion } from 'framer-motion';

interface YesNoButtonsProps {
  /** 选择回调 */
  onSelect: (meaningful: boolean) => void;
  /** 禁用状态 */
  disabled?: boolean;
}

export function YesNoButtons({ onSelect, disabled = false }: YesNoButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* 是按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={() => !disabled && onSelect(true)}
        disabled={disabled}
        className={`
          py-6 font-bold text-xl transition-all
          ${disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-seal text-paper hover:shadow-lg'
          }
        `}
        style={{
          borderRadius: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        是
      </motion.button>

      {/* 否按钮 */}
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={() => !disabled && onSelect(false)}
        disabled={disabled}
        className={`
          py-6 font-bold text-xl transition-all
          ${disabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-ink text-paper hover:shadow-lg'
          }
        `}
        style={{
          borderRadius: 0,
          fontFamily: 'Georgia, serif',
        }}
      >
        否
      </motion.button>
    </div>
  );
}
