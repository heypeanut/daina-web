import { BoothDetail, BoothProduct } from '../../../../../../../src/types/booth';

export interface GetBoothDetailResponse extends BoothDetail {
  products?: BoothProduct[];
  relatedBooths?: BoothDetail[];
}

export interface BoothContactAction {
  type: 'phone' | 'wechat' | 'qq' | 'navigate';
  value: string;
  label: string;
}

export interface BoothShareData {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export interface BoothDetailPageState {
  booth: BoothDetail | null;
  products: BoothProduct[];
  relatedBooths: BoothDetail[];
  isFavorited: boolean;
  isLoading: boolean;
  error: string | null;
  activeTab: 'info' | 'products' | 'reviews';
}

export interface ProductShowcaseConfig {
  displayMode: 'grid' | 'list' | 'carousel';
  itemsPerPage: number;
  showPrices: boolean;
  enableFilters: boolean;
}

export type ContactType = 'phone' | 'wechat' | 'qq' | 'address';