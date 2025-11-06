'use client';

import { useState, useRef, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';

interface UserMenuProps {
  name: string;
  email: string;
  avatar: string;
}

export default function UserMenu({ name, email, avatar }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部時關閉選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* 大頭照按鈕 */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 hover:border-gray-400 transition"
      >
        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
      </button>

      {/* 下拉選單 */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
          {/* 第一列：使用者資訊 */}
          <div className="flex items-center p-4 border-b border-gray-100">
            <img
              src={avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{name}</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <FiSettings size={18} />
            </button>
          </div>

          {/* 第二列：訊息管理 */}
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition text-gray-700 font-medium">
            📩 訊息管理
          </button>

          {/* 第三列：我的收藏 */}
          <button className="w-full text-left px-4 py-3 hover:bg-gray-50 transition text-gray-700 font-medium">
            ⭐ 我的收藏
          </button>
        </div>
      )}
    </div>
  );
}
