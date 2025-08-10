"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Plus, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { createBoothProduct, getProductCategories } from "@/lib/api/booth";
import { ProductCreateForm, ProductCategory } from "@/types/booth";

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boothId = searchParams.get("boothId");

  // 状态管理
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [formData, setFormData] = useState<ProductCreateForm>({
    name: "",
    price: 0,
    originalPrice: undefined,
    coverImage: null,
    additionalImages: [],
    description: "",
    categoryId: "",
    stock: undefined,
    status: 'active'
  });

  // 加载商品分类
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoryData = await getProductCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("加载商品分类失败:", error);
        toast.error("加载商品分类失败");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // 检查档口ID
  useEffect(() => {
    if (!boothId) {
      toast.error("未提供档口ID");
      router.back();
    }
  }, [boothId, router]);

  const handleInputChange = (
    field: keyof ProductCreateForm,
    value: string | number | File | File[] | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 处理封面图片上传
  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("请选择图片文件");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过5MB");
        return;
      }
      handleInputChange("coverImage", file);
    }
  };

  // 处理附加图片上传
  const handleAdditionalImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // 验证文件
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} 不是有效的图片文件`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} 大小不能超过5MB`);
        return false;
      }
      return true;
    });

    // 检查总数量限制
    const currentCount = (formData.additionalImages?.length || 0);
    const maxAllowed = 5; // 最多5张附加图片
    const availableSlots = maxAllowed - currentCount;
    
    if (validFiles.length > availableSlots) {
      toast.error(`最多只能添加${availableSlots}张图片`);
      return;
    }

    if (validFiles.length > 0) {
      const newImages = [...(formData.additionalImages || []), ...validFiles];
      handleInputChange("additionalImages", newImages);
    }
  };

  // 删除附加图片
  const removeAdditionalImage = (index: number) => {
    const newImages = (formData.additionalImages || []).filter((_, i) => i !== index);
    handleInputChange("additionalImages", newImages);
  };

  // 表单验证
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("请输入商品名称");
      return false;
    }
    if (formData.price <= 0) {
      toast.error("请输入有效的商品价格");
      return false;
    }
    if (formData.originalPrice && formData.originalPrice < formData.price) {
      toast.error("原价不能低于现价");
      return false;
    }
    if (!formData.coverImage) {
      toast.error("请上传商品封面图片");
      return false;
    }
    return true;
  };

  // 保存商品
  const handleSave = async () => {
    if (!validateForm() || !boothId) return;

    try {
      setLoading(true);
      const result = await createBoothProduct(boothId, formData);

      if (result.success) {
        toast.success(result.message, {
          duration: 4000,
        });
        // 返回产品管理页面
        router.push(`/booth/products?boothId=${boothId}`);
      } else {
        toast.error(result.message || "创建商品失败，请重试");
      }
    } catch (error: unknown) {
      console.error("商品创建失败:", error);
      toast.error(error instanceof Error ? error.message : "创建商品失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // 渲染图片预览
  const renderImagePreview = (file: File, altText: string) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <img
        src={imageUrl}
        alt={altText}
        className="w-full h-full object-cover"
      />
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
          <h1 className="text-lg font-semibold text-gray-900">添加商品</h1>
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
      <div className="p-4 space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">基本信息</h3>
          
          {/* 商品名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 商品名称
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
              placeholder="请输入商品名称"
              maxLength={100}
            />
          </div>

          {/* 价格信息 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="text-red-500">*</span> 现价 (元)
              </label>
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
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
                value={formData.originalPrice || ''}
                onChange={(e) => handleInputChange("originalPrice", parseFloat(e.target.value) || undefined)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* 商品分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              商品分类
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => handleInputChange("categoryId", e.target.value)}
              disabled={categoriesLoading}
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
                {categoriesLoading ? "加载中..." : "请选择分类（可选）"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* 库存和状态 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                库存数量
              </label>
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => handleInputChange("stock", parseInt(e.target.value) || undefined)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
                placeholder="不限制"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                商品状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value as 'active' | 'inactive')}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="active">上架</option>
                <option value="inactive">下架</option>
              </select>
            </div>
          </div>
        </div>

        {/* 商品图片 */}
        <div className="bg-white rounded-lg p-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">商品图片</h3>
          
          {/* 封面图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> 封面图片
            </label>
            <div className="relative">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer">
                {formData.coverImage ? (
                  <div className="space-y-3">
                    <div className="w-full h-48 rounded-lg overflow-hidden">
                      {renderImagePreview(formData.coverImage, "封面预览")}
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {formData.coverImage.name}
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
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-1">点击上传封面图片</p>
                    <p className="text-xs text-gray-500">
                      支持 JPG、PNG 格式，不超过5MB
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* 附加图片 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              附加图片 <span className="text-xs text-gray-500">(最多5张)</span>
            </label>
            
            {/* 已上传的附加图片 */}
            {formData.additionalImages && formData.additionalImages.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-3">
                {formData.additionalImages.map((file, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    {renderImagePreview(file, `附加图片${index + 1}`)}
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 添加更多图片 */}
            {(!formData.additionalImages || formData.additionalImages.length < 5) && (
              <div className="relative">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center rounded-full bg-gray-100">
                    <Plus className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">添加更多图片</p>
                  <p className="text-xs text-gray-500">
                    还可添加 {5 - (formData.additionalImages?.length || 0)} 张
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleAdditionalImagesUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* 商品描述 */}
        <div className="bg-white rounded-lg p-4 space-y-4">
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

        {/* 温馨提示 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">温馨提示</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• 商品名称和封面图片为必填项</p>
            <p>• 建议上传清晰的商品图片，有助于吸引买家</p>
            <p>• 详细的商品描述可以提高成交率</p>
            <p>• 商品创建后可随时编辑修改</p>
          </div>
        </div>
      </div>
    </div>
  );
}