// new-LinkUp/client/src/app/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Megaphone, ArrowRight, 
  Sparkles, Clock, BookOpen, User 
} from 'lucide-react';
import Link from 'next/link';
// API & Context
// [修改 1] 引入 getCategories 與 CategoryData
import { getEvents, getAnnouncements, getCategories, AnnouncementData, CategoryData } from '.././api/event-api';
import { EventCardData } from '.././components/card/EventCard';
import HomeEventCard from '.././components/card/HomeEventCard';
import { useFavorites } from '../components/content/member/FavoritesContext';

// [輔助函式] 根據類別名稱回傳對應 Icon (因為資料庫只有名字)
const getCategoryIcon = (name: string) => {
  if (name.includes('課程')) return '📕';
  if (name.includes('展覽')) return '🎨';
  if (name.includes('派對')) return '🎵';
  if (name.includes('聚會')) return '🤝';
  if (name.includes('市集')) return '🎪';
  if (name.includes('比賽')) return '🏀';
  if (name.includes('表演')) return '🎭';
  if (name.includes('研討會')) return '🎤';
  if (name.includes('導覽')) return '🗺️';
  return '✨'; // 預設圖示
};

const MOCK_ARTICLES = [
  { id: 1, title: "2025 音樂祭生存指南：必備物品清單", author: "音樂小編", date: "2024-11-20", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80", desc: "夏天就是要去音樂祭！但要帶什麼才不會手忙腳亂？這篇清單幫你整理好所有懶人包。" },
  { id: 2, title: "探索台北的地下獨立樂團文化", author: "聽團仔", date: "2024-11-18", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", desc: "除了主流音樂，台北的地下 Live House 其實藏著許多寶藏聲音，帶你走訪公館、西門町的秘密基地。" },
  { id: 3, title: "週末露營去！新手也能輕鬆上手的營地推薦", author: "戶外達人", date: "2024-11-15", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80", desc: "不想跑太遠，又想享受芬多精？精選北部 5 個適合新手的露營區，裝備租借也超方便。" },
];

interface LocalBanner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  highlight?: string;
  desc: string;
  type: 'announcement' | 'event';
  link: string;
}

export default function HomePage() {
  const { isFavorited, toggleFavorite } = useFavorites();
  
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [announcements, setAnnouncements] = useState<LocalBanner[]>([]);
  
  const [hotEvents, setHotEvents] = useState<EventCardData[]>([]);
  const [newEvents, setNewEvents] = useState<EventCardData[]>([]);
  const [spotlightEvents, setSpotlightEvents] = useState<EventCardData[]>([]);
  
  // [修改 2] 新增 categories 狀態
  const [categories, setCategories] = useState<CategoryData[]>([]);

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [hotPage, setHotPage] = useState(0);
  const [activeTab, setActiveTab] = useState<'new' | 'spotlight'>('spotlight');

  const HOT_ITEMS_PER_PAGE = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // [修改 3] 在 Promise.all 中加入 getCategories(6)
        const [allEvents, featuredEvents, apiCategories] = await Promise.all([
          getEvents('all', 50),
          getEvents('featured', 3),
          getCategories(8) // 抓取前 6 個類別
        ]);

        // 設定類別資料
        setCategories(apiCategories);

        // 2. 讀取 Admin 設定的 Banner (LocalStorage: 'home_banners')
        let adminBanners: LocalBanner[] = [];
        try {
            const stored = localStorage.getItem('home_banners');
            if (stored) adminBanners = JSON.parse(stored);
        } catch (e) { console.error(e); }

        const activeAnnouncements = adminBanners.filter(b => b.isActive).reverse();
        setAnnouncements(activeAnnouncements);

        // 3. 組合 Hero Slides 邏輯
        const slides: HeroSlide[] = [];

        // 優先顯示 Admin 公告 (最多 3 則)
        const activeAdminBanners = adminBanners.filter(b => b.isActive).slice(0, 3);
        
        activeAdminBanners.forEach(b => {
            slides.push({
                id: `banner-${b.id}`,
                image: b.imageUrl,
                title: b.title,
                highlight: "最新公告",
                desc: "點擊查看詳情",
                type: 'announcement',
                link: b.linkUrl || '#'
            });
        });

        // 補上活動 (最多補到 6 則，或至少補 3 則活動)
        const eventsToTake = featuredEvents.slice(0, 3);
        
        eventsToTake.forEach(evt => {
          slides.push({
            id: `evt-${evt.id}`,
            image: evt.cover_image,
            title: evt.title,
            highlight: evt.location_name,
            desc: `${evt.organizerName} 熱烈售票中，立即搶購！`,
            type: 'event',
            link: `/event/${evt.id}`
          });
        });
        
        if (slides.length < 3 && allEvents.length > 0) {
             const fillCount = 3 - slides.length;
             allEvents.slice(0, fillCount).forEach(evt => {
                if (!slides.some(s => s.id === `evt-${evt.id}`)) {
                    slides.push({
                        id: `fill-${evt.id}`,
                        image: evt.cover_image,
                        title: evt.title,
                        highlight: '熱門推薦',
                        desc: '大家都在關注的活動，別錯過！',
                        type: 'event',
                        link: `/event/${evt.id}`
                    });
                }
             });
        }

        setHeroSlides(slides);

        const now = new Date();
        const validEvents = allEvents.filter(e => new Date(e.start_time) > now || true); 

        setHotEvents([...validEvents].sort(() => 0.5 - Math.random()).slice(0, 9));
        setNewEvents([...validEvents].sort((a, b) => b.id - a.id).slice(0, 6));
        setSpotlightEvents([...validEvents].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).slice(0, 6));

      } catch (error) {
        console.error("載入失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  useEffect(() => {
    if (announcements.length === 0) return;
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex(prev => (prev + 1) % announcements.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [announcements]);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroSlides]);

  const handleToggleFavorite = (id: number) => {
    const allKnownEvents = [...hotEvents, ...newEvents, ...spotlightEvents];
    const targetEvent = allKnownEvents.find(e => e.id === id);
    if (targetEvent) {
      toggleFavorite(targetEvent);
    }
  };

  const nextHotPage = () => {
    if ((hotPage + 1) * HOT_ITEMS_PER_PAGE < hotEvents.length) setHotPage(prev => prev + 1);
  };
  const prevHotPage = () => {
    if (hotPage > 0) setHotPage(prev => prev - 1);
  };
  const nextHero = () => setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
  const prevHero = () => setCurrentHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);


  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white overflow-x-hidden pb-20">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEEEEE_0%,#7D8B93_45%,#0C2838_100%)]"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`, backgroundSize: 'cover', filter: 'grayscale(100%) contrast(150%)' }}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
      </div>

      <div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

      <main className="relative z-10 pt-24 px-4 container mx-auto max-w-6xl flex flex-col gap-16">
        
        {/* 公告欄 */}
        <section className="bg-white/95 backdrop-blur-md border border-white/60 rounded-full px-5 py-3 flex items-center justify-between shadow-lg shadow-black/5 animate-in fade-in slide-in-from-top-4 duration-700 h-14">
            <div className="flex items-center gap-3 overflow-hidden flex-1 h-full">
                <div className="flex items-center gap-1 text-[#EF9D11] font-bold whitespace-nowrap">
                    <Megaphone className="w-5 h-5" />
                    <span className="hidden sm:inline">最新公告：</span>
                </div>
                <div className="flex-1 h-full relative overflow-hidden">
                    {announcements.map((item, idx) => (
                        <div key={item.id} className="absolute top-0 left-0 w-full h-full transition-all duration-700 ease-in-out flex items-center" style={{ transform: `translateY(${(idx - currentAnnouncementIndex) * 100}%)`, opacity: idx === currentAnnouncementIndex ? 1 : 0 }}>
                            <div className="text-sm text-gray-800 font-medium truncate hover:text-[#EF9D11] transition-colors block w-full cursor-default select-none">
                                • {item.title}
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                         <div className="absolute top-0 left-0 w-full h-full flex items-center text-sm text-gray-400">
                            暫無公告
                         </div>
                    )}
                </div>
            </div>
            <Link href="/announcements" className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#EF9D11] whitespace-nowrap ml-4 transition-colors">更多 <ArrowRight className="w-3 h-3" /></Link>
        </section>

        {/* Hero Banner */}
        <section className="relative w-full h-[450px] rounded-[32px] overflow-hidden shadow-2xl group bg-gray-900">
            {heroSlides.length > 0 ? heroSlides.map((slide, index) => (
                <div key={slide.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover transform transition-transform duration-[10s] scale-105 group-hover:scale-110 opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md flex items-center gap-1 ${slide.type === 'announcement' ? 'bg-[#EF9D11]' : 'bg-[#0C2838]/90 border border-white/20'}`}>
                            {slide.type === 'announcement' ? '📌 公告' : '🔥 主打'}
                        </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white z-20">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">{slide.title}<br/><span className="text-[#EF9D11]">{slide.highlight}</span></h1>
                        <p className="text-lg text-gray-200 max-w-xl mb-6 line-clamp-2">{slide.desc}</p>
                        <Link href={slide.link}>
                            <button className="bg-white text-[#0C2838] hover:bg-[#EF9D11] hover:text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg">查看詳情 <ChevronRight size={18} /></button>
                        </Link>
                    </div>
                </div>
            )) : (
               <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">載入中...</div>
            )}
            <button onClick={prevHero} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={24} /></button>
            <button onClick={nextHero} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/30 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={24} /></button>
            <div className="absolute bottom-6 right-8 z-30 flex gap-2">
                {heroSlides.map((_, idx) => (
                    <button key={idx} onClick={() => setCurrentHeroIndex(idx)} className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-[#EF9D11] w-8' : 'bg-white/50 hover:bg-white'}`}/>
                ))}
            </div>
        </section>

        {/* Categories (動態渲染) */}
        <section className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-lg relative z-20">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            
            {/* 1. 渲染 API 回傳的類別 */}
            {categories.map((cat) => {
              return (
                <Link href={`/eventlist?category_id=${cat.id}`} key={cat.id}>
                  <div className="group flex flex-col items-center gap-2 cursor-pointer">
                    <div className="w-16 h-16 rounded-full backdrop-blur-sm border border-white/40 bg-white/10 shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-[#EF9D11] group-hover:border-[#EF9D11] group-hover:text-white transition-all duration-300">
                      {/* 使用輔助函式顯示圖示 */}
                      {getCategoryIcon(cat.name)}
                    </div>
                    <span className="text-sm font-bold text-white group-hover:text-[#EF9D11] transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              );
            })}

            {/* 2. 固定顯示「全部」按鈕 */}
            <Link href="/eventlist">
              <div className="group flex flex-col items-center gap-2 cursor-pointer">
                <div className="w-16 h-16 rounded-full backdrop-blur-sm border border-[#EF9D11] bg-[#EF9D11] shadow-orange-500/30 shadow-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-all duration-300">
                  <ArrowRight size={24} className="text-white" />
                </div>
                <span className="text-sm font-bold text-white">
                  全部
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* 月球 */}
        <div className="relative h-0 w-full z-0 hidden md:block -my-5">
            <img src="/homepage/moon.png" alt="Moon Decoration" className="absolute -top-56 -right-56 w-96 h-96 object-contain  drop-shadow-2xl animate-float-slow pointer-events-none" style={{ transform: 'rotate(15deg)' }}/>
        </div>

        {/* 熱門活動 */}
        <section className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[40px] p-6 md:p-10 shadow-xl relative overflow-hidden z-20">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EF9D11] to-transparent opacity-50"></div>
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-[#0C2838] flex items-center gap-2">🔥 熱門活動 <span className="text-sm font-normal text-gray-500 bg-white/50 px-3 py-1 rounded-full">本週精選</span></h2>
                    <p className="text-[#0C2838]/80 font-medium mt-2">大家都在搶的熱門票券，別錯過！</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={prevHotPage} disabled={hotPage === 0} className="w-10 h-10 rounded-full bg-white/50 hover:bg-white disabled:opacity-30 flex items-center justify-center text-[#0C2838] transition-all"><ChevronLeft size={20}/></button>
                    <button onClick={nextHotPage} disabled={(hotPage + 1) * HOT_ITEMS_PER_PAGE >= hotEvents.length} className="w-10 h-10 rounded-full bg-[#EF9D11] text-white flex items-center justify-center hover:bg-[#d88d0e] disabled:bg-gray-400 transition-all"><ChevronRight size={20}/></button>
                </div>
            </div>
            {loading ? <div className="text-center py-20 text-gray-500">載入中...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[380px]">
                  {hotEvents.slice(hotPage * HOT_ITEMS_PER_PAGE, (hotPage + 1) * HOT_ITEMS_PER_PAGE).map(event => (
                      <div key={event.id} className="h-full animate-in fade-in duration-500">
                          <HomeEventCard 
                            event={event} 
                            isFavorited={isFavorited(event.id)}
                            onToggleFavorite={handleToggleFavorite} 
                          />
                      </div>
                  ))}
              </div>
            )}
        </section>

        {/* [星球 2] 地球 */}
        <div className="relative h-0 w-full z-0 hidden md:block -my-5">
            <img src="/homepage/earth.png" alt="Earth Decoration" className="absolute -top-48 -left-62 w-[30rem] h-[30rem] object-contain  drop-shadow-2xl animate-float-reverse pointer-events-none"/>
        </div>

        {/* 最新/焦點活動 */}
        <section className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-[40px] p-6 md:p-10 shadow-2xl z-20">
             <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-[#0C2838]/10 pb-4 gap-4">
                <h2 className="text-3xl font-bold text-[#0C2838] drop-shadow-sm flex items-center gap-3">
                    {activeTab === 'spotlight' ? <Clock className="text-red-500" /> : <Sparkles className="text-[#EF9D11]" />}
                    {activeTab === 'spotlight' ? '焦點活動' : '最新上架'}
                </h2>
                <div className="flex bg-white/40 p-1 rounded-full backdrop-blur-sm">
                    <button 
                        onClick={() => setActiveTab('spotlight')} 
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'spotlight' ? 'bg-red-500 text-white shadow-lg' : 'text-[#0C2838]/70 hover:text-[#0C2838]'}`}
                    >
                        焦點活動
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('new')} 
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-[#EF9D11] text-white shadow-lg' : 'text-[#0C2838]/70 hover:text-[#0C2838]'}`}
                    >
                        最新上架
                    </button>
                </div>
            </div>
            {loading ? <div className="text-center py-20 text-[#0C2838]/50">載入中...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(activeTab === 'new' ? newEvents : spotlightEvents).map(event => (
                      <div key={event.id} className="h-full animate-in zoom-in-95 duration-300">
                          <HomeEventCard 
                            event={event} 
                            isFavorited={isFavorited(event.id)}
                            onToggleFavorite={handleToggleFavorite} 
                          />
                      </div>
                  ))}
              </div>
            )}
            <div className="mt-10 text-center">
              <Link
                href={
                  activeTab === 'new'
                    ? '/eventlist'
                    : '/eventlist?sort=upcoming'
                }
              >
                <button className="bg-white hover:bg-[#EF9D11] hover:text-white border border-white/30 text-[#0C2838] px-8 py-3 rounded-full font-bold backdrop-blur-md transition-all hover:scale-105 shadow-lg">
                  查看更多{activeTab === 'new' ? '最新' : '焦點'}活動
                </button>
              </Link>
            </div>
        </section>
        
        {/* 文章牆 */}
        <section className="bg-white/20 backdrop-blur-xl border border-white/40 rounded-[40px] p-6 md:p-10 shadow-xl relative overflow-hidden z-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3 drop-shadow-md">
                    <BookOpen className="text-[#EF9D11]" /> 精選文章牆
                </h2>
                <Link href="/post" className="text-[#EF9D11] hover:text-white flex items-center gap-1 transition-colors">
                    閱讀更多 <ChevronRight size={16} />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_ARTICLES.map((article) => (
                    <Link href={`/post/${article.id}`} key={article.id} className="group block h-full">
                        <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-black/60 transition-all duration-300 h-full flex flex-col shadow-lg group-hover:shadow-xl hover:-translate-y-1">
                            <div className="relative h-48 overflow-hidden">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">{article.date}</div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#EF9D11] transition-colors line-clamp-2">{article.title}</h3>
                                <p className="text-gray-300 text-sm line-clamp-2 mb-4 flex-1">{article.desc}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-400 mt-auto">
                                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><User size={14}/></div>
                                    <span>{article.author}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>

      </main>
    </div>
  );
}