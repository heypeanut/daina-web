import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout";
import { 
  Handshake, 
  Store, 
  Users, 
  TrendingUp, 
  Shield, 
  HeadphonesIcon,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function CooperationPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'booth' | 'agent'>('booth');

  const cooperationTypes = [
    {
      id: 'booth',
      title: '档口入驻',
      description: '开通专属档口，展示商品，获得更多曝光',
      icon: <Store size={24} />,
      color: 'bg-blue-500',
      benefits: [
        '免费开通档口展示',
        '专业商品管理系统', 
        '多渠道推广曝光',
        '客户精准匹配'
      ]
    },
    {
      id: 'agent',
      title: '代拿代发',
      description: '成为代拿合伙人，轻松创业赚取佣金',
      icon: <Users size={24} />,
      color: 'bg-green-500',
      benefits: [
        '零投资轻松创业',
        '灵活自由工作时间',
        '丰厚佣金收益',
        '专业培训指导'
      ]
    }
  ];

  const features = [
    {
      icon: <TrendingUp size={20} />,
      title: '业务增长',
      description: '专业平台助力业务快速发展'
    },
    {
      icon: <Shield size={20} />,
      title: '安全保障',
      description: '完善的交易保障体系'
    },
    {
      icon: <HeadphonesIcon size={20} />,
      title: '专业服务',
      description: '7×24小时客服支持'
    }
  ];

  const handleApply = (type: 'booth' | 'agent') => {
    if (type === 'booth') {
      navigate('/booth/apply');
    } else {
      // 代拿申请逻辑
      console.log('申请代拿合伙人');
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gray-50">
        {/* 头部 */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">商务合作</h1>
          <p className="text-orange-100">携手共创，共赢未来</p>
        </div>

        {/* 合作类型选择 */}
        <div className="p-4">
          <div className="bg-white rounded-lg p-1 mb-6">
            <div className="flex">
              {cooperationTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveTab(type.id as 'booth' | 'agent')}
                  className={`flex-1 py-3 px-4 rounded-lg transition-all ${
                    activeTab === type.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {type.icon}
                    <span className="font-medium">{type.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 当前选择的合作类型详情 */}
          {cooperationTypes.map((type) => (
            activeTab === type.id && (
              <div key={type.id} className="space-y-6">
                {/* 主要介绍卡片 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center text-white`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {type.description}
                      </p>
                      <button
                        onClick={() => handleApply(type.id as 'booth' | 'agent')}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center space-x-2"
                      >
                        <span>立即申请</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 优势特色 */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    {type.title}优势
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {type.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          ))}

          {/* 平台特色 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">平台特色</h4>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{feature.title}</h5>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 联系我们 */}
          <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">联系我们</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-orange-500" />
                <span className="text-gray-600">400-888-8888</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-orange-500" />
                <span className="text-gray-600">cooperation@daina.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={18} className="text-orange-500" />
                <span className="text-gray-600">广州市天河区珠江新城</span>
              </div>
            </div>
          </div>

          {/* 底部说明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Handshake size={20} className="text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">合作承诺</p>
                <p>我们致力于为合作伙伴提供最优质的服务和最大化的收益，携手共创美好未来。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}