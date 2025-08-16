export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkType?: "internal" | "external";
  description?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface Booth {
  id: string;
  boothName: string;
  coverImg?: string;
  description?: string;
  rating?: number;
  location?: string;
  category?: string;
  imageUrl?: string;
  market?: string;
  mainBusiness?: string;
  wx?: string;
  wxQrCode?: string;
  qq?: string;
  qqQrCode?: string;
  phone?: string;
  address?: string;
  followers?: number;
  view?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: { url: string }[];
  description?: string;
  category?: string;
  views?: number;
  rating?: number;
  stock?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface HomepageData {
  banners: Banner[];
  boothRecommendations: Booth[];
  productRecommendations: Product[];
  latestBooths: Booth[];
  personalizedBooths?: PersonalizedRecommendation<Booth>[];
  personalizedProducts?: PersonalizedRecommendation<Product>[];
}

export interface PersonalizedRecommendation<T> {
  item: T;
  score: number;
  reason: string;
  algorithm: string;
}

export interface MixedRecommendation {
  id: string;
  type: "booth" | "product";
  item: Booth | Product;
  score: number;
  reason: string;
  algorithm: string;
}

export interface ImageSearchParams {
  image: File;
  limit?: number;
  minSimilarity?: number;
  boothId?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ImageSearchResponse {
  code: number;
  message: string;
  data: {
    results: Array<{
      id: string;
      similarity: number;
      item: Booth | Product;
    }>;
    total: number;
  };
}
