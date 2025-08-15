import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, RotateCcw } from 'lucide-react';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropResult {
  file: File;
  url: string;
}

interface ImageCropModalProps {
  isOpen: boolean;
  imageFile: File;
  onClose: () => void;
  onCropComplete: (result: CropResult) => void;
  aspectRatio?: number;
  cropShape?: 'rect' | 'round';
  title?: string;
}

// 创建裁切后的图片文件
const createCroppedImage = async (
  imageSrc: string,
  pixelCrop: Area,
  fileName: string
): Promise<CropResult> => {
  const image = new Image();
  image.src = imageSrc;
  
  return new Promise((resolve) => {
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('无法创建canvas上下文');
      }

      // 设置canvas尺寸为裁切区域尺寸
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      // 绘制裁切后的图片
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // 转换为blob并创建File对象
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('无法创建图片blob');
        }
        
        const file = new File([blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        
        const url = URL.createObjectURL(file);
        
        resolve({ file, url });
      }, 'image/jpeg', 0.95);
    };
  });
};

export function ImageCropModal({
  isOpen,
  imageFile,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = 'rect',
  title = '裁切图片'
}: ImageCropModalProps) {
  console.log('ImageCropModal 渲染:', { isOpen, imageFile: imageFile?.name });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 图片URL
  const imageSrc = React.useMemo(() => {
    return imageFile ? URL.createObjectURL(imageFile) : '';
  }, [imageFile]);

  // 清理URL
  React.useEffect(() => {
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  const onCropChange = useCallback((crop: { x: number; y: number }) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom: number) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation: number) => {
    setRotation(rotation);
  }, []);

  const onCropAreaChange = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // 重置裁切参数
  const handleReset = useCallback(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  }, []);

  // 确认裁切
  const handleCropConfirm = useCallback(async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    
    setIsProcessing(true);
    try {
      const result = await createCroppedImage(
        imageSrc,
        croppedAreaPixels,
        imageFile.name
      );
      onCropComplete(result);
      onClose();
    } catch (error) {
      console.error('裁切图片失败:', error);
      alert('裁切图片失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  }, [croppedAreaPixels, imageSrc, imageFile.name, onCropComplete, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* 裁切区域 */}
        <div className="relative flex-1 bg-gray-900" style={{ minHeight: '300px' }}>
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspectRatio}
              cropShape={cropShape}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
              onCropComplete={onCropAreaChange}
              showGrid={true}
              style={{
                containerStyle: {
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1f2937',
                },
              }}
            />
          )}
        </div>

        {/* 控制区域 */}
        <div className="p-4 space-y-4 border-t border-gray-200">
          {/* 缩放控制 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              缩放: {Math.round(zoom * 100)}%
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* 旋转控制 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              旋转: {rotation}°
            </label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw size={16} />
              重置
            </button>
            <button
              onClick={handleCropConfirm}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all"
            >
              <Check size={16} />
              {isProcessing ? '处理中...' : '确认'}
            </button>
          </div>
        </div>

        {/* 使用提示 */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 提示：拖拽图片调整位置，使用滑块控制缩放和旋转
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #f97316;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `
      }} />
    </div>
  );
}
