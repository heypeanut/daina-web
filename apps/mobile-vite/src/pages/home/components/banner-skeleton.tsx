export function BannerSkeleton() {
  return (
    <div className="relative w-full h-[180px] mx-4 mb-4">
      {/* 主要轮播图骨架 */}
      <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
      
      {/* 指示器骨架 */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
