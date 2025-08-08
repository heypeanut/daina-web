// 新版图片搜索和上传API - 使用tenant端接口
import { tenantApi } from './config';

// ==================== 图片搜索相关类型 ====================

export interface ImageSearchOptions {
  limit?: number;
  pageNum?: number;
  minSimilarity?: number;
  boothId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BoothSearchResult {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  similarity: number;
  matchedImages: string[];
}

export interface ProductSearchResult {
  id: string;
  name: string;
  price: number;
  image: string;
  boothId: string;
  boothName: string;
  similarity: number;
  matchedImages: string[];
}

export interface ImageSearchResponse<T> {
  results?: T[]; // 兼容原有结构
  rows?: T[];    // 实际API返回的字段
  total: number;
  searchTime?: number;
  algorithm?: string;
  pageNum?: number;
  pageSize?: number;
}

// ==================== 上传相关类型 ====================

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface BatchUploadResponse {
  success: UploadResponse[];
  failed: Array<{
    filename: string;
    error: string;
  }>;
}

// ==================== 图片搜索API ====================

/**
 * 档口图片搜索
 */
export async function searchBoothsByImage(
  imageFile: File,
  options: ImageSearchOptions = {}
): Promise<ImageSearchResponse<BoothSearchResult>> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // 添加搜索选项
  formData.append('limit', (options.limit || 20).toString());
  formData.append('minSimilarity', (options.minSimilarity || 0.3).toString());
  
  if (options.pageNum) {
    formData.append('pageNum', options.pageNum.toString());
  }
  
  const response = await tenantApi.postFormData('/search/image/booth', formData);
  
  return response.data;
}

/**
 * 产品图片搜索
 */
export async function searchProductsByImage(
  imageFile: File,
  options: ImageSearchOptions = {}
): Promise<ImageSearchResponse<ProductSearchResult>> {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  // 添加搜索选项
  formData.append('limit', (options.limit || 20).toString());
  formData.append('minSimilarity', (options.minSimilarity || 0.3).toString());
  
  if (options.pageNum) {
    formData.append('pageNum', options.pageNum.toString());
  }
  if (options.boothId) formData.append('boothId', options.boothId);
  if (options.minPrice) formData.append('minPrice', options.minPrice.toString());
  if (options.maxPrice) formData.append('maxPrice', options.maxPrice.toString());
  
  const response = await tenantApi.postFormData('/search/image/product', formData);
  
  return response.data;
}

// ==================== 图片上传API ====================

/**
 * 上传单张图片
 */
export async function uploadImage(imageFile: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await tenantApi.postFormData('/upload/image', formData);
  
  return response.data;
}

/**
 * 上传图片（支持水印）
 */
export async function uploadImageWithWatermark(
  imageFile: File,
  watermarkText?: string
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', imageFile);
  formData.append('addWatermark', 'true');
  
  if (watermarkText) {
    formData.append('watermarkText', watermarkText);
  }
  
  const response = await tenantApi.postFormData('/upload/image/with-watermark', formData);
  
  return response.data;
}

/**
 * 批量上传图片
 */
export async function uploadImagesBatch(imageFiles: File[]): Promise<BatchUploadResponse> {
  const formData = new FormData();
  
  imageFiles.forEach(file => {
    formData.append('files', file);
  });
  
  const response = await tenantApi.postFormData('/upload/images/batch', formData);
  
  return response.data;
}

// ==================== 工具函数 ====================

/**
 * 验证图片文件
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的文件格式，请选择 JPG、PNG、GIF 或 WebP 格式的图片'
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: '图片文件过大，请选择小于10MB的图片'
    };
  }
  
  return { valid: true };
}

/**
 * 批量验证图片文件
 */
export function validateImageFiles(files: File[]): { 
  valid: File[]; 
  invalid: Array<{ file: File; error: string }> 
} {
  const valid: File[] = [];
  const invalid: Array<{ file: File; error: string }> = [];
  
  files.forEach(file => {
    const validation = validateImageFile(file);
    if (validation.valid) {
      valid.push(file);
    } else {
      invalid.push({ file, error: validation.error! });
    }
  });
  
  return { valid, invalid };
}

/**
 * 压缩图片（客户端压缩，减少上传时间）
 */
export function compressImage(
  file: File, 
  quality: number = 0.8, 
  maxWidth: number = 1920
): Promise<File> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // 计算压缩后的尺寸
      const { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxWidth / height);
      const newWidth = width * ratio;
      const newHeight = height * ratio;
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);
      
      // 转换为Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        file.type,
        quality
      );
    };
    
    img.onerror = () => reject(new Error('图片加载失败'));
    img.src = URL.createObjectURL(file);
  });
}