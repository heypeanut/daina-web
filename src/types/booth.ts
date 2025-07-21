export interface Booth {
  id: string;
  title: string;
  avatar: string;
  main_business?: string[];
  phone?: string;
  wx?: string;
  wx_qrcode?: string;
  address?: string;
  qq?: string;
  booth?: string;
  market?: string;
  qq_qrcode?: string;
  text?: string;
  url?: string;
  rank?: string;
  [key: string]: unknown; // 允许有其他字段但不影响类型安全
}

export interface BoothDetail extends Booth {
  description?: string;
  businessHours?: BusinessHours;
  certification?: BoothCertification;
  statistics?: BoothStatistics;
  isOnline?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessHours {
  weekdays: string;
  weekends?: string;
  isOpen24h?: boolean;
}

export interface BoothCertification {
  isVerified: boolean;
  verificationType?: 'personal' | 'business' | 'premium';
  verifyDate?: string;
}

export interface BoothStatistics {
  viewCount: number;
  favoriteCount: number;
  contactCount: number;
  rating: number;
  reviewCount: number;
}

export interface BoothProduct {
  id: string;
  boothId: string;
  name: string;
  image: string;
  price?: number;
  priceRange?: [number, number];
  category?: string;
  description?: string;
}

export interface BoothCategory {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

export type SortType = 'default' | 'hot' | 'newest' | 'rating' | 'distance';
