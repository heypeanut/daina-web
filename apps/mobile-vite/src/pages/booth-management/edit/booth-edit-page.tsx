import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Mock字典数据类型
enum DictType {
  MARKET = "MARKET"
}

// Mock字典数据
const mockMarketData = [
  { value: "1", label: "广州天河电脑城", sort: 1 },
  { value: "2", label: "深圳华强北电子市场", sort: 2 },
  { value: "3", label: "广州十三行服装批发市场", sort: 3 },
  { value: "4", label: "广州白马服装市场", sort: 4 }
];

// 档口编辑信息接口
interface BoothEditInfo {
  id: string;
  boothNumber: string;
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  coverImg: string;
  wx?: string;
  qq?: string;
  wxQrcode?: string;
  qqQrcode?: string;
  profile?: string;
}

// 档口编辑表单接口
interface BoothEditForm {
  boothName: string;
  market: string;
  mainBusiness: string;
  address: string;
  phone: string;
  coverImage: File | string | null;
  wx: string;
  qq: string;
  wxQrCode: File | string | null;
  qqQrCode: File | string | null;
  description: string;
}

// Mock档口编辑信息
const mockBoothEditInfo: BoothEditInfo = {
  id: "1",
  boothNumber: "A201-A205",
  boothName: "潮流手机配件专营店",
  market: "1",
  mainBusiness: "手机壳、数据线、无线耳机、充电器、手机贴膜",
  address: "天河区天河路208号天河电脑城2楼A201-A205",
  phone: "13888888888",
  coverImg: "/placeholder-booth.jpg",
  wx: "wechat123",
  qq: "123456789",
  wxQrcode: "/placeholder-qr.jpg",
  qqQrcode: "/placeholder-qr.jpg",
  profile: "专业从事手机配件销售，质量保证，价格优惠。"
};

// Mock字典hook
const useDictionary = (type: DictType) => {
  return {
    data: type === DictType.MARKET ? mockMarketData : [],
    isLoading: false,
    error: null
  };
};

// Mock API函数
const getBoothEditInfo = async (boothId: string) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (boothId === "1") {
    return mockBoothEditInfo;
  }
  
  throw new Error("档口不存在或无访问权限");
};

const updateBoothInfo = async (boothId: string, formData: BoothEditForm) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log("档口信息更新:", { boothId, formData });
  
  return {
    success: true,
    message: "档口信息更新成功！"
  };
};

