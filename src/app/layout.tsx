import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Layout } from "@/components/layout/Layout";
import { Toaster } from "sonner";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "代拿网",
  description: "代拿网, 华强北拿货, 拿货网, 华强北拿货网, 华强北代拿网",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="antialiased">
        <Layout>{children}</Layout>
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
