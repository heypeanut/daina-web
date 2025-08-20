import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  searchProductsByImageBase64,
  type ImageSearchOptions,
} from "@/lib/api/upload-search";
import { IMAGE_SEARCH_MIN_SIMILARITY } from "@/lib/constants/search";
import { compressImage } from "@/lib/utils/image-compress";

export interface UseImageSearchOptions {
  variant?: "home" | "market" | "search" | "booth" | "booth-detail";
  boothId?: string;
}

// 搜索状态的key
const SEARCH_STATE_KEY = "imageSearchState";

export const useImageSearch = (options: UseImageSearchOptions = {}) => {
  const navigate = useNavigate();
  const { variant, boothId } = options;

  const handleImageSearch = async (file: File) => {
    try {
      // 显示加载提示
      toast.loading("正在搜索中...", { id: "image-search" });

      // 压缩图片
      const base64Image = await compressImage(file);
      console.log(
        "[ImageSearch] 图片压缩完成，原始大小:",
        (file.size / 1024).toFixed(1) + "KB",
        "压缩后:",
        (base64Image.length / 1024).toFixed(1) + "KB"
      );

      // 立即保存搜索状态到localStorage，防止页面刷新丢失
      const searchState = {
        isSearching: true,
        image: base64Image,
        variant,
        boothId,
        timestamp: Date.now(),
      };
      localStorage.setItem(SEARCH_STATE_KEY, JSON.stringify(searchState));

      // 设置搜索选项
      const searchOptions: ImageSearchOptions = {
        limit: 20,
        minSimilarity: IMAGE_SEARCH_MIN_SIMILARITY,
      };

      // 如果是档口详情页，限制搜索范围
      if (variant === "booth-detail" && boothId) {
        searchOptions.boothId = boothId;
      }

      // 执行搜索
      const result = await searchProductsByImageBase64(
        base64Image,
        searchOptions
      );

      // 清除搜索状态
      localStorage.removeItem(SEARCH_STATE_KEY);

      toast.dismiss("image-search");

      // 将搜索结果保存到sessionStorage，传递给结果页面
      sessionStorage.setItem(
        "imageSearchResults",
        JSON.stringify(result || { rows: [], total: 0 })
      );
      sessionStorage.setItem("searchImage", base64Image);

      // 如果有boothId，也保存到sessionStorage
      if (variant === "booth-detail" && boothId) {
        sessionStorage.setItem("searchBoothId", boothId);
      } else {
        sessionStorage.removeItem("searchBoothId");
      }

      // 无论有没有结果都跳转到结果页面
      navigate("/search/results?type=image-product");
    } catch (error) {
      // 清除搜索状态
      localStorage.removeItem(SEARCH_STATE_KEY);

      toast.dismiss("image-search");
      console.error("[ImageSearch] 图片处理或搜索失败:", error);
      toast.error("搜索失败，请重试");
    }
  };

  return { handleImageSearch };
};

// 检查是否有未完成的搜索状态的工具函数
export const checkPendingImageSearch = () => {
  const savedState = localStorage.getItem(SEARCH_STATE_KEY);
  if (savedState) {
    try {
      const state = JSON.parse(savedState);
      // 检查是否是最近的搜索（5分钟内）
      if (Date.now() - state.timestamp < 5 * 60 * 1000) {
        return state;
      } else {
        // 过期的状态，清除
        localStorage.removeItem(SEARCH_STATE_KEY);
      }
    } catch (error) {
      console.error("解析搜索状态失败:", error);
      localStorage.removeItem(SEARCH_STATE_KEY);
    }
  }
  return null;
};
