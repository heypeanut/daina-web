"use client";
import { Button } from "@/components/ui/button";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "sonner";
import React from "react";

export const MobileContactFab: React.FC = () => {
  return (
    <div className="fixed bottom-12 right-4 z-50 sm:hidden card-glass !bg-[rgba(255,255,255,0.25)] backdrop-blur-md border border-white/30 shadow-lg">
      <Button
        className="rounded-xl size-14 font-bold text-lg bg-transparent"
        onClick={async () => {
          const ok = await copyToClipboard("13148865179");
          if (ok) {
            toast.success("联系方式已复制");
          } else {
            toast.error("复制失败");
          }
        }}
      >
        拿货
      </Button>
    </div>
  );
};
