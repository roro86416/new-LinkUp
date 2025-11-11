'use client';

import { ReactElement } from 'react';
import { AiOutlineSetting, AiOutlineInbox, AiOutlineStar, AiOutlineCamera } from 'react-icons/ai';
import { FiPackage, FiBarChart2 } from 'react-icons/fi';
import { User } from '../../../context/auth/UserContext';
import { AdminUser } from '../../../context/auth/AdminUserContext';

interface MenuItem {
  label: string;
  icon: ReactElement;
}

export interface SidebarProps {
  type: 'member' | 'admin';
  activeMenu: string;
  onMenuChange: (menu: string) => void;
  currentUser: User | AdminUser | null;
  loading: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Sidebar({ type, activeMenu, onMenuChange, currentUser, loading, onAvatarChange }: SidebarProps) {
  const menus: MenuItem[] =
    type === 'member'
      ? [
        { label: '帳號設定', icon: <AiOutlineSetting /> },
        { label: '訊息管理', icon: <AiOutlineInbox /> },
        { label: '我的收藏', icon: <AiOutlineStar /> },
      ]
      : [

        { label: '後台總覽', icon: <FiBarChart2 /> },
        { label: '主辦方管理', icon: <AiOutlineSetting /> },
        { label: '活動管理', icon: <AiOutlineSetting /> },
        { label: '交易管理', icon: <FiPackage /> },
        { label: '通知管理', icon: <AiOutlineInbox /> }, // 
        { label: '系統公告管理', icon: <AiOutlineSetting /> },
      ];


  return (
    <aside className="bg-white w-[280px] h-[660px] rounded-2xl p-6 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">
      <div className="relative w-[120px] h-[120px] mx-auto group rounded-full border-4 border-orange-100 ring-2 ring-orange-300">
        {loading ? (
          <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
        ) : currentUser?.avatar ? (
          <img src={currentUser.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-5xl font-bold">
            {currentUser?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-[#EF9D11] text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-[#d9890e] transition duration-200 cursor-pointer"
        >
          <AiOutlineCamera className="w-4 h-4" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
        />
      </div>

      <div className="text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <><p className="text-xl font-bold text-gray-800">{currentUser?.name || (type === 'member' ? '普通會員' : '系統管理員')}</p><p className="text-sm text-gray-500 mt-0.5">{currentUser?.email || 'user@example.com'}</p></>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {menus.map(item => {
          const isActive = activeMenu === item.label;
          return (
            <button
              key={item.label}
              onClick={() => onMenuChange(item.label)}
              className={`flex items-center gap-4 w-full text-left cursor-pointer py-3 px-4 rounded-xl transition-all duration-200
                ${isActive
                  ? 'bg-[#EF9D11] text-white font-semibold shadow-lg shadow-orange-400/50 hover:bg-[#d9890e]'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 font-medium'
                }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-orange-600'}`}>
                {item.icon}
              </span>
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
