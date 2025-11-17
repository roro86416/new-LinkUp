'use client'; 

import Link from 'next/link';
import Image from 'next/image'; // [!] 1. 您已經匯入了
import { useUser } from '../../context/auth/UserContext';
import { useModal } from '../../context/auth/ModalContext';
import { MagnifyingGlassIcon, ShoppingCartIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function ShopHeader() {
  const { user, loading } = useUser();
  const { openLogin } = useModal();
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
        
        {/* (Logo 和 搜尋欄 保持不變) */}
        <Link href="/" className="cursor-pointer">
          <Image
            src="/logo/logoColor.png" 
            alt="LOGO"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
        </Link>
        <div className="relative w-96 hidden md:block">
          <input
            type="text"
            placeholder="搜尋商品..."
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-200"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* 右側：圖示按鈕 */}
        <div className="flex items-center gap-4">
          <button className="text-gray-600 hover:text-orange-600">
            <ShoppingCartIcon className="w-6 h-6" />
          </button>
          
          {loading ? (
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <Link href="/member">
              <span className="w-6 h-6 rounded-full overflow-hidden block"> {/* [!] 加上 "block" 確保 span 有正確的 box model */}
                {user.avatar ? (
                  // [!!!] 2. 關鍵修正
                  // 將 <img ... /> 
                  // 改為 <Image ... />
                  <Image 
                    src={user.avatar} 
                    alt="avatar" 
                    width={24} // 24px (w-6)
                    height={24} // 24px (h-6)
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <UserCircleIcon className="w-6 h-6 text-gray-600" />
                )}
              </span>
            </Link>
          ) : (
            <button onClick={openLogin} className="text-sm font-medium text-gray-700 hover:text-orange-600">
              登入
            </button>
          )}
        </div>
      </div>
    </header>
  );
}