"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ShopSidebar from "../../../components/booth/ShopSidebar";
import ShopMainInfo from "../../../components/booth/ShopMainInfo";
import { Booth } from "@/types/booth";

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

  if (loading) return <div>加载中...</div>;
  if (!booth) return <div>未找到该档口</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-[600px] gap-4">
      <ShopSidebar booth={booth} />
      <ShopMainInfo booth={booth} />
    </div>
  );
}
