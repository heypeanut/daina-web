// 档口卡片骨架屏组件
export function BoothCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100/50 overflow-hidden">
      {/* 档口图片骨架 */}
      <div className="relative">
        <div className="w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
      </div>

      {/* 档口信息骨架 */}
      <div className="p-3 space-y-2">
        {/* 档口名称 */}
        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded animate-pulse"></div>
        
        {/* 主营商品 */}
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4 animate-pulse"></div>
        
        {/* 市场位置 */}
        <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}

// 档口网格骨架屏
export function BoothGridSkeleton() {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <BoothCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
