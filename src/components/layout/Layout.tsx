import React, { Suspense } from "react";
import { Header } from "./Header";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>加载中...</div>}>
        <Header />
        <main className="flex-1 w-full max-w-[1400px] mx-auto p-4">
          {children}
        </main>
      </Suspense>
    </div>
  );
};
