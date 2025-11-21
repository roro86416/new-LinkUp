// new-LinkUp/client/src/app/announcements/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MegaphoneIcon, 
  CalendarDaysIcon, 
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

// -------------------- 型別定義 (對應首頁 LocalBanner) --------------------
interface LocalBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState<LocalBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // -------------------- 讀取 LocalStorage ('home_banners') --------------------
  useEffect(() => {
    // 模擬讀取延遲，讓動畫跑起來
    const timer = setTimeout(() => {
      try {
        // 直接讀取與首頁相同的 Key
        const stored = localStorage.getItem('home_banners');
        
        if (stored) {
          const parsedData: LocalBanner[] = JSON.parse(stored);
          // 過濾出 isActive 的公告，並反轉順序(通常新加的在後面，想顯示在上面)
          const activeBanners = parsedData.filter(b => b.isActive).reverse();
          setAnnouncements(activeBanners);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error('讀取公告失敗:', error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white overflow-x-hidden pb-20">
      
      {/* ---------------- 1. 背景特效 (與首頁 page.tsx 完全一致) ---------------- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEEEEE_0%,#7D8B93_45%,#0C2838_100%)]"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`, backgroundSize: 'cover', filter: 'grayscale(100%) contrast(150%)' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
      </div>

      <div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

      <main className="relative z-10 pt-24 px-4 container mx-auto max-w-6xl flex flex-col gap-10">

        {/* ---------------- 2. Header 區塊 (玻璃擬態 + 文案) ---------------- */}
        <section className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[40px] p-10 md:p-16 shadow-2xl text-center relative overflow-hidden animate-in fade-in slide-in-from-top-8 duration-700">
            {/* 光暈裝飾 */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#EF9D11] opacity-20 blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF9D11] text-white text-sm font-bold tracking-wider mb-6 shadow-lg">
                <MegaphoneIcon className="w-4 h-4" />
                <span>NEWS CENTER</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight mb-6">
                最新消息與公告
              </h1>
              <p className="text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                掌握 LinkUp 的第一手資訊，包含系統更新、熱門活動推薦以及限時優惠好康。
              </p>
            </div>
        </section>

        {/* ---------------- 3. 公告列表 (卡片式) ---------------- */}
        <section className="relative z-20">
          {loading ? (
            // Loading State
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-3xl p-6 h-40 animate-pulse border border-white/20"></div>
              ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid gap-8">
              {announcements.map((item, index) => (
                <div 
                  key={item.id}
                  className="group relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-xl hover:bg-white/30 transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row"
                  style={{ animationDelay: `${index * 100}ms` }} // 依序浮現
                >
                  {/* 圖片區塊 (左側/上方) */}
                  <div className="w-full md:w-1/3 h-56 md:h-auto relative overflow-hidden">
                    {item.imageUrl ? (
                       <img 
                         src={item.imageUrl} 
                         alt={item.title} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                       />
                    ) : (
                       // 若無圖片顯示預設漸層
                       <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white/20">
                          <MegaphoneIcon className="w-16 h-16" />
                       </div>
                    )}
                    
                    {/* 標籤 */}
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#EF9D11] shadow-lg backdrop-blur-md">
                          公告
                        </span>
                    </div>
                  </div>

                  {/* 內容區塊 (右側/下方) */}
                  <div className="flex-1 p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                       <CalendarDaysIcon className="w-4 h-4" />
                       {/* 因為 LocalBanner 沒有日期，這裡顯示 '最新發布' 或暫時隱藏 */}
                       <span>最新發布</span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#EF9D11] transition-colors drop-shadow-md">
                      {item.title}
                    </h3>
                    
                    {/* 雖然 home_banners 沒有 content 欄位，但我們可以顯示連結按鈕 */}
                    <div className="mt-auto pt-4 border-t border-white/10 flex items-center justify-between">
                       <span className="text-gray-300 text-sm">
                         點擊查看詳情以獲取更多資訊
                       </span>
                       
                       {item.linkUrl && (
                         <Link 
                           href={item.linkUrl} 
                           className="inline-flex items-center gap-2 text-[#EF9D11] font-bold hover:text-white transition-colors"
                         >
                           前往查看 <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                         </Link>
                       )}
                    </div>
                  </div>

                  {/* 全卡連結 (提升體驗) */}
                  {item.linkUrl && (
                    <Link href={item.linkUrl} className="absolute inset-0 z-10" aria-label={`查看 ${item.title}`} />
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="text-center py-24 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-xl">
              <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                <MegaphoneIcon className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">目前沒有相關公告</h3>
              <p className="text-gray-400">敬請期待最新的活動消息與系統更新！</p>
            </div>
          )}
          
          {/* 底部裝飾 */}
          {!loading && announcements.length > 0 && (
             <div className="text-center mt-12 mb-8">
               <p className="text-sm text-gray-400/60">已經顯示所有公告</p>
             </div>
          )}
        </section>

      </main>
    </div>
  );
}