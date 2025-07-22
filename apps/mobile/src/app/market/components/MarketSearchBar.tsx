"use client";

import React from "react";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";

interface MarketSearchBarProps {
  placeholder?: string;
  className?: string;
}

export function MarketSearchBar({
  placeholder = "搜索档口名称、主营商品...",
  className = "",
}: MarketSearchBarProps) {
  return (
    <UnifiedSearchBar
      variant="home"
      className={className}
      placeholder={placeholder}
      showLogo={true}
      showCamera={true}
      logoSize={32}
    />
  );
}
