// new-LinkUp/client/src/app/events/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { getEvents } from '../../api/event-api'; // [引用] 使用現有的 API
import { EventCardData } from '../../components/card/EventCard';
import HomeEventCard from '../../components/card/HomeEventCard';
import { useFavorites } from '../../components/content/member/FavoritesContext'; // [引用] 整合收藏功能

// 模擬分類資料 (建議與首頁保持一致或從後端撈取)
const CATEGORIES = ['全部', '音樂', '戶外', '展覽', '學習', '親子', '運動'];

// 排序選項
const SORT_OPTIONS = [
  { label: '最新發布', value: 'newest' },
  { label: '即將開始', value: 'upcoming' },
  { label: '價格：由低到高', value: 'price_asc' },
  { label: '價格：由高到低', value: 'price_desc' },
];

export default function EventsPage() {
  // 1. 資料與狀態管理
  const [allEvents, setAllEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorited, toggleFavorite } = useFavorites(); // 取得收藏狀態

  // 2. 搜尋與篩選狀態
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 3. 載入活動資料
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 這裡抓取 'all' 類型的活動，數量設為 100 (或更多)
        const data = await getEvents('all', 100);
        setAllEvents(data);
      } catch (error) {
        console.error("載入活動失敗:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 4. 用戶端過濾邏輯 (Filter & Search Logic)
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    // (A) 關鍵字搜尋 (標題、地點、主辦方)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(lowerTerm) ||
        e.location_name.toLowerCase().includes(lowerTerm) ||
        e.organizerName.toLowerCase().includes(lowerTerm)
      );
    }

    // (B) 類別篩選 (目前 EventCardData 暫無 category 欄位，這裡預留邏輯或需擴充 API)
    // 如果未來 API 有回傳 category，可在此過濾：
    // if (selectedCategory !== '全部') {
    //    result = result.filter(e => e.category === selectedCategory);
    // }

    // (C) 排序邏輯
    switch (sortBy) {
      case 'newest': // ID 越大越新 (假設)
        result.sort((a, b) => b.id - a.id);
        break;
      case 'upcoming': // 日期越近越前
        result.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        break;
      case 'price_asc': // 價格低到高
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc': // 價格高到低
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [allEvents, searchTerm, selectedCategory, sortBy]);

  // 處理切換收藏 (包裝成符合 HomeEventCard 需求的格式)
  const handleToggleFavorite = (id: number) => {
    const event = allEvents.find(e => e.id === id);
    if (event) {
      toggleFavorite(event);
    }
  };

  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white pb-20">
      
      {/* ================= 背景特效 (同首頁) ================= */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEEEEE_0%,#7D8B93_45%,#0C2838_100%)]"></div>
        <div className="absolute inset-0 opacity-30 mix-blend-overlay" 
             style={{ 
               backgroundImage: `url('https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=2080&auto=format&fit=crop')`, 
               backgroundSize: 'cover', 
               filter: 'grayscale(100%) contrast(150%)' 
             }}>
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
        
        {/* 漂浮星球 (裝飾) */}
        <img src="/homepage/moon.png" alt="" className="absolute top-20 right-[-100px] w-64 h-64 object-contain opacity-60 animate-float-slow pointer-events-none" />
      </div>

      <div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

      {/* ================= 主要內容 ================= */}
      <main className="relative z-10 pt-28 px-4 container mx-auto max-w-7xl flex flex-col gap-8">
        
        {/* 標題區 */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            探索精彩活動
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            發現您感興趣的展覽、音樂祭與各類體驗。
          </p>
        </div>

        {/* ================= 搜尋與篩選工具列 (Glassmorphism) ================= */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* 搜尋欄 */}
            <div className="relative w-full md:flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#EF9D11] transition-colors" />
              </div>
              <input
                type="text"
                placeholder="搜尋活動名稱、地點或主辦方..."
                className="w-full rounded-xl border border-white/20 bg-black/20 text-white pl-11 pr-4 py-3 text-base shadow-inner outline-none focus:border-[#EF9D11] focus:bg-black/30 focus:ring-1 focus:ring-[#EF9D11] transition-all placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* 篩選器與排序 (桌面版) */}
            <div className="hidden md:flex gap-3 w-full md:w-auto">
              {/* 類別下拉 (目前僅 UI) */}
              <div className="relative min-w-[140px]">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none bg-black/20 border border-white/20 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#EF9D11] cursor-pointer hover:bg-black/30 transition font-bold"
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat} className="text-black">{cat}</option>)}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* 排序下拉 */}
              <div className="relative min-w-[180px]">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none bg-black/20 border border-white/20 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#EF9D11] cursor-pointer hover:bg-black/30 transition font-bold"
                >
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="text-black">{opt.label}</option>)}
                </select>
                <ArrowsUpDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* 手機版篩選按鈕 */}
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden w-full bg-[#EF9D11] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#d88d0e] transition shadow-lg"
            >
              <FunnelIcon className="h-5 w-5" /> 篩選與排序
            </button>
          </div>

          {/* 手機版展開的篩選器 */}
          {showMobileFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 animate-in slide-in-from-top-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block ml-1">活動類別</label>
                <div className="flex flex-wrap gap-2">
                   {CATEGORIES.map(cat => (
                     <button 
                       key={cat} 
                       onClick={() => setSelectedCategory(cat)}
                       className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedCategory === cat ? 'bg-[#EF9D11] text-white' : 'bg-white/10 text-gray-300'}`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block ml-1">排序方式</label>
                <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-black/20 border border-white/20 text-white py-2 px-3 rounded-lg focus:outline-none text-sm"
                  >
                    {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="text-black">{opt.label}</option>)}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ================= 活動列表區 ================= */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF9D11]"></div>
               <p className="text-gray-400 mt-4">正在載入活動...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredEvents.map(event => (
                <div key={event.id} className="h-full animate-in fade-in duration-500">
                  <HomeEventCard 
                    event={event} 
                    isFavorited={isFavorited(event.id)} 
                    onToggleFavorite={handleToggleFavorite} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
               <p className="text-2xl text-gray-300 font-bold">沒有找到相關活動</p>
               <p className="text-gray-500 mt-2">試試看調整搜尋關鍵字或篩選條件吧！</p>
               <button 
                 onClick={() => { setSearchTerm(''); setSelectedCategory('全部'); }}
                 className="mt-6 px-6 py-2 bg-white/10 hover:bg-[#EF9D11] text-white rounded-full transition-all"
               >
                 清除所有條件
               </button>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}