import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

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
      // (未來如果您有其他圖片網域，例如 S3，也可以加在這裡)
    ],
  },
};

export default nextConfig;