"use client";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "sonner";
import React from "react";
import { usePathname } from "next/navigation";

export const MobileContactFab: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // 只在首页显示
  if (!isHomePage) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 sm:hidden card-glass !bg-[rgba(255,255,255,0.25)] backdrop-blur-md border border-white/30 shadow-lg">
      <Button
        className="flex flex-col gap-0 items-center justify-center rounded-xl size-14 font-bold bg-transparen text-gray-300"
        onClick={async () => {
          const ok = await copyToClipboard("13148865179");
          if (ok) {
            toast.success("联系方式已复制");
          } else {
            toast.error("复制失败");
          }
        }}
      >
        <span className="text-sm">联系</span>
        <span className="text-sm">代拿</span>
      </Button>
    </div>
  );
};
