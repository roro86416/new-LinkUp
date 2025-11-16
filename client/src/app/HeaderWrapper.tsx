'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // 如果是後台登入頁面，不渲染 Header
  if (pathname === '/admin/login') {
    return null;
  }

  // ⭐️ 修正：
  // 1. 在非首頁時，動態加入一個與 Header 等高的 div (h-16 約 64px) 來推開下方內容。
  // 2. 在首頁時，不加入這個 div，讓 Header 直接疊在 Banner 上。
  return (
    <>
      <Header />
      {!isHome && <div className="h-16" />}
    </>
  );
}
