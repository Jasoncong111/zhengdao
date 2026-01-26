/**
 * Demo 数据生成 API
 * 用于快速生成模拟复盘数据
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDemoData } from '@/lib/demo-data';

/**
 * POST 请求处理
 * 生成指定天数的Demo数据
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { walletAddress, days = 30 } = body;

    // 验证参数
    if (!walletAddress || typeof walletAddress !== 'string') {
      return NextResponse.json(
        { error: '缺少必需参数: walletAddress' },
        { status: 400 }
      );
    }

    if (days < 1 || days > 365) {
      return NextResponse.json(
        { error: '天数必须在 1-365 之间' },
        { status: 400 }
      );
    }

    console.log('[Demo API] 开始生成Demo数据, walletAddress:', walletAddress, 'days:', days);

    // 生成Demo数据
    const count = await generateDemoData(walletAddress, days);

    return NextResponse.json({
      success: true,
      data: {
        count,
        days,
        walletAddress,
      },
    });
  } catch (error) {
    console.error('[Demo API] 生成失败:', error);

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
