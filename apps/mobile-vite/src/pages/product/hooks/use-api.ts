import { useQuery } from "@tanstack/react-query";
import { getProductDetail, getProductDetailForOwner } from "@/lib/api/booth";
import { useSearchParams } from "react-router-dom";

export function useGetProductDetail(productId: string) {
  const [searchParams] = useSearchParams();
  
  // 判断是否来自档口管理页面
  const isFromBoothManagement = searchParams.get('from') === 'booth-management';
  
  const data = useQuery({
    queryKey: ['product-detail', productId, isFromBoothManagement ? 'owner' : 'public'],
    queryFn: () => {
      // 如果来自档口管理，使用档口所有者API，否则使用普通API
      return isFromBoothManagement 
        ? getProductDetailForOwner(productId)
        : getProductDetail(productId);
    },
    select: (data) => data
  });
  return data
}
