import React from "react";
import { SearchBar } from "./SearchBar";
import { Button } from "@/components/ui/button";
import { MobileContactFab } from "./MobileContactFab";
import Image from "next/image";

export const Header: React.FC = () => {
  return (
    <>
      <header className="sticky top-0 z-40 w-full card-glass backdrop-blur-md border-b border-white/30 shadow-sm transition-all">
        <div className="max-w-[1400px] mx-auto flex flex-row items-center h-auto sm:h-24 px-4 sm:px-8 gap-2 sm:gap-0 py-2 sm:py-4">
          {/* LOGO + 网站名（移动端只显示图标） */}
          <div className="flex items-center min-w-[40px] sm:min-w-[180px]">
            {/* <span className="inline-flex items-center justify-center size-28 sm:h-14 sm:w-14 rounded-xl">
              <Image
                className="max-w-none"
                src="./logo.png"
                alt="代拿网"
                width={80}
                height={80}
              />
            </span> */}
            <span className="hidden sm:inline text-2xl font-bold sm:text-3xl tracking-tight bg-gradient-to-r to-[#0040f0] from-[#ff2e16] bg-clip-text text-transparent select-none">
              代拿网
            </span>
          </div>
          {/* 搜索栏（客户端组件） */}
          <div className="flex-1 flex justify-center">
            <SearchBar />
          </div>
          {/* 联系拿货按钮+二维码（PC/iPad显示，移动端隐藏） */}
          <div className="hidden sm:flex sm:ml-8 relative group w-full sm:w-auto justify-center">
            <Button
              className="w-full sm:w-auto px-6 sm:px-8 py-2 rounded-xl bg-gradient-to-r to-[#0040f0] from-[#ff2e16] text-white font-bold text-base sm:text-lg shadow hover:opacity-90 transition-all"
              style={{ boxShadow: "none" }}
            >
              联系代拿
            </Button>
            <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 mt-3 bg-white p-4 shadow-lg border flex flex-col items-center min-w-[160px] sm:min-w-[180px] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition rounded-xl">
              <Image
                className="max-w-none"
                src="/logo.jpg"
                alt="扫码联系代拿"
                width={160}
                height={160}
              />
              <span className="text-gray-700 text-xs sm:text-sm">
                扫码联系代拿
              </span>
            </div>
          </div>
        </div>
      </header>
      {/* 移动端右下角浮窗联系拿货 */}
      <MobileContactFab />
    </>
  );
};
