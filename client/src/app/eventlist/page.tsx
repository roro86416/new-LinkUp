// new-LinkUp/client/src/app/eventlist/page.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, XMarkIcon, TagIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
// [修改] 引入 getCategories 與 CategoryData
import { getEvents, getCategories, CategoryData } from '../../api/event-api';
import { EventCardData } from '../../components/card/EventCard';
import HomeEventCard from '../../components/card/HomeEventCard';
import { useFavorites } from '../../components/content/member/FavoritesContext';

const SORT_OPTIONS = [
  { label: '最新發布', value: 'newest' },
  { label: '即將開始', value: 'upcoming' },
  { label: '價格：由低到高', value: 'price_asc' },
  { label: '價格：由高到低', value: 'price_desc' },
];

export default function EventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // [修改] 新增 categories 狀態來儲存從後端抓回來的類別
  const [categories, setCategories] = useState<CategoryData[]>([]);
  
  const [allEvents, setAllEvents] = useState<EventCardData[]>([]);
  const [visibleCount, setVisibleCount] = useState(9); // 控制顯示數量
  const [loading, setLoading] = useState(true);
  const { isFavorited, toggleFavorite } = useFavorites();
  const [showBackToTop, setShowBackToTop] = useState(false);

  // 從 URL 初始化狀態
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  // [修改] 改用 selectedCategoryId (number | null)
  const initialCatId = searchParams.get('category_id');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(initialCatId ? Number(initialCatId) : null);
  
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // 1. 載入資料 (平行載入類別與活動)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 平行請求：抓取類別清單 & 抓取活動列表 (帶入 category_id)
        const [catsData, eventsData] = await Promise.all([
          getCategories(), // 抓全部類別
          getEvents('all', 100, selectedCategoryId || undefined)
        ]);
        
        setCategories(catsData);
        setAllEvents(eventsData);
      } catch (error) {
        console.error("載入失敗:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategoryId]); // [關鍵] 當類別 ID 改變時，重新向後端抓取活動

  // 2. 同步 URL (當篩選條件改變時)
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    // [修改] 將 category_id 寫入 URL
    if (selectedCategoryId) params.set('category_id', selectedCategoryId.toString());
    if (sortBy !== 'newest') params.set('sort', sortBy);
    
    router.replace(`/eventlist?${params.toString()}`, { scroll: false });
  }, [searchTerm, selectedCategoryId, sortBy, router]);

  useEffect(() => {
    updateUrl();
    setVisibleCount(9); // 篩選條件改變時重置顯示數量
  }, [searchTerm, selectedCategoryId, sortBy, updateUrl]);

  // 3. 用戶端過濾與排序邏輯 (類別已由後端過濾，這裡處理關鍵字與排序)
  const filteredEvents = useMemo(() => {
    let result = [...allEvents];

    // (A) 關鍵字搜尋
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(lowerTerm) ||
        e.location_name.toLowerCase().includes(lowerTerm) ||
        e.organizerName.toLowerCase().includes(lowerTerm)
      );
    }

    // (B) 排序邏輯
    switch (sortBy) {
      case 'newest': 
        result.sort((a, b) => b.id - a.id);
        break;
      case 'upcoming': 
        result.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
        break;
      case 'price_asc': 
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc': 
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [allEvents, searchTerm, sortBy]);

  // 計算當前顯示的事件
  const displayEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  const handleToggleFavorite = (id: number) => {
    const event = allEvents.find(e => e.id === id);
    if (event) toggleFavorite(event);
  };

  // 回到頂部邏輯
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 取得排序標籤顯示文字
  const currentSortLabel = useMemo(() => {
      return SORT_OPTIONS.find(opt => opt.value === sortBy)?.label;
  }, [sortBy]);

  // [新增] 取得當前選中類別的名稱 (用於顯示 Active Tag)
  const currentCategoryName = useMemo(() => {
      return categories.find(c => c.id === selectedCategoryId)?.name;
  }, [categories, selectedCategoryId]);

  return (
    <div className="min-h-screen font-sans relative selection:bg-[#EF9D11] selection:text-white pb-20 bg-[#0C2838]">
      
      {/* 背景特效 */}
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
        <img src="/homepage/moon.png" alt="" className="absolute top-20 right-[-100px] w-64 h-64 object-contain opacity-60 animate-float-slow pointer-events-none" />
      </div>

      <div className="fixed top-0 left-0 w-full h-20 z-50 pointer-events-none"></div>

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

        {/* ================= 搜尋與篩選工具列 ================= */}
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
              {/* 類別篩選 (動態渲染) */}
              <div className="relative min-w-[140px]">
                <select 
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full appearance-none bg-black/20 border border-white/20 text-white py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:border-[#EF9D11] cursor-pointer hover:bg-black/30 transition font-bold"
                >
                  <option value="" className="text-black">所有類別</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} className="text-black">{cat.name}</option>
                  ))}
                </select>
                <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              {/* 排序 */}
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

          {/* 手機版展開 */}
          {showMobileFilters && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 animate-in slide-in-from-top-2">
              <div>
                <label className="text-xs text-gray-400 mb-1 block ml-1">活動類別</label>
                <div className="flex flex-wrap gap-2">
                   <button 
                       onClick={() => setSelectedCategoryId(null)}
                       className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedCategoryId === null ? 'bg-[#EF9D11] text-white' : 'bg-white/10 text-gray-300'}`}
                   >
                       全部
                   </button>
                   {categories.map(cat => (
                     <button 
                       key={cat.id} 
                       onClick={() => setSelectedCategoryId(cat.id)}
                       className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedCategoryId === cat.id ? 'bg-[#EF9D11] text-white' : 'bg-white/10 text-gray-300'}`}
                     >
                       {cat.name}
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

        {/* ================= 篩選標籤顯示區 (Active Filter Tags) ================= */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-3 shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="flex flex-wrap items-center gap-2 min-h-[32px] animate-in fade-in duration-500">
            <span className="text-white text-sm uppercase tracking-wider m-1 font-bold mr-2">篩選條件：</span>
            
            {/* 搜尋關鍵字 */}
            {searchTerm && (
                 <button 
                    onClick={() => setSearchTerm('')}
                    className="group px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-400 text-xs font-medium flex items-center gap-1 hover:bg-purple-500 hover:text-white transition-all"
                >
                    搜尋: {searchTerm}
                    <XMarkIcon className="w-3 h-3 group-hover:text-white" />
                </button>
            )}

            {/* 分類標籤 (顯示選中的類別名稱) */}
            {selectedCategoryId && currentCategoryName && (
                <button 
                    onClick={() => setSelectedCategoryId(null)}
                    className="group px-3 py-1 rounded-full bg-[#EF9D11]/20 border border-[#EF9D11]/50 text-[#EF9D11] text-xs font-medium flex items-center gap-1 hover:bg-[#EF9D11] hover:text-white transition-all"
                >
                    <TagIcon className="w-3 h-3" />
                    {currentCategoryName}
                    <XMarkIcon className="w-3 h-3 group-hover:text-white" />
                </button>
            )}

            {/* 排序標籤 (僅在非預設時顯示) */}
            {sortBy !== 'newest' && currentSortLabel && (
                <button 
                    onClick={() => setSortBy('newest')}
                    className="group px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50 text-blue-400 text-xs font-medium flex items-center gap-1 hover:bg-blue-500 hover:text-white transition-all"
                >
                    <ArrowsUpDownIcon className="w-3 h-3" />
                    {currentSortLabel}
                    <XMarkIcon className="w-3 h-3 group-hover:text-white" />
                </button>
            )}

            {/* 若無任何篩選，顯示預設標籤 */}
            {!searchTerm && !selectedCategoryId && sortBy === 'newest' && (
                 <div className="px-3 py-1 rounded-full  bg-white/10 border border-white/20 text-white/60 text-xs font-medium">
                    所有活動
                 </div>
            )}
        </div>
        </div>

        {/* ================= 活動列表區 ================= */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EF9D11]"></div>
               <p className="text-gray-400 mt-4">正在載入活動...</p>
            </div>
          ) : displayEvents.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {displayEvents.map((event, index) => (
                    // 卡片動畫：從左側滑入 (Slide In From Left) + 漸顯
                    <div key={`${event.id}-${index}`} className="h-full animate-in slide-in-from-left-4 fade-in duration-700 fill-mode-backwards" style={{ animationDelay: `${(index % 9) * 100}ms` }}>
                      <HomeEventCard 
                        event={event} 
                        isFavorited={isFavorited(event.id)} 
                        onToggleFavorite={handleToggleFavorite} 
                      />
                    </div>
                  ))}
                </div>

                {/* 查看更多按鈕 */}
                {hasMore && (
                    <div className="mt-12 flex justify-center">
                        <button 
                            onClick={handleLoadMore}
                            className="group relative px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-full text-white font-bold transition-all flex items-center gap-2 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                查看更多活動 <ArrowDownIcon className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                            </span>
                            {/* 底部漸層光暈效果 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EF9D11]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        </button>
                    </div>
                )}
            </>
          ) : (
            <div className="text-center py-32 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
               <p className="text-2xl text-gray-300 font-bold">沒有找到相關活動</p>
               <p className="text-gray-500 mt-2">試試看調整搜尋關鍵字或篩選條件吧！</p>
               <button 
                 onClick={() => { setSearchTerm(''); setSelectedCategoryId(null); setSortBy('newest'); }}
                 className="mt-6 px-6 py-2 bg-white/10 hover:bg-[#EF9D11] text-white rounded-full transition-all"
               >
                 清除所有條件
               </button>
            </div>
          )}
        </div>

      </main>

      {/* 回到頂部按鈕 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-[#EF9D11] text-white rounded-full shadow-lg hover:bg-[#d88d0e] transition-all duration-300 z-50 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        <ArrowUpIcon className="h-6 w-6" />
      </button>
    </div>
  );
}