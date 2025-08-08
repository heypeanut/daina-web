"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { isLoggedIn, redirectToLogin } from "@/lib/auth";
import { getUserBoothStatus, UserBoothStatus } from "@/lib/api/booth";
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
    console.log("boothStatus", boothStatus);
    if (boothStatus?.booths[0].status === "pending") {
      return toast.error("档口正在审核中");
    }
    if (!isLoggedIn()) {
      // 未登录，跳转到登录页面
      redirectToLogin("/booth/apply");
      return;
    }

    // 如果正在加载状态，重新获取
    if (loading || !boothStatus) {
      try {
        setLoading(true);
        const status = await getUserBoothStatus();
        setBoothStatus(status);

        if (status.hasBooths) {
          // 有档口，跳转到档口管理页
          router.push("/booth/management");
        } else {
          // 没有档口，跳转到档口入驻页
          router.push("/booth/apply");
        }
      } catch {
        toast.error("获取档口状态失败，请重试");
      } finally {
        setLoading(false);
      }
      return;
    }

    // 根据档口状态跳转
    if (boothStatus.hasBooths) {
      // 有通过审核的档口，跳转到档口管理页
      router.push("/booth/management");
    } else {
      // 没有通过审核的档口，跳转到档口入驻页
      router.push("/booth/apply");
    }
  };

  const getButtonText = () => {
    if (!isLoggedIn()) {
      return "档口入驻";
    }

    if (loading || !boothStatus) {
      return "档口入驻";
    }

    // 检查是否有档口申请记录
    if (boothStatus.booths && boothStatus.booths.length > 0) {
      const activeBooth = boothStatus.booths.find(
        (booth) => booth.status === "active"
      );
      const pendingBooth = boothStatus.booths.find(
        (booth) => booth.status === "pending"
      );
      const rejectedBooth = boothStatus.booths.find(
        (booth) => booth.status === "rejected"
      );

      if (activeBooth) {
        return "档口管理";
      } else if (pendingBooth) {
        return "审核中";
      } else if (rejectedBooth) {
        return "重新申请";
      }
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

    // 检查是否有档口申请记录
    if (boothStatus.booths && boothStatus.booths.length > 0) {
      const activeBooth = boothStatus.booths.find(
        (booth) => booth.status === "active"
      );
      const pendingBooth = boothStatus.booths.find(
        (booth) => booth.status === "pending"
      );
      const rejectedBooth = boothStatus.booths.find(
        (booth) => booth.status === "rejected"
      );

      if (activeBooth) {
        return `管理您的档口：${activeBooth.boothName}`;
      } else if (pendingBooth) {
        return `申请审核中：${pendingBooth.boothName}`;
      } else if (rejectedBooth) {
        return `申请被拒绝，可重新申请`;
      }
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
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <ShoppingBag className="w-6 h-6 text-white" />
              )}
            </div>
            <div className="text-left">
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
