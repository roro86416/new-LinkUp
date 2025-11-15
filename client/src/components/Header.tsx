'use client';

import Link from 'next/link';
import { useModal } from '../context/auth/ModalContext';
import { useUser } from '../context/auth/UserContext';
import Image from 'next/image';
import { FaTicketAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import {
  CogIcon,
  InboxIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { openLogin } = useModal();
  const { user, loading, logout } = useUser();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉選單 (保持不變)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // 您的 Header 樣式 (保持 z-50)
    <header className="isScrolled top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-1 bg-black/50 backdrop-blur-md shadow-md">
      
      {/* LOGO (保持不變) */}
      <Link href="/" className="cursor-pointer">
        <Image
          src="/logo/logoBlack.png" // [!] 您的 Header.tsx 是用 logoBlack
          alt="LOGO"
          width={120}
          height={40}
          className="invert brightness-200"
          style={{ width: 'auto' }}
        />
      </Link>

      {/* 搜尋欄 (保持不變) */}
      <div className="relative w-96 hidden md:block"> 
        <input
          type="text"
          placeholder="搜尋活動"
          className="w-full pl-10 pr-3 py-2 rounded-lg bg-black/20 text-white placeholder-white text-center hover:bg-black/30 focus:outline-none focus:ring-0 border border-white/50 transition-all duration-200 cursor-pointer"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70 pointer-events-none" />
      </div>

      {/* 右側按鈕區 (保持不變) */}
      <div className="flex gap-4 items-center">
        {/* 我的票卷 */}
        <button className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-4 py-2 cursor-pointer">
          <FaTicketAlt className="text-lg" /> 我的票卷
        </button>

        {/* 登入狀態 (保持不變) */}
        {loading ? (
          <div className="w-10 h-10" />
        ) : user ? (
          <div className="relative" ref={menuRef}>
            {/* 大頭照按鈕 (保持不變) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#EF9D11] transition cursor-pointer"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-500 flex items-center justify-center text-white text-xl font-bold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
              )}
            </button>

            {/* [!!!] 關鍵修正：補回完整的下拉選單 JSX [!!!] */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 z-60">
                {/* 第一列：點擊跳轉會員頁 */}
                <button
                  onClick={() => {
                    router.push('/member'); // 跳轉會員頁
                    setMenuOpen(false);     // 關閉下拉選單
                  }}
                  className="w-full flex items-center p-4 border-b border-gray-300 text-left cursor-pointer hover:text-[#EF9D11] transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover mr-3"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl font-bold mr-3 flex-shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1">
                    {/* [!] 確保 user.name 和 user.email 存在 */}
                    <p className="font-semibold text-gray-800">{user.name || '使用者'}</p>
                    <p className="text-sm text-gray-500">{user.email || 'Email'}</p>
                  </div>
                  <CogIcon className="w-5 h-5 text-gray-500 hover:text-[#EF9D11]" />
                </button>

                {/* 其他選單 */}
                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 font-medium hover:text-[#EF9D11] transition-colors text-left cursor-pointer">
                  <ClipboardDocumentIcon className="w-5 h-5 pointer-events-none" />
                  訂單管理
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 font-medium hover:text-[#EF9D11] transition-colors text-left cursor-pointer">
                  <InboxIcon className="w-5 h-5 pointer-events-none" />
                  訊息管理
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 font-medium hover:text-[#EF9D11] transition-colors text-left cursor-pointer">
                  <StarIcon className="w-5 h-5 pointer-events-none" />
                  我的收藏
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-gray-700 font-medium hover:text-[#EF9D11] transition-colors text-left border-t border-gray-300 cursor-pointer"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 pointer-events-none" />
                  登出
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-4 py-2 cursor-pointer"
          >
            登入 / 註冊
          </button>
        )}
      </div>
    </header>
  );
}