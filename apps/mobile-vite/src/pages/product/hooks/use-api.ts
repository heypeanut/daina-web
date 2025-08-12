import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "@/lib/api/booth";

export function useGetProductDetail(productId: string) {
  const data = useQuery({
    queryKey: ['product-detail', productId],
    queryFn: () => getProductDetail(productId),
    select: (data) => data
  });
  return data
}
