import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	async rewrites() {
		return [
			{
				// 將所有 /api/ 開頭的請求代理到後端伺服器
				source: '/api/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`,
			},
			// 👇 [新增] 攔截所有 /uploads/ 的圖片請求，轉發到雲端後端
			{
				source: '/uploads/:path*',
				destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/:path*`,
			},
		];
	},

	images: {
		// Next.js 16 (Turbopack) 必須使用 remotePatterns
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'images.pexels.com',
			},
			{
				protocol: 'https',
				hostname: 'picsum.photos',
			},
			// 👇 [新增] 允許您的 Google Cloud Run 網域，避免 Next.js <Image /> 元件報錯
			{
				protocol: 'https',
				hostname: 'new-linkup-30337976958.asia-east1.run.app',
			},
		],
	},
};

export default nextConfig;
