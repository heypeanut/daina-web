import React from 'react';
import { Heart } from 'lucide-react';

// 模拟商品数据
const mockProducts = [
  { 
    id: '1', 
    title: '华强北代拿手机贴膜', 
    image: '/placeholder-product.jpg',
    boothName: '华强北数码城'
  },
  { 
    id: '2', 
    title: '华强北代拿手机壳', 
    image: '/placeholder-product.jpg',
    boothName: '华强北数码城'
  },
];

export function InfiniteProducts() {
  return (
    <div className="px-4 py-4">
      {/* 标题 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        近期上新
      </h3>
      
      {/* 商品网格 */}
      <div className="grid grid-cols-2 gap-4">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer"
          >
            {/* 商品图片 */}
            <div className="aspect-square bg-gray-200 relative">
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                商品图片
              </div>
              {/* 收藏按钮 */}
              <button className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow-sm">
                <Heart size={16} className="text-gray-400" />
              </button>
            </div>
            
            {/* 商品信息 */}
            <div className="p-3">
              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {product.title}
              </h4>
              <p className="text-xs text-gray-500">
                {product.boothName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
