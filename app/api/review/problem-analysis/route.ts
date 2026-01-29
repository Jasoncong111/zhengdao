/**
 * 问题分析报告 API
 * 在服务器端调用 AI 服务生成问题分析报告
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateProblemAnalysis } from '@/lib/review-service';

/**
 * POST 请求处理
 * 生成问题分析报告
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { problemMonths } = body;

    // 验证参数
    if (!problemMonths) {
      return NextResponse.json(
        { error: '缺少必需参数: problemMonths' },
        { status: 400 }
      );
    }

    console.log('[API] 开始生成问题分析报告...');
    const startTime = Date.now();

    // 调用 AI 服务生成分析
    const analysis = await generateProblemAnalysis(problemMonths);

    const duration = Date.now() - startTime;
    console.log(`[API] 问题分析报告生成完成, 耗时: ${duration}ms`);

    // 返回分析结果
    return NextResponse.json({
      success: true,
      analysis,
      duration,
    });
  } catch (error) {
    console.error('[API] 问题分析报告生成失败:', error);

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
