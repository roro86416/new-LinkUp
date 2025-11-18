'use client';

import { usePathname } from 'next/navigation';
// [!] 1. 修正 Header 匯入路徑 (現在是 './Header')
import Header from '../Header'; 

export default function HeaderWrapper() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    // [!!!] 2. 關鍵修正
    // 加上 "sticky" 和 "top-0" 讓它滾動時黏在頂部
    // 加上 "z-50" 確保它在所有內容之上
    <div className={`sticky top-0 z-50 ${!isHome ? 'mb-12' : ''}`}>
      <Header />
    </div>
  );
}