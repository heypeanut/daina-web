import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Package 
} from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

// Mock收藏商品数据
interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  boothName: string;
  favoriteAt: string;
  views: number;
}

const mockFavoriteProducts: FavoriteProduct[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 透明保护壳",
    price: 35.00,
    originalPrice: 59.00,
    coverImage: "/placeholder-product.jpg",
    boothName: "潮流手机配件专营店",
    favoriteAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    views: 1250
  },
  {
    id: "2",
    name: "Type-C快充数据线 2米",
    price: 15.80,
    originalPrice: 25.00,
    coverImage: "/placeholder-product.jpg",
    boothName: "潮流手机配件专营店",
    favoriteAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    views: 890
  },
  {
    id: "3",
    name: "无线蓝牙耳机 降噪版",
    price: 128.00,
    originalPrice: 199.00,
    coverImage: "/placeholder-product.jpg",
    boothName: "数码科技专营店",
    favoriteAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    views: 2100
  }
];

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(mockFavoriteProducts);
  const [removing, setRemoving] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleRemoveFavorite = async (productId: string) => {
    setRemoving(productId);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 从列表中移除
      setProducts(prev => prev.filter(p => p.id !== productId));
      
      console.log(`已取消收藏商品: ${productId}`);
    } catch (error) {
      console.error("取消收藏失败:", error);
      alert("取消收藏失败，请重试");
    } finally {
      setRemoving(null);
    }
  };

  const formatPrice = (price: number) => {
    return `¥${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            我的收藏 ({products.length})
          </h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {products.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">暂无收藏商品</p>
            <p className="text-gray-400 text-sm text-center">
              去逛逛喜欢的商品，点击♡收藏吧
            </p>
            <button
              onClick={() => navigate('/market')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          /* 商品列表 */
          <div className="p-4">
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="flex p-3 gap-3">
                    {/* 商品图片 */}
                    <div
                      className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <ImageLazyLoader
                        src={product.coverImage}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* 商品信息 */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500 font-bold text-lg">
                          {formatPrice(product.price)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-sm line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{product.boothName}</span>
                        <span>浏览 {product.views}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-1">
                        收藏于 {formatDate(product.favoriteAt)}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-col justify-between items-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(product.id);
                        }}
                        disabled={removing === product.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      >
                        {removing === product.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: 实现购物车功能
                          console.log('添加到购物车:', product.id);
                        }}
                        className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
