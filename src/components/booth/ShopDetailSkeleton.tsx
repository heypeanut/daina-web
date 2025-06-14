import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ShopDetailSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
      {/* 侧边栏骨架 */}
      <div className="card-glass w-full md:w-[340px] p-6 flex flex-col items-center">
        {/* 头像骨架 */}
        <div className="flex flex-col items-center w-full">
          <Skeleton className="w-28 h-28 rounded-xl mb-4" />
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-32 mb-1" />
          <Skeleton className="h-4 w-48 mb-2" />
        </div>
        <Skeleton className="w-full h-[1px] my-4" />
        {/* 档口信息骨架 */}
        <div className="w-full space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>

      {/* 主内容区骨架 */}
      <div className="card-glass w-full md:w-[340px] p-6 flex flex-col items-center">
        {/* 档口简介骨架 */}
        <div className="w-full space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>

      {/* 主内容区骨架 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {/* 档口简介骨架 */}
        <Skeleton className="card-glass h-36 w-42 p-4 flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </Skeleton>
        <Skeleton className="card-glass h-36 w-42 p-4 flex flex-col gap-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </Skeleton>{" "}
      </div>
    </div>
  );
}
