// 假設這個 layout.tsx 檔案是 page.tsx 的父層，並且沒有使用 "use client"
// app/.../admin/daily-subscribers/layout.tsx (Server Component)

import React from 'react';
import type { Metadata } from 'next';

// ✅ 在 Server Component (Layout) 中導出 metadata 是正確的做法
export const metadata: Metadata = {
  title: '【即時】訂閱人數觀察儀表板',
  description: '使用 Next.js/TSX 和 Tailwind CSS 製作的即時訂閱人數觀察頁面。',
};

// 佈局組件定義
export default function DailySubscribersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // 這裡可以定義共用佈局，如果沒有就直接返回 children
}