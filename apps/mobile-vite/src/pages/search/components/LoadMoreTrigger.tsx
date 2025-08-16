import { forwardRef } from "react";

interface LoadMoreTriggerProps {
  isLoading: boolean;
  itemType: string;
}

const LoadMoreTrigger = forwardRef<HTMLDivElement, LoadMoreTriggerProps>(
  ({ isLoading, itemType }, ref) => {
    return (
      <div className="mt-4">
        <div
          ref={ref}
          className="h-10 flex items-center justify-center"
        >
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full" />
              <span className="text-sm text-gray-600">
                加载更多{itemType}...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

LoadMoreTrigger.displayName = "LoadMoreTrigger";

export default LoadMoreTrigger;
export type { LoadMoreTriggerProps };