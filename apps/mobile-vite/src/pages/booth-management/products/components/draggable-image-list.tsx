import React, { useState, useRef, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
import { restrictToParentElement, restrictToHorizontalAxis } from '@dnd-kit/modifiers';
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
  } = useSortable({ 
    id: `image-${index}`,
    disabled: false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: disableAnimation ? 'none' : transition,
    touchAction: 'none',
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-lg border overflow-hidden transition-all duration-200 ${
        isDragging 
          ? 'border-orange-500 shadow-xl scale-105 rotate-3 opacity-90' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
      {...attributes}
      {...listeners}
    >
      {/* 封面标识 */}
      {isCover && (
        <div className="absolute top-2 left-2 z-20 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={10} />
          <span>封面</span>
        </div>
      )}

      {/* 删除按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-2 right-2 z-20 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
      >
        <X size={12} />
      </button>

      {/* 图片预览 */}
      <div className="aspect-square">
        <img
          src={URL.createObjectURL(image)}
          alt={`商品图片 ${index + 1}`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* 图片信息 */}
      <div className="p-2 bg-gray-50">
        <p className="text-xs text-gray-600 truncate">{image.name}</p>
        <p className="text-xs text-gray-400">
          {(image.size / 1024 / 1024).toFixed(2)}MB
        </p>
      </div>

      {/* 拖拽指示器 */}
      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
          拖拽排序
        </div>
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
        distance: 8,
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
        tolerance: 5,
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
    
    if (files.length === 0) return;
    
    // 检查图片数量限制
    if (images.length + files.length > maxImages) {
      alert(`最多只能上传${maxImages}张图片`);
      return;
    }
    
    // 验证每个文件
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`图片 "${file.name}" 大小超过5MB，请选择更小的图片`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert(`文件 "${file.name}" 不是图片格式`);
        return;
      }
    }
    
    const newImages = [...images, ...files];
    onChange(newImages);
    
    // 重置input
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* 图片拖拽区域 */}
      <div className="relative">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          // 添加边界限制
          modifiers={[restrictToParentElement]}
        >
          <SortableContext 
            items={images.map((_, index) => `image-${index}`)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-3 select-none">
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
      </div>

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
