"use client";
import React from "react";
import Image from "next/image";
import { QrCode, Phone, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "sonner";

export const SupplyContent: React.FC = () => {
  return (
    <div className="px-2 flex flex-col items-center">
      <div className="mt-4 bg-white p-2 rounded-2xl shadow-sm border w-full flex justify-center items-center mb-4">
        <Image
          src="/logo.jpg"
          alt="qrcode"
          width={150}
          height={150}
          className="rounded-xl"
          priority
        />
      </div>
      <div className="flex items-center py-2 px-4 bg-gray-50 rounded-xl w-full">
        <Phone className="size-5 text-blue-500 mr-3" />
        <div className="flex-1">
          <div className="text-sm text-gray-500">联系电话 / 微信</div>
          <div className="font-medium">13148865179</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            copyToClipboard("13148865179");
            toast.success("已复制");
          }}
        >
          <Copy className="size-4" />
        </Button>
      </div>
    </div>
  );
};

export const SupplySheet: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-[#0040f0] to-[#ff2e16] text-white flex items-center gap-2">
          <QrCode className="size-5" />
          联系代拿
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl p-2 pb-10">
        <SheetHeader className="text-center">
          <SheetTitle className="text-xl">联系代拿</SheetTitle>
        </SheetHeader>
        <SupplyContent />
      </SheetContent>
    </Sheet>
  );
};
