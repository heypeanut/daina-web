// 产品详情页面类型定义

// 产品图片数据
export interface ProductImage {
  id: number;
  url: string;
  type: string;
  imageFeatures: string;
}

// 档口信息
export interface ProductBooth {
  id: string;
  boothName: string;
  coverImg: string;
  status: string;
  mainBusiness: string;
}

// 产品详情完整接口
export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  maxPrice?: number;
  originalPrice: number;
  stock: number;
  status: number;
  features: string;
  boothId: string;
  video: string;
  views: number;
  collects: number;
  itemNo: string;
  imageType: string;
  copyright: string;
  category: string;
  style: string;
  phoneModel: string;
  productType: string;
  trend: string;
  biodegradable: string;
  ecoMaterial: string;
  services: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  booth: ProductBooth;
}

// 产品规格选择项
export interface ProductSpecOption {
  key: string;
  label: string;
  value: string;
}