'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface AIReviewSummaryProps {
  summary: string;
  isLoading?: boolean;
}

/**
 * AIReviewSummary - AI复盘总结
 *
 * 展示AI生成的周期复盘总结
 */
export default function AIReviewSummary({ summary, isLoading = false }: AIReviewSummaryProps) {
  const [displayedSummary, setDisplayedSummary] = useState('');

  // 打字机效果
  useEffect(() => {
    if (!summary) {
      setDisplayedSummary('');
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index < summary.length) {
        setDisplayedSummary(summary.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 20); // 每20ms显示一个字符

    return () => clearInterval(timer);
  }, [summary]);

  return (
    <motion.div
      className="w-full bg-white border-2 border-black p-6"
      style={{ borderRadius: 0, backgroundColor: '#FFFEF2' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 标题 */}
      <motion.div
        className="flex items-center gap-2 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3
          className="text-xl font-bold text-black"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          AI 复盘总结
        </h3>
        {isLoading && (
          <motion.span
            className="text-sm text-black/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            生成中...
          </motion.span>
        )}
      </motion.div>

      <motion.p
        className="text-sm text-black/60 mb-6"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        基于你的打卡数据，AI为你生成的个性化复盘分析
      </motion.p>

      {/* AI总结内容 */}
      <motion.div
        className={`
          p-6 border-2 bg-black/5 relative overflow-hidden
          ${isLoading ? 'border-black/20' : 'border-black/30'}
        `}
        style={{ borderRadius: 0, minHeight: '150px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {/* 加载状态 */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="flex gap-2"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="w-2 h-2 bg-black/30" style={{ borderRadius: '50%' }} />
              <div className="w-2 h-2 bg-black/30" style={{ borderRadius: '50%' }} />
              <div className="w-2 h-2 bg-black/30" style={{ borderRadius: '50%' }} />
            </motion.div>
          </div>
        )}

        {/* 总结内容 */}
        {!isLoading && (
          <motion.div
            className="text-black leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: 'Georgia, serif', fontSize: '15px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {displayedSummary || '暂无总结内容，请先完成一些打卡记录。'}
            {/* 光标 */}
            {displayedSummary && displayedSummary.length < summary.length && (
              <motion.span
                className="inline-block w-0.5 h-4 bg-[#D43628] ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
          </motion.div>
        )}

      </motion.div>

      {/* 提示文字 */}
      {!isLoading && displayedSummary && (
        <motion.div
          className="mt-4 p-3 bg-black/5 text-center"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            AI总结基于你的真实数据生成，仅供参考。最重要的是你自己的感受和思考。
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
