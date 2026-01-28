'use client';

import { useState } from 'react';

export default function TestAIPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAI = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: '请用一句话介绍你自己。',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API调用失败');
      }

      setResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          GLM-4 API 测试
        </h1>

        <button
          onClick={testAI}
          disabled={loading}
          className="px-6 py-3 bg-[#D43628] text-white font-bold border-2 border-black hover:bg-[#D43628]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
        >
          {loading ? '测试中...' : '测试 GLM-4 API'}
        </button>

        {error && (
          <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 text-red-700">
            <div className="font-bold mb-2">❌ 错误</div>
            <div>{error}</div>
          </div>
        )}

        {result && (
          <div className="mt-6 p-6 bg-white border-2 border-black">
            <div className="font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              ✅ AI 回复：
            </div>
            <div className="text-black" style={{ fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap' }}>
              {result}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-black/5 border border-black/20 text-sm">
          <div className="font-bold mb-2">📝 测试说明：</div>
          <ul className="list-disc list-inside space-y-1">
            <li>点击按钮测试 GLM-4 API 连接</li>
            <li>如果看到 AI 回复，说明 API 集成成功</li>
            <li>如果看到错误，检查配置和网络</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
