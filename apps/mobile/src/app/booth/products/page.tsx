"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Loader2,
  Package,
  Eye,
  Edit3,
  Power,
  Trash2,
  CheckSquare,
  Square
} from "lucide-react";
import { toast } from "sonner";
import {
  getBoothProductsManagement,
  toggleProductStatus,
  deleteBoothProduct,
  batchUpdateProducts
} from "@/lib/api/booth";
import {
  ProductListItem,
  ProductManagementFilter
} from "@/types/booth";
import { useProductStatusDict } from "@/lib/react-query/hooks/dictionary";

export default function BoothProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boothId = searchParams.get("boothId");

  // 状态管理
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { 
    data: productStatusOptions, 
  } = useProductStatusDict();
  // 筛选和排序状态
  const [filter, setFilter] = useState<ProductManagementFilter>({
    status: 'all',
    sortBy: 'created_time',
    sortOrder: 'desc'
  });

  // 分页状态
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 12,
    total: 0,
  });

  // 加载商品列表
  const loadProducts = useCallback(async (reset: boolean = false) => {
    if (!boothId) return;

    try {
      setLoading(true);
      const currentPage = reset ? 1 : pagination.pageNum;

      const response = await getBoothProductsManagement(boothId, {
        pageNum: currentPage,
        pageSize: pagination.pageSize,
        keyword: searchKeyword || undefined,
        status: filter.status,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder
      });

      if (reset) {
        setProducts(response.rows);
      } else {
        setProducts(prev => [...prev, ...response.rows]);
      }

      setPagination({
        pageNum: response.page || 1,
        pageSize: response.pageSize || 10,
        total: response.total,  
      });
    } catch (error) {
      console.error("加载商品列表失败:", error);
      toast.error(error instanceof Error ? error.message : "加载商品列表失败");
    } finally {
      setLoading(false);
    }
  }, [boothId, searchKeyword, filter, pagination.pageNum, pagination.pageSize]);

  // 初始化加载
  useEffect(() => {
    if (!boothId) {
      toast.error("未提供档口ID");
      router.back();
      return;
    }
    loadProducts(true);
  }, [boothId, searchKeyword, filter]);

  // 处理搜索
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setPagination(prev => ({ ...prev, pageNum: 1 }));
  };

  // 处理筛选
  const handleFilterChange = (newFilter: Partial<ProductManagementFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    setPagination(prev => ({ ...prev, pageNum: 1 }));
  };

  // 切换商品状态
  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    
    try {
      setActionLoading(productId);
      // await toggleProductStatus(productId, currentStatus);
      
      // 更新本地状态
      setProducts(prev => 
        prev.map(product => 
          product.id === productId 
            ? { ...product, status: currentStatus }
            : product
        )
      );
      
      toast.success(`商品已${currentStatus === '0' ? '上架' : '下架'}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "操作失败");
    } finally {
      setActionLoading(null);
    }
  };

  // 删除单个商品
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`确定要删除商品"${productName}"吗？`)) return;

    try {
      setActionLoading(productId);
      await deleteBoothProduct(productId);
      
      // 从本地状态中移除
      setProducts(prev => prev.filter(product => product.id !== productId));
      setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      
      toast.success("商品删除成功");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败");
    } finally {
      setActionLoading(null);
    }
  };

  // 批量操作
  const handleBatchAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedProducts.length === 0) {
      toast.error("请选择要操作的商品");
      return;
    }

    const actionNames = {
      'activate': '批量上架',
      'deactivate': '批量下架',
      'delete': '批量删除'
    };

    if (action === 'delete' && !confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
      return;
    }

    try {
      setActionLoading('batch');
      const result = await batchUpdateProducts(selectedProducts, action);
      
      if (action === 'delete') {
        // 删除操作：从列表中移除
        setProducts(prev => 
          prev.filter(product => !selectedProducts.includes(product.id))
        );
        setPagination(prev => ({ 
          ...prev, 
          total: prev.total - (result.updatedCount || selectedProducts.length)
        }));
      } else {
        // 状态更新操作
        const newStatus = action === 'activate' ? 'active' : 'inactive';
        setProducts(prev =>
          prev.map(product =>
            selectedProducts.includes(product.id)
              ? { ...product, status: newStatus }
              : product
          )
        );
      }
      
      setSelectedProducts([]);
      setBulkMode(false);
      toast.success(`${actionNames[action]}成功`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${actionNames[action]}失败`);
    } finally {
      setActionLoading(null);
    }
  };

  // 切换选择模式
  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    setSelectedProducts([]);
  };

  // 全选/取消全选
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
  };

  // 单选商品
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // 返回
  const handleBack = () => {
    router.back();
  };

  // 添加商品
  const handleAddProduct = () => {
    router.push(`/booth/products/add?boothId=${boothId}`);
  };

  // 编辑商品
  const handleEditProduct = (productId: string) => {
    router.push(`/booth/products/edit/${productId}?boothId=${boothId}`);
  };

  // 渲染商品卡片
  const renderProductCard = (product: ProductListItem) => {
    const isSelected = selectedProducts.includes(product.id);
    const isLoading = actionLoading === product.id;

    return (
      <div 
        key={product.id} 
        className={`bg-white rounded-lg shadow-sm border ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} overflow-hidden`}
      >
        {/* 商品图片 */}
        <div className="relative aspect-square">
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
           <div className="flex items-center text-white text-xs mb-3 absolute -bottom-1 right-2">
              <Eye className="w-3 h-3 mr-1" />
              <span>{product.views} 浏览</span>
            </div>
          
          {/* 选择框 */}
          {bulkMode && (
            <div 
              className="absolute top-2 left-2 w-6 h-6 rounded bg-white/80 flex items-center justify-center cursor-pointer"
              onClick={() => handleSelectProduct(product.id)}
            >
              {isSelected ? (
                <CheckSquare className="w-4 h-4 text-orange-500" />
              ) : (
                <Square className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}

          {/* 状态标签 */}
          <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              product.status === '1' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.status === '1' ? '已上架' : '已下架'}
            </span>
          </div>
        </div>

        {/* 商品信息 */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
            {product.name}
          </h3>
          
          {/* 价格 */}
          {/* <div className="flex items-center space-x-2 mb-2">
            <span className="text-orange-500 font-bold text-lg">
              ¥{product.price}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-gray-400 text-sm line-through">
                ¥{product.originalPrice}
              </span>
            )}
          </div> */}

          {/* 操作按钮 */}
          {!bulkMode && (
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleEditProduct(product.id)}
                className="flex items-center px-2 py-1 text-xs text-gray-600 hover:text-orange-500"
              >
                编辑
              </button>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleToggleStatus(product.id, product.status)}
                  disabled={isLoading}
                  className={`flex items-center px-2 py-1 text-xs rounded ${
                    product.status === 'active'
                      ? 'text-gray-600 hover:text-red-500'
                      : 'text-gray-600 hover:text-green-500'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      {product.status === '1' ? '下架' : '上架'}
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleDeleteProduct(product.id, product.name)}
                  className="flex items-center px-2 py-1 text-xs text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  删除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">商品管理</h1>
          
          <div className="flex items-center space-x-2">
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
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索商品名称..."
                value={searchKeyword}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              />
            </div>
          </div>
        )}

        {/* 筛选栏 */}
        <div className="px-4 pb-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {/* 状态筛选 */}
            <select
              value={filter.status}
              onChange={(e) => handleFilterChange({ status: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              {(productStatusOptions || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>

            {/* 排序 */}
            <select
              value={`${filter.sortBy}-${filter.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleFilterChange({ 
                  sortBy: sortBy as any, 
                  sortOrder: sortOrder as any 
                });
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
            >
              <option value="created_time-desc">最新创建</option>
              <option value="created_time-asc">最早创建</option>
              <option value="price-desc">价格高到低</option>
              <option value="price-asc">价格低到高</option>
              <option value="views-desc">浏览量高到低</option>
            </select>

            {/* 批量操作按钮 */}
            {products.length > 0 && (
              <button
                onClick={toggleBulkMode}
                className={`px-3 py-2 text-sm rounded-lg ${
                  bulkMode 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                批量操作
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 批量操作栏 */}
      {bulkMode && (
        <div className="bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center text-sm text-gray-600"
              >
                {selectedProducts.length === products.length ? (
                  <CheckSquare className="w-4 h-4 mr-2 text-orange-500" />
                ) : (
                  <Square className="w-4 h-4 mr-2 text-gray-400" />
                )}
                全选 ({selectedProducts.length}/{products.length})
              </button>
            </div>

            {selectedProducts.length > 0 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBatchAction('activate')}
                  disabled={actionLoading === 'batch'}
                  className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
                >
                  批量上架
                </button>
                <button
                  onClick={() => handleBatchAction('deactivate')}
                  disabled={actionLoading === 'batch'}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded disabled:opacity-50"
                >
                  批量下架
                </button>
                <button
                  onClick={() => handleBatchAction('delete')}
                  disabled={actionLoading === 'batch'}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                >
                  {actionLoading === 'batch' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    '批量删除'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div className="p-4">
        {loading && products.length === 0 ? (
          /* 初始加载状态 */
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">加载商品中...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          /* 空状态 */
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                暂无商品
              </h3>
              <p className="text-gray-600 mb-6">
                {searchKeyword ? '没有找到相关商品' : '还没有添加任何商品'}
              </p>
              <button
                onClick={handleAddProduct}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                添加商品
              </button>
            </div>
          </div>
        ) : (
          /* 商品网格 */
          <div className="grid grid-cols-2 gap-4">
            {products.map(renderProductCard)}
          </div>
        )}

        {/* 加载更多 */}
        {pagination.pageNum < pagination.total / pagination.pageSize && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                setPagination(prev => ({ ...prev, pageNum: prev.pageNum + 1 }));
                loadProducts(false);
              }}
              disabled={loading}
              className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                  加载中...
                </>
              ) : (
                '加载更多'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}