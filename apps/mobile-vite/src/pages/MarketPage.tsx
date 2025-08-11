import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MobileLayout } from '@/components/layout/MobileLayout';

const MarketPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>档口市场 - 代拿网</title>
      </Helmet>
      
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              🏪 档口市场
            </h1>
            <p className="text-gray-600">
              档口列表页面（待迁移）
            </p>
          </div>
        </div>
      </MobileLayout>
    </>
  );
};

export default MarketPage;
