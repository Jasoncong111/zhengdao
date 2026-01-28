'use client';

import { motion } from 'framer-motion';

interface ProblemMonth {
  month: string;
  total: number;
  meaningful: number;
  ratio: number;
}

interface ProblemAnalysisProps {
  problemMonths: ProblemMonth[];
  analysis: string;
  isLoading?: boolean;
}

/**
 * ProblemAnalysis - 问题分析（年度复盘专用）
 *
 * 分析表现不佳的月份并给出改进建议
 */
export default function ProblemAnalysis({ problemMonths, analysis, isLoading = false }: ProblemAnalysisProps) {
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
        className="flex items-center gap-2 mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3
          className="text-lg font-bold text-black"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          问题定位分析
        </h3>
      </motion.div>

      <motion.p
        className="text-xs text-black/60 mb-4"
        style={{ fontFamily: 'Georgia, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        找出需要改进的月份，制定提升策略
      </motion.p>

      {/* 问题月份列表 */}
      {problemMonths.length > 0 ? (
        <motion.div
          className="space-y-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {problemMonths.map((month, index) => (
            <motion.div
              key={month.month}
              className="border-2 border-black/20 p-4 bg-black/5"
              style={{ borderRadius: 0 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>
                      {month.month}
                    </span>
                    <span
                      className={`
                        px-2 py-0.5 text-xs font-bold
                        ${month.ratio < 30 ? 'bg-[#D43628]/20 text-[#D43628]' : 'bg-black/10 text-black/70'}
                      `}
                      style={{ fontFamily: 'Georgia, serif', borderRadius: 0 }}
                    >
                      {month.ratio < 30 ? '需重点关注' : '待改进'}
                    </span>
                  </div>
                  <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
                    打卡 {month.total} 天，有意义 {month.meaningful} 天
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ fontFamily: 'Georgia, serif', color: month.ratio < 30 ? '#D43628' : '#6B7280' }}>
                    {month.ratio.toFixed(1)}%
                  </div>
                  <div className="text-xs text-black/50" style={{ fontFamily: 'Georgia, serif' }}>
                    有意义比例
                  </div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mt-3 w-full h-2 bg-black/10" style={{ borderRadius: 0 }}>
                <motion.div
                  className="h-full"
                  style={{
                    backgroundColor: month.ratio < 30 ? '#D43628' : '#6B7280',
                    borderRadius: 0,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${month.ratio}%` }}
                  transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="mb-4 p-6 border-2 border-dashed border-black/30 text-center"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            数据积累中，暂无问题月份分析
          </div>
          <div className="text-xs text-black/40 mt-1" style={{ fontFamily: 'Georgia, serif' }}>
            继续坚持打卡，系统将为你提供更有价值的分析
          </div>
        </motion.div>
      )}

      {/* AI分析内容 */}
      <motion.div
        className={`
          p-6 border-2 bg-black/5 relative
          ${isLoading ? 'border-black/20' : 'border-black/30'}
        `}
        style={{ borderRadius: 0, minHeight: '120px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
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

        {/* 分析内容 */}
        {!isLoading && (
          <div className="text-black leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Georgia, serif', fontSize: '15px' }}>
            {analysis || '暂无分析内容'}
          </div>
        )}

      </motion.div>

      {/* 提示文字 */}
      {!isLoading && problemMonths.length > 0 && (
        <motion.div
          className="mt-4 p-3 bg-black/5 text-center"
          style={{ borderRadius: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-xs text-black/60" style={{ fontFamily: 'Georgia, serif' }}>
            每个人都有低谷期，重要的是如何调整状态。建议回顾这些月份的日记，找出可能的干扰因素。
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
