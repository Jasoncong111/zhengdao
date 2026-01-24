import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/verify
 *
 * 图片验证 API - 三层验证逻辑：
 * 1. 上帝模式 (Demo Mode) - 最高优先级
 * 2. AI 验证 (智谱 GLM-4V Vision)
 * 3. 兜底机制 (超时自动通过)
 */

// ============== 类型定义 ==============

interface VerifyRequest {
  image: string;        // Base64 编码的图片
  userAddress: string;  // 用户钱包地址
}

interface VerifyResponse {
  success: boolean;
  reason?: string;
  confidence?: number;
  demoMode?: boolean;
  fallback?: boolean;
  message?: string;
}

// ============== 配置常量 ==============

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const TIMEOUT_MS = 30 * 1000; // 30 秒超时
const GLM_MODEL = 'glm-4v-flash'; // 智谱 GLM-4V Flash 模型
const ZHIPU_API_BASE = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// AI 验证 Prompt
const VERIFICATION_PROMPT = `分析这张图片，判断是否包含以下场景之一：
1. 健身活动（运动、健身房、体育运动）
2. 读书活动（阅读书籍、学习）

如果包含以上任一场景，返回 'valid'，否则返回 'invalid' 并说明原因。`;

// ============== 工具函数 ==============

/**
 * 解析 Base64 图片并获取大小
 */
function parseBase64Image(base64: string): { data: string; size: number } {
  // 移除可能的 Data URL 前缀
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // 计算原始字节大小
  const size = Buffer.from(base64Data, 'base64').byteLength;

  return {
    data: base64Data,
    size,
  };
}

/**
 * 验证图片大小
 */
function validateImageSize(size: number): { valid: boolean; reason?: string } {
  if (size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      reason: `图片大小超过限制 (最大 ${MAX_IMAGE_SIZE / 1024 / 1024}MB)`,
    };
  }
  return { valid: true };
}

/**
 * 调用智谱 GLM-4V API 进行图片验证
 */
async function verifyImageWithAI(
  base64Image: string
): Promise<{ valid: boolean; confidence?: number; reason?: string }> {
  const apiKey = process.env.ZHIPU_API_KEY;
  
  if (!apiKey) {
    throw new Error('ZHIPU_API_KEY not configured');
  }

  try {
    const response = await fetch(ZHIPU_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GLM_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: VERIFICATION_PROMPT,
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('智谱 API 错误:', response.status, errorText);
      throw new Error(`智谱 API 调用失败: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.toLowerCase() || '';

    // 解析 AI 响应
    const isValid = result.includes('valid');

    return {
      valid: isValid,
      confidence: isValid ? 0.85 : 0.3, // 简化置信度计算
      reason: isValid ? undefined : result,
    };
  } catch (error) {
    console.error('智谱 API 调用失败:', error);
    throw error;
  }
}

/**
 * 带超时的 Promise 包装器
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

// ============== API 路由处理器 ==============

export async function POST(request: NextRequest) {
  try {
    // ============== 第一层：上帝模式 (Demo Mode) ==============
    const demoModeHeader = request.headers.get('x-demo-mode');

    if (demoModeHeader === 'true') {
      console.log('[Demo Mode] 演示模式已激活，跳过 AI 验证');

      const response: VerifyResponse = {
        success: true,
        demoMode: true,
        message: '演示模式：自动通过',
      };

      return NextResponse.json(response);
    }

    // ============== 第二层：解析和验证请求 ==============
    const body: VerifyRequest = await request.json();
    const { image, userAddress } = body;

    // 基本参数验证
    if (!image) {
      const response: VerifyResponse = {
        success: false,
        reason: '缺少图片数据',
      };
      return NextResponse.json(response, { status: 400 });
    }

    if (!userAddress) {
      const response: VerifyResponse = {
        success: false,
        reason: '缺少用户地址',
      };
      return NextResponse.json(response, { status: 400 });
    }

    // 解析图片
    const { data: base64Data, size: imageSize } = parseBase64Image(image);

    // 验证图片大小
    const sizeValidation = validateImageSize(imageSize);
    if (!sizeValidation.valid) {
      const response: VerifyResponse = {
        success: false,
        reason: sizeValidation.reason,
      };
      return NextResponse.json(response, { status: 400 });
    }

    // ============== 第三层：AI 验证（带超时兜底） ==============
    try {
      console.log(`[AI Verification] 开始验证用户 ${userAddress} 的图片`);

      // 带超时的 AI 验证
      const aiResult = await withTimeout(
        verifyImageWithAI(base64Data),
        TIMEOUT_MS,
        'AI verification timeout'
      );

      if (aiResult.valid) {
        console.log('[AI Verification] 验证通过');
        const response: VerifyResponse = {
          success: true,
          confidence: aiResult.confidence,
        };
        return NextResponse.json(response);
      } else {
        console.log('[AI Verification] 验证失败:', aiResult.reason);
        const response: VerifyResponse = {
          success: false,
          reason: aiResult.reason || '图片未包含健身或读书场景',
          confidence: aiResult.confidence,
        };
        return NextResponse.json(response);
      }
    } catch (error) {
      // ============== 兜底机制：超时或 API 错误时自动通过 ==============
      console.error('[Fallback] AI 验证失败，触发兜底机制:', error);

      const response: VerifyResponse = {
        success: true,
        fallback: true,
        message: '验证超时，自动通过',
        confidence: 0,
      };

      return NextResponse.json(response);
    }
  } catch (error) {
    // ============== 错误处理 ==============
    console.error('[API Error] 验证 API 发生错误:', error);

    const response: VerifyResponse = {
      success: false,
      reason: error instanceof Error ? error.message : '服务器内部错误',
    };

    return NextResponse.json(response, { status: 500 });
  }
}

// ============== 配置 API 路由选项 ==============

// 禁用请求体大小限制（Next.js 默认限制可能影响大图片上传）
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

// 支持 OPTIONS 预检请求（CORS）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-demo-mode',
    },
  });
}
