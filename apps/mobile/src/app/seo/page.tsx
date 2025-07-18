import React from "react";
import { MobileLayout } from '@/components/layout/MobileLayout';
import { StaticBanner } from '@/components/home/StaticBanner';
import { StaticBoothRecommend } from '@/components/home/StaticBoothRecommend';
import { StaticProductRecommend } from '@/components/home/StaticProductRecommend';
import { SearchBar } from '@/components/home/SearchBar';
import { QuickActions } from '@/components/home/QuickActions';
import { Metadata } from 'next';

// 生成页面元数据 - SEO优化
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
  alternates: {
    canonical: "https://www.daina.com",
  },
};

// 静态数据 - 可以从数据库或API获取
const banners = [
  {
    id: '1',
    title: '找货就上代拿网',
    imageUrl: 'https://picsum.photos/350/160?random=1',
    linkUrl: '/cooperation',
    linkType: 'external' as const,
  },
  {
    id: '2', 
    title: '代拿费低至1元',
    imageUrl: 'https://picsum.photos/350/160?random=2',
    linkUrl: '/dropship',
    linkType: 'external' as const,
  },
];

const booths = [
  {
    id: '1',
    boothName: '舒克',
    description: '手机保护套/壳专营',
    imageUrl: 'https://picsum.photos/60/60?random=3',
    score: 95.5,
    market: '工业',
    address: 'A2005',
    rank: 1,
    isHot: true,
  },
  {
    id: '2',
    boothName: '星辉通讯',
    description: '手机配件及数码产品',
    imageUrl: 'https://picsum.photos/60/60?random=4', 
    score: 92.3,
    market: '康乐',
    address: '5A60-61',
    rank: 2,
    isHot: true,
  },
  {
    id: '3',
    boothName: '永承',
    description: '手机配件批发',
    imageUrl: 'https://picsum.photos/60/60?random=5',
    score: 90.1,
    market: '工业',
    address: 'B1203',
    rank: 3,
  },
];

const products = [
  {
    id: '1',
    name: '苹果14寸MacBook Pro',
    description: 'M4Pro芯片，原装正品',
    price: 11600,
    imageUrl: 'https://picsum.photos/200/200?random=6',
    boothName: '舒克',
    score: 4.8,
    sales: 18,
    isHot: true,
  },
  {
    id: '2',
    name: 'ROG华硕RTX5070Ti',
    description: '猛禽天选白',
    price: 5099,
    imageUrl: 'https://picsum.photos/200/200?random=7',
    boothName: '星辉通讯',
    score: 4.6,
    sales: 7,
  },
];

// Server Component - SEO友好的首页
export default function SEOHomePage() {
  return (
    <MobileLayout>
      <div className="mobile-homepage">
        {/* 网站标题 - SEO */}
        <header className="sr-only">
          <h1>代拿网 - 专业的档口批发代发平台</h1>
          <p>提供优质的档口商品推荐、以图搜图、批发代发等服务</p>
        </header>

        {/* 搜索栏 - 客户端组件 */}
        <SearchBar />
        
        {/* 轮播图 - 静态内容 */}
        <StaticBanner banners={banners} />
        
        {/* 快捷功能入口 - 客户端组件 */}
        <QuickActions />
        
        {/* 档口排行榜 - 静态内容 */}
        <StaticBoothRecommend
          title="档口排行榜"
          booths={booths}
          type="ranking"
        />
        
        {/* 热门档口 - 静态内容 */}
        <StaticBoothRecommend
          title="热门档口"
          booths={booths}
          type="hot"
        />
        
        {/* 近期上新 - 静态内容 */}
        <StaticProductRecommend
          title="近期上新"
          products={products}
          layout="grid"
        />

        {/* 页脚信息 - SEO */}
        <footer className="bg-gray-100 mt-8 py-8 px-4">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">© 2024 代拿网 - 专业的档口批发代发平台</p>
            <p className="mb-4">致力于为批发商提供优质的货源和服务</p>
            <nav className="flex justify-center space-x-4">
              <a href="/about" className="text-gray-500 hover:text-gray-700">关于我们</a>
              <a href="/cooperation" className="text-gray-500 hover:text-gray-700">商务合作</a>
              <a href="/help" className="text-gray-500 hover:text-gray-700">帮助中心</a>
              <a href="/contact" className="text-gray-500 hover:text-gray-700">联系我们</a>
            </nav>
          </div>
        </footer>
      </div>
    </MobileLayout>
  );
}