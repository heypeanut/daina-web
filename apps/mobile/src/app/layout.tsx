import './globals.css';
import { QueryProvider } from '@/lib/react-query/provider';
import { Toaster } from "sonner";

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
        <Toaster
          position="bottom-center"
          toastOptions={{
            className:
              "bg-[#0040f0]/80 text-white shadow-xl rounded-xl border border-white/30 backdrop-blur-md transition-colors duration-200 hover:bg-[#0030b8]/90",
            style: {
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.18)",
              border: "1.5px solid rgba(255,255,255,0.28)",
            },
          }}
        />
      </body>
    </html>
  );
}
