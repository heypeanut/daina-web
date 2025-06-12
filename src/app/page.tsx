import { Suspense } from "react";
import { BoothList } from "@/components/booth/BoothList";

interface PageProps {
  searchParams: { page?: string; keyword?: string; type?: string };
}

export default function Home({ searchParams }: PageProps) {
  const page = Number(searchParams.page) > 0 ? Number(searchParams.page) : 1;
  const keyword = searchParams.keyword || "";
  const searchType = searchParams.type || "booth";

  // 动态标题
  const title = keyword ? `搜索结果 - ${keyword}` : "档口列表";

  return (
    <div className="min-h-screen w-full py-2">
      <h1 className="text-lg sm:text-2xl font-bold mb-4">{title}</h1>
      <Suspense fallback={null}>
        <BoothList page={page} keyword={keyword} searchType={searchType} />
      </Suspense>
    </div>
  );
}
