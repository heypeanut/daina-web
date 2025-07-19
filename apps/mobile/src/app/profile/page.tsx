import React from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Footer } from "@/components/layout/Footer";
import {
  ProfileHeader,
  QuickActions,
  ServiceSection,
} from "@/components/profile";

export default function ProfilePage() {
  return (
    <MobileLayout>
      <div className="min-h-full bg-gray-50">
        {/* 用户头部信息 */}
        <ProfileHeader />

        {/* 快捷功能区域 */}
        <QuickActions />

        {/* 我的服务 */}
        <ServiceSection />
      </div>
      <Footer />
    </MobileLayout>
  );
}
