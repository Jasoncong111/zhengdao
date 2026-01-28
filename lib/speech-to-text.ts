/**
 * 语音转文字模块
 * 使用 Web Speech API 实现实时语音识别
 */

// 类型定义
export interface SpeechRecognitionConfig {
  /** 语言设置，默认 'zh-CN' */
  language?: string;
  /** 连续识别，默认 false */
  continuous?: boolean;
  /** 临时结果，默认 true */
  interimResults?: boolean;
  /** 最大备选词数，默认 1 */
  maxAlternatives?: number;
}

export interface SpeechRecognitionEvent {
  /** 识别结果索引 */
  resultIndex: number;
  /** 识别结果列表 */
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResult {
  /** 是否是临时结果 */
  isFinal: boolean;
  /** 识别文本（第一个备选） */
  transcript: string;
  /** 置信度 (0-1) */
  confidence: number;
}

export type SpeechRecognitionStatus =
  | 'idle' // 空闲
  | 'listening' // 监听中
  | 'processing'; // 处理中

export interface SpeechRecognitionCallbacks {
  /** 开始识别回调 */
  onStart?: () => void;
  /** 结束识别回调 */
  onEnd?: () => void;
  /** 错误回调 */
  onError?: (error: string) => void;
  /** 结果回调（实时） */
  onResult?: (text: string, isFinal: boolean) => void;
  /** 状态变化回调 */
  onStatusChange?: (status: SpeechRecognitionStatus) => void;
}

// Web Speech API 类型定义
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

/**
 * 语音识别类
 */
export class SpeechRecognitionService {
  private recognition: any = null;
  private isListening: boolean = false;
  private finalTranscript: string = '';
  private interimTranscript: string = '';
  private config: SpeechRecognitionConfig;
  private callbacks: SpeechRecognitionCallbacks;

  constructor(config: SpeechRecognitionConfig = {}, callbacks: SpeechRecognitionCallbacks = {}) {
    this.config = {
      language: config.language || 'zh-CN',
      continuous: config.continuous !== false, // 默认开启连续识别
      interimResults: config.interimResults !== false, // 默认开启临时结果
      maxAlternatives: config.maxAlternatives || 1,
    };

    this.callbacks = callbacks;

    // 检查浏览器支持
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('浏览器不支持 Web Speech API');
        callbacks.onError?.('您的浏览器不支持语音识别功能');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  /**
   * 设置识别器配置和事件监听
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    // 设置配置
    this.recognition.lang = this.config.language || 'zh-CN';
    this.recognition.continuous = this.config.continuous ? true : false;
    this.recognition.interimResults = this.config.interimResults ? true : false;
    this.recognition.maxAlternatives = this.config.maxAlternatives || 1;

    // 开始监听
    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
      this.callbacks.onStatusChange?.('listening');
    };

    // 结束监听
    this.recognition.onend = () => {
      this.isListening = false;
      this.callbacks.onEnd?.();
      this.callbacks.onStatusChange?.('idle');
    };

    // 错误处理
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      let errorMessage = '语音识别出错';

      switch (event.error) {
        case 'no-speech':
          errorMessage = '未检测到语音输入';
          break;
        case 'audio-capture':
          errorMessage = '无法访问麦克风';
          break;
        case 'not-allowed':
          errorMessage = '未授权使用麦克风';
          break;
        case 'network':
          errorMessage = '网络连接错误';
          break;
        case 'aborted':
          errorMessage = '识别已中止';
          break;
        default:
          errorMessage = `识别错误: ${event.error}`;
      }

      this.isListening = false;
      this.callbacks.onError?.(errorMessage);
      this.callbacks.onStatusChange?.('idle');
    };

    // 结果处理
    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;

        if (result.isFinal) {
          this.finalTranscript += transcript;
          this.callbacks.onResult?.(this.finalTranscript, true);
        } else {
          this.interimTranscript += transcript;
          this.callbacks.onResult?.(this.finalTranscript + this.interimTranscript, false);
        }
      }
    };
  }

  /**
   * 开始识别
   */
  public start(): void {
    if (!this.recognition) {
      this.callbacks.onError?.('语音识别功能不可用');
      return;
    }

    if (this.isListening) {
      console.warn('语音识别已在运行中');
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      this.callbacks.onError?.('无法启动语音识别');
    }
  }

  /**
   * 停止识别
   */
  public stop(): void {
    if (!this.recognition || !this.isListening) {
      return;
    }

    try {
      this.recognition.stop();
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }

  /**
   * 中止识别（强制停止）
   */
  public abort(): void {
    if (!this.recognition) {
      return;
    }

    try {
      this.recognition.abort();
      this.isListening = false;
    } catch (error) {
      console.error('Failed to abort speech recognition:', error);
    }
  }

  /**
   * 重置识别器
   */
  public reset(): void {
    this.finalTranscript = '';
    this.interimTranscript = '';
  }

  /**
   * 获取最终识别文本
   */
  public getFinalTranscript(): string {
    return this.finalTranscript;
  }

  /**
   * 获取临时识别文本
   */
  public getInterimTranscript(): string {
    return this.interimTranscript;
  }

  /**
   * 获取完整识别文本（最终+临时）
   */
  public getFullTranscript(): string {
    return this.finalTranscript + this.interimTranscript;
  }

  /**
   * 是否正在监听
   */
  public getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * 更改语言
   */
  public changeLanguage(language: string): void {
    if (!this.recognition) return;

    // 停止当前识别
    if (this.isListening) {
      this.stop();
    }

    // 更新配置
    this.config.language = language;

    // 重新设置识别器
    this.setupRecognition();
  }

  /**
   * 检查浏览器支持
   */
  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  /**
   * 获取支持的语言列表
   */
  public static getSupportedLanguages(): string[] {
    return [
      'zh-CN', // 中文（中国）
      'zh-TW', // 中文（台湾）
      'en-US', // 英语（美国）
      'en-GB', // 英语（英国）
      'ja-JP', // 日语
      'ko-KR', // 韩语
      'fr-FR', // 法语
      'de-DE', // 德语
      'es-ES', // 西班牙语
      'ru-RU', // 俄语
    ];
  }
}

/**
 * 辅助函数：将音频 Blob 转换为 Base64
 */
export async function audioBlobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * 辅助函数：将 Base64 转换为音频 Blob
 */
export function base64ToAudioBlob(base64: string, mimeType: string = 'audio/webm'): Blob {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}

/**
 * 辅助函数：获取音频时长
 */
export function getAudioDuration(blob: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
      URL.revokeObjectURL(audio.src);
    };
    audio.onerror = () => {
      reject(new Error('无法获取音频时长'));
      URL.revokeObjectURL(audio.src);
    };
    audio.src = URL.createObjectURL(blob);
  });
}
