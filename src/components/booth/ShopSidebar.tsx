"use client";
import React, { useState } from "react";
import Image from "next/image";
import { QrCode } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Booth } from "@/types/booth";
import { CopyableText } from "../common/CopyableText";
import { toast } from "sonner";
import { useIsMobile } from "../common/useIsMobile";

interface ShopSidebarProps {
  booth: Booth;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ booth }) => {
  const [imgError, setImgError] = useState(false);
  const [wxOpen, setWxOpen] = useState(false);
  const [qqOpen, setQqOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <aside className="card-glass w-full md:w-[340px] p-6 flex flex-col items-center">
      {/* 头像 */}
      <div className="flex flex-col items-center w-full">
        <div className="relative w-28 h-28 mb-4">
          <Image
            src={
              imgError ||
              booth.avatar ===
                "https://www.52dsy.com/userpic/temp/seller_pic.png"
                ? "/cover.png"
                : booth.avatar
            }
            alt={booth.title}
            fill
            onError={() => setImgError(true)}
            className="rounded-xl object-cover border-4 shadow"
            sizes="112px"
            priority
          />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{booth.title}</h2>
        <div className="text-gray-500 mb-1 text-sm">
          {booth.market} <span className="mx-1">|</span> 档口号：{booth.booth}
        </div>
        <div className="text-gray-500 mb-2 text-sm">
          主营：{(booth.main_business || []).join("、")}
        </div>
      </div>
      <hr className="w-full my-4 border-gray-200" />
      {/* 档口信息 */}
      <div className="w-full text-gray-700 text-[15px] space-y-1">
        <div>
          <b>编号：</b>
          {booth.id}
        </div>
        <div>
          <b>地址：</b>
          {booth.address}
        </div>
        <div>
          <b>电话：</b>
          <CopyableText text={booth.phone || ""} />
        </div>
        {(booth.wx || booth.wx_qrcode) && (
          <div className="flex items-center gap-1">
            <b>微信：</b>
            {booth.wx}
            {booth.wx_qrcode && (
              <Popover open={wxOpen} onOpenChange={setWxOpen}>
                <PopoverTrigger asChild>
                  <span
                    onMouseEnter={() => setWxOpen(true)}
                    onMouseLeave={() => setWxOpen(false)}
                  >
                    <QrCode className="w-4 h-4 text-gray-400 cursor-pointer ml-1" />
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col items-center min-w-[120px] min-h-[120px] max-w-[180px] p-2"
                  onMouseEnter={() => setWxOpen(true)}
                  onMouseLeave={() => setWxOpen(false)}
                >
                  <Image
                    src={booth.wx_qrcode}
                    alt="微信二维码"
                    width={120}
                    height={120}
                    className="object-contain rounded-xl mb-1"
                  />
                  <span className="text-gray-700 text-xs mt-1">微信二维码</span>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
        {(booth.qq || booth.qq_qrcode) && (
          <div className="flex items-center gap-1">
            <b>QQ：</b>
            {booth.qq}
            {booth.qq_qrcode && (
              <Popover open={qqOpen} onOpenChange={setQqOpen}>
                <PopoverTrigger asChild>
                  <span
                    onMouseEnter={() => setQqOpen(true)}
                    onMouseLeave={() => setQqOpen(false)}
                  >
                    <QrCode className="w-4 h-4 text-gray-400 cursor-pointer ml-1" />
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col items-center min-w-[120px] min-h-[120px] max-w-[180px] p-2"
                  onMouseEnter={() => setQqOpen(true)}
                  onMouseLeave={() => setQqOpen(false)}
                >
                  <Image
                    src={booth.qq_qrcode}
                    alt="QQ二维码"
                    width={120}
                    height={120}
                    className="object-contain rounded-xl mb-1"
                  />
                  <span className="text-gray-700 text-xs mt-1">QQ二维码</span>
                </PopoverContent>
              </Popover>
            )}
          </div>
        )}
      </div>
      <div className="flex-1" />
      {/* 联系拿货按钮+二维码，hover触发 */}
      <div className="mt-6 w-full flex justify-center">
        <Popover open={contactOpen} onOpenChange={setContactOpen}>
          <PopoverTrigger asChild>
            <span
              onMouseEnter={isMobile ? undefined : () => setContactOpen(true)}
              onMouseLeave={isMobile ? undefined : () => setContactOpen(false)}
            >
              <Button
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log("复制示例");
                  await navigator.clipboard.writeText("复制示例");
                  toast.success("联系方式已复制");
                }}
                className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#0040f0] to-[#ff2e16] text-white font-bold text-lg shadow hover:opacity-90 transition-all"
                style={{ boxShadow: "none" }}
              >
                联系拿货
              </Button>
            </span>
          </PopoverTrigger>
          <PopoverContent
            className="flex flex-col items-center w-40 p-4"
            onMouseEnter={() => setContactOpen(true)}
            onMouseLeave={() => setContactOpen(false)}
          >
            <QrCode className="size-20 text-gray-400 mb-2" />
            {/* <Image
              src={booth.wx_qrcode}
              alt="微信二维码"
              width={120}
              height={120}
              className="object-contain rounded mb-1"
            /> */}
            <span className="text-gray-700 text-sm mt-1">扫码联系拿货</span>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
};

export default ShopSidebar;
