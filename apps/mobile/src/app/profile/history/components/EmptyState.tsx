import React from "react";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

export const EmptyState: React.FC = () => {
  const router = useRouter();

  const handleGoShopping = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Clock className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        暂无浏览记录
      </h3>
      <p className="text-gray-500 text-center mb-6">
        您的浏览记录会显示在这里
      </p>
      <button
        onClick={handleGoShopping}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
      >
        去逛逛
      </button>
    </div>
  );
};