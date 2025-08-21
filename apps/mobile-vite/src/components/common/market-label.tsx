import { useDictMap } from "@/hooks/api/useDictionary";
import { DictType } from "@/types/dictionary";
import { translateDictValue } from "@/utils/dictionary";

interface MarketLabelProps {
  /** 市场字段的原始值 */
  market?: string;
  /** 自定义类名 */
  className?: string;
  /** 当market为空时的默认显示文本 */
  fallback?: string;
  /** 是否显示加载状态 */
  showLoading?: boolean;
}

/**
 * 市场标签组件 - 统一处理市场字段的翻译和显示
 *
 * @example
 * <MarketLabel market="huaqiangbei" fallback="华强北" />
 */
export function MarketLabel({
  market,
  className = "",
  fallback = "批发市场",
  showLoading = false,
}: MarketLabelProps) {
  const marketDictMap = useDictMap(DictType.MARKET);

  // 如果没有market值，显示fallback
  if (!market) {
    return <span className={className}>{fallback}</span>;
  }

  // 翻译市场字段
  const translatedMarket = translateDictValue(market, marketDictMap);

  // 如果显示加载状态且字典还在加载中
  if (showLoading && !marketDictMap) {
    return <span className={className}>加载中...</span>;
  }

  return <span className={className}>{translatedMarket}</span>;
}
