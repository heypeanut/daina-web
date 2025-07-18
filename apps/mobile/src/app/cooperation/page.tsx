import React from "react";
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Footer } from '@/components/layout/Footer';

export default function CooperationPage() {
  return (
    <MobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">商务合作</h1>
        <p className="text-gray-600">
          批发代发合作、招商加盟等商务合作内容
        </p>
      </div>
      <Footer />
    </MobileLayout>
  );
}