/** @type {import('tailwindcss').Config} */
module.exports = {
  // 這是讓 Tailwind 知道要去掃描哪些檔案以生成 CSS
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  // 這是解決 lab() 顏色問題的關鍵設定
  future: {
    respectDefaultRingColor: true,
  },
  plugins: [],
};