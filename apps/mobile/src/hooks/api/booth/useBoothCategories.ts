import { useQuery } from '@tanstack/react-query';
import { getBoothCategories } from '@/lib/api/booth';

// Query Keys
export const BOOTH_CATEGORIES_QUERY_KEYS = {
  all: ['booth-categories'] as const,
  lists: () => [...BOOTH_CATEGORIES_QUERY_KEYS.all, 'list'] as const,
};

// Cache times
const CACHE_TIMES = {
  CATEGORIES: 30 * 60 * 1000, // 30分钟
};

// useBoothCategories Hook
interface UseBoothCategoriesOptions {
  enabled?: boolean;
}

export function useBoothCategories(options: UseBoothCategoriesOptions = {}) {
  const { enabled = true } = options;

  return useQuery({
    queryKey: BOOTH_CATEGORIES_QUERY_KEYS.lists(),
    queryFn: async () => await getBoothCategories(),
    staleTime: CACHE_TIMES.CATEGORIES,
    enabled,
  });
}