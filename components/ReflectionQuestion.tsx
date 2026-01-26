'use client';

/**
 * Yes/No 问题组件
 * 第1步：询问"今天有意义吗？"
 */

import { motion } from 'framer-motion';

interface ReflectionQuestionProps {
  /** 用户选择回调 */
  onAnswer: (isMeaningful: boolean) => void;
}

export function ReflectionQuestion({ onAnswer }: ReflectionQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-8"
    >
      {/* 问题标题 */}
      <h3 className="text-2xl font-bold text-black mb-8 font-georgia">
        今天有意义吗？
      </h3>

      {/* Yes/No 按钮 */}
      <div className="flex gap-4 justify-center">
        {/* Yes 按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(true)}
          className="flex-1 max-w-[160px] bg-[#D43628] text-white px-8 py-6 text-xl font-bold border-2 border-black hover:bg-[#B82E20] transition-colors"
        >
          <div className="mb-2 text-3xl">✓</div>
          <div>有</div>
        </motion.button>

        {/* No 按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(false)}
          className="flex-1 max-w-[160px] bg-white text-black px-8 py-6 text-xl font-bold border-2 border-black hover:bg-gray-100 transition-colors"
        >
          <div className="mb-2 text-3xl">✗</div>
          <div>无</div>
        </motion.button>
      </div>

      {/* 提示文字 */}
      <p className="mt-8 text-sm text-gray-600">
        诚实地面对自己，是成长的第一步
      </p>
    </motion.div>
  );
}
