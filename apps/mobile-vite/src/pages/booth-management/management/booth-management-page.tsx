import React from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  CheckCircle, 
  Clock, 
  XCircle,
  ChevronRight,
  Store,
  Package,
  Edit3,
  Settings
} from "lucide-react";
import { useBoothStatus } from "../../profile/hooks/use-booth-status";
import type { UserBoothStatusItem } from "@/types/booth";



export default function BoothManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { data: boothStatus, isLoading: loading, error } = useBoothStatus();
  
  // 从URL参数获取档口ID
  const boothId = searchParams.get("id");
  
  // 如果有档口ID，显示单个档口管理界面
  if (boothId) {
    return <SingleBoothManagement boothId={boothId} />;
  }

  // 获取所有档口
  const allBooths = boothStatus?.booths || [];

  const handleBack = () => {
    // 智能回退逻辑
    // 检查是否有 state 中的 from 信息（从其他页面导航过来时可以传递）
    const from = location.state?.from;
    
    if (from) {
      // 如果有明确的来源页面，回退到来源页面
      navigate(from);
    } else {
      // 默认情况下，档口管理通常从profile页面进入
      navigate("/profile");
    }
  };

  const handleManageBooth = (boothId: string) => {
    // 跳转到具体档口的管理页面，使用查询参数
    navigate(`/booth/management?id=${boothId}`);
  };

  const handleViewDetail = (boothId: string) => {
    // 跳转到档口详情页面
    navigate(`/booth/${boothId}`);
  };

  const handleApplyNew = () => {
    navigate("/booth/apply");
  };

  // 获取状态图标和颜色
  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
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
            <h1 className="text-lg font-semibold text-gray-900">档口管理</h1>
            <div className="w-10 h-10" />
          </div>
        </div>

        {/* 加载状态 */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !boothStatus) {
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
            <div className="w-10 h-10" />
          </div>
        </div>

        {/* 错误状态 */}
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">加载档口信息失败</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              重试
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
          <div className="w-10 h-10" />
        </div>


      </div>

      {/* 档口列表 */}
      <div className="p-4 space-y-3">
        {allBooths.map((booth) => (
          <BoothCard
            key={booth.id}
            booth={booth}
            onManage={() => handleManageBooth(booth.id)}
            onViewDetail={() => handleViewDetail(booth.id)}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
          />
        ))}

        {allBooths.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">暂无档口</p>
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
  booth: UserBoothStatusItem;
  onManage: () => void;
  onViewDetail: () => void;
  getStatusIcon: (status: string) => React.ReactElement;
  getStatusColor: (status: string) => string;
}

function BoothCard({ 
  booth, 
  onManage, 
  onViewDetail, 
  getStatusIcon, 
  getStatusColor 
}: BoothCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 档口基本信息 */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900 mb-1">
              {booth.boothName}
            </h3>
            <div className="flex items-center">
              <div className={`flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusColor(booth.status)}`}>
                {getStatusIcon(booth.status)}
                <span className="ml-1">{booth.statusText}</span>
              </div>
            </div>
          </div>
          <Store className="w-5 h-5 text-gray-400 ml-2" />
        </div>

        {/* 时间信息 */}
        <div className="text-xs text-gray-500 space-y-0.5">
          {booth.lastSubmitTime && (
            <p>申请时间：{formatDate(booth.lastSubmitTime)}</p>
          )}
          {booth.auditTime && (
            <p>审核时间：{formatDate(booth.auditTime)}</p>
          )}
        </div>

        {/* 拒绝原因 */}
        {booth.status === "rejected" && booth.rejectReason && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-800">
              <span className="font-medium">拒绝原因：</span>
              {booth.rejectReason}
            </p>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="border-t border-gray-100 px-3 py-2">
        <div className="flex space-x-2">
          {/* 只有已通过的档口才显示查看详情 */}
          {booth.status === "active" && (
            <>
              <button
                onClick={onViewDetail}
                className="flex-1 flex items-center justify-center px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                查看详情
              </button>
              <button
                onClick={onManage}
                className="flex-1 flex items-center justify-center px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
              >
                <span>管理档口</span>
                <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </>
          )}
          {/* 审核中的档口只显示一个按钮 */}
          {booth.status === "pending" && (
            <div className="w-full text-center py-1">
              <span className="text-sm text-gray-500">审核中，请耐心等待</span>
            </div>
          )}
          {/* 被拒绝的档口显示重新申请 */}
          {booth.status === "rejected" && (
            <button
              onClick={() => window.location.href = "/booth/apply"}
              className="w-full flex items-center justify-center px-3 py-1.5 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
            >
              重新申请
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 单个档口管理组件
interface SingleBoothManagementProps {
  boothId: string;
}

function SingleBoothManagement({ boothId }: SingleBoothManagementProps) {
  const navigate = useNavigate();
  const { data: boothStatus } = useBoothStatus();
  
  // 从档口状态中找到对应的档口信息
  const currentBooth = boothStatus?.booths?.find(booth => booth.id === boothId);
  
  const handleBack = () => {
    navigate("/booth/management");
  };
  
  const handleEditBooth = () => {
    navigate(`/booth/edit?id=${boothId}`);
  };
  
  const handleProductManagement = () => {
    navigate(`/booth/products?id=${boothId}`);
  };
  
  // 辅助函数
  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3" />;
      case "pending":
        return <Clock className="w-3 h-3" />;
      case "rejected":
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "rejected":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  if (!currentBooth) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">档口管理</h1>
            <div className="w-10 h-10" />
          </div>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">档口不存在</p>
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
          <h1 className="text-lg font-semibold text-gray-900">{currentBooth.boothName}</h1>
          <button
            onClick={handleEditBooth}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 档口信息卡片 */}
      <div className="p-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-lg font-medium text-gray-900 mb-2">{currentBooth.boothName}</h2>
              <div className="flex items-center mb-2">
                <div className={`flex items-center px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusColor(currentBooth.status)}`}>
                  {getStatusIcon(currentBooth.status)}
                  <span className="ml-1">{currentBooth.statusText}</span>
                </div>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                {currentBooth.lastSubmitTime && (
                  <p>申请时间：{formatDate(currentBooth.lastSubmitTime)}</p>
                )}
                {currentBooth.auditTime && (
                  <p>审核时间：{formatDate(currentBooth.auditTime)}</p>
                )}
              </div>
            </div>
            <Store className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        {/* 管理功能 */}
        {currentBooth.status === "active" && (
          <div className="space-y-3">
            <button
              onClick={handleProductManagement}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">商品管理</h3>
                  <p className="text-sm text-gray-600">管理档口商品，上架下架</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={handleEditBooth}
              className="w-full bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Edit3 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">编辑档口</h3>
                  <p className="text-sm text-gray-600">修改档口基本信息</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        )}

        {/* 审核中状态 */}
        {currentBooth.status === "pending" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-medium text-yellow-800 mb-1">审核中</h3>
            <p className="text-sm text-yellow-700">您的档口正在审核中，请耐心等待</p>
          </div>
        )}

        {/* 被拒绝状态 */}
        {currentBooth.status === "rejected" && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-center mb-4">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-red-800 mb-1">审核未通过</h3>
              <p className="text-sm text-red-700">您的档口申请未通过审核</p>
            </div>
            {currentBooth.rejectReason && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  <span className="font-medium">拒绝原因：</span>
                  {currentBooth.rejectReason}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate("/booth/apply")}
              className="w-full bg-orange-500 text-white rounded-lg py-2 hover:bg-orange-600 transition-colors"
            >
              重新申请
            </button>
          </div>
        )}
      </div>
    </div>
  );
}