import { tenantApi } from './config';
import { DictType } from '@/types/dictionary';
import type { DictItem } from '@/types/dictionary';

export const getDictData = async (type: DictType): Promise<DictItem[]> => {
  const { data } = await tenantApi.get<DictItem[]>(`/dict/data/type/${type}`);
  return data;
};