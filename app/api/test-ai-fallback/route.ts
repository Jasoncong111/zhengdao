/**
 * AI 服务降级测试 API
 *
 * GET /api/test-ai-fallback
 *
 * 用于测试 AI 服务是否正常工作以及降级机制是否生效
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  callAIService,
  isAIServiceAvailable,
  getAvailableProviders,
  getCurrentProvider,
} from '@/lib/ai-service';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 检查配置状态
    const isAvailable = isAIServiceAvailable();
    const currentProvider = getCurrentProvider();
    const availableProviders = getAvailableProviders();

    // 如果没有配置任何 API Key，返回提示信息
    if (!isAvailable) {
      return NextResponse.json(
        {
          success: false,
          error: '没有可用的 AI API Key',
          message: '请在 .env.local 中配置至少一个 AI API Key',
          availableProviders: [],
          recommendedProviders: [
            {
              name: 'GLM-4 (智谱AI)',
              envVar: 'GLM_API_KEY',
              url: 'https://open.bigmodel.cn/',
              recommended: true,
            },
            {
              name: 'MiniMax',
              envVar: 'MINIMAX_API_KEY',
              url: 'https://api.minimax.chat/',
              recommended: false,
            },
            {
              name: 'DeepSeek',
              envVar: 'DEEPSEEK_API_KEY',
              url: 'https://platform.deepseek.com/api_keys',
              recommended: false,
            },
            {
              name: 'Gemini (Google)',
              envVar: 'GEMINI_API_KEY',
              url: 'https://makersuite.google.com/app/apikey',
              recommended: false,
            },
          ],
        },
        { status: 400 }
      );
    }

    // 测试提示词
    const testPrompt = '今天我完成了3小时的深度学习，感觉很有收获。请帮我总结一下今天的成长。';

    // 调用 AI 服务
    const response = await callAIService(testPrompt, 300);

    const duration = Date.now() - startTime;

    // 返回成功结果
    return NextResponse.json({
      success: true,
      message: 'AI 服务测试成功',
      config: {
        isAvailable,
        currentProvider,
        availableProviders,
      },
      test: {
        prompt: testPrompt,
        response: {
          model: response.model,
          content: response.content,
          usage: response.usage,
        },
        duration: `${duration}ms`,
      },
      fallback: {
        message:
          '如果 DeepSeek 失败，系统会自动降级到 Gemini',
        enabled: availableProviders.includes('deepseek') && availableProviders.includes('gemini'),
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;

    // 返回错误信息
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        config: {
          isAvailable: isAIServiceAvailable(),
          currentProvider: getCurrentProvider(),
          availableProviders: getAvailableProviders(),
        },
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}
