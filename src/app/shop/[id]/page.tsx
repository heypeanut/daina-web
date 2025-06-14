"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ShopSidebar from "../../../components/booth/ShopSidebar";
import ShopMainInfo from "../../../components/booth/ShopMainInfo";
import { ShopDetailSkeleton } from "@/components/booth/ShopDetailSkeleton";
import { Booth } from "@/types/booth";
import { AlertCircle } from "lucide-react";

export default function ShopDetail() {
  const params = useParams();
  const id = params?.id as string;
  const [booth, setBooth] = useState<Booth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/52hqb_booths_puppeteer.json")
      .then((res) => res.json())
      .then((data: Booth[]) => {
        const found = data.find((item) => String(item.id) === String(id));
        setBooth(found || null);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ShopDetailSkeleton />;
  if (!booth)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="card-glass p-8 max-w-md rounded-2xl">
          <AlertCircle className="mx-auto mb-4 size-16 text-[#ff2e16]" />
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            未找到该档口
          </h2>
          <p className="text-gray-600 mb-6">
            抱歉，我们无法找到ID为&ldquo;{id}&rdquo;的档口信息
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-[#0040f0] text-white font-medium rounded-xl transition-all hover:bg-[#0030b8]"
          >
            返回首页
          </Link>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] gap-4">
      <ShopSidebar booth={booth} />
      <ShopMainInfo booth={booth} />
    </div>
  );
}
