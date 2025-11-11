'use client';

import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

// 引入所有後台內容元件
import AdminDashboard from '../../components/content/admin/AdminDashboard';
import AdminUsers from '../../components/content/admin/AdminUsers';
import AdminTransaction from '../../components/content/admin/AdminTransaction';
import AdminNotifications from '../../components/content/admin/AdminNotifications'; // 引入新的通知管理元件
import AdminAnnouncements from '../../components/content/admin/AdminAnnouncements';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  const renderContent = (): ReactNode => {
    switch (section) {
      case '後台總覽':
        return <AdminDashboard />;
      case '主辦方管理':
        // 這裡可以放主辦方管理的元件，暫時使用 AdminUsers
        return <AdminUsers />;
      case '活動管理':
        // 這裡可以放活動管理的元件，暫時使用 AdminUsers
        return <AdminUsers />;
      case '交易管理':
        return <AdminTransaction />;
      case '通知管理':
        return <AdminNotifications />; // 渲染通知管理內容
      case '系統公告管理':
        return <AdminAnnouncements />;
      default:
        // 如果沒有 section 或 section 不匹配，預設顯示總覽
        return <AdminDashboard />;
    }
  };

  // 這個頁面只渲染對應的內容，版面由 layout.tsx 控制
  return <>{renderContent()}</>;
}