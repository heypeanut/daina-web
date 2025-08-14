import { useQuery } from "@tanstack/react-query";
import { getDictData } from "@/lib/api/dictionary";
import { DictType } from "@/types/dictionary";
import type { DictMap, DictItem } from "@/types/dictionary";

export const DICT_QUERY_KEYS = {
  all: ["dictionary"] as const,
  type: (type: DictType) => [...DICT_QUERY_KEYS.all, type] as const,
};

const CACHE_TIMES = {
  DICTIONARY: 30 * 60 * 1000, // 30分钟
};

interface UseDictionaryOptions {
  enabled?: boolean;
}

export const useDictionary = (
  type: DictType,
  options: UseDictionaryOptions = {}
) => {
  const { enabled = true } = options;

  return useQuery({
    queryKey: DICT_QUERY_KEYS.type(type),
    queryFn: () => getDictData(type),
    staleTime: CACHE_TIMES.DICTIONARY,
    gcTime: 60 * 60 * 1000, // 1小时缓存
    enabled,
  });
};

export const useDictMap = (type: DictType): DictMap | undefined => {
  const { data } = useDictionary(type);
  if (!data || !Array.isArray(data)) return undefined;
  return data.reduce((map: DictMap, item: DictItem) => {
    map[item.value] = item.label;
    return map;
  }, {} as DictMap);
};
