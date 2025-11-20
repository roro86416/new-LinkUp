// new-LinkUp/client/src/components/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, User as UserIcon, LogOut, Ticket, Settings } from 'lucide-react';

import { useModal } from '../context/auth/ModalContext';
import { useUser } from '../context/auth/UserContext';
import { useAdminUser } from '../context/auth/AdminUserContext';
import MemberNotificationBell from './content/member/MemberNotificationBell';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  
  // 頁面判斷
  const isHome = pathname === '/';
  const isEventPage = pathname.startsWith('/event/');
  const isAdmin = pathname.startsWith('/admin');
  const isMember = pathname.startsWith('/member');
  const islist = pathname.startsWith('/eventlist');

  // 是否為特殊背景頁面 (首頁或活動頁) -> 需要透明效果
  const isSpecialPage = isHome || isEventPage || isMember || islist;

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { openLogin, isLoginOpen, isRegisterOpen, isEmailLoginOpen, isForgotPasswordOpen, isPasswordSentOpen, isAdminLoginOpen } = useModal();
  const { user: memberUser, logout: memberLogout } = useUser();
  const { adminUser, logout: adminLogout } = useAdminUser();

  const user = isAdmin ? adminUser : memberUser;
  const logout = isAdmin ? adminLogout : memberLogout;
  
  // 任何 Modal 開啟時
  const isAnyModalOpen = isLoginOpen || isRegisterOpen || isEmailLoginOpen || isForgotPasswordOpen || isPasswordSentOpen || isAdminLoginOpen;

  // 1. 解決 Hydration Error
  useEffect(() => {
    requestAnimationFrame(() => setIsMounted(true));
  }, []);

  // 2. 監聽捲動
  useEffect(() => {
    // 如果不是特殊頁面，直接設為白底模式 (scrolled=true)
    if (!isSpecialPage) {
        setScrolled(true);
        return;
    }

    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(prev => (prev !== isScrolled ? isScrolled : prev));
    };

    window.addEventListener('scroll', handleScroll);
    // 初始化檢查
    requestAnimationFrame(() => handleScroll());

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSpecialPage]); // 當頁面類型改變時重新執行

  // 3. 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- 樣式邏輯判斷 ---
  
  // 定義變數 (修復錯誤)
  const isModalMode = isAnyModalOpen;
  // 透明模式：特殊頁面 + 沒捲動 + 沒開 Modal
  const isTransparentMode = isSpecialPage && !scrolled && !isModalMode;

  // 決定文字顏色
  let textColorClass = 'text-slate-600 hover:text-[#EF9D11]'; // 預設：深色 (白底時)
  
  if (isModalMode) {
    textColorClass = 'text-white hover:text-white/80'; // Modal 開啟：白色
  } else if (isTransparentMode) {
    if (isEventPage || isMember) {
        textColorClass = 'text-white hover:text-white/80'; // 活動頁頂部：白色 (配深色海報)
    } else {
        textColorClass = 'text-slate-700 hover:text-[#EF9D11]'; // 首頁頂部：深色 (配亮色天空)
    }
  }

  // 決定 Logo 圖片
  let logoSrc = "/logo/logoColor.png";
  let logoClass = "";

  if (isModalMode) {
    logoSrc = "/logo/logoBlack.png"; logoClass = "invert opacity-100"; // 白Logo
  } else if (isTransparentMode) {
    if (isEventPage || isMember) {
        logoSrc = "/logo/logoBlack.png"; logoClass = "invert opacity-100"; // 活動頁：白Logo
    } else {
        logoSrc = "/logo/logoBlack.png"; logoClass = "opacity-90 hover:opacity-100"; // 首頁：黑Logo
    }
  }

  // 背景樣式
  const headerBackgroundClass = isModalMode
    ? 'bg-transparent border-transparent'
    : isTransparentMode
      ? 'bg-transparent border-transparent py-5'
      : 'bg-white/90 backdrop-blur-md border-white/20 py-3 shadow-sm'; // 滾動後變白底

  return (
    <header className={`fixed top-0 left-0 w-full z-[99] transition-all duration-300 border-b ${headerBackgroundClass}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="cursor-pointer flex items-center gap-2 group relative z-[100]">
          <div className="relative h-10 w-32">
             <Image src={logoSrc} alt="LinkUp Logo" fill className={`object-contain transition-all duration-300 ${logoClass}`} priority />
          </div>
        </Link>

        {/* 中間選單 */}
        <div className={`hidden md:flex items-center gap-8 text-sm font-medium transition-colors duration-300 ${textColorClass}`}>
            <Link href="/eventlist" className="transition-colors">活動列表</Link>
            <Link href="/post" className="transition-colors">文章牆</Link>
            <Link href="/about" className="transition-colors">關於我們</Link>
        </div>

        {/* 右側功能區 */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/eventlist" className={`p-2 rounded-full transition-colors ${textColorClass.includes('text-white') ? 'hover:bg-white/20' : 'hover:bg-gray-100'}`}>
             {/* 讓 Search Icon 顏色跟隨文字顏色 */}
             <Search size={22} className={textColorClass.split(' ')[0]} />
          </Link>

          {isMounted && user ? (
            <div className="flex items-center gap-4 animate-in fade-in duration-300">
              {!isAdmin && (
                // 修正：讓通知鈴鐺顏色與 textColorClass 同步
                <MemberNotificationBell className={textColorClass.split(' ')[0]} />
              )}
              
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen(!menuOpen)} className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center ${textColorClass.includes('text-white') ? 'border-white/50 hover:border-white' : 'border-gray-200 hover:border-[#EF9D11]'}`}>
                  {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center text-lg font-bold ${textColorClass.includes('text-white') ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>{user.name?.[0]?.toUpperCase() || <UserIcon size={20} />}</div>}
                </button>
                
                {/* Dropdown Menu */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                      <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-200">
                           {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gray-400 text-white font-bold">{user.name?.[0]?.toUpperCase()}</div>}
                         </div>
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-gray-900 truncate text-base">{user.name || '會員'}</p>
                           <p className="text-xs text-gray-500 truncate">{user.email}</p>
                         </div>
                      </div>
                    </div>
                    <div className="p-2">
                        <button onClick={() => { router.push(isAdmin ? '/admin' : '/member'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#EF9D11] rounded-xl transition-colors text-left">
                           {isAdmin ? <Settings size={18}/> : <UserIcon size={18}/>} {isAdmin ? '後台管理' : '會員中心'}
                        </button>
                        {!isAdmin && (
                            <button onClick={() => { router.push('/member?section=我的訂單'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#EF9D11] rounded-xl transition-colors text-left">
                               <Ticket size={18}/> 我的票券
                            </button>
                        )}
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button onClick={() => { if(logout) logout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left">
                        <LogOut size={18} /> 登出
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // 登入按鈕
            <button onClick={openLogin} className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all shadow-sm hover:shadow-md active:scale-95 ${
                  isModalMode 
                    ? 'bg-white/20 text-white hover:bg-white/30 border border-white/50' 
                    : (isTransparentMode && !isEventPage) // 首頁透明模式 (深字)
                        ? 'bg-[#0C2838] text-white hover:bg-[#EF9D11]' 
                        : 'bg-[#EF9D11] text-white hover:bg-[#d88d0e]' // 其他 (含活動頁透明/白底)
              }`}>
              <UserIcon size={18} />
              <span>登入 / 註冊</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}