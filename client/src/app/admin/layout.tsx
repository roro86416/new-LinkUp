'use client';

import { useEffect, useState } from 'react';
import UserLayout from '../../components/layout/UserLayout';
import { useModal } from '../../context/auth/ModalContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { openAdminLogin } = useModal();
  // ⭐️ 使用函式進行延遲初始化，此函式只會在客戶端初次渲染時執行一次
  const [isVerified] = useState(() => {
    // 這個檢查只會在客戶端執行，伺服器端永遠返回 false
    if (typeof window === 'undefined') {
      return false;
    }
    return !!localStorage.getItem('admin_token');
  });

  useEffect(() => {
    // 現在 effect 的職責很單純：如果未驗證，就打開登入視窗
    if (!isVerified) {
      openAdminLogin();
    }
  }, [isVerified, openAdminLogin]);

  // 如果未驗證，Modal 會覆蓋在上面；如果已驗證，則正常顯示 children。
  return <UserLayout type="admin">{isVerified ? children : null}</UserLayout>;
}
