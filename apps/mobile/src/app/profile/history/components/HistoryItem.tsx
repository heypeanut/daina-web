import React from "react";
import { Clock, Package, Store, Trash2 } from "lucide-react";
import { Footprint } from "@/lib/api/favorites";
import { formatTime } from "@/utils/formatTime";
import { formatPrice } from "@/utils/formatPrice";

interface HistoryItemProps {
  footprint: Footprint;
  removing: string | null;
  onRemove: (footprintId: string) => Promise<void>;
  onItemClick: (footprint: Footprint) => void;
}

const ProductInfo: React.FC<{ footprint: Footprint }> = ({ footprint }) => {
  if (!footprint.product) return null;

  return (
    <>
      <p className="text-xs text-gray-500 mb-1">
        {footprint.product.boothName}
      </p>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-orange-500">
          {formatPrice(footprint.product.price)}
        </span>
        {footprint.product.originalPrice &&
          footprint.product.originalPrice > footprint.product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(footprint.product.originalPrice)}
            </span>
          )}
      </div>
    </>
  );
};

const BoothInfo: React.FC<{ footprint: Footprint }> = ({ footprint }) => {
  if (!footprint.booth) return null;

  return (
    <>
      {footprint.booth.description && (
        <p className="text-xs text-gray-500 line-clamp-1 mb-1">
          {footprint.booth.description}
        </p>
      )}
      <div className="flex items-center space-x-3 text-xs text-gray-500">
        {footprint.booth.productsCount && (
          <span>{footprint.booth.productsCount}商品</span>
        )}
        {footprint.booth.followers && (
          <span>{footprint.booth.followers}关注</span>
        )}
      </div>
    </>
  );
};

const ItemImage: React.FC<{ footprint: Footprint; onClick: () => void }> = ({ 
  footprint, 
  onClick 
}) => {
  const isProduct = footprint.type === "product";
  const imageSrc = isProduct 
    ? footprint.product?.image 
    : footprint.booth?.avatar;
  const altText = isProduct 
    ? footprint.product?.name 
    : footprint.booth?.name;

  return (
    <button onClick={onClick} className="flex-shrink-0">
      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isProduct ? (
              <Package className="w-8 h-8 text-gray-400" />
            ) : (
              <Store className="w-8 h-8 text-gray-400" />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export const HistoryItem: React.FC<HistoryItemProps> = React.memo(({
  footprint,
  removing,
  onRemove,
  onItemClick,
}) => {
  const handleItemClick = () => onItemClick(footprint);
  const handleRemove = () => onRemove(footprint.id);
  
  const isRemoving = removing === footprint.id;
  const isProduct = footprint.type === "product";
  const itemName = isProduct 
    ? footprint.product?.name 
    : footprint.booth?.name;

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
      <div className="p-4">
        <div className="flex space-x-4">
          <ItemImage footprint={footprint} onClick={handleItemClick} />

          {/* 信息区域 */}
          <div className="flex-1 min-w-0">
            <button
              onClick={handleItemClick}
              className="block w-full text-left"
            >
              <div className="flex items-center space-x-2 mb-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isProduct ? "bg-blue-500" : "bg-green-500"
                  }`}
                />
                <span className="text-xs text-gray-500">
                  {isProduct ? "商品" : "档口"}
                </span>
              </div>

              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {itemName}
              </h3>

              {isProduct ? (
                <ProductInfo footprint={footprint} />
              ) : (
                <BoothInfo footprint={footprint} />
              )}

              <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(footprint.visitedAt)}</span>
              </p>
            </button>
          </div>

          {/* 操作按钮 */}
          <div className="flex flex-col justify-between items-end">
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50"
            >
              {isRemoving ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

HistoryItem.displayName = "HistoryItem";