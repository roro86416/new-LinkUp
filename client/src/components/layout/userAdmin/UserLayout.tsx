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
import MyCoupons from '../../content/member/MyCoupons';
import Orders from '../../content/member/Orders';
import LotteryPage from '../../content/member/Game/LotteryPage';

// 管理員內容頁面
import AdminDashboard from '../../content/admin/AdminDashboard';
import AdminTransaction from '../../content/admin/AdminTransaction';
import AdminNotifications from '../../content/admin/AdminNotifications';
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
        case '我的訂單': return <Orders />;
        case '我的折價卷': return <MyCoupons />;
        case '幸運摸彩': return <LotteryPage />;
        default: return <div>請選擇一個頁面</div>;
      }
    } else { // admin
      switch (getActiveMenu()) {
        case '後台總覽': return <AdminDashboard />;
        case '交易管理': return <AdminTransaction />;
        case '通知管理': return <AdminNotifications />;
        case '系統公告管理': return <AdminAnnouncements />;
        default: return <div>請選擇一個頁面</div>;
      }
    }
  };

  return (
    // [修正] 改用 fixed 定位，徹底解決捲軸問題
    <div className="fixed top-[64px] left-0 right-0 bottom-0 bg-[#f5f5f5] flex gap-6 p-6 justify-center overflow-hidden z-0">
      
      {/* 左側 Sidebar 容器 */}
      <div className="flex-shrink-0 h-full overflow-y-auto no-scrollbar">
        <Sidebar
          type={type}
          activeMenu={getActiveMenu()}
          onMenuChange={handleMenuChange}
          currentUser={currentUser}
          loading={loading}
          onAvatarChange={handleAvatarChange}
        />
      </div>

      {/* 右側內容容器 */}
      <div className="bg-white rounded-md p-6 w-[952px] h-full overflow-y-auto shadow-sm">
        {renderContent()}
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
      // [修正] 加入 '我的訂單'，確保重新整理後能停留在該頁面
      ? ['帳號設定', '我的訂單', '訊息管理', '我的收藏', '我的折價卷', '幸運摸彩']
      : ['後台總覽', '交易管理', '通知管理', '系統公告管理'];
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