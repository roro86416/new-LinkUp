'use client';

import React, { ReactElement } from 'react';
// [新增] 引入您指定的圖示庫
import { 
  AiOutlineSetting, 
  AiOutlineInbox, 
  AiOutlineStar, 
  AiOutlineCamera, 
  AiOutlineOrderedList 
} from 'react-icons/ai';
import { BsGift, BsTicketPerforated } from 'react-icons/bs';
import { FiPackage, FiBarChart2 } from 'react-icons/fi';
// 引用正確的 Context 路徑
import { User } from '../../../context/auth/UserContext';
import { AdminUser } from '../../../context/auth/AdminUserContext';

interface MenuItem {
  label: string;
  icon: ReactElement;
  id: string; // [新增] 用於對應 activeMenu
}

export interface SidebarProps {
  type: 'member' | 'admin';
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  currentUser: User | AdminUser | null;
  loading: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// --- Menu Data ---
const memberMenus: MenuItem[] = [
  { label: '帳號設定', id: '帳號設定', icon: <AiOutlineSetting /> },
  { label: '我的訂單', id: '我的訂單', icon: <AiOutlineOrderedList /> }, // [重點] 加入我的訂單
  { label: '訊息管理', id: '訊息管理', icon: <AiOutlineInbox /> },
  { label: '我的收藏', id: '我的收藏', icon: <AiOutlineStar /> },
  { label: '我的折價卷', id: '我的折價卷', icon: <BsTicketPerforated /> },
  { label: '幸運摸彩', id: '幸運摸彩', icon: <BsGift /> },
];

const adminMenus: MenuItem[] = [
  { label: '後台總覽', id: '後台總覽', icon: <FiBarChart2 /> },
  { label: '交易管理', id: '交易管理', icon: <FiPackage /> },
  { label: '通知管理', id: '通知管理', icon: <AiOutlineInbox /> },
  { label: '系統公告管理', id: '系統公告管理', icon: <AiOutlineSetting /> },
];

// --- Sub-components ---

const Avatar = ({ loading, currentUser, onAvatarChange }: Pick<SidebarProps, 'loading' | 'currentUser' | 'onAvatarChange'>) => (
  <div className="relative w-[120px] h-[120px] mx-auto group rounded-full border-4 border-orange-100 ring-2 ring-orange-300">
    {loading ? (
      <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
    ) : currentUser?.avatar ? (
      <img src={currentUser.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
    ) : (
      <div className="w-full h-full rounded-full bg-gray-400 flex items-center justify-center text-white text-5xl font-bold">
        {currentUser?.name?.[0]?.toUpperCase() || '?'}
      </div>
    )}
    <label
      className="absolute bottom-0 right-0 bg-[#EF9D11] text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-[#d9890e] transition duration-200 cursor-pointer"
    >
      <AiOutlineCamera className="w-4 h-4" />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onAvatarChange}
      />
    </label>
  </div>
);

const UserInfo = ({ loading, currentUser, type }: Pick<SidebarProps, 'loading' | 'currentUser' | 'type'>) => (
  <div className="text-center">
    {loading ? (
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
    ) : (
      <>
        <p className="text-xl font-bold text-gray-800">{currentUser?.name || (type === 'member' ? '普通會員' : '系統管理員')}</p>
        <p className="text-sm text-gray-500 mt-0.5">{currentUser?.email || 'user@example.com'}</p>
      </>
    )}
  </div>
);

const MenuList = ({ menus, activeMenu, onMenuChange }: { menus: MenuItem[] } & Pick<SidebarProps, 'activeMenu' | 'onMenuChange'>) => {
  const baseClasses = "flex items-center gap-4 w-full text-left cursor-pointer py-3 px-4 rounded-xl transition-all duration-200";
  const activeClasses = "bg-[#EF9D11] text-white font-semibold shadow-lg shadow-orange-400/50 hover:bg-[#d9890e]";
  const inactiveClasses = "text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium";

  return (
    <div className="flex flex-col gap-2">
      {menus.map(item => {
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onMenuChange(item.id)}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
          >
            <span className={`flex items-center justify-center text-xl ${isActive ? 'text-white' : 'text-orange-600'}`}>
              {item.icon}
            </span>
            <span className="text-base">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- Main Sidebar Component ---

export default function Sidebar({ type, activeMenu, onMenuChange, currentUser, loading, onAvatarChange }: SidebarProps) {
  const menus = type === 'member' ? memberMenus : adminMenus;

  return (
    // 這裡設定 h-full 讓它填滿 UserLayout 給的高度，並保持圓角卡片風格
    <aside className="bg-white w-[280px] min-h-[660px] h-full rounded-2xl p-6 flex flex-col gap-8 shadow-xl shadow-gray-200/50 overflow-y-auto">
      <Avatar
        loading={loading}
        currentUser={currentUser}
        onAvatarChange={onAvatarChange}
      />
      <UserInfo
        loading={loading}
        currentUser={currentUser}
        type={type}
      />
      <div className="flex-1">
        <MenuList
          menus={menus}
          activeMenu={activeMenu}
          onMenuChange={onMenuChange}
        />
      </div>
    </aside>
  );
}