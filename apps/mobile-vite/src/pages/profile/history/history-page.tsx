import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Package, Store, Eye, MapPin } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

// 浏览记录类型
type FootprintType = "all" | "product" | "booth";

// 浏览记录接口
interface Footprint {
  id: string;
  type: "product" | "booth";
  targetId: string;
  viewedAt: string;
  product?: {
    id: string;
    name: string;
    price: number;
    coverImage: string;
    boothName: string;
  };
  booth?: {
    id: string;
    boothName: string;
    marketLabel: string;
    coverImg: string;
    followers: number;
  };
}

// Mock浏览记录数据
const mockFootprints: Footprint[] = [
  {
    id: "1",
    type: "product",
    targetId: "1",
    viewedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前
    product: {
      id: "1",
      name: "iPhone 15 Pro Max 透明保护壳",
      price: 35.00,
      coverImage: "/placeholder-product.jpg",
      boothName: "潮流手机配件专营店"
    }
  },
  {
    id: "2",
    type: "booth",
    targetId: "1",
    viewedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3小时前
    booth: {
      id: "1",
      boothName: "潮流手机配件专营店",
      marketLabel: "广州天河电脑城",
      coverImg: "/placeholder-booth.jpg",
      followers: 1250
    }
  },
  {
    id: "3",
    type: "product",
    targetId: "2",
    viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    product: {
      id: "2",
      name: "Type-C快充数据线 2米",
      price: 15.80,
      coverImage: "/placeholder-product.jpg",
      boothName: "潮流手机配件专营店"
    }
  },
  {
    id: "4",
    type: "booth",
    targetId: "2",
    viewedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    booth: {
      id: "2",
      boothName: "数码科技专营店",
      marketLabel: "深圳华强北电子市场",
      coverImg: "/placeholder-booth.jpg",
      followers: 2300
    }
  },
  {
    id: "5",
    type: "product",
    targetId: "3",
    viewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    product: {
      id: "3",
      name: "无线蓝牙耳机 降噪版",
      price: 128.00,
      coverImage: "/placeholder-product.jpg",
      boothName: "数码科技专营店"
    }
  }
];

export default function HistoryPage() {
  const navigate = useNavigate();
  const [footprints, setFootprints] = useState(mockFootprints);
  const [filter, setFilter] = useState<FootprintType>("all");
  const [removing, setRemoving] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleItemClick = useCallback((footprint: Footprint) => {
    if (footprint.type === "product" && footprint.product) {
      navigate(`/product/${footprint.targetId}`);
    } else if (footprint.type === "booth" && footprint.booth) {
      navigate(`/booth/${footprint.targetId}`);
    }
  }, [navigate]);

  const handleRemoveFootprint = async (footprintId: string) => {
    setRemoving(footprintId);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 从列表中移除
      setFootprints(prev => prev.filter(f => f.id !== footprintId));
      
      console.log(`已删除浏览记录: ${footprintId}`);
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请重试");
    } finally {
      setRemoving(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("确定要清空所有浏览记录吗？此操作不可恢复。")) {
      return;
    }

    setClearing(true);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 清空所有记录
      setFootprints([]);
      
      console.log("已清空所有浏览记录");
    } catch (error) {
      console.error("清空失败:", error);
      alert("清空失败，请重试");
    } finally {
      setClearing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "刚刚";
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return date.toLocaleDateString();
  };

  // 过滤数据
  const filteredFootprints = filter === "all" 
    ? footprints 
    : footprints.filter(f => f.type === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            浏览记录 ({filteredFootprints.length})
          </h1>
          <button
            onClick={handleClearAll}
            disabled={clearing || footprints.length === 0}
            className="text-sm text-red-500 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {clearing ? "清空中..." : "清空"}
          </button>
        </div>

        {/* 筛选标签 */}
        <div className="flex items-center px-4 pb-3">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "全部" },
              { key: "product", label: "商品" },
              { key: "booth", label: "档口" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FootprintType)}
                className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                  filter === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="pb-6">
        {filteredFootprints.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Eye className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              {filter === "all" ? "暂无浏览记录" : 
               filter === "product" ? "暂无商品浏览记录" : "暂无档口浏览记录"}
            </p>
            <p className="text-gray-400 text-sm text-center">
              去逛逛感兴趣的内容吧
            </p>
            <button
              onClick={() => navigate('/market')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              去逛逛
            </button>
          </div>
        ) : (
          /* 记录列表 */
          <div className="p-4">
            <div className="space-y-3">
              {filteredFootprints.map((footprint) => (
                <div
                  key={footprint.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="flex p-3 gap-3">
                    {/* 图片 */}
                    <div
                      className="relative w-16 h-16 flex-shrink-0 cursor-pointer"
                      onClick={() => handleItemClick(footprint)}
                    >
                      <ImageLazyLoader
                        src={footprint.type === "product" 
                          ? footprint.product?.coverImage || "/placeholder-product.jpg"
                          : footprint.booth?.coverImg || "/placeholder-booth.jpg"
                        }
                        alt={footprint.type === "product" 
                          ? footprint.product?.name || ""
                          : footprint.booth?.boothName || ""
                        }
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* 类型标识 */}
                      <div className="absolute top-1 left-1 bg-black/50 rounded px-1 py-0.5">
                        {footprint.type === "product" ? (
                          <Package size={10} className="text-white" />
                        ) : (
                          <Store size={10} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* 信息 */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleItemClick(footprint)}
                    >
                      {footprint.type === "product" && footprint.product ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {footprint.product.name}
                          </h3>
                          <div className="text-red-500 font-bold text-sm mb-1">
                            ¥{footprint.product.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            来自：{footprint.product.boothName}
                          </div>
                        </>
                      ) : footprint.booth ? (
                        <>
                          <h3 className="text-sm font-medium text-gray-900 mb-1">
                            {footprint.booth.boothName}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <MapPin size={10} className="mr-1" />
                            <span>{footprint.booth.marketLabel}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {footprint.booth.followers} 关注
                          </div>
                        </>
                      ) : null}
                      
                      <div className="text-xs text-gray-400 mt-2">
                        浏览时间：{formatDate(footprint.viewedAt)}
                      </div>
                    </div>

                    {/* 删除按钮 */}
                    <div className="flex items-start">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFootprint(footprint.id);
                        }}
                        disabled={removing === footprint.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                      >
                        {removing === footprint.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
