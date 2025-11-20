// new-LinkUp/client/src/app/(shop)/layout.tsx
import React from 'react';
// 注意：Header 和 Footer 已經在 RootLayout 中處理，這裡我們專注於內容區域
// 為了避免 Header 遮擋，我們需要足夠的 padding-top (pt-28)
// 為了美觀，我們設定背景為淡灰色 (bg-slate-50)

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}