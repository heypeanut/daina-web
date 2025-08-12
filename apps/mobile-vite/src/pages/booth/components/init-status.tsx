interface InitStatusProps {
  className?: string;
}

export function InitStatus({ className }: InitStatusProps) {
  return (
    <div className={`bg-white ${className}`}>
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-200"></div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}