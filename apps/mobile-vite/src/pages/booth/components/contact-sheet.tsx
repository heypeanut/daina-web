import { useState } from "react";
import { Phone, MessageCircle, Copy, X, QrCode } from "lucide-react";
import { ImageLazyLoader } from "@/components/common";
import type { Booth } from "@/types/api";

interface ContactSheetProps {
  booth: Booth;
  isOpen: boolean;
  onClose: () => void;
}

interface AgentContactSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

// 联系商家抽屉组件
export function ContactSheet({ booth, isOpen, onClose }: ContactSheetProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`已复制: ${text}`);
      // 实际项目中使用toast提示
    }).catch(() => {
      console.error('复制失败');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 抽屉内容 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">联系商家</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4">
          {/* 档口信息 */}
          <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
            <ImageLazyLoader
              src={booth.coverImg || "/logo.png"}
              alt={booth.boothName}
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <h4 className="font-medium text-gray-900">{booth.boothName}</h4>
              <p className="text-sm text-gray-500">{booth.marketLabel}</p>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="space-y-3">
            {booth.phone && (
              <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-red-500 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">电话</div>
                  <div className="font-medium">{booth.phone}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(booth.phone!)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}

            {booth.wx && (
              <div className="flex items-center py-3 px-4 bg-gray-50 rounded-xl">
                <MessageCircle className="w-5 h-5 text-green-500 mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-gray-500">微信</div>
                  <div className="font-medium">{booth.wx}</div>
                </div>
                <button
                  onClick={() => copyToClipboard(booth.wx!)}
                  className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* 二维码 */}
          <div className="mt-6 bg-white p-4 rounded-2xl shadow-sm border flex justify-center items-center">
            <ImageLazyLoader
              src="/logo.jpg"
              alt="微信二维码"
              width={150}
              height={150}
              className="rounded-xl"
            />
          </div>

          {/* 提示信息 */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              扫描二维码或复制联系方式添加商家微信，获取更多优惠信息
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// 代拿服务抽屉组件
export function AgentContactSheet({ isOpen, onClose }: AgentContactSheetProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`已复制: ${text}`);
      // 实际项目中使用toast提示
    }).catch(() => {
      console.error('复制失败');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* 抽屉内容 */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl">
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">联系代拿</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4">
          {/* 服务说明 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <QrCode className="w-5 h-5 text-orange-600" />
              <h4 className="font-medium text-gray-900">代拿服务</h4>
            </div>
            <p className="text-sm text-gray-600">
              专业代拿团队，为您提供安全、快捷的代购服务
            </p>
          </div>

          {/* 二维码 */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border flex justify-center items-center mb-4">
            <ImageLazyLoader
              src="/logo.jpg"
              alt="代拿服务二维码"
              width={150}
              height={150}
              className="rounded-xl"
            />
          </div>

          {/* 服务特色 */}
          <div className="space-y-3">
            <h5 className="font-medium text-gray-900">服务特色</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">专业团队</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">安全保障</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">快速响应</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">价格透明</span>
              </div>
            </div>
          </div>

          {/* 提示信息 */}
          <div className="mt-4 p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-800">
              扫描二维码联系代拿客服，享受专业代购服务
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
