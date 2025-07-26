export interface Booth {
  id: string;
  boothName: string;
  avatar?: string;
  coverImg?: string;
  description?: string;
  location?: string;
  category?: string;
  rating?: number;
  followers?: number;
  productsCount?: number;
  verified?: boolean;
  rank?: number;
  market?: string;
  phone?: string;
  wx?: string;
  qq?: string;
  wxQrCode?: string;
  qqQrCode?: string;
  address?: string;
  mainBusiness?: string;
  businessHours?: string;
  createdAt: string;
  updatedAt: string;
}
