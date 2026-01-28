'use client';

/**
 * Image Uploader Component
 * 图片上传组件
 * 支持点击上传、拖拽上传、多图上传（最多9张）、图片预览、删除
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  processImage,
  formatFileSize,
  validateImage,
  type ImageProcessResult,
} from '@/lib/image-handler';

export interface ImageData {
  id: string;
  file: File;
  preview: string;
  compressed: string;
  thumbnail: string;
  size: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

interface ImageUploaderProps {
  /** 已选择的图片 */
  images?: ImageData[];
  /** 图片变化回调 */
  onChange?: (images: ImageData[]) => void;
  /** 最大图片数量 */
  maxCount?: number;
  /** 是否禁用 */
  disabled?: boolean;
  /** 显示标题 */
  showTitle?: boolean;
}

export function ImageUploader({
  images = [],
  onChange,
  maxCount = 9,
  disabled = false,
  showTitle = true,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 生成唯一ID
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 处理文件选择
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled || processing) return;

      const fileArray = Array.from(files);
      const remainingSlots = maxCount - images.length;

      if (remainingSlots <= 0) {
        alert(`最多只能上传 ${maxCount} 张图片`);
        return;
      }

      // 过滤和验证图片
      const validFiles: File[] = [];
      for (const file of fileArray.slice(0, remainingSlots)) {
        const validation = validateImage(file);
        if (!validation.valid) {
          alert(`${file.name}: ${validation.error}`);
          continue;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      setProcessing(true);

      try {
        // 处理所有图片
        const results = await Promise.all(
          validFiles.map(async (file) => {
            const result = await processImage(file, {
              maxWidth: 1920,
              maxHeight: 1920,
              quality: 0.85,
              maxSize: 500 * 1024, // 500KB
              thumbnailSize: 200,
            });

            return {
              id: generateId(),
              file,
              preview: result.base64,
              compressed: result.compressedBase64,
              thumbnail: result.thumbnail,
              size: result.size,
              compressedSize: result.compressedSize,
              width: result.width,
              height: result.height,
              format: result.format,
            };
          })
        );

        // 更新图片列表
        const newImages = [...images, ...results];
        onChange?.(newImages);
      } catch (error) {
        console.error('图片处理失败:', error);
        alert('图片处理失败，请重试');
      } finally {
        setProcessing(false);
      }
    },
    [images, maxCount, disabled, processing, onChange]
  );

  // 处理文件输入变化
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    handleFiles(files);

    // 清空 input 允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !processing) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled || processing) return;

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    handleFiles(files);
  };

  // 删除图片
  const handleRemoveImage = (id: string) => {
    const newImages = images.filter((img) => img.id !== id);
    onChange?.(newImages);
  };

  // 点击上传区域
  const handleClick = () => {
    if (!disabled && !processing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      {/* 标题 */}
      {showTitle && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-black mb-1">📷 添加图片</h3>
          <p className="text-sm text-gray-600">
            最多 {maxCount} 张，单张不超过 500KB
          </p>
        </div>
      )}

      {/* 图片网格 */}
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3">
          <AnimatePresence>
            {images.map((image) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square bg-gray-100 border-2 border-black overflow-hidden group"
              >
                {/* 图片预览 */}
                <img
                  src={image.thumbnail}
                  alt="预览"
                  className="w-full h-full object-cover"
                />

                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="text-white text-center px-2">
                    <p className="text-xs mb-1">
                      {image.width} × {image.height}
                    </p>
                    <p className="text-xs">{formatFileSize(image.compressedSize)}</p>
                  </div>
                </div>

                {/* 删除按钮 */}
                {!disabled && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveImage(image.id)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg hover:bg-red-700 transition-colors"
                  >
                    ×
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 上传区域 */}
      {images.length < maxCount && (
        <motion.div
          whileHover={{ scale: disabled || processing ? 1 : 1.01 }}
          whileTap={{ scale: disabled || processing ? 1 : 0.99 }}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full py-12 px-6 border-2 border-dashed rounded-lg
            transition-all cursor-pointer
            ${
              isDragging
                ? 'border-[#D43628] bg-red-50'
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
            ${disabled || processing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {/* 隐藏的文件输入 */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || processing}
          />

          {/* 内容 */}
          <div className="text-center">
            {processing ? (
              <div className="space-y-2">
                <div className="inline-block w-12 h-12 border-4 border-[#D43628] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-600">处理中...</p>
              </div>
            ) : (
              <>
                {/* 图标 */}
                <motion.div
                  animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                  className="mb-3"
                >
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>

                {/* 文字提示 */}
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragging ? '松开鼠标上传图片' : '点击或拖拽图片到此处'}
                  </p>
                  <p className="text-xs text-gray-500">
                    支持 JPG、PNG、GIF、WebP 格式
                  </p>
                  <p className="text-xs text-gray-500">
                    已选 {images.length} / {maxCount} 张
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* 图片信息 */}
      {images.length > 0 && (
        <div className="mt-3 text-xs text-gray-600">
          <p>总大小: {formatFileSize(images.reduce((sum, img) => sum + img.compressedSize, 0))}</p>
        </div>
      )}
    </div>
  );
}
