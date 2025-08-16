// 搜索相关hooks导出
export {
  useProductSearch,
  useInfiniteProductSearch,
  PRODUCT_SEARCH_QUERY_KEYS,
  type ProductSearchParams,
  type ProductSearchResponse,
} from "./useProductSearch";

export {
  useBoothSearch,
  useInfiniteBoothSearch,
  BOOTH_SEARCH_QUERY_KEYS,
  type BoothSearchParams,
  type BoothSearchResponse,
} from "./useBoothSearch";

export {
  useInfiniteImageProductSearch,
  useInfiniteImageBoothSearch,
} from "./useImageSearch";