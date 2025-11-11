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

  return (
    <div className={!isHome ? 'mb-16' : ''}>
      <Header />
    </div>
  );
}
