import React from "react";
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Footer } from '@/components/layout/Footer';

export default function ProfilePage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">我的</h1>
        <p className="text-gray-600">
          个人中心，登录后显示个性化推荐内容
        </p>
      </div>
      <Footer />
    </MobileLayout>
  );
}