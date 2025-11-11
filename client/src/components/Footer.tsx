'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // 如果是後台登入頁面，不渲染 Footer
  if (pathname === '/admin/login') {
    return null;
  }
  return (
    <footer className="w-full py-6 bg-black text-white text-center z-10">
      © 2025 LINKUP. All rights reserved.
    </footer>
  )
}