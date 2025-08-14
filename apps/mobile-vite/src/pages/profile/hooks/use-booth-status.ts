import { useQuery } from "@tanstack/react-query";
import { getUserBoothStatus } from "@/lib/api/booth";
import { isLoggedIn } from "@/lib/auth";
import type { UserBoothStatus } from "@/types/booth";

/**
 * 档口状态查询Hook
 */
export function useBoothStatus() {
  return useQuery<UserBoothStatus, Error>({
    queryKey: ["user-booth-status"],
    queryFn: async () => {
      return await getUserBoothStatus();
    },
    staleTime: 5 * 60 * 1000, // 5分钟缓存
    gcTime: 10 * 60 * 1000, // 10分钟垃圾回收
    retry: 2,
    refetchOnWindowFocus: false,
    // 只有在用户登录时才启用查询
    enabled: isLoggedIn(),
  });
}

/**
 * 根据档口状态获取按钮文本
 */
export function getBoothButtonText(boothStatus: UserBoothStatus | undefined): string {
  if (!boothStatus) {
    return "开通档口";
  }

  // 无档口
  if (boothStatus.totalBooths === 0) {
    return "开通档口";
  }

  // 只有一个档口且在审核中
  if (boothStatus.totalBooths === 1 && boothStatus.hasPendingBooths && !boothStatus.hasActiveBooths) {
    return "审核中";
  }

  // 只有一个档口且通过了
  if (boothStatus.totalBooths === 1 && boothStatus.hasActiveBooths) {
    return "档口管理";
  }

  // 有多个档口
  if (boothStatus.totalBooths > 1) {
    return "档口管理";
  }

  // 只有被拒绝的档口
  if (boothStatus.hasRejectedBooths && !boothStatus.hasActiveBooths && !boothStatus.hasPendingBooths) {
    return "重新申请";
  }

  return "开通档口";
}

/**
 * 根据档口状态获取描述文本
 */
export function getBoothButtonDescription(boothStatus: UserBoothStatus | undefined): string {
  if (!boothStatus) {
    return "立即申请开通档口，开启您的生意之路";
  }

  // 无档口
  if (boothStatus.totalBooths === 0) {
    return "立即申请开通档口，开启您的生意之路";
  }

  // 只有一个档口且在审核中
  if (boothStatus.totalBooths === 1 && boothStatus.hasPendingBooths && !boothStatus.hasActiveBooths) {
    const pendingBooth = boothStatus.booths.find(booth => booth.status === "pending");
    return `申请审核中：${pendingBooth?.boothName || "您的档口"}`;
  }

  // 只有一个档口且通过了
  if (boothStatus.totalBooths === 1 && boothStatus.hasActiveBooths) {
    const activeBooth = boothStatus.booths.find(booth => booth.status === "active");
    return `管理您的档口：${activeBooth?.boothName || "您的档口"}`;
  }

  // 有多个档口
  if (boothStatus.totalBooths > 1) {
    const statusParts = [];
    if (boothStatus.hasActiveBooths) {
      statusParts.push(`${boothStatus.activeBoothsCount}个通过审核的档口`);
    }
    if (boothStatus.hasPendingBooths) {
      statusParts.push(`${boothStatus.pendingBoothsCount}个待审核档口`);
    }
    return `您有${statusParts.join("，")}`;
  }

  // 只有被拒绝的档口
  if (boothStatus.hasRejectedBooths && !boothStatus.hasActiveBooths && !boothStatus.hasPendingBooths) {
    return "申请被拒绝，可重新申请";
  }

  return "立即申请开通档口，开启您的生意之路";
}

/**
 * 根据档口状态获取跳转路径
 */
export function getBoothNavigationPath(boothStatus: UserBoothStatus | undefined): string {
  if (!boothStatus) {
    return "/booth/apply";
  }

  // 无档口
  if (boothStatus.totalBooths === 0) {
    return "/booth/apply";
  }

  // 只有一个档口且在审核中
  if (boothStatus.totalBooths === 1 && boothStatus.hasPendingBooths && !boothStatus.hasActiveBooths) {
    // 可以跳转到状态查看页面，或者档口选择页面
    return "/booth/select";
  }

  // 只有一个档口且通过了，或者有多个档口
  if (boothStatus.hasActiveBooths || boothStatus.totalBooths > 1) {
    return "/booth/management";
  }

  // 只有被拒绝的档口
  if (boothStatus.hasRejectedBooths && !boothStatus.hasActiveBooths && !boothStatus.hasPendingBooths) {
    return "/booth/apply";
  }

  return "/booth/apply";
}
