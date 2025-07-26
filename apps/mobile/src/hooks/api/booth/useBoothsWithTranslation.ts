import { useBooths } from "./useBooths";
import { useDictMap } from "../useDictionary";
import { DictType } from "@/types/dictionary";
import { GetBoothsParams } from "@/app/market/types/market";
import { translateDictValue } from "@/utils/dictionary";

interface UseBoothsWithTranslationOptions {
  enabled?: boolean;
}

export const useBoothsWithTranslation = (
  params: GetBoothsParams,
  options: UseBoothsWithTranslationOptions = {}
) => {
  const boothsQuery = useBooths(params, options);
  const marketDictMap = useDictMap(DictType.MARKET);
  console.log("marketDictMap", marketDictMap);
  const boothsWithTranslation = boothsQuery.data
    ? {
        ...boothsQuery.data,
        rows: boothsQuery.data.rows.map((booth) => ({
          ...booth,
          marketLabel: translateDictValue(booth.market, marketDictMap),
        })),
      }
    : undefined;

  return {
    ...boothsQuery,
    data: boothsWithTranslation,
  };
};
