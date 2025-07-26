export interface DictItem {
  label: string;
  value: string;
  sort: number;
}

export interface DictResponse {
  code: number;
  message: string;
  data: DictItem[];
}

export enum DictType {
  MARKET = 'market',
}

export type DictMap = Record<string, string>;