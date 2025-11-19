'use client';

import Link from 'next/link';
import { useModal } from '../context/auth/ModalContext';
import { useAdminUser } from '../context/auth/AdminUserContext';
import { useUser } from '../context/auth/UserContext';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import {
  CogIcon,
  InboxIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

// 匯入通知鈴鐺組件
import MemberNotificationBell from './content/member/MemberNotificationBell';

export default function Header() {
  const { openLogin } = useModal();
  const { user: memberUser, loading: memberLoading, logout: memberLogout } = useUser();
  const { adminUser, loading: adminLoading, logout: adminLogout } = useAdminUser();
  const router = useRouter();
  const pathname = usePathname();

  // 判斷是否為後台
  const isAdmin = pathname.startsWith('/admin');

  // [新增] 判斷是否需要顯示「白色背景」的 Header
  // 規則：後台頁面、結帳流程(/checkout)、訂單頁面(/orders) 都要變白底
  const isWhiteStyle = 
    isAdmin || 
    pathname.startsWith('/checkout') || 
    pathname.startsWith('/orders') ||
    pathname.startsWith('/member');

  // 根據當前頁面決定要顯示的使用者資訊和登出功能
  const user = isAdmin ? adminUser : memberUser;
  const loading = isAdmin ? adminLoading : memberLoading;
  const logout = isAdmin ? adminLogout : memberLogout;

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
    <header
      className={`fixed top-0 left-0 w-full z-[99] flex items-center justify-between px-10 py-3 shadow-sm transition-all duration-300 ${
        isWhiteStyle 
          ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' // 白色模式
          : 'bg-black/40 backdrop-blur-md border-b border-white/10' // 透明深色模式 (首頁)
      }`}
    >
      {/* LOGO */}
      <Link href="/" className="cursor-pointer">
        <Image
          // 根據背景色決定 Logo 顏色：白底用彩色 Logo，深底用反白 Logo
          src={isWhiteStyle ? "/logo/logoColor.png" : "/logo/logoBlack.png"}
          alt="LOGO"
          width={120}
          height={40}
          // 深色模式下，對 logoBlack 進行反轉濾鏡使其變白
          className={isWhiteStyle ? "" : "invert brightness-200"}
          style={{ width: 'auto', height: 'auto' }}
          priority
        />
      </Link>

      <div className="flex gap-4 items-center">
        {/* [已移除] "我的票卷" 按鈕已在此處移除 */}

        {/* 登入狀態 */}
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200/50 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-4">
            {/* 如果不是後台頁面，就顯示通知鈴鐺 */}
            {!isAdmin && <MemberNotificationBell />}

            <div className="relative" ref={menuRef}>
              {/* 大頭照按鈕 */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`w-10 h-10 rounded-full overflow-hidden border-2 transition cursor-pointer flex items-center justify-center ${
                  isWhiteStyle 
                    ? 'border-gray-300 hover:border-[#EF9D11]' 
                    : 'border-white/50 hover:border-white'
                }`}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center text-xl font-bold ${
                      isAdmin ? 'bg-red-900 text-white' : 'bg-gray-500 text-white'
                    }`}
                  >
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
              </button>

              {/* 下拉選單 */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* 第一列：個人資訊 */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                         {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                         ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white font-bold text-xl">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                         )}
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="font-bold text-gray-900 truncate">{user.name}</p>
                         <p className="text-xs text-gray-500 truncate">{user.email}</p>
                       </div>
                    </div>
                    {/* 會員中心/後台 按鈕 */}
                    <button 
                        onClick={() => {
                          router.push(isAdmin ? '/admin' : '/member');
                          setMenuOpen(false);
                        }}
                        className="mt-3 w-full py-2 text-sm font-medium text-center rounded-lg border border-gray-200 hover:border-[#EF9D11] hover:text-[#EF9D11] transition-colors flex items-center justify-center gap-2"
                    >
                       <CogIcon className="w-4 h-4" />
                       {isAdmin ? '進入後台管理' : '前往會員中心'}
                    </button>
                  </div>

                  {!isAdmin && (
                    <div className="py-1">
                      <button
                        onClick={() => {
                          router.push('/member?section=訊息管理');
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EF9D11] transition-colors text-left"
                      >
                        <InboxIcon className="w-5 h-5" />
                        訊息管理
                      </button>
                      <button
                        onClick={() => {
                          router.push('/member?section=我的收藏');
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#EF9D11] transition-colors text-left"
                      >
                        <StarIcon className="w-5 h-5" />
                        我的收藏
                      </button>
                    </div>
                  )}

                  <div className="border-t border-gray-100 py-1">
                    <button
                      onClick={() => logout && logout()}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      登出
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : !isAdmin ? (
          // 未登入狀態 (前台顯示登入按鈕)
          <button
            onClick={openLogin}
            className={`flex items-center gap-2 font-medium transition-colors px-5 py-2 rounded-full cursor-pointer ${
               isWhiteStyle 
                 ? 'bg-[#EF9D11] text-white hover:bg-[#d9890e] shadow-sm' 
                 : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/50'
            }`}
          >
            登入 / 註冊
          </button>
        ) : null}
      </div>
    </header>
  );
}