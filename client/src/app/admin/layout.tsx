//系統管理員的權限保護與頁面佈局元件（Admin Auth + Layout）

'use client';

import { ReactNode, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAdminUser } from '../../context/auth/AdminUserContext';
import UserLayout from '../../components/layout/userAdmin/UserLayout';

function AdminAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { adminUser, loading } = useAdminUser();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (loading) return;

    // 如果在登入頁，但已有登入狀態，導向後台首頁
    if (isLoginPage) {
      if (adminUser) router.replace('/admin');
    }

    // 如果不在登入頁，且沒有登入狀態，導向登入頁
    if (!isLoginPage && !adminUser) {
      router.replace('/admin/login');
    }
  }, [adminUser, isLoginPage, loading, router]);

  // 在驗證過程中，或需要重導向時，不渲染任何內容避免畫面閃爍
  if (loading || (!isLoginPage && !adminUser) || (isLoginPage && adminUser)) {
    return null;
  }

  // 在登入頁且未登入
  if (isLoginPage && !adminUser) {
    return <>{children}</>;
  }

  // 在後台頁面且已登入
  if (!isLoginPage && adminUser) {
    return <UserLayout type="admin">{children}</UserLayout>;
  }

  return null;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminAuth>{children}</AdminAuth>;
}
