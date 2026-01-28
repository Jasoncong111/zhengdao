'use client';

/**
 * 核心问题组件
 * 询问用户今天是否度过了有意义的一天
 */

import { motion } from 'framer-motion';

interface DailyQuestionProps {
  /** 问题回答回调 */
  onAnswer: (meaningful: boolean) => void;
}

export function DailyQuestion({ onAnswer }: DailyQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-center"
    >
      {/* 标题 */}
      <div className="space-y-6">
        <h2
          className="text-3xl font-bold text-ink leading-relaxed"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          你觉得今天是否度过了
          <br />
          <span className="text-seal">有意义的一天</span>？
        </h2>
        <p
          className="text-ink/60 text-lg"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          吾日三省吾身 · 诚实面对自己
        </p>
      </div>

      {/* 两个大按钮 */}
      <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
        {/* 是按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(true)}
          className="py-8 bg-seal text-paper font-bold text-2xl"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          是
        </motion.button>

        {/* 否按钮 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAnswer(false)}
          className="py-8 bg-ink text-paper font-bold text-2xl"
          style={{
            borderRadius: 0,
            fontFamily: 'Georgia, serif',
          }}
        >
          否
        </motion.button>
      </div>

      {/* 提示文字 */}
      <p className="text-sm text-ink/40" style={{ fontFamily: 'Georgia, serif' }}>
        选择后会进入复盘输入
      </p>
    </motion.div>
  );
}
