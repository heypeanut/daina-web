import { useQuery } from "@tanstack/react-query";
import { getProductDetailForOwner } from "@/lib/api/booth";

export function useGetProductDetailForOwner(productId: string) {
  const data = useQuery({
    queryKey: ['product-detail-owner', productId],
    queryFn: () => getProductDetailForOwner(productId),
    select: (data) => data
  });
  return data
}
