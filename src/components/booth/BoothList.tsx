"use client";
import boothsData from "../../../public/52hqb_booths_puppeteer.json";
import { Booth } from "../../types/booth";
import { PaginationBar } from "./PaginationBar";
import { BoothCard } from "./BoothCard";

const PAGE_SIZE = 30;

interface BoothListProps {
  page: number;
  keyword?: string;
  searchType?: string;
}

// 搜索过滤函数
const filterBooths = (
  booths: Booth[],
  keyword: string,
  searchType: string
): Booth[] => {
  if (!keyword.trim()) return booths;

  const lowerKeyword = keyword.toLowerCase().trim();

  return booths.filter((booth) => {
    // 如果搜索类型是档口，则搜索档口相关信息
    if (searchType === "booth") {
      // 搜索档口名
      if (booth.title?.toLowerCase().includes(lowerKeyword)) return true;

      // 搜索主营业务
      if (
        booth.main_business?.some((business) =>
          business.toLowerCase().includes(lowerKeyword)
        )
      )
        return true;

      // 搜索联系方式
      if (booth.phone?.includes(lowerKeyword)) return true;
      if (booth.wx?.toLowerCase().includes(lowerKeyword)) return true;
      if (booth.qq?.includes(lowerKeyword)) return true;

      // 搜索地址
      if (booth.address?.toLowerCase().includes(lowerKeyword)) return true;

      // 搜索档口号
      if (booth.booth?.toLowerCase().includes(lowerKeyword)) return true;

      // 搜索市场
      if (booth.market?.toLowerCase().includes(lowerKeyword)) return true;
    }

    // 如果搜索类型是商品，这里可以扩展商品搜索逻辑
    // 目前暂时也搜索主营业务
    if (searchType === "goods") {
      if (
        booth.main_business?.some((business) =>
          business.toLowerCase().includes(lowerKeyword)
        )
      )
        return true;
    }

    return false;
  });
};

export const BoothList = ({ page, keyword, searchType }: BoothListProps) => {
  // 防御性处理，确保 page 是有效正整数
  const validPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;

  // 原始数据
  const allBooths = boothsData as Booth[];

  // 应用搜索过滤
  const filteredBooths =
    keyword && searchType
      ? filterBooths(allBooths, keyword, searchType)
      : allBooths;

  const total = filteredBooths.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.max(1, Math.min(validPage, totalPages));
  const start = (safePage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageData = filteredBooths.slice(start, end);

  return (
    <div>
      {/* 搜索结果信息 */}
      {keyword && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700">
            搜索 {keyword} 找到 {total} 个档口
            {total === 0 && (
              <span className="text-gray-600 ml-2">
                试试修改关键词或搜索其他内容
              </span>
            )}
          </p>
        </div>
      )}

      {/* 档口列表 */}
      {pageData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {pageData.map((booth) => (
            <BoothCard key={booth.id} booth={booth} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">暂无符合条件的档口</p>
          <p className="text-gray-400 text-sm mt-2">
            {keyword ? "请尝试其他搜索关键词" : "暂无档口数据"}
          </p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 relative">
          <PaginationBar currentPage={safePage} totalPages={totalPages} />
          <span className="text-gray-600 text-sm absolute right-0 flex gap-0 sm:gap-1">
            <span>第</span>
            <span>{safePage}</span>
            <span>/</span>
            <span>{totalPages}</span>
            <span>页</span>
          </span>
        </div>
      )}
    </div>
  );
};
