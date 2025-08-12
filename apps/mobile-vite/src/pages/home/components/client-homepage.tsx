import { ClientSearchBar } from "./client-search-bar";
// import { ClientQuickActions } from "./ClientQuickActions";
import { HybridBanner } from "./hybrid-banner";
import { RankingBooths } from "./ranking-booths";
import { StaticBooths } from "./static-booths";
import { InfiniteBoothsWithNewProducts } from "./infinite-booths-with-new-products";
import { useBanners, useBehaviorTracking } from "@/hooks/use-api";
import type { Banner } from "@/types/api";

export function ClientHomepage() {
  const { banners, loading: bannersLoading } = useBanners(5);
  const { recordBehavior } = useBehaviorTracking();

  const handleBannerClick = (banner: Banner) => {
    recordBehavior("click", "banner", banner.id.toString(), {
      source: "homepage",
      linkUrl: banner.linkUrl,
      linkType: banner.linkType,
    });
  };

  return (
    <div className="mobile-homepage">
      {/* 顶部整体渐变背景区域 */}
      <div className="relative">
        {/* 大渐变背景 */}
        <div className="absolute inset-0">
          {/* 水平渐变层 */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500" />
          {/* 垂直透明渐变层 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />
        </div>

        {/* 搜索栏 - 固定在顶部 */}
        <ClientSearchBar />

        {/* 主要内容区域 - 为固定搜索栏留出空间 */}
        <div className="pt-14 relative z-10">
          {/* 轮播图 - 混合渲染 */}
          {!bannersLoading && banners.length > 0 && (
            <HybridBanner banners={banners} onBannerClick={handleBannerClick} />
          )}

          {/* 快捷功能入口 - 客户端组件 */}
          {/* <ClientQuickActions /> */}
        </div>
      </div>

      {/* 白色背景的内容区域 */}
      <div className="bg-white pt-4">
        {/* 档口排行榜 - 横向滑动显示 */}
        <RankingBooths title="优质商家" limit={25} />

        {/* 最新档口 - 静态显示，不滚动加载 */}
        <StaticBooths title="最新档口" type="booth_new" limit={10} />

        {/* 近期上新 - 无限滚动 */}
        <InfiniteBoothsWithNewProducts title="近期上新" />
      </div>
    </div>
  );
}