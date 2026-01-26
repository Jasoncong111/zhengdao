'use client';

/**
 * 反思内容输入组件
 * 第2步：用户输入复盘内容
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReflectionInputProps {
  /** 今天是否有意义 */
  isMeaningful: boolean;
  /** 初始内容 */
  initialValue?: string;
  /** 提交回调 */
  onSubmit: (content: string) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

export function ReflectionInput({
  isMeaningful,
  initialValue = '',
  onSubmit,
  onCancel,
}: ReflectionInputProps) {
  const [content, setContent] = useState(initialValue);
  const [wordCount, setWordCount] = useState(0);

  // 更新字数统计
  useEffect(() => {
    setWordCount(content.length);
  }, [content]);

  // 处理提交
  const handleSubmit = () => {
    if (content.length < 10) {
      alert('复盘内容至少需要10个字');
      return;
    }
    onSubmit(content);
  };

  // 提示文字
  const getPlaceholder = () => {
    if (isMeaningful) {
      return '今天收获了什么？学到了什么？做到了什么？\n\n例如：\n- 完成了项目的核心功能开发\n- 坚持早起，感觉精力充沛\n- 学会了新的设计模式\n- 和家人度过了愉快的时光';
    } else {
      return '今天遇到了什么挑战？浪费了什么时间？有什么感悟？\n\n例如：\n- 工作拖延，效率不高\n- 花费太多时间在社交媒体上\n- 情绪低落，需要调整\n- 但也意识到了问题，明天会改进';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-4"
    >
      {/* 提示标题 */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-black mb-2">
          {isMeaningful ? '记录你的收获' : '反思你的不足'}
        </h3>
        <p className="text-sm text-gray-600">
          {isMeaningful ? '诚实地记录今天的成就' : '勇敢地面对今天的挑战'}
        </p>
      </div>

      {/* 文字输入区域 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={getPlaceholder()}
        className="w-full h-64 p-4 bg-white border-2 border-black text-black resize-none focus:outline-none focus:ring-2 focus:ring-[#D43628] font-geography text-base leading-relaxed"
        style={{ fontFamily: 'Georgia, serif' }}
      />

      {/* 字数统计 */}
      <div className="mt-2 text-right text-sm text-gray-600">
        {wordCount} / 5000 字
        {wordCount < 10 && <span className="text-red-600 ml-2">（至少10个字）</span>}
        {wordCount >= 200 && wordCount < 500 && <span className="text-green-600 ml-2">（深度复盘）</span>}
        {wordCount >= 500 && <span className="text-[#D43628] ml-2">（深度复盘 +30%积分）</span>}
      </div>

      {/* 按钮组 */}
      <div className="mt-6 flex gap-3">
        {/* 取消按钮 */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-black px-6 py-3 font-bold border-2 border-black hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
        )}

        {/* 提交按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={content.length < 10}
          className={`flex-1 px-6 py-3 font-bold border-2 border-black transition-all ${
            content.length < 10
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#D43628] text-white hover:bg-[#B82E20]'
          }`}
        >
          提交复盘
        </motion.button>
      </div>

      {/* 提示 */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        AI将自动整理你的复盘，提取关键收获和洞察
      </p>
    </motion.div>
  );
}
