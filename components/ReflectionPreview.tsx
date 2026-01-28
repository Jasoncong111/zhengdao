'use client';

/**
 * 反思预览确认组件
 * 第4步：展示AI提取的结构化数据，用户确认
 */

import { motion } from 'framer-motion';
import { StructuredReflectionData } from '@/lib/db';

interface ReflectionPreviewProps {
  /** 今天是否有意义 */
  isMeaningful: boolean;
  /** 原始内容 */
  rawContent: string;
  /** AI提取的结构化数据 */
  structuredData: StructuredReflectionData;
  /** 确认回调 */
  onConfirm: () => void;
  /** 编辑回调 */
  onEdit: () => void;
  /** 是否正在保存 */
  isSaving?: boolean;
}

export function ReflectionPreview({
  isMeaningful,
  rawContent,
  structuredData,
  onConfirm,
  onEdit,
  isSaving = false,
}: ReflectionPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="py-4 max-h-[60vh] overflow-y-auto"
    >
      {/* 标题 */}
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-black mb-2">
          AI已整理完成
        </h3>
        <p className="text-sm text-gray-600">
          请确认以下内容是否准确
        </p>
      </div>

      {/* 有意义标识 */}
      <div className="mb-4 p-3 bg-white border-2 border-black text-center">
        <span className="text-lg font-bold">
          今天{isMeaningful ? <span className="text-[#D43628]">有意义</span> : <span className="text-gray-600">无意义</span>}
        </span>
      </div>

      {/* 收获 */}
      <div className="mb-4 p-4 bg-white border-2 border-black">
        <h4 className="text-lg font-bold text-black mb-3">
          <span>收获</span>
        </h4>
        <ul className="space-y-2">
          {structuredData.gains.map((gain, index) => (
            <li key={index} className="text-black pl-4 border-l-2 border-[#D43628]">
              {gain}
            </li>
          ))}
        </ul>
      </div>

      {/* 损失 */}
      <div className="mb-4 p-4 bg-white border-2 border-black">
        <h4 className="text-lg font-bold text-black mb-3">
          <span>损失</span>
        </h4>
        <ul className="space-y-2">
          {structuredData.losses.map((loss, index) => (
            <li key={index} className="text-black pl-4 border-l-2 border-gray-400">
              {loss}
            </li>
          ))}
        </ul>
      </div>

      {/* 想法 */}
      {structuredData.ideas.length > 0 && (
        <div className="mb-4 p-4 bg-white border-2 border-black">
          <h4 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
            <span>想法</span>
          </h4>
          <ul className="space-y-2">
            {structuredData.ideas.map((idea, index) => (
              <li key={index} className="text-black pl-4 border-l-2 border-[#D43628]">
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 情绪和关键词 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* 情绪 */}
        <div className="p-4 bg-white border-2 border-black text-center">
          <div className="text-sm text-gray-600 mb-1">情绪</div>
          <div className="text-lg font-bold text-black">
            {structuredData.emotion}
          </div>
        </div>

        {/* 关键词 */}
        <div className="p-4 bg-white border-2 border-black">
          <div className="text-sm text-gray-600 mb-2">关键词</div>
          <div className="flex flex-wrap gap-1">
            {structuredData.keywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[#D43628] text-white text-xs font-bold"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 原始内容折叠 */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-black">
          查看原始内容
        </summary>
        <div className="mt-2 p-3 bg-gray-50 border border-gray-300 text-sm text-gray-700 whitespace-pre-wrap">
          {rawContent}
        </div>
      </details>

      {/* 按钮组 */}
      <div className="flex gap-3">
        {/* 返回编辑 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onEdit}
          disabled={isSaving}
          className="flex-1 bg-white text-black px-6 py-3 font-bold border-2 border-black hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          返回编辑
        </motion.button>

        {/* 确认保存 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          disabled={isSaving}
          className={`flex-1 px-6 py-3 font-bold border-2 border-black transition-all ${
            isSaving
              ? 'bg-gray-400 text-white cursor-wait'
              : 'bg-[#D43628] text-white hover:bg-[#B82E20]'
          }`}
        >
          {isSaving ? '保存中...' : '确认保存'}
        </motion.button>
      </div>

      {/* 提示 */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        确认后将保存到本地数据库，触发打卡并获得奖励
      </p>
    </motion.div>
  );
}
