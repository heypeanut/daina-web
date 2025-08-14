import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { DraggableImageList, type ImageItem } from "./components/draggable-image-list";
import { getProductDetail, updateBoothProduct } from "@/lib/api/booth";
import { useDictionary } from "@/hooks/api/useDictionary";
import { DictType } from "@/types/dictionary";

// 商品表单接口
interface ProductEditForm {
  name: string;
  price?: number;
  originalPrice?: number;
  images: ImageItem[]; // 支持File对象和URL字符串的混合数组
  description: string;
  categoryId: string;
  stock?: number;
  status: string;
  // 规格参数（可选）
  style: string;
  phoneModel: string;
  productType: string;
  trend: string;
  imageType: string;
  copyright: string;
  biodegradable: string;
  ecoMaterial: string;
}

// 商品状态字典hook
const useProductStatusDict = () => {
  const { data, isLoading, error } = useDictionary(DictType.PRODUCT_STATUS);
  return {
    data: data || [
      { value: "1", label: "上架" },
      { value: "0", label: "下架" }
    ],
    isLoading,
    error
  };
};

export default function EditProductPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const boothId = searchParams.get("boothId");
  
  const [loading, setLoading] = useState(false);
  
  // 获取商品详情
  const {
    data: productDetail,
    isLoading: initialLoading,
    error: productError
  } = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductDetail(productId!),
    enabled: !!productId, // 只有当productId存在时才执行查询
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  });
  
  // 获取商品状态字典
  const { 
    data: productStatusOptions, 
    isLoading: statusLoading, 
    error: statusError 
  } = useProductStatusDict();

  const [formData, setFormData] = useState<ProductEditForm>({
    name: "",
    price: undefined,
    originalPrice: undefined,
    images: [], // 合并后的图片数组
    description: "",
    categoryId: "",
    stock: undefined,
    status: "1",
    // 规格参数（可选）
    style: "",
    phoneModel: "",
    productType: "",
    trend: "",
    imageType: "",
    copyright: "",
    biodegradable: "",
    ecoMaterial: ""
  });

  // 当商品详情加载完成后，填充表单数据
  useEffect(() => {
    if (productDetail) {
      setFormData({
        name: productDetail.name || "",
        price: productDetail.price,
        originalPrice: productDetail.originalPrice,
        images: productDetail.images?.map(img => img.url) || [], // 将ProductImage转换为URL字符串数组
        description: productDetail.features || "", // API返回的是features字段
        categoryId: productDetail.category || "",
        stock: productDetail.stock,
        status: productDetail.status?.toString() || "1",
        style: productDetail.style || "",
        phoneModel: productDetail.phoneModel || "",
        productType: productDetail.productType || "",
        trend: productDetail.trend || "",
        imageType: productDetail.imageType || "",
        copyright: productDetail.copyright || "",
        biodegradable: productDetail.biodegradable || "",
        ecoMaterial: productDetail.ecoMaterial || ""
      });
    }
  }, [productDetail]);

  // 处理错误和参数验证
  useEffect(() => {
    if (!productId) {
      toast.error("未提供商品ID");
      navigate(-1);
      return;
    }
    
    if (productError) {
      console.error("加载商品详情失败:", productError);
      toast.error("加载商品详情失败");
      navigate(-1);
    }
  }, [productId, productError, navigate]);

  // React Query错误处理
  useEffect(() => {
    if (statusError) {
      console.error("加载商品状态字典失败:", statusError);
      toast.error("加载商品状态选项失败，使用默认选项");
    }
  }, [statusError]);

  // 检查参数
  useEffect(() => {
    if (!boothId) {
      toast.error("未提供档口ID");
      navigate(-1);
    }
  }, [boothId, navigate]);

  const handleInputChange = (
    field: string,
    value: string | number | File | File[] | null | undefined
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 表单验证
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("请输入商品名称");
      return false;
    }
    if (!formData.images || formData.images.length === 0) {
      toast.error("请上传至少一张商品图片");
      return false;
    }
    if (!formData.status) {
      toast.error("请选择商品状态");
      return false;
    }
    // 可选字段验证
    if (formData.originalPrice && formData.price && formData.originalPrice < formData.price) {
      toast.error("原价不能低于现价");
      return false;
    }
    return true;
  };

  // 保存商品
  const handleSave = async () => {
    if (!validateForm() || !boothId || !productId) return;

    try {
      setLoading(true);
      
      // 分离新上传的文件和现有的图片URL
      const newFiles = formData.images.filter((img): img is File => img instanceof File);
      const existingUrls = formData.images.filter((img): img is string => typeof img === 'string');
      
      // 创建用于API调用的表单数据，只包含新上传的文件
      const apiFormData = {
        ...formData,
        images: newFiles, // 只传递新上传的文件
        existingImages: existingUrls // 可以传递现有图片URL给后端参考
      };
      
      const result = await updateBoothProduct(productId, boothId, apiFormData);

      if (result.success) {
        toast.success(result.message, {
          duration: 4000,
        });
        // 返回产品管理页面
        navigate(`/booth/products?id=${boothId}`);
      } else {
        toast.error(result.message || "更新商品失败，请重试");
      }
    } catch (error: any) {
      console.error("商品更新失败:", error);
      toast.error(error.message || "更新商品失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 初始加载状态
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载商品信息中...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-lg font-semibold text-gray-900">编辑商品</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* 表单内容 */}
      <div className="p-4 pb-24">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg p-4 space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
          
          {/* 商品名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="请输入商品名称"
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.name.length}/100
            </div>
          </div>

          {/* 价格信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                售价 (元)
              </label>
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || undefined)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                原价 (元)
              </label>
              <input
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || undefined)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* 库存和状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                库存数量
              </label>
              <input
                type="number"
                value={formData.stock || ""}
                onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || undefined)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                disabled={statusLoading}
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
                  {statusLoading
                    ? "加载中..."
                    : statusError
                    ? "加载失败"
                    : "请选择状态"}
                </option>
                {productStatusOptions &&
                  Array.isArray(productStatusOptions) &&
                  productStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* 商品图片 */}
        <div className="bg-white rounded-lg p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              商品图片
            </h3>
            <span className="text-sm text-gray-500">
              第一张为封面图，可拖拽调整顺序
            </span>
          </div>
          
          <DraggableImageList
            images={formData.images}
            onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
            maxImages={10}
          />
        </div>

        {/* 商品描述 */}
        <div className="bg-white rounded-lg p-4 space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">商品详情</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品描述
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none resize-none"
              placeholder="请详细描述商品的特点、规格、使用说明等信息..."
              maxLength={1000}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {formData.description?.length || 0}/1000
            </div>
          </div>
        </div>

        {/* 规格参数 */}
        <div className="bg-white rounded-lg p-4 space-y-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">规格参数</h3>
          <p className="text-sm text-gray-500 mb-4">以下规格参数均为可选，有助于买家更好地了解商品</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 风格 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                风格
              </label>
              <input
                type="text"
                value={formData.style || ""}
                onChange={(e) => handleInputChange("style", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：简约、复古、时尚等"
                maxLength={50}
              />
            </div>

            {/* 适用机型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                适用机型
              </label>
              <input
                type="text"
                value={formData.phoneModel || ""}
                onChange={(e) => handleInputChange("phoneModel", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：iPhone 15、小米14等"
                maxLength={100}
              />
            </div>

            {/* 产品类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品类型
              </label>
              <input
                type="text"
                value={formData.productType || ""}
                onChange={(e) => handleInputChange("productType", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：手机壳、保护套、配件等"
                maxLength={50}
              />
            </div>

            {/* 流行元素 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                流行元素
              </label>
              <input
                type="text"
                value={formData.trend || ""}
                onChange={(e) => handleInputChange("trend", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：卡通、动漫、潮流等"
                maxLength={50}
              />
            </div>

            {/* 图片类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片类型
              </label>
              <input
                type="text"
                value={formData.imageType || ""}
                onChange={(e) => handleInputChange("imageType", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：原创、定制、印刷等"
                maxLength={50}
              />
            </div>

            {/* 版权 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                版权
              </label>
              <input
                type="text"
                value={formData.copyright || ""}
                onChange={(e) => handleInputChange("copyright", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：原创设计、授权使用等"
                maxLength={50}
              />
            </div>

            {/* 生物降解 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                生物降解
              </label>
              <select
                value={formData.biodegradable || ""}
                onChange={(e) => handleInputChange("biodegradable", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">请选择</option>
                <option value="是">是</option>
                <option value="否">否</option>
                <option value="部分">部分</option>
              </select>
            </div>

            {/* 环保材料 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                环保材料
              </label>
              <input
                type="text"
                value={formData.ecoMaterial || ""}
                onChange={(e) => handleInputChange("ecoMaterial", e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="如：可回收塑料、天然材料等"
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">温馨提示</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• 商品名称为必填项</p>
            <p>• 建议上传清晰的商品图片，有助于吸引买家</p>
            <p>• 详细的商品描述可以提高成交率</p>
            <p>• 修改后的信息将立即生效</p>
          </div>
        </div>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {loading ? "保存中..." : "保存修改"}
        </button>
      </div>
    </div>
  );
}
