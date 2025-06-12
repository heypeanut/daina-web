import React from "react";
import { Booth } from "@/types/booth";

interface ShopMainInfoProps {
  booth: Booth;
}

// 用正则提取所有"数字+关键字"对
function parseStats(text: string | undefined) {
  if (!text) return {};
  const regex = /([0-9]+)\s*([\u4e00-\u9fa5]+)/g;
  const stats: Record<string, string> = {};
  let match;
  while ((match = regex.exec(text))) {
    const value = match[1];
    const key = match[2];
    stats[key] = value;
  }
  return stats;
}

const ShopMainInfo: React.FC<ShopMainInfoProps> = ({ booth }) => {
  const statsMap = parseStats(booth.text as string);
  const stats = [
    { label: "档口排行", value: statsMap["档口排行"] },
    { label: "宝贝数量", value: statsMap["宝贝数量"] },
    { label: "近期上新", value: statsMap["近期上新"] },
    { label: "关注人数", value: statsMap["关注人数"] },
    { label: "人气值", value: statsMap["人气值"] },
    { label: "浏览量", value: statsMap["浏览量"] },
  ];

  // 简介（取text前60字）
  const intro =
    booth.text && typeof booth.text === "string"
      ? booth.text.replace(/\s+/g, " ").slice(0, 60) +
        (booth.text.length > 60 ? "..." : "")
      : "";

  return (
    <section className="flex-1 px-0 sm:px-8 py-4">
      {/* 档口简介 */}
      <div className="mb-6 ">
        <h2 className="text-xl font-bold mb-2 text-gray-900">档口简介</h2>
        <p className="text-gray-700 card-glass text-base bg-gray-50 rounded-xl p-4">
          {intro}
        </p>
      </div>
      {/* 档口数据 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">档口数据</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map(
            (item) =>
              item.value && (
                <div
                  key={item.label}
                  className="card-glass p-4 flex flex-col items-center"
                >
                  <span className="text-2xl font-bold text-[#0040f0] mb-1">
                    {item.value}
                  </span>
                  <span className="text-gray-500 text-sm">{item.label}</span>
                </div>
              )
          )}
        </div>
      </div>
      {/* 主营品类 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">主营品类</h3>
        <div className="flex flex-wrap gap-2">
          {(booth.main_business || []).map((cat) => (
            <span
              key={cat}
              className="bg-[#eaf0fe] text-[#0040f0] px-3 py-1 rounded-xl text-sm font-medium border border-blue-100"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      {/* 服务说明/退货政策 */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900">服务说明</h3>
        <div className="text-gray-600 text-sm card-glass p-4 leading-relaxed shadow-sm whitespace-pre-line">
          {typeof booth.text === "string" ? booth.text : ""}
        </div>
      </div>
    </section>
  );
};

export default ShopMainInfo;
