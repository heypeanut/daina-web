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

export const DictType = {
  MARKET: "market",
  PRODUCT_STATUS: "product_status",
} as const;

export type DictType = (typeof DictType)[keyof typeof DictType];

export type DictMap = Record<string, string>;
