import { Booth } from '@/types/booth';

export interface GetBoothsParams {
  pageNum: number;
  size: number;
  keyword?: string;
}

export interface GetBoothsResponse {
  items: Booth[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'booth' | 'category' | 'keyword';
  count?: number;
}