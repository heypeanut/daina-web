"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, Star } from 'lucide-react';

interface DraggableImageItemProps {
  image: File;
  index: number;
  isCover: boolean;
  onRemove: (index: number) => void;
  disableAnimation?: boolean;
}

function DraggableImageItem({ image, index, isCover, onRemove, disableAnimation = false }: DraggableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging || disableAnimation ? 'none' : transition,
    opacity: isDragging ? 0.9 : 1,
  };

  const imageUrl = URL.createObjectURL(image);

  return (
    <div
      ref={setNodeRef}
      style={{ touchAction: 'none', ...style }}
      {...attributes}
      {...listeners}
      className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
        isCover ? 'border-orange-500' : 'border-gray-200'
      } ${isDragging ? 'z-10 shadow-lg border-blue-400' : ''} cursor-grab active:cursor-grabbing select-none`}
    >

      {/* 封面标识 */}
      {isCover && (
        <div className="absolute top-1 right-7 px-2 py-1 bg-orange-500 text-white text-xs rounded-full flex items-center gap-1 z-10 pointer-events-none">
          <Star className="w-3 h-3" />
          封面
        </div>
      )}

      {/* 删除按钮 */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-20 pointer-events-auto"
      >
        <X className="w-3 h-3" />
      </button>

      {/* 图片预览 */}
      <img
        src={imageUrl}
        alt={`商品图片${index + 1}`}
        className="w-full h-full object-cover"
        onLoad={() => URL.revokeObjectURL(imageUrl)} // 释放内存
      />

      {/* 图片信息 */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
        <div className="truncate">{image.name}</div>
        <div>{(image.size / 1024 / 1024).toFixed(1)}MB</div>
      </div>
    </div>
  );
}

interface DraggableImageListProps {
  images: File[];
  onChange: (newImages: File[]) => void;
  maxImages?: number;
}

export function DraggableImageList({ 
  images, 
  onChange, 
  maxImages = 10 
}: DraggableImageListProps) {
  const [disableAnimation, setDisableAnimation] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 清理定时器，避免内存泄漏
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 5,
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      console.log('Drag ended without valid drop target');
      return;
    }
    
    if (active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().replace('image-', ''));
      const newIndex = parseInt(over.id.toString().replace('image-', ''));
      
      // 立即禁用动画，避免回弹效果
      setDisableAnimation(true);
      
      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // 更新图片顺序
      const newImages = arrayMove(images, oldIndex, newIndex);
      onChange(newImages);
      
      // 150ms 后重新启用动画
      timeoutRef.current = setTimeout(() => {
        setDisableAnimation(false);
      }, 150);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // 验证文件
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        console.warn(`${file.name} 不是有效的图片文件`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.warn(`${file.name} 大小不能超过5MB`);
        return false;
      }
      return true;
    });

    // 检查总数量限制
    const currentCount = images.length;
    const availableSlots = maxImages - currentCount;
    
    if (validFiles.length > availableSlots) {
      console.warn(`最多只能添加${availableSlots}张图片`);
      const limitedFiles = validFiles.slice(0, availableSlots);
      onChange([...images, ...limitedFiles]);
    } else if (validFiles.length > 0) {
      onChange([...images, ...validFiles]);
    }

    // 清空input值，允许重复选择相同文件
    event.target.value = '';
  };

  const imageIds = images.map((_, index) => `image-${index}`);

  return (
    <div className="space-y-4">
      {/* 拖拽排序列表 */}
      {images.length > 0 && (
        <DndContext 
          sensors={sensors} 
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageIds} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 gap-3">
              {images.map((image, index) => (
                <DraggableImageItem
                  key={`image-${index}`}
                  image={image}
                  index={index}
                  isCover={index === 0}
                  onRemove={handleRemoveImage}
                  disableAnimation={disableAnimation}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* 添加图片按钮 */}
      {images.length < maxImages && (
        <div className="relative">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <div>
                <p className="text-gray-600 mb-1">
                  {images.length === 0 ? '点击添加商品图片' : '继续添加图片'}
                </p>
                <p className="text-xs text-gray-500">
                  支持 JPG、PNG 格式，不超过5MB
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  还可添加 {maxImages - images.length} 张
                  {images.length === 0 && ' (第一张将作为封面图)'}
                </p>
              </div>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImages}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      )}

      {/* 使用说明 */}
      {images.length > 0 && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
          <p>💡 使用说明：</p>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>长按图片可拖动调整顺序</li>
            <li>第一张图片将作为商品封面</li>
            <li>点击右上角 ✕ 可删除图片</li>
          </ul>
        </div>
      )}
    </div>
  );
}