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

  // [!!!] 
  // [!!!] 關鍵修正：
  // [!!!] 告訴 Next.js 允許 (whitelist) 來自這個網域的圖片
  // [!!!] 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com", // 有些 unsplash 也從這送
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", 
      },

      // (未來如果您有其他圖片網域，例如 S3，也可以加在這裡)
    ],
  },
};

export default nextConfig;