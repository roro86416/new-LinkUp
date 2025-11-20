// new-LinkUp/client/src/app/member/layout.tsx
'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  UserIcon, 
  BellIcon, 
  TicketIcon, 
  HeartIcon, 
  GiftIcon, 
  SparklesIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useUser } from '../../context/auth/UserContext';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout, loading } = useUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const currentSection = searchParams.get('section') || '會員設定';

  // 1. 依照您的需求排序選單
  const menuItems = [
    { name: '會員設定', href: '/member?section=會員設定', icon: UserIcon },
    { name: '通知管理', href: '/member?section=通知管理', icon: BellIcon }, // 原本叫訊息管理
    { name: '我的訂單', href: '/member?section=我的訂單', icon: TicketIcon },
    { name: '我的收藏', href: '/member?section=我的收藏', icon: HeartIcon },
    { name: '折價券',   href: '/member?section=折價券',   icon: GiftIcon },
    { name: '幸運抽獎', href: '/member?section=幸運抽獎', icon: SparklesIcon },
  ];

  if (loading || !user) {
     return <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">載入會員資料中...</div>;
  }

  return (
    <div className="min-h-screen font-sans relative text-white pt-24 pb-20">
      
      {/* 背景層 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0f172a_0%,#1e293b_100%)]"></div>
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`, backgroundSize: 'cover' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* 側邊欄 */}
        <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl sticky top-28">
                <div className="text-center mb-8 pb-6 border-b border-white/10">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#EF9D11] to-orange-600 rounded-full p-1 shadow-lg mb-4">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center border-2 border-white/50">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                    <h2 className="text-xl font-bold text-white">{user?.name || '會員'}</h2>
                    <p className="text-sm text-gray-400 mt-1 truncate px-2" title={user?.email}>{user?.email}</p>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = currentSection === item.name;
                        return (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                                    ${isActive 
                                        ? 'bg-[#EF9D11] text-white shadow-lg shadow-orange-500/20 font-bold' 
                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-4 mt-4 border-t border-white/10">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            登出
                        </button>
                    </div>
                </nav>
            </div>
        </aside>

        {/* 內容區 */}
        <main className="flex-1 min-w-0">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[40px] p-6 md:p-10 shadow-2xl min-h-[600px]">
                {children}
            </div>
        </main>

      </div>
    </div>
  );
}