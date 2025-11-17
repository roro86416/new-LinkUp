//統一控制左側選單和右側內容區的渲染邏輯

'use client';

import { ReactNode, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { useUser, User } from '../../../context/auth/UserContext';
import { useAdminUser, AdminUser } from '../../../context/auth/AdminUserContext';

// 會員內容頁面
import AccountSettings from '../../content/member/AccountSettings';
import Messages from '../../content/member/Messages';
import Favorites from '../../content/member/Favorites';

// 管理員內容頁面
import AdminDashboard from '../../content/admin/AdminDashboard';
import AdminTransaction from '../../content/admin/AdminTransaction';
import AdminNotifications from '../../content/admin/AdminNotifications'; // 引入新的通知管理元件
import AdminAnnouncements from '../../content/admin/AdminAnnouncements';

interface UserLayoutProps {
  type: 'member' | 'admin';
  children?: React.ReactNode;
}

interface ContainerProps extends UserLayoutProps {
  getActiveMenu: () => string;
  handleMenuChange: (menu: string) => void;
}

interface LayoutRendererProps extends ContainerProps {
  currentUser: User | AdminUser | null;
  loading: boolean;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function MemberContainer({ children, type, getActiveMenu, handleMenuChange }: ContainerProps) {
  const { user, updateUser, loading } = useUser();

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result as string;
      if (updateUser) updateUser({ avatar: newAvatar });
    };
    reader.readAsDataURL(file);
  }, [updateUser]);

  return (
    <LayoutRenderer
      type={type}
      currentUser={user}
      loading={loading}
      getActiveMenu={getActiveMenu}
      handleMenuChange={handleMenuChange}
      handleAvatarChange={handleAvatarChange}
    >
      {children}
    </LayoutRenderer>
  );
}

function AdminContainer({ children, type, getActiveMenu, handleMenuChange }: ContainerProps) {
  const { adminUser, updateAdminUser, loading } = useAdminUser();

  // 啟用後台大頭貼更換功能
  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result as string;
      if (updateAdminUser) updateAdminUser({ avatar: newAvatar });
    };
    reader.readAsDataURL(file);
  }, [updateAdminUser]);

  return (
    <LayoutRenderer
      type={type}
      currentUser={adminUser}
      loading={loading}
      getActiveMenu={getActiveMenu}
      handleMenuChange={handleMenuChange}
      handleAvatarChange={handleAvatarChange}
    >
      {children}
    </LayoutRenderer>
  );
}

function LayoutRenderer({ type, currentUser, loading, getActiveMenu, handleMenuChange, handleAvatarChange, children }: LayoutRendererProps) {
  const renderContent = () => {
    if (type === 'member') {
      switch (getActiveMenu()) {
        case '訊息管理': return <Messages />;
        case '帳號設定': return <AccountSettings />;
        case '我的收藏': return <Favorites />;
        default: return <div>請選擇一個頁面</div>;
      }
    } else { // admin
      switch (getActiveMenu()) {
        case '後台總覽': return <AdminDashboard />;
        case '交易管理': return <AdminTransaction />;
        case '通知管理': return <AdminNotifications />; // 渲染通知管理內容
        case '系統公告管理': return <AdminAnnouncements />;
        default: return <div>請選擇一個頁面</div>;
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5] flex gap-6 min-h-screen p-6 justify-center">
      <Sidebar
        type={type}
        activeMenu={getActiveMenu()}
        onMenuChange={handleMenuChange}
        currentUser={currentUser}
        loading={loading}
        onAvatarChange={handleAvatarChange}
      />
      <div className="bg-white rounded-md p-6 w-[952px]">
        {children || renderContent()}
      </div>
    </div>
  );
}

export default function UserLayout({ type, children }: UserLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const getActiveMenu = useCallback(() => {
    const section = searchParams.get('section');
    const validSections = type === 'member'
      ? ['帳號設定', '訊息管理', '我的收藏']
      : ['後台總覽', '交易管理', '通知管理', '系統公告管理']; // ⭐️ 移除主辦方和活動管理
    const defaultSection = type === 'member' ? '帳號設定' : '後台總覽';
    return validSections.find(s => s === section) || defaultSection;
  }, [searchParams, type]);

  const handleMenuChange = useCallback((menu: string) => {
    router.push(`/${type}?section=${menu}`);
  }, [router, type]);

  const containerProps = { type, children, getActiveMenu, handleMenuChange };

  return type === 'member'
    ? <MemberContainer {...containerProps} />
    : <AdminContainer {...containerProps} />;
}
