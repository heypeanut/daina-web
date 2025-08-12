import type { BoothProduct } from "@/types/booth";
import { ImageLazyLoader } from "@/components/common";

interface ProductCardProps {
  product: BoothProduct;
  isGridView: boolean;
  onProductClick: (product: BoothProduct) => void;
}

export function ProductCard({
    product,
    isGridView,
    onProductClick,
  }: ProductCardProps) {
    // 判断是否为新品（7天内的商品）
    const isNewProduct = () => {
      const now = new Date();
      const createdDate = new Date(product.createdAt);
      const diffTime = now.getTime() - createdDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays <= 7;
    };

    // 判断是否有特价（有原价且原价高于现价）
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const hasNewTag = isNewProduct();

    if (isGridView) {
      return (
        <div
          onClick={() => onProductClick(product)}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
          {/* Product image */}
          <div className="relative aspect-square">
            <ImageLazyLoader
              src={product.coverImage || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Tags */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {hasNewTag && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                  新品
                </span>
              )}
              {hasDiscount && (
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  特价
                </span>
              )}
            </div>
          </div>

          {/* Product info */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h4>

            {/* Price */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-red-500 font-bold text-lg">
                ¥{product.price?.toFixed(2) || "0.00"}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-sm line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Views info */}
            <div className="text-xs text-gray-500">
              <span>浏览 {product.views || 0}</span>
            </div>
          </div>
        </div>
      );
    }

    // List view
    return (
      <div
        onClick={() => onProductClick(product)}
        className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex gap-3">
          {/* Product image */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <ImageLazyLoader
              src={product.coverImage || "/placeholder-product.png"}
              alt={product.name}
              className="w-full h-full object-cover rounded"
            />
            {hasNewTag && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                新
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
              {product.name}
            </h4>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-500 font-bold">
                ¥{product.price?.toFixed(2) || "0.00"}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-xs line-through">
                  ¥{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">
              <span>浏览 {product.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };