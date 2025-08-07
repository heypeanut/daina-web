// 搜索相关hooks导出
export {
  useProductSearch,
  useInfiniteProductSearch,
  PRODUCT_SEARCH_QUERY_KEYS,
} from "./useProductSearch";

export {
  useBoothSearch,
  useInfiniteBoothSearch,
  BOOTH_SEARCH_QUERY_KEYS,
} from "./useBoothSearch";

export {
  useInfiniteImageProductSearch,
  useInfiniteImageBoothSearch,
} from "./useImageSearch";

// 搜索相关类型重导出
export type {
  ProductSearchParams,
  BoothSearchParams,
  ProductSearchResponse,
  BoothSearchResponse,
} from "@/lib/api/search";