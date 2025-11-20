import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // 將所有 /api/ 開頭的請求代理到後端伺服器
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ];
  },

  images: {
    // Next.js 16 (Turbopack) 必須使用 remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // 👇 [新增] 允許 Pexels 圖片 (您的錯誤來源)
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      // 👇 [建議] 允許 Picsum 圖片 (如果您有用假資料產生器通常會用到)
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;