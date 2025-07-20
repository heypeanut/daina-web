import React from "react";
import { SKELETON_COUNT } from "../constants/filters";

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {[...Array(SKELETON_COUNT)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-4 animate-pulse"
          >
            <div className="flex space-x-4">
              <div className="w-16 h-16 bg-gray-200 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};