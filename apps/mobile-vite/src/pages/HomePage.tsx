import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MobileLayout } from '@/components/layout/MobileLayout';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>代拿网 - 专业的档口批发代发平台</title>
        <meta 
          name="description" 
          content="代拿网是专业的档口批发代发平台，提供优质的档口商品推荐、以图搜图、批发代发等服务。找好货，就上代拿网！" 
        />
      </Helmet>
      
      <MobileLayout>
        <div 
          className="flex items-center justify-center min-h-[calc(100vh-3rem)] bg-gray-50"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 3rem)',
            backgroundColor: '#f9fafb'
          }}
        >
          <div 
            className="text-center p-8"
            style={{ textAlign: 'center', padding: '32px' }}
          >
            <h1 
              className="text-3xl font-bold text-gray-900 mb-4"
              style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: '16px' 
              }}
            >
              🎉 迁移成功！
            </h1>
            <p 
              className="text-lg text-gray-600 mb-4"
              style={{ 
                fontSize: '1.125rem', 
                color: '#4b5563', 
                marginBottom: '16px' 
              }}
            >
              Vite + React 版本运行中
            </p>
            <div 
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
              style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #4ade80',
                color: '#15803d',
                padding: '12px 16px',
                borderRadius: '6px',
                marginBottom: '16px'
              }}
            >
              <p 
                className="text-sm"
                style={{ fontSize: '14px', lineHeight: '1.5' }}
              >
                ✅ 路由系统：React Router<br/>
                ✅ UI框架：TailwindCSS<br/>
                ✅ 状态管理：React Query<br/>
                ✅ 构建工具：Vite<br/>
              </p>
            </div>
            <div 
              className="mt-4 text-sm text-gray-500"
              style={{
                marginTop: '16px',
                fontSize: '14px',
                color: '#6b7280'
              }}
            >
              💡 查看页面底部的TabBar导航
            </div>
          </div>
        </div>
      </MobileLayout>
    </>
  );
};

export default HomePage;