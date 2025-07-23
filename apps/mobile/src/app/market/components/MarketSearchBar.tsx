"use client";

import React from "react";
import { UnifiedSearchBar } from "@/components/common/UnifiedSearchBar";
import { useMarketData } from "../hooks/useMarketData";

interface MarketSearchBarProps {
  placeholder?: string;
  className?: string;
}

export function MarketSearchBar({
  placeholder = "搜索档口名称、主营商品...",
  className = "",
}: MarketSearchBarProps) {
  const { searchKeyword, handleSearch, handleClearSearch } = useMarketData();

  return (
    <UnifiedSearchBar
      variant="market"
      className={className}
      placeholder={placeholder}
      value={searchKeyword}
      onChange={handleSearch}
      onSearch={handleSearch}
      onClear={handleClearSearch}
      showLogo={true}
      showCamera={true}
      logoSize={32}
    />
  );
}
