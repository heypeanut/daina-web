/**
 * 图片压缩工具函数
 */

export interface CompressOptions {
  maxWidth?: number;
  quality?: number;
}

/**
 * 压缩图片文件
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns Promise<string> 压缩后的base64字符串
 */
export const compressImage = (
  file: File,
  options: CompressOptions = {}
): Promise<string> => {
  const { maxWidth = 600, quality = 0.7 } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // 计算压缩后的尺寸
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxWidth) {
          width = (width * maxWidth) / height;
          height = maxWidth;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);

      // 尝试使用WebP格式，不支持则使用JPEG
      try {
        const compressedDataUrl = canvas.toDataURL("image/webp", quality);
        if (!compressedDataUrl.startsWith("data:image/webp")) {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(compressedDataUrl);
        }
      } catch {
        resolve(canvas.toDataURL("image/jpeg", quality));
      }
    };

    img.onerror = () => reject(new Error("图片加载失败"));
    img.src = URL.createObjectURL(file);
  });
};
