import Image from "next/image";
import { useState } from "react";
import { Booth } from "../../types/booth";
import { ContactPopover } from "./ContactPopover";
import { useIsMobile } from "../common/useIsMobile";

interface BoothCardProps {
  booth: Booth;
}

export const BoothCard = ({ booth }: BoothCardProps) => {
  const [imgError, setImgError] = useState(false);
  const [hover, setHover] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div
      className="card-glass overflow-hidden relative cursor-pointer p-1.5 sm:p-2 md:p-3 flex flex-col transition-shadow duration-200 hover:shadow-xl group"
      onMouseEnter={() => !isMobile && setHover(true)}
      onMouseLeave={() => !isMobile && setHover(false)}
      onClick={() => window.open(`/shop/${booth.id}`, "_blank")}
    >
      {/* 弹出层覆盖title以下内容 */}
      <div className="relative flex-1">
        <ContactPopover booth={booth} show={hover} />
        <div
          className={hover ? "opacity-0 pointer-events-none" : "opacity-100"}
        >
          <Image
            loading="lazy"
            src={
              imgError ||
              booth.avatar ===
                "https://www.52dsy.com/userpic/temp/seller_pic.png"
                ? "/cover.png"
                : booth.avatar
            }
            alt={booth.title}
            width={400}
            height={400}
            className="w-full aspect-square shadow object-cover rounded-lg sm:rounded-xl mb-1.5 sm:mb-2 transition-transform duration-200"
            onError={() => setImgError(true)}
          />
          <div className="text-[#0040f0] font-bold text-sm sm:text-base md:text-lg truncate mb-1">
            {booth.title}
          </div>
          <div className="text-[#ff2e16] text-xs sm:text-sm font-semibold truncate">
            主营: {booth.main_business?.join("、")}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm truncate">
            地址: {booth.address}
          </div>
        </div>
      </div>
    </div>
  );
};
