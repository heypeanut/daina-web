import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MobileLayout } from "@/components/layout";
import { X } from "lucide-react";
import { UnifiedSearchBar } from "@/components/common";

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [productKeyword, setProductKeyword] = useState("");
  const [boothKeyword, setBoothKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"product" | "booth">("product");
  const [boothIdParam, setBoothIdParam] = useState("");
  const [currentBoothInfo, setCurrentBoothInfo] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    // 从URL参数获取初始搜索词和档口信息
    const q = searchParams.get("q");
    const type = searchParams.get("type");
    const boothIdFromUrl = searchParams.get("boothId");
    const boothNameFromUrl = searchParams.get("boothName");

    // 设置档口信息（用于档口内搜索）
    if (boothIdFromUrl) {
      setBoothIdParam(boothIdFromUrl);
      setCurrentBoothInfo({
        id: boothIdFromUrl,
        name: boothNameFromUrl || "档口",
      }); // 这里可以后续从API获取档口名称
      setActiveTab("product"); // 档口内搜索固定为商品搜索
    } else {
      setBoothIdParam("");
      setCurrentBoothInfo(null);
    }

    if (q) {
      if (type === "booth" && !boothIdFromUrl) {
        setBoothKeyword(q);
        setActiveTab("booth");
      } else {
        setProductKeyword(q);
        setActiveTab("product");
      }
    } else if (type === "booth" && !boothIdFromUrl) {
      setActiveTab("booth");
    }

    // 加载搜索历史
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, [searchParams]);

  const handleSearch = (keyword?: string) => {
    const currentKeyword =
      keyword || (activeTab === "product" ? productKeyword : boothKeyword);
    if (currentKeyword.trim()) {
      // 保存到搜索历史
      const newHistory = [
        currentKeyword.trim(),
        ...searchHistory.filter((item) => item !== currentKeyword.trim()),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      // 构建搜索URL
      let searchUrl = `/search/results?type=${activeTab}&q=${encodeURIComponent(
        currentKeyword.trim()
      )}`;

      // 如果是档口内搜索，添加boothId参数
      if (boothIdParam && activeTab === "product") {
        searchUrl += `&boothId=${boothIdParam}`;
      }

      // 执行搜索逻辑
      console.log(
        `搜索${activeTab === "product" ? "商品" : "档口"}:`,
        currentKeyword.trim()
      );
      if (boothIdParam && activeTab === "product") {
        console.log(`在档口 ${boothIdParam} 内搜索商品`);
      }

      navigate(searchUrl);
    }
  };

  const handleHistoryClick = (item: string) => {
    if (activeTab === "product") {
      setProductKeyword(item);
    } else {
      setBoothKeyword(item);
    }
    handleSearch(item);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };

  const removeHistoryItem = (item: string) => {
    const newHistory = searchHistory.filter((h) => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem("searchHistory", JSON.stringify(newHistory));
  };

  const handleImageSearch = () => {
    // 获取当前选中的标签页类型
    const searchType =
      boothIdParam || activeTab === "product" ? "product" : "booth";
    navigate(`/search/image?searchType=${searchType}`);
  };

  // 计算当前搜索关键词和占位符
  const currentKeyword =
    boothIdParam || activeTab === "product" ? productKeyword : boothKeyword;
  const currentPlaceholder = boothIdParam
    ? `在 ${currentBoothInfo?.name || "档口"} 内搜索商品...`
    : activeTab === "product"
    ? "搜索商品关键字或货号"
    : "搜索档口名称";

  // 处理搜索输入变化
  const handleKeywordChange = (value: string) => {
    if (boothIdParam || activeTab === "product") {
      setProductKeyword(value);
    } else {
      setBoothKeyword(value);
    }
  };

  // 处理清除搜索
  const handleClearKeyword = () => {
    if (boothIdParam || activeTab === "product") {
      setProductKeyword("");
    } else {
      setBoothKeyword("");
    }
  };

  return (
    <MobileLayout showTabBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索栏 - 使用UnifiedSearchBar */}
        <UnifiedSearchBar
          variant="search"
          showBack={true}
          onBackClick={() => navigate(-1)}
          value={currentKeyword}
          onChange={handleKeywordChange}
          onSearch={handleSearch}
          placeholder={currentPlaceholder}
          showCamera={true}
          onCameraClick={handleImageSearch}
          showClearButton={true}
          onClear={handleClearKeyword}
          className="fixed top-0 left-0 right-0 z-50"
        />

        {/* 搜索内容 */}
        <div className="pt-16 bg-white">
          {/* 档口内搜索提示信息 */}
          {boothIdParam && currentBoothInfo && (
            <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center justify-center">
                <span className="text-sm text-orange-700">
                  正在{" "}
                  <span className="font-medium">"{currentBoothInfo.name}"</span>{" "}
                  档口内搜索商品
                </span>
              </div>
            </div>
          )}

          {/* 搜索类型切换 - 档口内搜索时隐藏 */}
          {!boothIdParam && (
            <div className="p-4">
              <div className="flex bg-gray-100 rounded-full p-1">
                <button
                  onClick={() => setActiveTab("product")}
                  className={`flex-1 py-2.5 text-center text-sm font-medium rounded-full transition-all duration-200 ${
                    activeTab === "product"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  商品搜索
                </button>
                <button
                  onClick={() => setActiveTab("booth")}
                  className={`flex-1 py-2.5 text-center text-sm font-medium rounded-full transition-all duration-200 ${
                    activeTab === "booth"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  档口搜索
                </button>
              </div>
            </div>
          )}

          {/* 搜索历史 */}
          {searchHistory.length > 0 && (
            <div className="p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium text-gray-900">
                  搜索历史
                </h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  清空全部
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {searchHistory.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-center bg-gray-50 hover:bg-gray-100 rounded-full border border-gray-100 transition-all duration-200"
                  >
                    <button
                      onClick={() => handleHistoryClick(item)}
                      className="flex-1 px-4 py-2.5 text-sm text-gray-700 font-medium"
                    >
                      {item}
                    </button>
                    <button
                      onClick={() => removeHistoryItem(item)}
                      className="w-8 h-8 mr-1 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
