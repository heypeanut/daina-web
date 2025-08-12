export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  linkType?: 'internal' | 'external';
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
}