"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";

interface MarketSearchBarProps {
  placeholder?: string;
  className?: string;
}

export function MarketSearchBar({
  placeholder = "搜索档口名称、主营商品...",
  className = "",
}: MarketSearchBarProps) {
  const router = useRouter();

  const handleSearchClick = () => {
    // 跳转到搜索页面，默认激活档口搜索标签
    router.push('/search?type=booth');
  };

  return (
    <UnifiedSearchBar
      variant="market"
      className={className}
      placeholder={placeholder}
      onSearchClick={handleSearchClick}
      showLogo={true}
      showCamera={true}
      logoSize={32}
    />
  );
}
