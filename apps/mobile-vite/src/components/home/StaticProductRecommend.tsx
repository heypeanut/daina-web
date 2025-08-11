import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, TrendingUp } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  boothId?: string;
  boothName?: string;
  score?: number;
  sales?: number;
  isHot?: boolean;
}

interface StaticProductRecommendProps {
  title: string;
  products: ProductItem[];
  layout?: 'grid' | 'list';
  showMore?: boolean;
}

// Server Component - SEO友好的商品推荐
export function StaticProductRecommend({ 
  title, 
  products, 
  layout = 'grid',
  showMore = true
}: StaticProductRecommendProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white mt-2">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <TrendingUp size={18} className="text-orange-500 mr-2" />
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        </div>
        {showMore && (
          <Link 
            href="/products" 
            className="text-sm text-orange-500 font-medium"
          >
            更多 &gt;
          </Link>
        )}
      </div>

      {/* 商品列表 */}
      {layout === 'grid' ? (
        // 网格布局 - 2列
        <div className="grid grid-cols-2 gap-3 p-4">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white border border-gray-100 rounded-lg overflow-hidden"
            >
              {/* 商品图片 */}
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                {product.isHot && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-1 py-0.5 rounded">
                    热销
                  </div>
                )}
              </div>
              
              {/* 商品信息 */}
              <div className="p-3">
                <h3 className="text-sm text-gray-900 font-medium truncate mb-1">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                )}
                
                {/* 价格和评分 */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-500">
                    ¥{product.price.toFixed(2)}
                  </span>
                  {product.score && (
                    <div className="flex items-center">
                      <Star size={12} className="text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-600">
                        {product.score.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* 档口信息 */}
                {product.boothName && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {product.boothName}
                  </p>
                )}
                
                {/* 销量 */}
                {product.sales && (
                  <p className="text-xs text-gray-400 mt-1">
                    {product.sales}人已买
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        // 列表布局
        <div className="px-4 py-2">
          {products.slice(0, 8).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex items-center py-3 border-b border-gray-50 last:border-b-0"
            >
              {/* 商品图片 */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 mr-3">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              
              {/* 商品信息 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </h3>
                  {product.isHot && (
                    <span className="ml-2 px-1 py-0.5 bg-orange-100 text-orange-600 text-xs rounded">
                      热销
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-orange-500">
                    ¥{product.price.toFixed(2)}
                  </span>
                  {product.boothName && (
                    <span className="text-xs text-gray-400">
                      {product.boothName}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 结构化数据用于SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": title,
            "description": `代拿网${title}推荐`,
            "numberOfItems": products.length,
            "itemListElement": products.map((product, index) => ({
              "@type": "Product",
              "position": index + 1,
              "name": product.name,
              "description": product.description,
              "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "CNY",
                "availability": "https://schema.org/InStock"
              },
              "brand": {
                "@type": "Brand",
                "name": product.boothName
              },
              "aggregateRating": product.score ? {
                "@type": "AggregateRating",
                "ratingValue": product.score,
                "bestRating": 5
              } : undefined
            }))
          })
        }}
      />
    </div>
  );
}