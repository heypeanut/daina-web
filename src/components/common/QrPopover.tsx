import Image from "next/image";
import { QrCode } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";

interface QrPopoverProps {
  qrcode: string;
  alt: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  label: string;
}

export const QrPopover: React.FC<QrPopoverProps> = ({
  qrcode,
  alt,
  open,
  setOpen,
  label,
}) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <QrCode className="w-4 h-4 text-gray-400 cursor-pointer ml-1" />
        </span>
      </PopoverTrigger>
      <PopoverContent
        className="flex flex-col items-center min-w-[120px] min-h-[120px] max-w-[180px] p-2"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <Image
          src={qrcode}
          alt={alt}
          width={120}
          height={120}
          className="object-contain rounded-xl mb-1"
        />
        <span className="text-gray-700 text-xs mt-1">{label}</span>
      </PopoverContent>
    </Popover>
  );
};
