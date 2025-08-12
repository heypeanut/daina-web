import React from 'react';
import { Star, MapPin, ChevronRight, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 模拟数据
const mockBooths = [
  {
    id: '1',
    name: '华强北数码城A座',
    description: '专营手机配件、数码产品',
    rating: 4.8,
    location: '深圳华强北',
    imageUrl: '/placeholder-booth.jpg'
  },
  {
    id: '2', 
    name: '义乌小商品批发',
    description: '日用百货、饰品批发',
    rating: 4.6,
    location: '义乌国际商贸城',
    imageUrl: '/placeholder-booth.jpg'
  },
  {
    id: '3',
    name: '广州服装批发中心',
    description: '时尚女装、男装批发',
    rating: 4.7,
    location: '广州白马服装市场',
    imageUrl: '/placeholder-booth.jpg'
  }
];

export function BoothRecommend() {
  const navigate = useNavigate();

  const handleBoothClick = (boothId: string) => {
    navigate(`/booth/${boothId}`);
  };

  const handleViewMore = () => {
    navigate('/market');
  };

  return (
    <div 
      className="px-4 py-4"
      style={{ padding: '16px' }}
    >
      {/* 标题栏 */}
      <div 
        className="flex items-center justify-between mb-4"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '16px' 
        }}
      >
        <h3 
          className="text-lg font-semibold text-gray-900"
          style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}
        >
          🏪 优质档口
        </h3>
        <button
          onClick={handleViewMore}
          className="flex items-center text-sm text-orange-500"
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            color: '#f97316',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          查看更多
          <ChevronRight size={16} style={{ marginLeft: '4px' }} />
        </button>
      </div>

      {/* 档口列表 */}
      <div 
        className="space-y-3"
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {mockBooths.map((booth) => (
          <div
            key={booth.id}
            onClick={() => handleBoothClick(booth.id)}
            className="bg-white rounded-lg p-4 shadow-sm cursor-pointer"
            style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
          >
            <div 
              className="flex items-start space-x-3"
              style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}
            >
              {/* 店铺图片 */}
              <div 
                className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
                style={{
                  width: '64px',
                  height: '64px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Store size={24} style={{ color: '#6b7280' }} />
              </div>
              
              {/* 店铺信息 */}
              <div 
                className="flex-1"
                style={{ flex: 1 }}
              >
                <h4 
                  className="font-medium text-gray-900 mb-1"
                  style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}
                >
                  {booth.name}
                </h4>
                <p 
                  className="text-sm text-gray-600 mb-2"
                  style={{ fontSize: '14px', color: '#4b5563', marginBottom: '8px' }}
                >
                  {booth.description}
                </p>
                
                {/* 评分和位置 */}
                <div 
                  className="flex items-center justify-between"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div 
                    className="flex items-center"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Star 
                      size={14} 
                      className="text-yellow-500 mr-1"
                      style={{ color: '#eab308', marginRight: '4px' }}
                    />
                    <span 
                      className="text-sm text-gray-700"
                      style={{ fontSize: '14px', color: '#374151' }}
                    >
                      {booth.rating}
                    </span>
                  </div>
                  
                  <div 
                    className="flex items-center"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <MapPin 
                      size={14} 
                      className="text-gray-400 mr-1"
                      style={{ color: '#9ca3af', marginRight: '4px' }}
                    />
                    <span 
                      className="text-sm text-gray-500"
                      style={{ fontSize: '14px', color: '#6b7280' }}
                    >
                      {booth.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
