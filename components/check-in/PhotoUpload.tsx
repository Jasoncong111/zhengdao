'use client';

/**
 * 照片上传组件（可选）
 * 支持上传今日打卡照片
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface PhotoUploadProps {
  /** 照片URL回调 */
  onPhotosChange: (photos: string[]) => void;
  /** 已有照片 */
  initialPhotos?: string[];
}

export function PhotoUpload({ onPhotosChange, initialPhotos = [] }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 选择文件 */
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  /** 文件变化处理 */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // 转换为base64
    const newPhotos: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      newPhotos.push(base64);
    }

    const updatedPhotos = [...photos, ...newPhotos];
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);

    // 重置input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /** 文件转base64 */
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /** 删除照片 */
  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    onPhotosChange(updatedPhotos);
  };

  return (
    <div className="space-y-4">
      {/* 标题和说明 */}
      <div className="flex justify-between items-center">
        <div>
          <h3
            className="text-lg font-bold text-ink"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            上传照片（可选）
          </h3>
          <p className="text-sm text-ink/60">记录今天的精彩瞬间</p>
        </div>
        <div className="text-xs text-ink/40">{photos.length}/9</div>
      </div>

      {/* 照片网格 */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square relative group"
            >
              <img
                src={`data:image/jpeg;base64,${photo}`}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover border-2 border-ink/20"
              />
              {/* 删除按钮 */}
              <button
                onClick={() => handleDeletePhoto(index)}
                className="absolute top-1 right-1 w-6 h-6 bg-seal text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ borderRadius: 0 }}
              >
                ×
              </button>
            </motion.div>
          ))}

          {/* 添加按钮 */}
          {photos.length < 9 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSelectFile}
              className="aspect-square border-2 border-dashed border-ink/30 flex items-center justify-center text-ink/40 hover:border-ink hover:text-ink transition-colors"
            >
              <span className="text-4xl">+</span>
            </motion.button>
          )}
        </div>
      )}

      {/* 无照片时的添加按钮 */}
      {photos.length === 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSelectFile}
          className="w-full py-8 border-2 border-dashed border-ink/30 flex flex-col items-center justify-center gap-2 text-ink/40 hover:border-ink hover:text-ink transition-colors"
        >
          <span className="text-4xl">📷</span>
          <span className="text-sm" style={{ fontFamily: 'Georgia, serif' }}>
            点击上传照片
          </span>
        </motion.button>
      )}

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 提示 */}
      <p className="text-xs text-ink/40 text-center">
        支持 JPG、PNG 格式，最多9张
      </p>
    </div>
  );
}
