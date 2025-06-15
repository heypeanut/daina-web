import React from "react";
import { MessageCircle, QrCode } from "lucide-react";

const ContactActions: React.FC<{
  onContactClick?: () => void;
  onSupplyClick?: () => void;
}> = ({ onContactClick, onSupplyClick }) => (
  <div className="flex gap-4 w-full">
    <button
      className="flex-1 h-12 text-base font-medium flex items-center gap-2 justify-center rounded-xl border bg-white shadow hover:bg-gray-50 transition cursor-pointer"
      onClick={onContactClick}
      type="button"
    >
      <MessageCircle className="size-5" /> 联系商家
    </button>
    <button
      className="flex-1 h-12 text-base font-medium flex items-center gap-2 justify-center rounded-xl bg-gradient-to-r from-[#0040f0] to-[#ff2e16] text-white shadow cursor-pointer"
      onClick={onSupplyClick}
      type="button"
    >
      <QrCode className="size-5" /> 联系代拿
    </button>
  </div>
);

export default ContactActions;
