import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Clock,
  XCircle,
  CheckCircle,
  Plus,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { MarketLabel } from "@/components/common";

// 类型定义
type FilterType = "all" | "active" | "pending" | "rejected";

interface FilterTab {
  key: FilterType;
  label: string;
  count?: number;
}

interface BoothSelectItem {
  id: string;
  boothName: string;
  boothNumber?: string;
  market?: string;
  status: "active" | "pending" | "rejected";
  statusText: string;
  rejectReason?: string;
  lastSubmitTime?: string;
  auditTime?: string;
}

interface UserBoothStatus {
  totalBooths: number;
  activeBoothsCount: number;
  pendingBoothsCount: number;
  rejectedBoothsCount: number;
  hasActiveBooths: boolean;
  booths: BoothSelectItem[];
}

// Mock API函数
const getUserBoothStatus = async (): Promise<UserBoothStatus> => {
  // 模拟API延迟
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalBooths: 3,
    activeBoothsCount: 1,
    pendingBoothsCount: 1,
    rejectedBoothsCount: 1,
    hasActiveBooths: true,
    booths: [
      {
        id: "1",
        boothName: "潮流手机配件专营店",
        boothNumber: "A201-A205",
        market: "广州天河电脑城",
        status: "active",
        statusText: "已通过",
        lastSubmitTime: "2023-01-15T10:00:00Z",
        auditTime: "2023-01-20T14:30:00Z",
      },
      {
        id: "2",
        boothName: "数码配件批发档口",
        boothNumber: "B301-B303",
        market: "深圳华强北电子市场",
        status: "pending",
        statusText: "审核中",
        lastSubmitTime: "2023-02-01T09:00:00Z",
      },
      {
        id: "3",
        boothName: "时尚数码配件店",
        boothNumber: "C101-C102",
        market: "广州天河电脑城",
        status: "rejected",
        statusText: "已拒绝",
        rejectReason: "提交的证件不清晰，请重新上传",
        lastSubmitTime: "2023-01-10T11:00:00Z",
        auditTime: "2023-01-12T16:00:00Z",
      },
    ],
  };
};

export default function BoothSelectPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [boothStatus, setBoothStatus] = useState<UserBoothStatus | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // 加载档口数据
  useEffect(() => {
    loadBoothStatus();
  }, []);

  const loadBoothStatus = async () => {
    try {
      setLoading(true);
      const status = await getUserBoothStatus();
      setBoothStatus(status);
    } catch (error) {
      console.error("加载档口状态失败:", error);
      toast.error("加载档口状态失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 筛选档口
  const filteredBooths =
    boothStatus?.booths?.filter((booth) => {
      if (activeFilter === "all") return true;
      return booth.status === activeFilter;
    }) || [];

  // 筛选器配置
  const filterTabs: FilterTab[] = [
    { key: "all", label: "全部", count: boothStatus?.totalBooths },
    { key: "active", label: "已通过", count: boothStatus?.activeBoothsCount },
    { key: "pending", label: "审核中", count: boothStatus?.pendingBoothsCount },
    {
      key: "rejected",
      label: "被拒绝",
      count: boothStatus?.rejectedBoothsCount,
    },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleManageBooth = (boothId: string) => {
    navigate(`/booth/management?id=${boothId}`);
  };

  const handleViewDetail = (boothId: string) => {
    // 这里可以跳转到档口详情页面或展开详细信息
    handleManageBooth(boothId);
  };

  const handleApplyNew = () => {
    navigate("/booth/apply");
  };

  // 获取状态图标和颜色
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
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
            <h1 className="text-lg font-semibold text-gray-900">选择档口</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* 加载状态 */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">正在加载档口信息...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!boothStatus || boothStatus.totalBooths === 0) {
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
            <h1 className="text-lg font-semibold text-gray-900">选择档口</h1>
            <div className="w-10"></div>
          </div>
        </div>

        {/* 空状态 */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              暂无档口
            </h3>
            <p className="text-gray-600 mb-6">您还没有申请任何档口</p>
            <button
              onClick={handleApplyNew}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              立即申请档口
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
          <h1 className="text-lg font-semibold text-gray-900">选择档口</h1>
          <div className="w-10"></div>
        </div>

        {/* 统计信息 */}
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-600">
            共 {boothStatus.totalBooths} 个档口
            {boothStatus.hasActiveBooths && (
              <span className="text-green-600 ml-2">
                {boothStatus.activeBoothsCount} 个已通过审核
              </span>
            )}
          </div>
        </div>

        {/* 筛选器 */}
        <div className="px-4 pb-2">
          <div className="flex space-x-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === tab.key
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 档口列表 */}
      <div className="p-4 space-y-4">
        {filteredBooths.map((booth) => (
          <BoothCard
            key={booth.id}
            booth={booth}
            onManage={() => handleManageBooth(booth.id)}
            onViewDetail={() => handleViewDetail(booth.id)}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        ))}

        {filteredBooths.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">该状态下暂无档口</p>
          </div>
        )}

        {/* 新申请入口 */}
        <button
          onClick={handleApplyNew}
          className="w-full flex items-center justify-center p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
        >
          <Plus className="w-6 h-6 text-gray-400 group-hover:text-orange-500 mr-3" />
          <span className="text-gray-600 group-hover:text-orange-700 font-medium">
            申请新档口
          </span>
        </button>
      </div>
    </div>
  );
}

// 档口卡片组件
interface BoothCardProps {
  booth: BoothSelectItem;
  onManage: () => void;
  onViewDetail: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusColor: (status: string) => string;
}

function BoothCard({
  booth,
  onManage,
  onViewDetail,
  getStatusIcon,
  getStatusColor,
}: BoothCardProps) {
  const canManage = booth.status === "active";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4">
        {/* 档口基本信息 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booth.boothName}
            </h3>
            <MarketLabel
              market={booth.market}
              className="text-sm text-gray-600 mb-2 block"
              fallback=""
            />
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
              booth.status
            )}`}
          >
            <div className="flex items-center space-x-1">
              {getStatusIcon(booth.status)}
              <span>{booth.statusText}</span>
            </div>
          </div>
        </div>

        {/* 拒绝原因 */}
        {booth.status === "rejected" && booth.rejectReason && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <span className="font-medium">拒绝原因：</span>
              {booth.rejectReason}
            </p>
          </div>
        )}

        {/* 时间信息 */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
          {booth.lastSubmitTime && (
            <p>
              申请时间：
              {new Date(booth.lastSubmitTime).toLocaleDateString("zh-CN")}
            </p>
          )}
          {booth.auditTime && (
            <p>
              审核时间：{new Date(booth.auditTime).toLocaleDateString("zh-CN")}
            </p>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-3">
          {canManage ? (
            <>
              <button
                onClick={onManage}
                className="flex-1 flex items-center justify-center py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                管理档口
              </button>
              <button
                onClick={onViewDetail}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onViewDetail}
              className="flex-1 flex items-center justify-center py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              查看详情
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
