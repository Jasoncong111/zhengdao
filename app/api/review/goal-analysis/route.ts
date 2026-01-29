/**
 * 年度目标对比分析 API
 * 在服务器端调用 AI 服务生成目标对比分析
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateGoalComparisonAnalysis } from '@/lib/review-service';
import type { ReviewStats } from '@/lib/review-service';

/**
 * POST 请求处理
 * 生成年度目标对比分析
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { comparisonData } = body;

    // 验证参数
    if (!comparisonData) {
      return NextResponse.json(
        { error: '缺少必需参数: comparisonData' },
        { status: 400 }
      );
    }

    console.log('[API] 开始生成目标对比分析...');
    const startTime = Date.now();

    // 调用 AI 服务生成分析
    const analysis = await generateGoalComparisonAnalysis(comparisonData);

    const duration = Date.now() - startTime;
    console.log(`[API] 目标对比分析生成完成, 耗时: ${duration}ms`);

    // 返回分析结果
    return NextResponse.json({
      success: true,
      analysis,
      duration,
    });
  } catch (error) {
    console.error('[API] 目标对比分析生成失败:', error);

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
