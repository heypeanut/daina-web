"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Package,
  Edit3,
  Eye,
  ShoppingBag,
  MapPin,
  Loader2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { getBoothManagementInfo, getUserBoothStatus } from "@/lib/api/booth";
import { BoothManagementInfo } from "@/types/booth";

export default function BoothManagementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [boothInfo, setBoothInfo] = useState<BoothManagementInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 从 URL 参数获取档口ID
  const boothIdFromUrl = searchParams.get("id");

  // 加载档口信息
  useEffect(() => {
    const loadBoothInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        let targetBoothId = boothIdFromUrl;

        // 如果没有提供档口ID，尝试获取用户的第一个活跃档口
        if (!targetBoothId) {
          const userStatus = await getUserBoothStatus();
          const activeBooth = userStatus.booths.find(
            (booth) => booth.status === "active"
          );

          if (!activeBooth) {
            // 没有活跃档口，跳转到选择页面
            router.replace("/booth/select");
            return;
          }

          targetBoothId = activeBooth.id;
          // 更新URL以包含档口ID
          router.replace(`/booth/management?id=${targetBoothId}`);
        }

        // 获取档口管理信息
        const managementInfo = await getBoothManagementInfo(targetBoothId);
        setBoothInfo(managementInfo);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "加载档口信息失败";
        setError(errorMessage);

        // 如果是档口ID无效，跳转到选择页面
        if (
          errorMessage.includes("档口详情失败") ||
          errorMessage.includes("获取档口详情失败") ||
          errorMessage.includes("获取档口管理信息失败") ||
          errorMessage.includes("档口不存在或无访问权限")
        ) {
          toast.error("档口不存在或无访问权限");
          router.replace("/booth/select");
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadBoothInfo();
  }, [boothIdFromUrl, router]);

  const handleBack = () => {
    router.back();
  };

  const handleEditBooth = () => {
    if (boothInfo) {
      router.push(`/booth/edit?id=${boothInfo.id}`);
    }
  };

  const handleProductManagement = () => {
    if (boothInfo) {
      router.push(`/booth/products?boothId=${boothInfo.id}`);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "已通过";
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
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载档口信息中...</p>
        </div>
      </div>
    );
  }

  if (error || !boothInfo) {
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
            <div className="w-10"></div>
          </div>
        </div>

        {/* 错误状态 */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              加载失败
            </h3>
            <p className="text-gray-600 mb-6">{error || "档口信息加载失败"}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重新加载
            </button>
          </div>
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
            <div className="size-24 bg-gradient-to-r overflow-hidden rounded-lg flex items-center justify-center">
              <Image
                src={boothInfo.coverImg}
                alt={boothInfo.boothName}
                width={32}
                height={32}
                className="w-full"
              />
              {/* <ShoppingBag className="w-8 h-8 text-white" /> */}
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

        {/* 商品管理 */}
        <div className="bg-white rounded-lg">
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
                  {boothInfo.productsCount}
                </p>
                <p className="text-sm text-gray-500">件商品</p>
              </div>
            </button>

            <button
              onClick={handleProductManagement}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">添加商品</p>
                  <p className="text-sm text-gray-600">发布新商品到档口</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 浏览量统计 */}
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">档口浏览量</p>
                <p className="text-sm text-gray-600">总访问次数统计</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {boothInfo.stats.totalViews.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">次浏览</p>
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
          </div>
        </div>
      </div>
    </div>
  );
}
