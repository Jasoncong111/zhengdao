'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface MockCameraProps {
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
}

/**
 * MockCamera - 模拟相机组件
 * 
 * 用于 Demo 演示，模拟拍照流程
 */
export default function MockCamera({ onCapture, onClose }: MockCameraProps) {
  const [stage, setStage] = useState<'camera' | 'capturing' | 'preview'>('camera');
  const [capturedImage, setCapturedImage] = useState<string>('');

  // 预设的健身/读书图片（使用占位图）
  const mockImages = [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop', // 健身
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', // 读书
  ];

  const handleCapture = () => {
    setStage('capturing');
    
    // 模拟拍照延迟
    setTimeout(() => {
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setCapturedImage(randomImage);
      setStage('preview');
    }, 1500);
  };

  const handleConfirm = () => {
    onCapture(capturedImage);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-full max-w-md mx-4">
          {/* 关闭按钮 */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white text-2xl"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            ✕
          </button>

          {/* 相机界面 */}
          {stage === 'camera' && (
            <motion.div
              className="bg-white p-6"
              style={{ borderRadius: 0 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {/* 相机预览区域 */}
              <div className="aspect-square bg-gray-200 mb-4 flex items-center justify-center">
                <motion.div
                  className="text-center"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-6xl mb-2">📷</div>
                  <p className="text-sm text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>
                    准备拍照
                  </p>
                </motion.div>
              </div>

              {/* 拍照按钮 */}
              <button
                onClick={handleCapture}
                className="w-full py-4 bg-black text-white font-bold"
                style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
              >
                拍照
              </button>
            </motion.div>
          )}

          {/* 拍照中 */}
          {stage === 'capturing' && (
            <motion.div
              className="bg-white p-6"
              style={{ borderRadius: 0 }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <div className="aspect-square bg-black mb-4 flex items-center justify-center">
                <motion.div
                  className="text-white text-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <div className="text-6xl mb-2">📸</div>
                  <p className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                    拍照中...
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* 图片预览 */}
          {stage === 'preview' && (
            <motion.div
              className="bg-white p-6"
              style={{ borderRadius: 0 }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              {/* 图片预览 */}
              <div className="aspect-square mb-4 overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 操作按钮 */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStage('camera')}
                  className="py-3 border-2 border-black text-black font-bold"
                  style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                >
                  重拍
                </button>
                <button
                  onClick={handleConfirm}
                  className="py-3 bg-black text-white font-bold"
                  style={{ borderRadius: 0, fontFamily: 'Georgia, serif' }}
                >
                  确认
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
