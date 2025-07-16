/**
 * 用户行为相关API封装
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export type BehaviorType = "view" | "click" | "favorite" | "share";
export type TargetType = "booth" | "product" | "banner";

export interface BehaviorData {
  userId: number;
  behaviorType: BehaviorType;
  targetType: TargetType;
  targetId: string;
  sessionId?: string;
  metadata?: {
    source?: string;
    position?: number;
    algorithm?: string;
    [key: string]: unknown;
  };
}

/**
 * 用户行为API
 */
export const behaviorApi = {
  /**
   * 记录用户行为
   */
  recordBehavior: async (data: BehaviorData): Promise<void> => {
    try {
      await fetch(`${BASE_URL}/api/behavior/record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("记录行为失败:", error);
    }
  },

  /**
   * 获取热门内容
   */
  getPopular: async (
    targetType: TargetType,
    days: number = 7,
    limit: number = 10
  ): Promise<unknown> => {
    const url = `${BASE_URL}/api/behavior/popular/${targetType}?days=${days}&limit=${limit}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch popular ${targetType}s`);
    }
    const data = await response.json();
    return data.data;
  },
};
