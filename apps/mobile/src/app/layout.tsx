import './globals.css';
import { QueryProvider } from '@/lib/react-query/provider';
import { Toaster } from "ui";

export const metadata = {
  title: "代拿网 - 移动版",
  description: "档口批发代发平台，为您提供优质的代拿服务",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
