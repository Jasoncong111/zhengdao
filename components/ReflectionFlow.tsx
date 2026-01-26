'use client';

/**
 * 反思流程主组件
 * 4步流程：Yes/No问题 → 文字输入 → AI处理 → 预览确认
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReflectionQuestion } from './ReflectionQuestion';
import { ReflectionInput } from './ReflectionInput';
import { ReflectionPreview } from './ReflectionPreview';
import { StructuredReflectionData } from '@/lib/db';
import { ReflectionService } from '@/lib/storage';

/** 流程步骤 */
type FlowStep = 'question' | 'input' | 'processing' | 'preview';

interface ReflectionFlowProps {
  /** 用户钱包地址 */
  walletAddress: string;
  /** 完成回调 */
  onComplete: () => void;
  /** 取消回调 */
  onCancel?: () => void;
}

export function ReflectionFlow({ walletAddress, onComplete, onCancel }: ReflectionFlowProps) {
  const [step, setStep] = useState<FlowStep>('question');
  const [isMeaningful, setIsMeaningful] = useState<boolean | null>(null);
  const [content, setContent] = useState('');
  const [structuredData, setStructuredData] = useState<StructuredReflectionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** 处理Yes/No问题回答 */
  const handleQuestionAnswer = async (answer: boolean) => {
    setIsMeaningful(answer);
    setStep('input');
  };

  /** 处理内容提交，调用AI处理 */
  const handleContentSubmit = async (inputContent: string) => {
    setContent(inputContent);
    setStep('processing');
    setIsProcessing(true);
    setError(null);

    try {
      // 调用AI API
      const response = await fetch('/api/reflect/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: inputContent }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'AI处理失败');
      }

      setStructuredData(result.data);
      setStep('preview');
    } catch (err) {
      console.error('[ReflectionFlow] AI处理失败:', err);
      setError(err instanceof Error ? err.message : '处理失败，请重试');
      // 失败时返回输入步骤
      setTimeout(() => {
        setStep('input');
        setIsProcessing(false);
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  /** 处理预览确认，保存到数据库 */
  const handleConfirm = async () => {
    if (!structuredData || isMeaningful === null) return;

    try {
      setIsProcessing(true);

      // 保存到IndexedDB
      await ReflectionService.saveReflection({
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        isMeaningful,
        rawContent: content,
        structuredData,
        walletAddress,
      });

      console.log('[ReflectionFlow] 反思已保存');
      onComplete();
    } catch (err) {
      console.error('[ReflectionFlow] 保存失败:', err);
      setError('保存失败，请重试');
      setIsProcessing(false);
    }
  };

  /** 处理返回编辑 */
  const handleEdit = () => {
    setStep('input');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-lg bg-[#FFFEF2] border-2 border-black p-8">
        {/* 标题 */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-2 font-georgia">
            吾日三省吾身
          </h2>
          <p className="text-sm text-gray-600">
            证道 · 每日复盘
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-6 flex justify-center gap-2">
          <div className={`h-1 w-12 ${step === 'question' || step === 'input' || step === 'processing' || step === 'preview' ? 'bg-[#D43628]' : 'bg-gray-300'}`} />
          <div className={`h-1 w-12 ${step === 'input' || step === 'processing' || step === 'preview' ? 'bg-[#D43628]' : 'bg-gray-300'}`} />
          <div className={`h-1 w-12 ${step === 'processing' || step === 'preview' ? 'bg-[#D43628]' : 'bg-gray-300'}`} />
          <div className={`h-1 w-12 ${step === 'preview' ? 'bg-[#D43628]' : 'bg-gray-300'}`} />
        </div>

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-900 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 流程内容 */}
        <AnimatePresence mode="wait">
          {step === 'question' && (
            <ReflectionQuestion key="question" onAnswer={handleQuestionAnswer} />
          )}

          {step === 'input' && (
            <ReflectionInput
              key="input"
              isMeaningful={isMeaningful!}
              initialValue={content}
              onSubmit={handleContentSubmit}
              onCancel={onCancel}
            />
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="mb-4">
                {/* 加载动画 */}
                <motion.div
                  className="w-16 h-16 mx-auto border-4 border-black border-t-[#D43628] rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                AI正在整理...
              </h3>
              <p className="text-gray-600">
                提取关键收获和洞察
              </p>
            </motion.div>
          )}

          {step === 'preview' && structuredData && (
            <ReflectionPreview
              key="preview"
              isMeaningful={isMeaningful!}
              rawContent={content}
              structuredData={structuredData}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
              isSaving={isProcessing}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
