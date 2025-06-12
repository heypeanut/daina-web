import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.goooy.cn",
      },
      {
        protocol: "https",
        hostname: "www.52dsy.com",
      },
      {
        protocol: "https",
        hostname: "img.ios.goooy.cn",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // 关键：忽略类型报错
  },
};

export default nextConfig;
