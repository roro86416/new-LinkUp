'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../context/auth/UserContext';
import UserLayout from '../../components/layout/userAdmin/UserLayout';

function MemberAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    // 在讀取狀態或使用者未登入時，不執行任何操作
    if (loading) return;

    // 如果不在讀取中，且沒有使用者資訊，則導向首頁
    if (!user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // 在驗證過程中或需要重導向時，顯示載入中或不渲染任何內容
  if (loading || !user) {
    return <div>載入會員資料中...</div>; // 或者一個更精美的載入動畫
  }

  // 使用者已登入，渲染會員中心佈局
  return (
    <UserLayout type="member">{children}</UserLayout>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  return <MemberAuth>{children}</MemberAuth>;
}