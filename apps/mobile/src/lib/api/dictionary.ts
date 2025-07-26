import { tenantApi } from './config';
import { DictResponse, DictType } from '@/types/dictionary';

export const getDictData = async (type: DictType): Promise<DictResponse> => {
  const { data } = await tenantApi.get<DictResponse>(`/dict/data/type/${type}`);
  return data;
};