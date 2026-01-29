/**
 * AI 服务 - 统一的 AI 接口
 *
 * 支持多个 AI 提供商:
 * - GLM-4 (智谱AI) - 推荐，国内访问快
 * - MiniMax - 备用，当 GLM 达到限制时使用
 * - DeepSeek - 备选
 * - Gemini (Google) - 备用，当 DeepSeek 失败时使用
 */

import https from 'https';
import { callGeminiAPI, isGeminiServiceAvailable } from './gemini-service';

/**
 * AI 提供商类型
 */
type AIProvider = 'glm' | 'minimax' | 'deepseek' | 'gemini';

/**
 * AI 服务配置
 */
interface AIServiceConfig {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

/**
 * AI 响应
 */
interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * AI 服务错误
 */
export class AIServiceError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public provider?: AIProvider
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

/**
 * GLM-4 API 调用
 */
async function callGLMAPI(prompt: string, maxTokens: number = 500): Promise<AIResponse> {
  const apiKey = process.env.GLM_API_KEY;

  if (!apiKey) {
    throw new AIServiceError('GLM_API_KEY 未配置', undefined, 'glm');
  }

  const requestBody = JSON.stringify({
    model: 'glm-4',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的成长教练，善于从日常反思中提炼洞察，帮助用户复盘和改进。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const options = {
    hostname: 'open.bigmodel.cn',
    path: '/api/paas/v4/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new AIServiceError(`GLM API 请求失败: ${data}`, res.statusCode, 'glm'));
          return;
        }

        try {
          const result = JSON.parse(data);
          resolve({
            content: result.choices[0].message.content,
            model: result.model,
            usage: result.usage ? {
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
            } : undefined,
          });
        } catch (parseError) {
          reject(new AIServiceError(`解析响应失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`, undefined, 'glm'));
        }
      });
    });

    req.on('error', (error) => {
      reject(new AIServiceError(`GLM API 网络错误: ${error.message}`, undefined, 'glm'));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new AIServiceError('GLM API 请求超时', undefined, 'glm'));
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * MiniMax API 调用
 */
async function callMiniMaxAPI(prompt: string, maxTokens: number = 500): Promise<AIResponse> {
  const apiKey = process.env.MINIMAX_API_KEY;
  const groupId = process.env.MINIMAX_GROUP_ID;

  if (!apiKey || !groupId) {
    throw new AIServiceError('MINIMAX_API_KEY 或 MINIMAX_GROUP_ID 未配置', undefined, 'minimax');
  }

  const requestBody = JSON.stringify({
    model: 'abab6.5-chat',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的成长教练，善于从日常反思中提炼洞察，帮助用户复盘和改进。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const options = {
    hostname: 'api.minimax.chat',
    path: `/v1/text/chatcompletion_v2?GroupId=${groupId}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new AIServiceError(`MiniMax API 请求失败: ${data}`, res.statusCode, 'minimax'));
          return;
        }

        try {
          const result = JSON.parse(data);
          resolve({
            content: result.choices[0].message.content,
            model: result.model || 'abab6.5-chat',
            usage: result.usage ? {
              promptTokens: result.usage.prompt_tokens || result.usage.total_tokens,
              completionTokens: result.usage.completion_tokens || 0,
              totalTokens: result.usage.total_tokens,
            } : undefined,
          });
        } catch (parseError) {
          reject(new AIServiceError(`解析响应失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`, undefined, 'minimax'));
        }
      });
    });

    req.on('error', (error) => {
      reject(new AIServiceError(`MiniMax API 网络错误: ${error.message}`, undefined, 'minimax'));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new AIServiceError('MiniMax API 请求超时', undefined, 'minimax'));
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * DeepSeek API 调用
 * 支持 DeepSeek 官方 API 和硅基流动 API
 */
async function callDeepSeekAPI(prompt: string, maxTokens: number = 500): Promise<AIResponse> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new AIServiceError('DEEPSEEK_API_KEY 未配置', undefined, 'deepseek');
  }

  // 支持硅基流动 API (https://api.siliconflow.cn)
  const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  // 解析 URL
  const url = new URL(apiUrl);
  const isHttps = url.protocol === 'https:';
  const hostname = url.hostname;
  const path = url.pathname + url.search;

  const requestBody = JSON.stringify({
    model,
    messages: [
      {
        role: 'system',
        content: '你是一个专业的成长教练，善于从日常反思中提炼洞察，帮助用户复盘和改进。',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: maxTokens,
  });

  const options = {
    protocol: url.protocol,
    hostname,
    path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(requestBody),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new AIServiceError(`DeepSeek API 请求失败: ${data}`, res.statusCode, 'deepseek'));
          return;
        }

        try {
          const result = JSON.parse(data);
          resolve({
            content: result.choices[0].message.content,
            model: result.model,
            usage: result.usage ? {
              promptTokens: result.usage.prompt_tokens,
              completionTokens: result.usage.completion_tokens,
              totalTokens: result.usage.total_tokens,
            } : undefined,
          });
        } catch (parseError) {
          reject(new AIServiceError(`解析响应失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`, undefined, 'deepseek'));
        }
      });
    });

    req.on('error', (error) => {
      reject(new AIServiceError(`DeepSeek API 网络错误: ${error.message}`, undefined, 'deepseek'));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new AIServiceError('DeepSeek API 请求超时', undefined, 'deepseek'));
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * 调用 AI 服务（自动选择可用的提供商）
 *
 * 优先级: GLM > MiniMax > DeepSeek
 * 当 GLM 达到限制时，自动切换到 MiniMax
 */
export async function callAIService(prompt: string, maxTokens: number = 500): Promise<AIResponse> {
  // 优先使用 GLM
  if (process.env.GLM_API_KEY) {
    try {
      console.log('[AI Service] 使用 GLM-4 API');
      const result = await callGLMAPI(prompt, maxTokens);
      console.log('[AI Service] GLM-4 API 调用成功');
      return result;
    } catch (error) {
      console.error('[AI Service] GLM-4 API 调用失败:', error);
      // 如果 GLM 失败（可能达到限制），尝试 MiniMax
    }
  }

  // 备选1：使用 MiniMax（当 GLM 达到限制时）
  if (process.env.MINIMAX_API_KEY && process.env.MINIMAX_GROUP_ID) {
    try {
      console.log('[AI Service] GLM 不可用，切换到 MiniMax API');
      const result = await callMiniMaxAPI(prompt, maxTokens);
      console.log('[AI Service] MiniMax API 调用成功');
      return result;
    } catch (error) {
      console.error('[AI Service] MiniMax API 调用失败:', error);
      // 如果 MiniMax 也失败，尝试 DeepSeek
    }
  }

  // 备选2：使用 DeepSeek
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      console.log('[AI Service] 使用 DeepSeek API');
      const result = await callDeepSeekAPI(prompt, maxTokens);
      console.log('[AI Service] DeepSeek API 调用成功');
      return result;
    } catch (error) {
      console.error('[AI Service] DeepSeek API 调用失败:', error);
      // DeepSeek 失败，尝试 Gemini
    }
  }

  // 备选3：使用 Gemini (当 DeepSeek 失败时)
  if (isGeminiServiceAvailable()) {
    try {
      console.log('[AI Service] DeepSeek 不可用，降级到 Gemini API');
      const result = await callGeminiAPI(prompt, maxTokens);
      console.log('[AI Service] Gemini API 调用成功');
      return result;
    } catch (error) {
      console.error('[AI Service] Gemini API 调用失败:', error);
    }
  }

  throw new AIServiceError(
    '没有可用的 AI API Key，请配置 GLM_API_KEY、MINIMAX_API_KEY、DEEPSEEK_API_KEY 或 GEMINI_API_KEY'
  );
}

/**
 * 生成 AI 文本（便捷方法）
 */
export async function generateAIResponse(prompt: string, maxTokens?: number): Promise<string> {
  try {
    const response = await callAIService(prompt, maxTokens);
    return response.content;
  } catch (error) {
    console.error('[AI Service] AI 生成失败:', error);
    throw error;
  }
}

/**
 * 检查 AI 服务是否可用
 */
export function isAIServiceAvailable(): boolean {
  return !!(
    process.env.GLM_API_KEY ||
    (process.env.MINIMAX_API_KEY && process.env.MINIMAX_GROUP_ID) ||
    process.env.DEEPSEEK_API_KEY ||
    process.env.GEMINI_API_KEY
  );
}

/**
 * 获取当前 AI 提供商
 */
export function getCurrentProvider(): AIProvider | null {
  if (process.env.GLM_API_KEY) return 'glm';
  if (process.env.MINIMAX_API_KEY && process.env.MINIMAX_GROUP_ID) return 'minimax';
  if (process.env.DEEPSEEK_API_KEY) return 'deepseek';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  return null;
}

/**
 * 获取所有可用的 AI 提供商
 */
export function getAvailableProviders(): AIProvider[] {
  const providers: AIProvider[] = [];
  if (process.env.GLM_API_KEY) providers.push('glm');
  if (process.env.MINIMAX_API_KEY && process.env.MINIMAX_GROUP_ID) providers.push('minimax');
  if (process.env.DEEPSEEK_API_KEY) providers.push('deepseek');
  if (process.env.GEMINI_API_KEY) providers.push('gemini');
  return providers;
}
