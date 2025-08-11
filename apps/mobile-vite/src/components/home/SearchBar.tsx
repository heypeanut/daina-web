"use client";

import React from 'react';
import { UnifiedSearchBar } from '@/components/common/UnifiedSearchBar';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({
  placeholder = "搜索商品关键字或货号"
}: SearchBarProps) {
  return (
    <UnifiedSearchBar
      variant="home"
      className="fixed top-0 left-0 right-0 z-50"
      placeholder={placeholder}
      showLogo={true}
      showCamera={true}
      logoSize={32}
    />
  );
}