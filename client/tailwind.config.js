/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  future: {
    respectDefaultRingColor: true,
  },
  // [修正] 加入 tailwindcss-animate
  plugins: [
    require("tailwindcss-animate"),
  ],
};