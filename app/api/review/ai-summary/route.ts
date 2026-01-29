/**
 * AI 复盘总结 API
 * 在服务器端调用 AI 服务生成复盘总结
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIReviewSummary } from '@/lib/review-service';
import type { ReviewStats } from '@/lib/review-service';

/**
 * POST 请求处理
 * 生成 AI 复盘总结
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { period, stats } = body;

    // 验证参数
    if (!period || !stats) {
      return NextResponse.json(
        { error: '缺少必需参数: period, stats' },
        { status: 400 }
      );
    }

    // 验证 period 参数
    const validPeriods = ['7d', '30d', '6m', '1y'];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: `无效的 period 参数，必须是: ${validPeriods.join(', ')}` },
        { status: 400 }
      );
    }

    console.log('[API] 开始生成 AI 复盘总结, period:', period);
    const startTime = Date.now();

    // 调用 AI 服务生成总结
    const summary = await generateAIReviewSummary(period, stats as ReviewStats);

    const duration = Date.now() - startTime;
    console.log(`[API] AI 总结生成完成, 耗时: ${duration}ms`);

    // 返回总结
    return NextResponse.json({
      success: true,
      summary,
      duration,
    });
  } catch (error) {
    console.error('[API] AI 总结生成失败:', error);

    // 返回错误信息
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '生成失败，请重试',
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS 请求处理（CORS 预检）
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
