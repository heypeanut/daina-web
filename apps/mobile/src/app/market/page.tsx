import React from "react";
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Footer } from '@/components/layout/Footer';

export default function MarketPage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">档口列表</h1>
        <p className="text-gray-600">
          这里将展示从 src/ 迁移过来的档口列表功能
        </p>
      </div>
      <Footer />
    </MobileLayout>
  );
}