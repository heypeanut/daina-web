import React from "react";
import { Metadata } from 'next';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Footer } from '@/components/layout/Footer';
import { ClientHomepage } from '@/components/home/ClientHomepage';

// SEO优化的页面元数据
export const metadata: Metadata = {
  title: "代拿网 - 专业的档口批发代发平台",
  description: "代拿网是专业的档口批发代发平台，提供优质的档口商品推荐、以图搜图、批发代发等服务。找好货，就上代拿网！",
  keywords: "代拿网,档口批发,批发代发,以图搜图,档口推荐,批发平台,华强北",
  openGraph: {
    title: "代拿网 - 专业的档口批发代发平台",
    description: "代拿网是专业的档口批发代发平台，提供优质的档口商品推荐、以图搜图、批发代发等服务。",
    type: "website",
    locale: "zh_CN",
  },
};


// Server Component - SEO友好的首页
export default function MobileHomePage() {
  return (
    <MobileLayout>
      <ClientHomepage />
      <Footer />
    </MobileLayout>
  );
}
