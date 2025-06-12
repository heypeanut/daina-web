"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// const options = [
//   { label: "商品", value: "goods" },
//   { label: "档口", value: "booth" },
// ];

export const SearchBar: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchType, setSearchType] = useState("booth");
  const [inputValue, setInputValue] = useState("");

  // 从URL参数初始化搜索状态
  useEffect(() => {
    if (searchParams) {
      const keyword = searchParams.get("keyword") || "";
      const type = searchParams.get("type") || "booth";
      setInputValue(keyword);
      setSearchType(type);
    }
  }, [searchParams]);

  // 处理搜索逻辑
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams?.toString() || "");

    if (inputValue.trim()) {
      params.set("keyword", inputValue.trim());
      params.set("type", searchType);
    } else {
      params.delete("keyword");
      params.delete("type");
    }

    // 搜索时重置页码
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  // 清空搜索
  const handleClear = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.delete("keyword");
    params.delete("type");
    params.delete("page");

    setInputValue("");

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <form
        className="w-full max-w-3xl flex items-center bg-white/80 rounded-xl px-3 pr-1 py-1 shadow border-2 border-[#0040f0] h-10 sm:h-auto"
        onSubmit={handleSearch}
      >
        {/* <Select value={searchType} onValueChange={setSearchType}>
        <SelectTrigger className="bg-transparent text-base text-gray-700 px-0 py-0 outline-none border-none cursor-pointer rounded-xl w-auto h-auto min-h-0 shadow-none focus:ring-0 focus:outline-none focus:border-none flex items-center">
          <SelectValue>
            {options.find((o) => o.value === searchType)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="min-w-[60px] w-auto">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="text-base bg-transparent hover:bg-transparent focus:bg-transparent"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
        <Input
          placeholder="请输入档口名、主营、联系方式..."
          className="flex-1 bg-transparent border-none focus:ring-0 focus:outline-none text-base sm:text-base text-sm px-2 placeholder:text-gray-400 h-8 sm:h-10"
          style={{ boxShadow: "none" }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {inputValue && (
          <Button
            type="button"
            onClick={handleClear}
            className="ml-2 px-3 py-1 sm:px-4 sm:py-2 bg-[#ff2e16] text-white rounded-xl cursor-pointer font-semibold text-xs sm:text-base hover:bg-[#d92610] transition-colors h-8 sm:h-10"
            style={{ boxShadow: "none" }}
          >
            清空
          </Button>
        )}
        <Button
          type="submit"
          className="ml-2 px-5 py-1 sm:px-8 sm:py-2 bg-[#0040f0] text-white rounded-xl cursor-pointer font-semibold text-xs sm:text-base hover:bg-[#0030b0] transition-colors h-8 sm:h-10"
          style={{ boxShadow: "none" }}
        >
          搜索
        </Button>
      </form>
    </Suspense>
  );
};
