"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Booth } from "@/types/booth";
import { useIsMobile } from "../common/useIsMobile";
import { ContactSheet } from "./ContactSheet";
import { SupplySheet } from "./SupplySheet";

interface ShopSidebarProps {
  booth: Booth;
}

const ShopSidebar: React.FC<ShopSidebarProps> = ({ booth }) => {
  const [imgError, setImgError] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
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
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {booth.title}
          </h2>
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
          {/* <div>
            <b>编号：</b>
            {booth.id}
          </div> */}
          <div>
            <b>地址：</b>
            {booth.address}
          </div>
        </div>
        <div className="flex-1" />
      </aside>

      {/* 移动端底部按钮 */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 card-glass backdrop-blur-md border-t border-white/30 shadow-sm p-4 flex gap-4 z-50">
          <ContactSheet booth={booth} />
          <SupplySheet />
        </div>
      )}
    </>
  );
};

export default ShopSidebar;
