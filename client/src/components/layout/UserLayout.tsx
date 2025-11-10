'use client';

import { ReactNode } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

// 會員內容頁面
import AccountSettings from '../../components/content/member/AccountSettings';
import Messages from '../../components/content/member/Messages';
import Favorites from '../../components/content/member/Favorites';

// 管理員內容頁面
import AdminDashboard from '../../components/content/admin/AdminDashboard';
import AdminUsers from '../../components/content/admin/AdminUsers';

import AdminTransaction from '../../components/content/admin/AdminTransaction';

import AdminAnnouncements from '../../components/content/admin/AdminAnnouncements';

interface UserLayoutProps {
  type: 'member' | 'admin';
  children?: React.ReactNode; // ✅ 加這一行
}

export default function UserLayout({ type }: UserLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const section = searchParams.get('section');

  // 每次渲染時都重新計算 activeMenu 的值
  // 這樣可以確保它總是與 URL 的 'section' 參數同步
  const getActiveMenu = () => {
    if (type === 'member') {
      // 確保 section 的值是有效的 member menu label
      const validSections = ['帳號設定', '訊息管理', '我的收藏'];
      const currentSection = section || '';
      return validSections.find(s => s === currentSection) || '帳號設定';
    }
    return '後台總覽';
  }

  const handleMenuChange = (menu: string) => {
    router.push(`/member?section=${menu}`);
  };

  const renderContent = (): ReactNode => {
    if (type === 'member') {
      switch (getActiveMenu()) {
        case '帳號設定':
          return <AccountSettings />;
        case '訊息管理':
          return <Messages />;
        case '我的收藏':
          return <Favorites />;
        default:
          return <div>請選擇一個頁面</div>;
      }
    } else { // admin
      switch (getActiveMenu()) {
        case '後台總覽':
          return <AdminDashboard />;
        case '會員管理':
          return <AdminUsers />;
        case '交易管理':
          return <AdminTransaction />;
        case '系統公告管理':
          return <AdminAnnouncements />;
        default:
          return <div>請選擇一個頁面</div>;
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5] flex gap-6 min-h-screen p-12 justify-center">
      <Sidebar
        type={type}
        activeMenu={getActiveMenu()}
        onMenuChange={handleMenuChange}
      />

      <div className="bg-white rounded-md p-6 w-[952px]">
        {renderContent()}
      </div>
    </div>
  );
}
