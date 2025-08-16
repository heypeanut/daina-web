import { ImageLazyLoader } from "@/components/common";
import type { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  viewMode: "grid" | "list";
  showSimilarity?: boolean;
}

export default function ProductCard({
  product,
  onClick,
  viewMode,
}: // showSimilarity,
ProductCardProps) {
  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex space-x-3">
          <ImageLazyLoader
            src={product.images[0].url}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-orange-600">
                  ¥{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    ¥{product.originalPrice}
                  </span>
                )}
              </div>
              {/* {showSimilarity && product.similarity && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  {Math.round(product.similarity * 100)}% 相似
                </span>
              )} */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="relative">
        <ImageLazyLoader
          src={product.images[0].url}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-1">
          <span className="text-red-500 font-bold text-base">
            ¥{product.price}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ¥{product.originalPrice}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-400">浏览 {product.views}</div>
      </div>
    </div>
  );
}

export type { Product, ProductCardProps };
