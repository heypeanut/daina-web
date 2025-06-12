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
