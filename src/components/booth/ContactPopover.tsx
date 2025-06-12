"use client";
import { Booth } from "../../types/booth";
import { useState } from "react";
import { QrCode } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { QrPopover } from "../common/QrPopover";
import { CopyableText } from "../common/CopyableText";

interface ContactPopoverProps {
  booth: Booth;
  show: boolean;
}

export const ContactPopover = ({ booth, show }: ContactPopoverProps) => {
  const [wxOpen, setWxOpen] = useState(false);
  const [qqOpen, setQqOpen] = useState(false);

  return (
    <div
      className={`card-glass bg-transparent flex flex-col absolute bottom-[12px] left-0 right-0 z-20 py-3 px-3 transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)] ${
        show
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-8 opacity-0 pointer-events-none"
      }`}
      style={{ top: 0 }} // 紧贴title行下方
    >
      {show && (
        <>
          {booth.phone && (
            <CopyableText
              label="电话: "
              className="text-sm text-gray-700"
              text={booth.phone}
            />
          )}
          {(booth.wx || booth.wx_qrcode) && (
            <div className="text-sm text-gray-700 flex items-center gap-1">
              <CopyableText label="微信: " text={booth.wx || ""} />
              {booth.wx_qrcode && (
                <QrPopover
                  qrcode={booth.wx_qrcode}
                  alt="微信二维码"
                  open={wxOpen}
                  setOpen={setWxOpen}
                  label="微信二维码"
                />
              )}
            </div>
          )}
          {(booth.qq || booth.qq_qrcode) && (
            <div className=" text-sm text-gray-700 flex items-center gap-1">
              <CopyableText label="QQ: " text={booth.qq || ""} />
              {booth.qq_qrcode && (
                <QrPopover
                  qrcode={booth.qq_qrcode}
                  alt="QQ二维码"
                  open={qqOpen}
                  setOpen={setQqOpen}
                  label="QQ二维码"
                />
              )}
            </div>
          )}
          {!booth.wx && !booth.phone && !booth.qq && (
            <div className="text-sm text-gray-400">暂无联系方式</div>
          )}
          {/* 联系拿货按钮+二维码（shadcn Popover实现，hover触发） */}
          <div className="mt-4 flex flex-1 justify-center items-end">
            <Popover>
              <PopoverTrigger asChild>
                <span
                  onClick={async (e) => {
                    e.stopPropagation();
                  }}
                >
                  <Button
                    className="px-8 py-2 rounded-xl bg-gradient-to-r from-[#0040f0] to-[#ff2e16] text-white font-bold text-lg shadow hover:opacity-90 transition-all"
                    style={{ boxShadow: "none" }}
                  >
                    联系拿货
                  </Button>
                </span>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col items-center w-32  p-4">
                <QrCode className="size-16 text-gray-400 mb-2" />
                <span className="text-gray-700 text-sm">扫码联系拿货</span>
              </PopoverContent>
            </Popover>
          </div>
        </>
      )}
    </div>
  );
};
