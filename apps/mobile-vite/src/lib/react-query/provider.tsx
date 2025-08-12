"use client";

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './client';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools已移除，如需使用请安装 @tanstack/react-query-devtools 包 */}
    </QueryClientProvider>
  );
}