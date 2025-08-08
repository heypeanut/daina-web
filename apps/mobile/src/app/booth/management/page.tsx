"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  BarChart3,
  Package,
  Users,
  Phone,
  MessageSquare,
  Edit3,
  Eye,
  TrendingUp,
  ShoppingBag,
  Star,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

interface BoothInfo {
  id: string;
  boothNumber: string;
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  wx?: string;
  qq?: string;
  avatar?: string;
  status: "active" | "pending" | "suspended";
  stats: {
    totalProducts: number;
    totalViews: number;
    totalOrders: number;
    rating: number;
    followers: number;
  };
  createdAt: string;
}

export default function BoothManagementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [boothInfo, setBoothInfo] = useState<BoothInfo | null>(null);

  // 模拟加载档口信息
  useEffect(() => {
    const loadBoothInfo = async () => {
      try {
        // TODO: 替换为实际API调用
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setBoothInfo({
          id: "booth_001",
          boothNumber: "A001",
          boothName: "优品数码专营店",
          market: "华强北商业区",
          mainBusiness: "手机配件、数码产品",
          address: "深圳市福田区华强北路1234号A座101",
          phone: "13800138000",
          wx: "shop_yp_digital",
          qq: "123456789",
          avatar: "/api/placeholder/150/150",
          status: "active",
          stats: {
            totalProducts: 156,
            totalViews: 12580,
            totalOrders: 324,
            rating: 4.8,
            followers: 1250,
          },
          createdAt: "2024-01-15",
        });
      } catch {
        toast.error("加载档口信息失败");
      } finally {
        setLoading(false);
      }
    };

    loadBoothInfo();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const handleEditBooth = () => {
    router.push("/booth/edit");
  };

  const handleProductManagement = () => {
    router.push("/booth/products");
  };

  const handleOrderManagement = () => {
    router.push("/booth/orders");
  };

  const handleDataAnalysis = () => {
    router.push("/booth/analytics");
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "营业中";
      case "pending":
        return "审核中";
      case "suspended":
        return "已暂停";
      default:
        return "未知";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!boothInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">档口信息加载失败</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-gray-900">档口管理</h1>
          <button
            onClick={handleEditBooth}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 档口信息卡片 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {boothInfo.boothName}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    boothInfo.status
                  )}`}
                >
                  {getStatusText(boothInfo.status)}
                </span>
              </div>
              <p className="text-gray-600 mb-2">
                档口号：{boothInfo.boothNumber}
              </p>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{boothInfo.market}</span>
              </div>
              <p className="text-sm text-gray-500">{boothInfo.mainBusiness}</p>
            </div>
          </div>

          <button
            onClick={handleEditBooth}
            className="w-full mt-4 flex items-center justify-center py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            编辑档口信息
          </button>
        </div>

        {/* 统计数据 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {boothInfo.stats.totalProducts}
            </p>
            <p className="text-sm text-gray-600">商品数量</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {boothInfo.stats.totalViews.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">总浏览量</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {boothInfo.stats.totalOrders}
            </p>
            <p className="text-sm text-gray-600">总订单数</p>
          </div>

          <div className="bg-white rounded-lg p-4 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {boothInfo.stats.rating}
            </p>
            <p className="text-sm text-gray-600">平均评分</p>
          </div>
        </div>

        {/* 管理功能 */}
        <div className="bg-white rounded-lg">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">管理功能</h3>
          </div>

          <div className="divide-y divide-gray-100">
            <button
              onClick={handleProductManagement}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">商品管理</p>
                  <p className="text-sm text-gray-600">
                    管理档口商品，上下架操作
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {boothInfo.stats.totalProducts}
                </p>
                <p className="text-sm text-gray-500">件商品</p>
              </div>
            </button>

            <button
              onClick={handleOrderManagement}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">订单管理</p>
                  <p className="text-sm text-gray-600">查看和处理订单信息</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {boothInfo.stats.totalOrders}
                </p>
                <p className="text-sm text-gray-500">个订单</p>
              </div>
            </button>

            <button
              onClick={handleDataAnalysis}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">数据分析</p>
                  <p className="text-sm text-gray-600">
                    查看销售数据和统计报表
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {boothInfo.stats.followers}
                </p>
                <p className="text-sm text-gray-500">关注者</p>
              </div>
            </button>

            <div className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">客户服务</p>
                  <p className="text-sm text-gray-600">联系方式和客服设置</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {boothInfo.phone && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">电话</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {boothInfo.phone}
                    </span>
                  </div>
                )}

                {boothInfo.wx && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">微信</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {boothInfo.wx}
                    </span>
                  </div>
                )}

                {boothInfo.qq && (
                  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">QQ</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {boothInfo.qq}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 档口详情 */}
        <div className="bg-white rounded-lg">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">档口详情</h3>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">档口地址</span>
              <span className="text-gray-900 text-right flex-1 ml-4">
                {boothInfo.address}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">入驻时间</span>
              <span className="text-gray-900">
                {new Date(boothInfo.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">档口ID</span>
              <span className="text-gray-900">{boothInfo.id}</span>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">快速操作</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleProductManagement}
              className="bg-white bg-opacity-20 rounded-lg p-3 text-center hover:bg-opacity-30 transition-colors"
            >
              <Package className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">添加商品</span>
            </button>

            <button
              onClick={handleDataAnalysis}
              className="bg-white bg-opacity-20 rounded-lg p-3 text-center hover:bg-opacity-30 transition-colors"
            >
              <BarChart3 className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm">查看数据</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
