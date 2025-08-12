import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Package,
  Eye,
  Edit3,
  Power,
  Trash2,
  CheckSquare,
  Square
} from "lucide-react";
import { ImageLazyLoader } from "@/components/common";

// 商品状态
type ProductStatus = "1" | "0" | "all"; // 1: 上架, 0: 下架, all: 全部

// 商品列表项接口
interface ProductListItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: ProductStatus;
  views: number;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

// Mock商品数据
const mockProducts: ProductListItem[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max 透明保护壳",
    price: 35.00,
    originalPrice: 59.00,
    stock: 99,
    status: "1",
    views: 1250,
    coverImage: "/placeholder-product.jpg",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Type-C快充数据线 2米",
    price: 15.80,
    originalPrice: 25.00,
    stock: 156,
    status: "1",
    views: 890,
    coverImage: "/placeholder-product.jpg",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    name: "无线蓝牙耳机 降噪版",
    price: 128.00,
    originalPrice: 199.00,
    stock: 0,
    status: "0",
    views: 2100,
    coverImage: "/placeholder-product.jpg",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function ProductsManagementPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = searchParams.get("boothId") || "1";

  const [products, setProducts] = useState(mockProducts);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<ProductStatus>("all");

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddProduct = () => {
    navigate(`/booth/products/add?boothId=${boothId}`);
  };

  const handleProductClick = (productId: string) => {
    if (bulkMode) {
      // 批量模式下切换选择状态
      setSelectedProducts(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    } else {
      // 正常模式下跳转到商品详情
      navigate(`/product/${productId}`);
    }
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/booth/products/edit?productId=${productId}&boothId=${boothId}`);
  };

  const handleToggleStatus = async (productId: string, currentStatus: ProductStatus) => {
    setActionLoading(productId);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newStatus = currentStatus === "1" ? "0" : "1";
      
      setProducts(prev => prev.map(product => 
        product.id === productId 
          ? { ...product, status: newStatus }
          : product
      ));
      
      console.log(`商品${productId}状态切换为${newStatus === "1" ? "上架" : "下架"}`);
    } catch (error) {
      console.error("状态切换失败:", error);
      alert("操作失败，请重试");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("确定要删除这个商品吗？此操作不可恢复。")) {
      return;
    }

    setActionLoading(productId);
    
    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      console.log(`商品${productId}已删除`);
    } catch (error) {
      console.error("删除失败:", error);
      alert("删除失败，请重试");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action: "delete" | "on" | "off") => {
    if (selectedProducts.length === 0) {
      alert("请先选择商品");
      return;
    }

    const actionText = action === "delete" ? "删除" : action === "on" ? "上架" : "下架";
    
    if (!confirm(`确定要${actionText}选中的${selectedProducts.length}个商品吗？`)) {
      return;
    }

    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (action === "delete") {
        setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
      } else {
        const newStatus = action === "on" ? "1" : "0";
        setProducts(prev => prev.map(product => 
          selectedProducts.includes(product.id)
            ? { ...product, status: newStatus }
            : product
        ));
      }
      
      setSelectedProducts([]);
      setBulkMode(false);
      
      console.log(`批量${actionText}操作完成`);
    } catch (error) {
      console.error("批量操作失败:", error);
      alert("操作失败，请重试");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "今天";
    if (diffDays === 1) return "昨天";
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString();
  };

  // 过滤商品
  const filteredProducts = products.filter(product => {
    const matchesKeyword = !searchKeyword || 
      product.name.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesStatus = filter === "all" || product.status === filter;
    
    return matchesKeyword && matchesStatus;
  });

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
            商品管理 ({filteredProducts.length})
          </h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleAddProduct}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white hover:bg-orange-600"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        {showSearch && (
          <div className="px-4 pb-3">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="搜索商品名称..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              autoFocus
            />
          </div>
        )}

        {/* 筛选和批量操作 */}
        <div className="flex items-center justify-between px-4 pb-3">
          {/* 状态筛选 */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "all", label: "全部" },
              { key: "1", label: "上架" },
              { key: "0", label: "下架" }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as ProductStatus)}
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

          {/* 批量操作 */}
          <div className="flex items-center gap-2">
            {bulkMode ? (
              <>
                <button
                  onClick={() => handleBulkAction("on")}
                  disabled={selectedProducts.length === 0}
                  className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300"
                >
                  批量上架
                </button>
                <button
                  onClick={() => handleBulkAction("off")}
                  disabled={selectedProducts.length === 0}
                  className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-gray-300"
                >
                  批量下架
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={selectedProducts.length === 0}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300"
                >
                  批量删除
                </button>
                <button
                  onClick={() => {
                    setBulkMode(false);
                    setSelectedProducts([]);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900"
                >
                  取消
                </button>
              </>
            ) : (
              <button
                onClick={() => setBulkMode(true)}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                批量管理
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="pb-6">
        {filteredProducts.length === 0 ? (
          /* 空状态 */
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-center mb-2">
              {searchKeyword ? "未找到相关商品" : "暂无商品"}
            </p>
            <p className="text-gray-400 text-sm text-center mb-4">
              {searchKeyword ? "试试其他关键词" : "发布您的第一个商品吧"}
            </p>
            {!searchKeyword && (
              <button
                onClick={handleAddProduct}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                发布商品
              </button>
            )}
          </div>
        ) : (
          /* 商品列表 */
          <div className="p-4">
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="flex p-3 gap-3">
                    {/* 批量选择框 */}
                    {bulkMode && (
                      <button
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center justify-center w-6 h-6 mt-1"
                      >
                        {selectedProducts.includes(product.id) ? (
                          <CheckSquare className="w-5 h-5 text-orange-500" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    )}

                    {/* 商品图片 */}
                    <div
                      className="relative w-20 h-20 flex-shrink-0 cursor-pointer"
                      onClick={() => !bulkMode && handleProductClick(product.id)}
                    >
                      <ImageLazyLoader
                        src={product.coverImage}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      
                      {/* 状态标识 */}
                      <div className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs rounded ${
                        product.status === "1" 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-500 text-white"
                      }`}>
                        {product.status === "1" ? "上架" : "下架"}
                      </div>
                    </div>

                    {/* 商品信息 */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => !bulkMode && handleProductClick(product.id)}
                    >
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-red-500 font-bold text-lg">
                          ¥{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-400 text-sm line-through">
                            ¥{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>库存 {product.stock}</span>
                        <span>浏览 {product.views}</span>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-1">
                        更新于 {formatDate(product.updatedAt)}
                      </div>
                    </div>

                    {/* 操作菜单 */}
                    {!bulkMode && (
                      <div className="flex flex-col justify-between items-end">
                        <div className="relative">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProduct(product.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit3 size={14} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStatus(product.id, product.status);
                            }}
                            disabled={actionLoading === product.id}
                            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                          >
                            {actionLoading === product.id ? (
                              <div className="w-3.5 h-3.5 border border-gray-300 border-t-green-500 rounded-full animate-spin" />
                            ) : (
                              <Power size={14} />
                            )}
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProduct(product.id);
                            }}
                            disabled={actionLoading === product.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
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
