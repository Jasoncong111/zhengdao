'use client';

/**
 * ProcessingStep - AI处理中状态组件
 *
 * 显示AI正在整理复盘的加载状态
 */

import { motion } from 'framer-motion';

export function ProcessingStep() {
  return (
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="w-20 h-20 mx-auto border-4 border-ink border-t-seal rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <h2
        className="text-2xl font-bold text-ink"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        AI正在整理您的复盘...
      </h2>
      <p className="text-ink/60" style={{ fontFamily: 'Georgia, serif' }}>
        请稍候，这通常需要几秒钟
      </p>
    </motion.div>
  );
}