export default function BoothEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const boothId = searchParams.get("id");

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [boothInfo, setBoothInfo] = useState<BoothEditInfo | null>(null);

  // 获取市场字典数据
  const {
    data: marketData,
    isLoading: isMarketLoading,
    error: marketError,
  } = useDictionary(DictType.MARKET);

  const [formData, setFormData] = useState<BoothEditForm>({
    boothName: "",
    market: "",
    mainBusiness: "",
    address: "",
    phone: "",
    coverImage: null,
    wx: "",
    qq: "",
    wxQrCode: null,
    qqQrCode: null,
    description: "",
  });

  // 加载档口信息并预填充表单
  useEffect(() => {
    const loadBoothInfo = async () => {
      if (!boothId) {
        toast.error("未提供档口ID");
        navigate(-1);
        return;
      }

      try {
        setInitialLoading(true);
        const info = await getBoothEditInfo(boothId);
        setBoothInfo(info);

        // 预填充表单数据
        setFormData({
          boothName: info.boothName,
          market: info.market,
          mainBusiness: info.mainBusiness,
          address: info.address,
          phone: info.phone,
          coverImage: info.coverImg, // 使用现有图片URL
          wx: info.wx || "",
          qq: info.qq || "",
          wxQrCode: info.wxQrcode || null,
          qqQrCode: info.qqQrcode || null,
          description: info.profile || "",
        });
      } catch (error) {
        console.error("加载档口信息失败:", error);
        toast.error(error instanceof Error ? error.message : "加载档口信息失败");
        navigate(-1);
      } finally {
        setInitialLoading(false);
      }
    };

    loadBoothInfo();
  }, [boothId, navigate]);

  const handleInputChange = (
    field: keyof BoothEditForm,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload =
    (field: "coverImage" | "wxQrCode" | "qqQrCode") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // 验证文件类型
        if (!file.type.startsWith("image/")) {
          toast.error("请选择图片文件");
          return;
        }
        // 验证文件大小（限制为5MB）
        if (file.size > 5 * 1024 * 1024) {
          toast.error("图片大小不能超过5MB");
          return;
        }
        handleInputChange(field, file);
      }
    };

  const validateForm = () => {
    if (!formData.boothName.trim()) {
      toast.error("请输入档口名称");
      return false;
    }
    if (!formData.market) {
      toast.error("请选择市场");
      return false;
    }
    if (!formData.mainBusiness.trim()) {
      toast.error("请输入主营业务");
      return false;
    }
    if (!formData.address.trim()) {
      toast.error("请输入地址");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("请输入联系电话");
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      toast.error("请输入正确的手机号");
      return false;
    }
    if (!formData.coverImage) {
      toast.error("请上传封面图片");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !boothId) return;

    try {
      setLoading(true);

      // 调用更新API
      const result = await updateBoothInfo(boothId, formData);

      if (result.success) {
        toast.success(result.message, {
          duration: 4000,
        });

        // 返回管理页面
        navigate(`/booth/management?id=${boothId}`);
      } else {
        toast.error(result.message || "保存失败，请重试");
      }
    } catch (error: unknown) {
      console.error("档口信息保存失败:", error);
      toast.error(error instanceof Error ? error.message : "保存失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 渲染图片预览
  const renderImagePreview = (
    imageData: File | string | null,
    altText: string
  ) => {
    if (!imageData) return null;

    const imageUrl = imageData instanceof File 
      ? URL.createObjectURL(imageData)
      : imageData;

    return (
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-48 object-cover rounded-lg mx-auto"
      />
    );
  };

  // 初始加载状态
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">加载档口信息中...</p>
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
          <h1 className="text-lg font-semibold text-gray-900">编辑档口信息</h1>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "保存中..." : "保存"}
          </button>
        </div>
      </div>

      {/* 表单内容 */}
      <div className="p-4 space-y-4">
        {/* 档口号（只读） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            档口号
          </label>
          <input
            type="text"
            value={boothInfo?.boothNumber || ""}
            readOnly
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            placeholder="档口号"
          />
        </div>

        {/* 档口名称 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 档口名称
          </label>
          <input
            type="text"
            value={formData.boothName}
            onChange={(e) => handleInputChange("boothName", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入档口名称"
          />
        </div>

        {/* 市场 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 市场
          </label>
          <select
            value={formData.market}
            onChange={(e) => handleInputChange("market", e.target.value)}
            disabled={isMarketLoading}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.5rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.5em 1.5em",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">
              {isMarketLoading
                ? "加载中..."
                : marketError
                ? "加载失败"
                : "请选择市场"}
            </option>
            {marketData &&
              Array.isArray(marketData) &&
              marketData
                .sort((a, b) => a.sort - b.sort)
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
          </select>
        </div>

        {/* 主营业务 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 主营业务
          </label>
          <input
            type="text"
            value={formData.mainBusiness}
            onChange={(e) => handleInputChange("mainBusiness", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入主营业务"
          />
        </div>

        {/* 地址 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 地址
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入地址"
          />
        </div>

        {/* 联系电话 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 联系电话
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入联系电话"
            maxLength={11}
          />
        </div>

        {/* 封面图片 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span className="text-red-500">*</span> 封面图片
          </label>
          <div className="relative">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors cursor-pointer">
              {formData.coverImage ? (
                <div className="space-y-3">
                  {renderImagePreview(formData.coverImage, "封面预览")}
                  <div className="flex items-center justify-center space-x-4 flex-wrap">
                    <span className="text-sm text-gray-600">
                      {formData.coverImage instanceof File
                        ? formData.coverImage.name
                        : "当前封面图片"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleInputChange("coverImage", null)}
                      className="text-orange-500 text-sm hover:text-orange-600"
                    >
                      重新选择
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-1">上传</p>
                  <p className="text-xs text-gray-500">
                    支持 JPG、PNG 格式，不超过5MB
                  </p>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload("coverImage")}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* 微信号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            微信号
          </label>
          <input
            type="text"
            value={formData.wx}
            onChange={(e) => handleInputChange("wx", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入微信号"
          />
        </div>

        {/* QQ号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            QQ号
          </label>
          <input
            type="text"
            value={formData.qq}
            onChange={(e) => handleInputChange("qq", e.target.value)}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="请输入QQ号"
          />
        </div>

        {/* 二维码上传 */}
        <div className="grid grid-cols-2 gap-4">
          {/* 微信二维码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              微信二维码
            </label>
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors cursor-pointer">
                {formData.wxQrCode ? (
                  <div className="space-y-2">
                    <img
                      src={formData.wxQrCode instanceof File 
                        ? URL.createObjectURL(formData.wxQrCode)
                        : formData.wxQrCode}
                      alt="微信二维码"
                      className="w-full h-20 object-cover rounded mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange("wxQrCode", null)}
                      className="text-orange-500 text-xs hover:text-orange-600"
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-gray-100">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600">上传</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload("wxQrCode")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* QQ二维码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QQ二维码
            </label>
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors cursor-pointer">
                {formData.qqQrCode ? (
                  <div className="space-y-2">
                    <img
                      src={formData.qqQrCode instanceof File
                        ? URL.createObjectURL(formData.qqQrCode)
                        : formData.qqQrCode}
                      alt="QQ二维码"
                      className="w-full h-20 object-cover rounded mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange("qqQrCode", null)}
                      className="text-orange-500 text-xs hover:text-orange-600"
                    >
                      重新选择
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-gray-100">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-600">上传</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload("qqQrCode")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 详细描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            详细描述
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={4}
            className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
            placeholder="请详细描述您的档口经营范围、优势等信息"
          />
        </div>

        {/* 市场数据加载错误提示 */}
        {marketError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              数据加载失败
            </h4>
            <p className="text-sm text-red-700">
              市场数据加载失败，请检查网络连接后重试。如果问题持续，请联系客服。
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              重新加载页面
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
