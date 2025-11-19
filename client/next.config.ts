import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // [保留] 原本的圖片設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '**',
      },
    ],
  },

  // [!!! 新增 !!!]
  // 解決 "Cross origin request detected" 警告
  // 允許來自您手機或區網 IP 的連線請求
  experimental: {
    allowedDevOrigins: [
      'localhost:3000', 
      '192.168.1.189:3000', // 加入您的 IP
    ],
  },
};

export default nextConfig;