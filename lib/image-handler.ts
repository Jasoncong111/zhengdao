/**
 * Image Handler Utilities
 * 处理图片上传、压缩、转换等功能
 */

export interface ImageProcessResult {
  base64: string;
  compressedBase64: string;
  thumbnail: string;
  size: number;
  compressedSize: number;
  width: number;
  height: number;
  format: string;
}

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 验证图片文件
 */
export function validateImage(file: File): ImageValidationResult {
  // 检查文件类型
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '仅支持 JPG、PNG、GIF、WebP 格式的图片',
    };
  }

  // 检查文件大小（原始文件限制 10MB）
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '图片大小不能超过 10MB',
    };
  }

  return { valid: true };
}

/**
 * 将文件转换为 Base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片
 * @param base64 - 原始图片的 Base64
 * @param maxWidth - 最大宽度（默认 1920px）
 * @param maxHeight - 最大高度（默认 1920px）
 * @param quality - 压缩质量（0-1，默认 0.8）
 * @param maxSize - 最大文件大小（字节，默认 500KB）
 */
export function compressImage(
  base64: string,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  quality: number = 0.8,
  maxSize: number = 500 * 1024
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      // 创建 Canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      // 计算缩放尺寸
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);

      // 逐步降低质量直到满足大小要求
      let currentQuality = quality;
      const tryCompress = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('压缩失败'));
              return;
            }

            // 如果满足大小要求或质量已经很低了
            if (blob.size <= maxSize || currentQuality <= 0.1) {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            } else {
              // 继续降低质量
              currentQuality -= 0.1;
              tryCompress();
            }
          },
          'image/jpeg',
          currentQuality
        );
      };

      tryCompress();
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = base64;
  });
}

/**
 * 生成缩略图
 * @param base64 - 原始图片的 Base64
 * @param size - 缩略图尺寸（默认 200px）
 */
export function generateThumbnail(base64: string, size: number = 200): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('无法创建 Canvas 上下文'));
        return;
      }

      // 计算缩略图尺寸（保持宽高比）
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > size) {
          height = (height * size) / width;
          width = size;
        }
      } else {
        if (height > size) {
          width = (width * size) / height;
          height = size;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制缩略图
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Base64
      const thumbnail = canvas.toDataURL('image/jpeg', 0.7);
      resolve(thumbnail);
    };

    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = base64;
  });
}

/**
 * 获取图片尺寸
 */
export function getImageDimensions(base64: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => reject(new Error('无法获取图片尺寸'));
    img.src = base64;
  });
}

/**
 * 计算图片文件大小（字节）
 */
export function getBase64Size(base64: string): number {
  // Base64 编码后的字符串长度约为原始文件的 4/3
  // 减去 data:image/xxx;base64, 前缀
  const base64Data = base64.split(',')[1];
  return Math.round((base64Data.length * 3) / 4);
}

/**
 * 格式化文件大小显示
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' B';
  } else if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + ' KB';
  } else {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}

/**
 * 完整处理图片
 * 包括：转换 Base64、压缩、生成缩略图、获取信息
 */
export async function processImage(
  file: File,
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSize?: number;
    thumbnailSize?: number;
  }
): Promise<ImageProcessResult> {
  // 验证图片
  const validation = validateImage(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 转换为 Base64
  const base64 = await fileToBase64(file);

  // 获取图片尺寸
  const dimensions = await getImageDimensions(base64);

  // 压缩图片
  const compressedBase64 = await compressImage(
    base64,
    options?.maxWidth,
    options?.maxHeight,
    options?.quality,
    options?.maxSize
  );

  // 生成缩略图
  const thumbnail = await generateThumbnail(base64, options?.thumbnailSize);

  // 获取文件大小
  const size = file.size;
  const compressedSize = getBase64Size(compressedBase64);

  return {
    base64,
    compressedBase64,
    thumbnail,
    size,
    compressedSize,
    width: dimensions.width,
    height: dimensions.height,
    format: file.type,
  };
}

/**
 * 批量处理图片
 */
export async function processImages(
  files: File[],
  options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSize?: number;
    thumbnailSize?: number;
    maxCount?: number;
  }
): Promise<ImageProcessResult[]> {
  // 限制数量
  const maxCount = options?.maxCount || 9;
  const filesToProcess = files.slice(0, maxCount);

  // 并行处理所有图片
  const results = await Promise.all(
    filesToProcess.map((file) => processImage(file, options))
  );

  return results;
}

/**
 * 下载图片
 */
export function downloadImage(base64: string, filename: string = 'image.jpg') {
  const link = document.createElement('a');
  link.href = base64;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
