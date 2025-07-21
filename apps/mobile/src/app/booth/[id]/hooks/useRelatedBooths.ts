"use client";

import { useQuery } from '@tanstack/react-query';
import { getRelatedBooths } from '@/lib/api/booth';

interface UseRelatedBoothsOptions {
  limit?: number;
  enabled?: boolean;
}

export function useRelatedBooths(
  boothId: string, 
  options: UseRelatedBoothsOptions = {}
) {
  const { limit = 6, enabled = true } = options;

  return useQuery({
    queryKey: ['related-booths', boothId, limit],
    queryFn: async () => await getRelatedBooths(boothId, limit),
    staleTime: 30 * 60 * 1000, // 30分钟
    enabled: enabled && !!boothId,
  });
}