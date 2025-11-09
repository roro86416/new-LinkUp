'use client';

import { Dispatch, SetStateAction, ReactElement, useState } from 'react';
import { AiOutlineSetting, AiOutlineInbox, AiOutlineStar, AiOutlineCamera } from 'react-icons/ai';
import { FiPackage, FiBarChart2 } from 'react-icons/fi';
import { useUser } from '../../context/auth/UserContext';

interface MenuItem {
  label: string;
  icon: ReactElement;
}

export interface SidebarProps {
  type: 'member' | 'admin';
  activeMenu: string;
  onMenuChange: Dispatch<SetStateAction<string>>;
}

export default function Sidebar({ type, activeMenu, onMenuChange }: SidebarProps) {
  const { user, updateUser, loading } = useUser();

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
        { label: '系統公告管理', icon: <AiOutlineSetting /> },
      ];

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result as string;
      updateUser({ avatar: newAvatar }); // 更新 Context → Header 即時同步
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="bg-white w-[280px] h-[660px] rounded-2xl p-6 flex flex-col gap-8 shadow-2xl shadow-gray-200/50">
      <div className="relative w-[120px] h-[120px] mx-auto group rounded-full border-4 border-indigo-100 ring-2 ring-indigo-300">
        {loading ? (
          <div className="w-full h-full rounded-full bg-gray-200 animate-pulse" />
        ) : user?.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-500 flex items-center justify-center text-white text-5xl font-bold">
            {user?.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full border-4 border-white shadow-lg hover:bg-indigo-700 transition duration-200 cursor-pointer"
        >
          <AiOutlineCamera className="w-4 h-4" />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <div className="text-center">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <><p className="text-xl font-bold text-gray-800">{user?.name || (type === 'member' ? '普通會員' : '系統管理員')}</p><p className="text-sm text-gray-500 mt-0.5">{user?.email || 'user@example.com'}</p></>
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
                  ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-500/50'
                  : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium'
                }`}
            >
              <span className={`flex items-center justify-center w-5 h-5 ${isActive ? 'text-white' : 'text-indigo-600'}`}>
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
