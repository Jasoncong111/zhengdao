'use client';

/**
 * 语音录制组件
 * 支持录音、实时转文字、播放预览、删除重录
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SpeechRecognitionService,
  SpeechRecognitionStatus,
  audioBlobToBase64,
  getAudioDuration,
} from '@/lib/speech-to-text';

interface VoiceRecorderProps {
  /** 转写完成回调 */
  onTranscriptComplete?: (text: string, audioData?: string, duration?: number) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 最大录音时长（秒），默认 60 */
  maxDuration?: number;
  /** 语言设置，默认 'zh-CN' */
  language?: string;
}

interface AudioData {
  blob: Blob;
  base64: string;
  duration: number;
  url: string;
}

export function VoiceRecorder({
  onTranscriptComplete,
  disabled = false,
  maxDuration = 60,
  language = 'zh-CN',
}: VoiceRecorderProps) {
  // 状态管理
  const [status, setStatus] = useState<SpeechRecognitionStatus>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  // Refs
  const recognitionRef = useRef<SpeechRecognitionService | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化
  useEffect(() => {
    // 检查浏览器支持
    const supported = SpeechRecognitionService.isSupported();
    setIsSupported(supported);

    if (!supported) {
      setErrorMessage('您的浏览器不支持语音识别功能');
      return;
    }

    // 初始化语音识别
    recognitionRef.current = new SpeechRecognitionService(
      { language },
      {
        onStart: () => {
          setStatus('listening');
          setErrorMessage('');
        },
        onEnd: () => {
          setStatus('idle');
          stopRecording();
        },
        onError: (error) => {
          setErrorMessage(error);
          setStatus('idle');
          stopRecording();
        },
        onResult: (text, isFinal) => {
          if (isFinal) {
            setTranscript(text);
            setInterimTranscript('');
          } else {
            setInterimTranscript(text.slice(transcript.length));
          }
        },
        onStatusChange: (newStatus) => {
          setStatus(newStatus);
        },
      }
    );

    return () => {
      // 清理
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioData?.url) {
        URL.revokeObjectURL(audioData.url);
      }
    };
  }, [language]);

  // 开始录音
  const startRecording = async () => {
    try {
      // 请求麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 创建 MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 收集音频数据
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 录音停止时的处理
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const base64 = await audioBlobToBase64(audioBlob);
        const duration = await getAudioDuration(audioBlob);
        const url = URL.createObjectURL(audioBlob);

        setAudioData({ blob: audioBlob, base64, duration, url });

        // 停止所有音频轨道
        stream.getTracks().forEach((track) => track.stop());

        // 通知父组件
        if (onTranscriptComplete && transcript) {
          onTranscriptComplete(transcript, base64, duration);
        }
      };

      // 开始录音
      mediaRecorder.start();
      recognitionRef.current?.start();

      // 开始计时
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      // 重置状态
      setTranscript('');
      setInterimTranscript('');
      setAudioData(null);
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setErrorMessage('无法访问麦克风，请检查权限设置');
    }
  };

  // 停止录音
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    recognitionRef.current?.stop();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // 删除重录
  const handleRerecord = () => {
    if (audioData?.url) {
      URL.revokeObjectURL(audioData.url);
    }

    setAudioData(null);
    setTranscript('');
    setInterimTranscript('');
    setRecordingTime(0);
    setErrorMessage('');

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  // 播放/暂停音频
  const togglePlayback = () => {
    if (!audioData) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioData.url);
        audioRef.current.onended = () => {
          setIsPlaying(false);
        };
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 生成波形动画数据
  const waveformBars = Array.from({ length: 20 }, (_, i) => ({
    height: Math.random() * 100,
  }));

  // 浏览器不支持
  if (!isSupported) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 text-sm">错误: {errorMessage || '您的浏览器不支持语音功能'}</p>
        <p className="text-red-500 text-xs mt-1">建议使用 Chrome、Edge 或 Safari 浏览器</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-2 border-black rounded-lg p-6 shadow-lg">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black flex items-center gap-2">
          语音录制
        </h3>
        <AnimatePresence>
          {status === 'listening' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-red-600">录音中</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 录音控制区域 */}
      <div className="space-y-4">
        {/* 录音按钮 */}
        {!audioData && (
          <div className="flex flex-col items-center gap-4">
            {status !== 'listening' ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                disabled={disabled}
                className={`w-20 h-20 rounded-full border-4 border-black flex items-center justify-center transition-all ${
                  disabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#D43628] text-white hover:bg-[#B82E20] shadow-lg'
                }`}
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                className="w-20 h-20 rounded-full border-4 border-black bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
              </motion.button>
            )}

            <div className="text-center">
              {status === 'idle' && !audioData && (
                <p className="text-gray-600 text-sm">点击开始录音</p>
              )}
            </div>

            {/* 录音时间 */}
            {status === 'listening' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="text-3xl font-bold text-[#D43628] font-mono">
                  {formatTime(recordingTime)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  最长 {maxDuration} 秒
                </p>
              </motion.div>
            )}

            {/* 波形动画 */}
            <AnimatePresence>
              {status === 'listening' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-center gap-1 h-12 overflow-hidden"
                >
                  {waveformBars.map((bar, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-[#D43628] rounded-full"
                      animate={{
                        height: [20, bar.height, 20],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 录音完成后的操作 */}
        {audioData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 音频播放器 */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border-2 border-black">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-[#D43628] text-white flex items-center justify-center flex-shrink-0"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </motion.button>

              <div className="flex-1">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D43628]"
                    initial={{ width: 0 }}
                    animate={{ width: isPlaying ? '100%' : '0%' }}
                    transition={{ duration: audioData.duration }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  时长: {formatTime(audioData.duration)}
                </p>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRerecord}
                className="flex-1 px-4 py-2 bg-white text-black border-2 border-black font-medium rounded hover:bg-gray-100 transition-colors"
              >
                删除重录
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* 实时转写文字 */}
        {(transcript || interimTranscript) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gray-50 border-2 border-black rounded-lg"
          >
            <h4 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
              实时转写
            </h4>
            <div className="min-h-[100px] max-h-[200px] overflow-y-auto">
              <p className="text-black leading-relaxed whitespace-pre-wrap">
                {transcript}
                <span className="text-gray-400">{interimTranscript}</span>
              </p>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <span>{transcript.length} 字</span>
              {status === 'listening' && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  转写中...
                </span>
              )}
            </div>
          </motion.div>
        )}

        {/* 错误提示 */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-200 rounded-lg p-3"
          >
            <p className="text-red-600 text-sm">警告: {errorMessage}</p>
          </motion.div>
        )}
      </div>

      {/* 提示信息 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          提示：说话清晰，可获得更准确的转写结果
        </p>
      </div>
    </div>
  );
}
