export const metadata = {
  title: "代拿网 - PC版",
  description: "为您提供优质的代拿服务",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
