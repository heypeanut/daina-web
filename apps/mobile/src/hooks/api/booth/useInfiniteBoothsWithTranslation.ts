import { useInfiniteBooths } from "./useBooths";
import { useDictMap } from "../useDictionary";
import { DictType } from "@/types/dictionary";
import { GetBoothsParams } from "@/lib/api/booth";
import { translateDictValue } from "@/utils/dictionary";

interface UseInfiniteBoothsWithTranslationOptions {
  enabled?: boolean;
}

export const useInfiniteBoothsWithTranslation = (
  params: Omit<GetBoothsParams, "pageNum">,
  options: UseInfiniteBoothsWithTranslationOptions = {}
) => {
  const boothsQuery = useInfiniteBooths(params, options);
  const marketDictMap = useDictMap(DictType.MARKET);
  const dataWithTranslation = boothsQuery.data
    ? {
        ...boothsQuery.data,
        pages: boothsQuery.data.pages.map((page) => ({
          ...page,
          rows: page.rows.map((booth) => ({
            ...booth,
            marketLabel: translateDictValue(booth.market, marketDictMap),
          })),
        })),
      }
    : undefined;

  return {
    ...boothsQuery,
    data: dataWithTranslation,
  };
};
