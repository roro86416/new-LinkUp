// new-LinkUp/client/src/app/HeaderWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import Header from '../components/Header';

export default function HeaderWrapper() {
  const pathname = usePathname();
  
  const isHome = pathname === '/';
  const isEventPage = pathname.startsWith('/event/');
  const isCheckoutPage = pathname.startsWith('/checkout');

  if (pathname === '/admin/login') {
    return null;
  }

  // 修正邏輯：首頁 OR 活動頁 OR 結帳頁，都不顯示預設佔位 div
  const shouldHideSpacer = isHome || isEventPage || isCheckoutPage;

  return (
    <>
      <Header />
      {!shouldHideSpacer && <div className="h-20" />}
    </>
  );
}