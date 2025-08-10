"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";
import { getUserBoothStatus } from "@/lib/api/booth";
import { UserBoothStatus } from "@/types/booth";
import { toast } from "sonner";

export const ServiceSection: React.FC = () => {
  const router = useRouter();
  const [boothStatus, setBoothStatus] = useState<UserBoothStatus | null>(null);
  const [loading, setLoading] = useState(false);

  // 加载用户档口状态
  useEffect(() => {
    const loadBoothStatus = async () => {
      if (!isLoggedIn()) return;

      try {
        setLoading(true);
        const status = await getUserBoothStatus();
        setBoothStatus(status);
      } catch (error) {
        console.error("加载档口状态失败:", error);
        // 静默失败，不显示错误提示
      } finally {
        setLoading(false);
      }
    };

    loadBoothStatus();
  }, []);

  const handleBoothRegistration = async () => {
    // 检查登录状态
    if (!isLoggedIn()) {
      redirectToLogin("/booth/apply");
      return;
    }

    // 如果正在加载状态，重新获取
    if (loading || !boothStatus) {
      try {
        setLoading(true);
        const status = await getUserBoothStatus();
        setBoothStatus(status);
        // 获取数据后重新执行跳转逻辑
        handleBoothNavigation(status);
      } catch {
        toast.error("获取档口状态失败，请重试");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 执行智能跳转逻辑
    handleBoothNavigation(boothStatus);
  };

  // 智能跳转逻辑函数
  const handleBoothNavigation = (status: UserBoothStatus) => {
    // 1. 无档口 - 跳转到申请页面
    if (status.totalBooths === 0) {
      router.push("/booth/apply");
      return;
    }

    // 2. 只有pending档口 - 显示审核中的提示
    if (
      status.hasPendingBooths &&
      !status.hasActiveBooths &&
      !status.hasRejectedBooths
    ) {
      return toast.error("档口正在审核中");
    }

    // 3. 有active档口
    if (status.hasActiveBooths) {
      if (status.activeBoothsCount === 1) {
        // 单个活跃档口 - 直接跳转到管理页面
        const activeBoothId = status.booths.find(
          (booth) => booth.status === "active"
        )?.id;
        if (activeBoothId) {
          const targetUrl = `/booth/management?id=${activeBoothId}`;

          try {
            router.push(targetUrl);
            // 添加延迟检查，如果router.push没有工作，使用window.location
            setTimeout(() => {
              if (window.location.pathname !== "/booth/management") {
                window.location.href = targetUrl;
              }
            }, 500);
          } catch {
            window.location.href = targetUrl;
          }
        } else {
          const fallbackUrl = "/booth/management";
          try {
            router.push(fallbackUrl);
            setTimeout(() => {
              if (window.location.pathname !== "/booth/management") {
                window.location.href = fallbackUrl;
              }
            }, 500);
          } catch {
            window.location.href = fallbackUrl;
          }
        }
      } else {
        // 多个活跃档口 - 跳转到选择页面
        router.push("/booth/select");
      }
      return;
    }

    // 4. 只有rejected档口 - 跳转到申请页面（重新申请）
    if (status.hasRejectedBooths && !status.hasPendingBooths) {
      router.push("/booth/apply");
      return;
    }

    // 5. 同时有pending和rejected档口 - 跳转到选择页面让用户查看状态
    router.push("/booth/select");
  };

  const getButtonText = () => {
    if (!isLoggedIn()) {
      return "档口入驻";
    }

    if (loading || !boothStatus) {
      return "档口入驻";
    }

    // 无档口
    if (boothStatus.totalBooths === 0) {
      return "档口入驻";
    }

    // 有active档口（优先级最高）
    if (boothStatus.hasActiveBooths) {
      if (boothStatus.activeBoothsCount === 1) {
        return "档口管理";
      } else {
        return `管理档口(${boothStatus.activeBoothsCount}个)`;
      }
    }

    // 只有pending档口
    if (boothStatus.hasPendingBooths && !boothStatus.hasRejectedBooths) {
      if (boothStatus.pendingBoothsCount === 1) {
        return "审核中";
      } else {
        return `审核中(${boothStatus.pendingBoothsCount}个)`;
      }
    }

    // 只有rejected档口
    if (boothStatus.hasRejectedBooths && !boothStatus.hasPendingBooths) {
      return "重新申请";
    }

    // 混合状态（pending + rejected）
    if (boothStatus.hasPendingBooths && boothStatus.hasRejectedBooths) {
      return "查看状态";
    }

    return "档口入驻";
  };

  const getButtonDescription = () => {
    if (!isLoggedIn()) {
      return "登录后即可申请档口入驻";
    }

    if (loading || !boothStatus) {
      return "正在获取档口状态...";
    }

    // 无档口
    if (boothStatus.totalBooths === 0) {
      return "立即申请开通档口，开启您的生意之路";
    }

    // 构建状态描述
    const statusParts = [];
    if (boothStatus.hasActiveBooths) {
      if (boothStatus.activeBoothsCount === 1) {
        const activeBooth = boothStatus.booths.find(
          (booth) => booth.status === "active"
        );
        statusParts.push(`管理您的档口：${activeBooth?.boothName}`);
      } else {
        statusParts.push(`${boothStatus.activeBoothsCount}个通过审核的档口`);
      }
    }

    if (boothStatus.hasPendingBooths) {
      if (
        boothStatus.activeBoothsCount === 0 &&
        boothStatus.pendingBoothsCount === 1
      ) {
        const pendingBooth = boothStatus.booths.find(
          (booth) => booth.status === "pending"
        );
        statusParts.push(`申请审核中：${pendingBooth?.boothName}`);
      } else {
        statusParts.push(`${boothStatus.pendingBoothsCount}个待审核档口`);
      }
    }

    if (boothStatus.hasRejectedBooths) {
      if (boothStatus.totalBooths === 1) {
        return "申请被拒绝，可重新申请";
      } else {
        statusParts.push(`${boothStatus.rejectedBoothsCount}个被拒绝档口`);
      }
    }

    // 组合状态描述
    if (statusParts.length > 0) {
      return `您有${statusParts.join("，")}`;
    }

    return "立即申请开通档口，开启您的生意之路";
  };

  return (
    <div className="bg-white rounded-lg mx-4 my-4 shadow-sm border border-gray-100">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">我的服务</h3>

        <button
          onClick={handleBoothRegistration}
          disabled={loading}
          className="w-full flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 hover:from-orange-100 hover:to-red-100 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <div className="size-12 max bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="text-left flex-1">
              <h4 className="font-medium text-gray-900">{getButtonText()}</h4>
              <p className="text-sm text-gray-600">{getButtonDescription()}</p>
            </div>
          </div>
          {!loading && <ChevronRight className="w-5 h-5 text-gray-400" />}
        </button>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">入驻优势</p>
              <ul className="space-y-1">
                <li>• 专业的档口管理系统</li>
                <li>• 个性化推荐曝光</li>
                <li>• 多渠道客户对接</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            加入我们，享受专业的批发代发服务
          </p>
        </div>
      </div>
    </div>
  );
};
