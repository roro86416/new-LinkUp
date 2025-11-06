'use client';

import Link from 'next/link';
import { useModal } from '../context/ModalContext';
import { useUser } from '../context/UserContext';
import Image from 'next/image';
import { FaTicketAlt } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import {
  CogIcon,
  InboxIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { openLogin } = useModal();
  const { user, logout } = useUser();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉選單
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
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-1 bg-black/50 backdrop-blur-md shadow-md">
      {/* LOGO */}
      <Link href="/" className="cursor-pointer">
        <Image
          src="/logo/logoBlack.png"
          alt="LOGO"
          width={120}
          height={40}
          className="invert brightness-200"
        />
      </Link>

      <div className="flex gap-4 items-center">
        {/* 我的票卷 */}
        <button className="flex items-center gap-2 text-white hover:text-[#EF9D11] font-medium transition-colors px-4 py-2 cursor-pointer">
          <FaTicketAlt className="text-lg" /> 我的票卷
        </button>

        {/* 登入狀態 */}
        {user ? (
          <div className="relative" ref={menuRef}>
            {/* 大頭照按鈕，增加 border */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-300 hover:border-[#EF9D11] transition cursor-pointer"
            >
              <img
                src={user.avatar || '/bear.png'}
                alt="avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </button>

            {/* 下拉選單 */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 z-50">
                {/* 第一列：點擊跳轉會員頁 */}
                <button
                  onClick={() => {
                    router.push('/member'); // 跳轉會員頁
                    setMenuOpen(false);     // 關閉下拉選單
                  }}
                  className="w-full flex items-center p-4 border-b border-gray-300 text-left cursor-pointer hover:text-[#EF9D11] transition-colors"
                >
                  <img
                    src={user.avatar || '/bear.png'}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border-2 border-gray-300 object-cover mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
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
