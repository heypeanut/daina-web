import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  submitBoothApplication, 
  getBoothEditInfo, 
  updateBoothInfo,
} from "@/lib/api/booth";
import type { 
  BoothApplicationForm, 
  BoothApplicationResponse, 
  BoothEditInfo, 
  BoothEditForm
} from "@/types/booth";

/**
 * 档口入驻申请Hook
 * 参考home页use-api.ts的规范实现
 */
export function useBoothApplication() {
  const queryClient = useQueryClient();

  return useMutation<BoothApplicationResponse, Error, BoothApplicationForm>({
    mutationFn: async (formData: BoothApplicationForm) => {
      return await submitBoothApplication(formData);
    },
    onSuccess: (data) => {
      console.log("档口申请提交成功:", data);
      // 可以在这里做一些成功后的处理
      // 比如清除相关缓存、更新用户状态等
      queryClient.invalidateQueries({ queryKey: ["user-booth-status"] });
    },
    onError: (error) => {
      console.error("档口申请提交失败:", error);
    },
  });
}

/**
 * 获取档口编辑信息Hook
 */
export function useBoothEditInfo(boothId: string) {
  return useQuery<BoothEditInfo, Error>({
    queryKey: ["booth-edit-info", boothId],
    queryFn: async () => await getBoothEditInfo(boothId),
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    gcTime: 10 * 60 * 1000, // 10分钟垃圾回收
    retry: 2,
    refetchOnWindowFocus: false,
    enabled: !!boothId, // 只有在有boothId时才启用查询
  });
}

/**
 * 更新档口信息Hook
 */
export function useBoothUpdate() {
  const queryClient = useQueryClient();

  return useMutation<BoothApplicationResponse, Error, { boothId: string; formData: BoothEditForm }>({
    mutationFn: async ({ boothId, formData }) => {
      return await updateBoothInfo(boothId, formData);
    },
    onSuccess: (data, { boothId }) => {
      console.log("档口信息更新成功:", data);
      // 刷新相关缓存
      queryClient.invalidateQueries({ queryKey: ["booth-edit-info", boothId] });
      queryClient.invalidateQueries({ queryKey: ["user-booth-status"] });
      queryClient.invalidateQueries({ queryKey: ["booth-management-info", boothId] });
    },
    onError: (error) => {
      console.error("档口信息更新失败:", error);
    },
  });
}


