import { Search } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "搜索中..." }: LoadingStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-block w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 mt-4">{message}</p>
    </div>
  );
}

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">搜索出错</div>
      <p className="text-gray-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          重试
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({ 
  message = "没有找到相关结果",
  description = "请尝试其他关键词或调整筛选条件"
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export type { LoadingStateProps, ErrorStateProps, EmptyStateProps };