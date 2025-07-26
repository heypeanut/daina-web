import { DictMap } from '@/types/dictionary';

export const translateDictValue = (
  value: string | undefined,
  dictMap: DictMap | undefined
): string => {
  if (!value || !dictMap) return value || '';
  return dictMap[value] || value;
};

export const translateDictValues = (
  values: (string | undefined)[],
  dictMap: DictMap | undefined
): string[] => {
  return values.map(value => translateDictValue(value, dictMap));
};