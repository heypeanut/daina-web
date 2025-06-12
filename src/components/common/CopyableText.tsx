import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyableTextProps {
  text: string; // 要复制的内容
  label?: string; // 可选，label，默认用Copy
  icon?: React.ReactNode; // 可选，icon，默认用Copy
  className?: string;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  label,
  icon,
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("已复制");
      setTimeout(() => setCopied(false), 1200);
    } catch {
      toast.error("复制失败");
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-1">
        {label && <span>{label}</span>}
        {text && <span>{text}</span>}
      </div>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className={`w-6 h-6 p-0 hover:text-[#0040f0]/50 hover:bg-transparent ${
          copied ? "text-[#0040f0]" : "text-gray-400"
        } sm:hidden`}
        onClick={handleCopy}
        tabIndex={0}
      >
        {icon || <Copy className="w-4 h-4" />}
      </Button>
    </span>
  );
};
