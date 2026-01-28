'use client';

/**
 * 测试IndexedDB保存功能
 */

import { useState } from 'react';
import { CheckInService } from '@/lib/check-in-service';

export default function TestSavePage() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testSave = async () => {
    setStatus('saving');
    setMessage('开始测试保存...');

    try {
      const testAddress = 'test-wallet-' + Date.now();

      console.log('[TestSave] 开始测试，地址:', testAddress);

      const result = await CheckInService.saveCheckIn(testAddress, {
        meaningful: true,
        originalText: '这是一条测试记录',
        aiSummary: {
          gains: ['测试收获'],
          losses: ['测试损失'],
          ideas: ['测试想法'],
          emotion: '测试情绪',
          keywords: ['测试'],
        },
        photos: [],
      });

      console.log('[TestSave] 保存成功，ID:', result);
      setStatus('success');
      setMessage(`保存成功！记录ID: ${result}`);

      // 验证读取
      const todayCheckIn = await CheckInService.getTodayCheckIn(testAddress);
      console.log('[TestSave] 验证读取:', todayCheckIn);
      setMessage(`保存成功！记录ID: ${result}。读取验证: ${todayCheckIn ? '成功' : '失败'}`);
    } catch (error) {
      console.error('[TestSave] 错误:', error);
      setStatus('error');
      setMessage(`错误: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-ink mb-8 font-serif">IndexedDB 保存测试</h1>

        <div className="space-y-4">
          <button
            onClick={testSave}
            disabled={status === 'saving'}
            className="px-6 py-3 bg-ink text-paper font-bold font-serif"
            style={{ borderRadius: 0 }}
          >
            {status === 'saving' ? '保存中...' : '测试保存功能'}
          </button>

          {message && (
            <div
              className={`p-4 border-2 font-serif ${
                status === 'success'
                  ? 'border-green-500 bg-green-50'
                  : status === 'error'
                  ? 'border-red-500 bg-red-50'
                  : 'border-ink/20'
              }`}
              style={{ borderRadius: 0 }}
            >
              <div className="font-bold mb-2">
                状态: {status === 'saving' ? '保存中' : status === 'success' ? '成功' : status === 'error' ? '错误' : '空闲'}
              </div>
              <div className="text-sm">{message}</div>
            </div>
          )}

          <div className="mt-8 p-4 border-2 border-ink/20 bg-paper">
            <h2 className="font-bold text-ink mb-2 font-serif">如何使用:</h2>
            <ol className="list-decimal list-inside text-sm space-y-1 font-serif text-ink/80">
              <li>打开浏览器开发者工具 (F12 或 Cmd+Option+I)</li>
              <li>切换到 Console 标签</li>
              <li>点击"测试保存功能"按钮</li>
              <li>查看控制台输出和下面的状态信息</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
