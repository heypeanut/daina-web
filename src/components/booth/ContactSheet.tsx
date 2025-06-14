"use client";
import React from "react";
import { Phone, MessageCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booth } from "@/types/booth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QrCodeCarousel, QrCodeImage } from "./QrCodeCarousel";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "sonner";

interface ContactSheetProps {
  booth: Booth;
}

export const ContactSheet: React.FC<ContactSheetProps> = ({ booth }) => {
  // 收集所有二维码并添加类型标识
  const qrCodes: QrCodeImage[] = [];
  if (booth.wx_qrcode) {
    qrCodes.push({
      url: booth.wx_qrcode,
      type: "wx",
      label: "微信",
    });
  }
  if (booth.qq_qrcode) {
    qrCodes.push({
      url: booth.qq_qrcode,
      type: "qq",
      label: "QQ",
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex-1 h-12 text-base font-medium flex items-center gap-2"
        >
          <MessageCircle className="size-5" />
          联系商家
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl p-2 pb-10">
        <SheetHeader className="text-center">
          <SheetTitle className="text-xl">联系方式</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col px-2 space-y-4">
          {booth.phone && (
            <div className="flex items-center py-2 px-4 bg-gray-50 rounded-xl">
              <Phone className="size-5 text-blue-500 mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">电话</div>
                <div className="font-medium">{booth.phone}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  console.log("booth.phone", booth.phone);
                  if (booth.phone) {
                    copyToClipboard(booth.phone);
                    toast.success("已复制");
                  }
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          )}
          {booth.wx && (
            <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
              <MessageCircle className="size-5 text-green-500 mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">微信</div>
                <div className="font-medium">{booth.wx}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (booth.wx) {
                    copyToClipboard(booth.wx);
                    toast.success("已复制");
                  }
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          )}
          {booth.qq && (
            <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
              <MessageCircle className="size-5 text-blue-400 mr-3" />
              <div className="flex-1">
                <div className="text-sm text-gray-500">QQ</div>
                <div className="font-medium">{booth.qq}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (booth.qq) {
                    copyToClipboard(booth.qq);
                    toast.success("已复制");
                  }
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          )}
          {qrCodes.length > 0 && <QrCodeCarousel images={qrCodes} />}
        </div>
      </SheetContent>
    </Sheet>
  );
};
