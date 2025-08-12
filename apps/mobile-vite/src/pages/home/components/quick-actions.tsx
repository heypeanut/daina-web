import React from 'react';
import { Camera, Search, Store, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'image-search',
    title: '拍照搜图',
    icon: <Camera size={24} />,
    path: '/search/image',
    color: '#3b82f6'
  },
  {
    id: 'search',
    title: '搜索商品',
    icon: <Search size={24} />,
    path: '/search',
    color: '#10b981'
  },
  {
    id: 'market',
    title: '档口市场',
    icon: <Store size={24} />,
    path: '/market',
    color: '#f59e0b'
  },
  {
    id: 'favorites',
    title: '我的收藏',
    icon: <Heart size={24} />,
    path: '/profile/favorites/products',
    color: '#ef4444'
  }
];

export function QuickActions() {
  const navigate = useNavigate();

  const handleActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <div 
      className="px-4 py-4"
      style={{ padding: '16px' }}
    >
      <div 
        className="grid grid-cols-4 gap-4"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '16px' 
        }}
      >
        {quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.path)}
            className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <div 
              className="p-2 rounded-lg mb-2"
              style={{
                padding: '8px',
                borderRadius: '8px',
                marginBottom: '8px',
                backgroundColor: `${action.color}20`,
                color: action.color
              }}
            >
              {action.icon}
            </div>
            <span 
              className="text-xs text-gray-700"
              style={{ fontSize: '12px', color: '#374151' }}
            >
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
