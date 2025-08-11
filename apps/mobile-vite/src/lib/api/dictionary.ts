import { tenantApi } from './config';
import { DictItem, DictResponse, DictType } from '@/types/dictionary';

export const getDictData = async (type: DictType): Promise<DictItem[]> => {
  const { data } = await tenantApi.get<DictItem[]>(`/dict/data/type/${type}`);
  return data;
};