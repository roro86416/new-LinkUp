'use client';

import { useState, useEffect, Fragment } from 'react';
import { useUser } from '../context/auth/UserContext';
import { useFavorites, FavoriteEvent } from '../components/content/member/FavoritesContext';
import { Banner } from '../types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Listbox, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';
import EventCard, { EventCardData } from '../components/content/member/EventCard'; 
import { getEvents } from '../api/event-api';

// 這裡借用 EventCard 的資料型別，如果您還沒搬移 EventCard，可以先用 any 或自己定義
interface EventCardData {
  id: number;
  title: string;
  cover_image: string; // 注意後端回傳的是 cover_image
  start_time: string;
  location_name: string;
  description?: string;
  organizerName?: string;
  price?: number;
}

// Icons
import {
  MagnifyingGlassIcon,
  ChevronDownIcon as HiChevronDown,
  PaintBrushIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  MusicalNoteIcon,
  BoltIcon,
  BookOpenIcon,
  MegaphoneIcon, // [新增] 公告圖示
  ArrowRightIcon // [新增] 箭頭圖示
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function HomePage() {
  const [location, setLocation] = useState('台北市');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useUser();
  const router = useRouter();
  const { favoriteEvents, addFavoriteEvent, removeFavoriteEvent } = useFavorites();

  const locations = ['台北市', '新北市', '台中市', '台南市', '高雄市'];
  const categories = [
    { name: '藝術', icon: <PaintBrushIcon className="w-6 h-6" /> },
    { name: '科技', icon: <CodeBracketIcon className="w-6 h-6" /> },
    { name: '商業', icon: <BriefcaseIcon className="w-6 h-6" /> },
    { name: '音樂', icon: <MusicalNoteIcon className="w-6 h-6" /> },
    { name: '運動', icon: <BoltIcon className="w-6 h-6" /> },
  ];

  // ----------------------------------------------------------------
  // 1. Banner & 公告資料 (保留組員的 localStorage 邏輯)
  // ----------------------------------------------------------------
  const [isMounted, setIsMounted] = useState(false);
  const [bannerItems, setBannerItems] = useState<Banner[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setIsMounted(true);

      // --- A. 讀取組員的公告 (LocalStorage) ---
      let announcementBanners: Banner[] = [];
      try {
        const savedBanners = localStorage.getItem('home_banners');
        if (savedBanners) {
          // 只顯示 isActive 為 true 的公告
          announcementBanners = JSON.parse(savedBanners).filter((b: Banner) => b.isActive);
        } else {
          // 若完全沒資料，給一個預設公告
          announcementBanners = [{
            id: 1,
            title: '年度活動盛大開啟',
            imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
            linkUrl: '#',
            isActive: true
          }];
        }
      } catch (error) {
        console.error("公告讀取失敗", error);
      }

      // --- B. 讀取您的活動 (Backend API) ---
      let eventBanners: Banner[] = [];
      try {
        // 這裡我們抓取 "popular" 的前 3 筆活動放上 Banner
        const events = await getEvents('popular', 3);
        
        // ⚠️ 關鍵：將 Event 格式轉換為 Banner 格式
        eventBanners = events.map((event) => ({
          // 為了避免 ID 與 localStorage 的公告 ID (通常是 1, 2, 3) 重複，我們給它加一個大數字
          id: 10000 + event.id, 
          title: event.title,
          imageUrl: event.cover_image, // 對應後端欄位
          linkUrl: `/event/${event.id}`, // 點擊後跳轉到活動詳情
          isActive: true
        }));
      } catch (error) {
        console.error("活動 Banner 讀取失敗", error);
      }

      // --- C. 合併兩者 ---
      // 這裡將公告放在前面，活動放在後面 (您可以依需求 `[...eventBanners, ...announcementBanners]` 交換順序)
      setBannerItems([...announcementBanners, ...eventBanners]);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (bannerItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerItems.length]);

  // ----------------------------------------------------------------
  // 2. 活動列表資料 (從後端 API 抓取)
  // ----------------------------------------------------------------
  const [popularEvents, setPopularEvents] = useState<EventCardData[]>([]);
  const [newlyAddedEvents, setNewlyAddedEvents] = useState<EventCardData[]>([]);
  const [browseEvents, setBrowseEvents] = useState<EventCardData[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        // 這裡呼叫您的後端 API
        const [popRes, newRes, browseRes] = await Promise.all([
          getEvents('popular', 4), // 熱門前 4 筆
          getEvents('new', 4),     // 最新前 4 筆
          getEvents('all', 8),     // 瀏覽全部前 8 筆
        ]);
        setPopularEvents(popRes);
        setNewlyAddedEvents(newRes);
        setBrowseEvents(browseRes);
      } catch (error) {
        console.error("載入活動失敗:", error);
        // 失敗時不擋畫面，保持空陣列或顯示錯誤
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  // 收藏功能
  const handleToggleFavorite = (event: EventCardData) => {
    const isFavorited = favoriteEvents.some(fav => fav.id === event.id);
    if (isFavorited) {
      removeFavoriteEvent(event.id);
      toast.error('已取消收藏');
    } else {
      const eventToSave: FavoriteEvent = {
        id: event.id,
        title: event.title,
        date: new Date(event.start_time).toLocaleDateString(),
        img: event.cover_image,
        desc: '',
        location: event.location_name || '地點待定',
        isUpcoming: true,
        organizerName: event.organizerName || '主辦方'
      };
      addFavoriteEvent(eventToSave);
      toast.success('已成功收藏！');
    }
  };

  // 共用的活動卡片渲染函式 (避免重複程式碼)
  const renderEventCard = (event: EventCardData) => (
    <Link key={event.id} href={`/event/${event.id}`} className="block group">
      <div className="bg-white rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg relative h-full flex flex-col">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteToggle(event);
          }}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
        >
          {favoriteEvents.some(fav => fav.id === event.id) ? (
            <HeartIconSolid className="w-5 h-5 text-red-500" />
          ) : (
            <HeartIconOutline className="w-5 h-5 text-white" />
          )}
        </button>
        <div className="relative w-full h-48">
          <img src={event.cover_image} alt={event.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{new Date(event.start_time).toLocaleDateString()}</p>
          <p className="text-sm text-gray-600 mt-2 line-clamp-1">{event.location_name}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="relative min-h-screen text-gray-900 bg-white overflow-x-hidden">
      
      {/* === 1. Banner 區塊 (保留組員的 Tailwind 寫法) === */}
      <section className="relative w-full h-[400px] overflow-hidden bg-gray-200 group">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {isMounted && bannerItems.length > 0 ? (
            bannerItems.map((banner) => (
              <a
                key={banner.id}
                href={banner.linkUrl || '#'}
                className="w-full h-full flex-shrink-0 relative"
              >
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                {/* Banner 文字遮罩 (可選) */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                  <h2 className="text-white text-3xl font-bold">{banner.title}</h2>
                </div>
              </a>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p>目前沒有可顯示的公告</p>
            </div>
          )}
        </div>

        {/* 搜尋欄 (浮在 Banner 上) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
           {/* pointer-events-auto 讓搜尋框可以被點擊 */}
          <div className="relative w-96 pointer-events-auto">
            <input
              type="text"
              placeholder="搜尋活動..."
              className="w-full pl-10 pr-3 py-3 rounded-full bg-white/90 backdrop-blur text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* 左右箭頭 (保留) */}
        {isMounted && bannerItems.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 z-30 pointer-events-none">
            <button
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer pointer-events-auto"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerItems.length) % bannerItems.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer pointer-events-auto"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerItems.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}
      </section>

      {/* === 2. [新增] 最新公告列表 (純文字) === */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1 text-orange-600 font-bold whitespace-nowrap">
              <MegaphoneIcon className="w-5 h-5" />
              <span>最新公告：</span>
            </div>
            {/* 這裡列出 Banner 的標題作為公告 */}
            <div className="flex-1 overflow-hidden">
              <ul className="flex flex-col sm:flex-row gap-4 sm:items-center animate-none">
                {isMounted && bannerItems.slice(0, 2).map((item) => (
                  <li key={item.id} className="text-sm text-gray-700 hover:text-orange-600 truncate cursor-pointer">
                    • {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* 右下角更多公告按鈕 */}
          <Link href="/announcements" className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 whitespace-nowrap ml-4">
            更多公告 <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* === 3. 類別按鈕 (保持不變) === */}
      <section className="py-10 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-2xl transition-all duration-300 group-hover:bg-orange-100 group-hover:text-orange-600 group-hover:scale-110">
                {cat.icon}
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-orange-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. [修改] 熱門活動 - 使用新的 EventCard */}
      <div className="px-4 md:px-16 py-8 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
          <span className="w-2 h-8 bg-orange-500 rounded-full inline-block"></span>
          熱門活動
        </h2>
        {isLoadingEvents ? (
           <div className="text-center py-12 text-gray-400">活動載入中...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`} className="block h-full">
                <EventCard
                  event={event}
                  isFavorited={favoriteEvents.some(fav => fav.id === event.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 4. [修改] 最新上架 - 使用新的 EventCard */}
      <div className="px-4 md:px-16 py-12 bg-gray-50">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
          最新上架
        </h2>
        {isLoadingEvents ? <div className="text-center py-12">載入中...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newlyAddedEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`} className="block h-full">
                <EventCard
                  event={event}
                  isFavorited={favoriteEvents.some(fav => fav.id === event.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* === 6. 生活日誌 (靜態區塊，保留) === */}
      <section
        className="relative text-white py-20 px-8 bg-cover bg-center flex justify-center items-center my-8"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-3xl text-left z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">生活日誌</h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">今日精選：城市漫步</h3>
          <p className="text-lg mb-6 leading-relaxed opacity-90">
            城市的每個角落都隱藏著故事，從老街的咖啡香氣到河畔的微風，每一步都能感受到生活的溫度。跟隨步伐，慢慢走過不一樣的街道，聆聽人們的笑聲與交談，偶爾停下來看看街頭藝人的表演，或是在小巷的書店裡翻閱一本書，這些看似平凡的瞬間，卻能讓心靈得到滿足。用心觀察身邊的細節，你會發現城市也能像一本厚重的日誌，記錄著每個人的故事與情感。
          </p>
          <button
            className="flex items-center gap-2 text-white font-medium transition-all px-6 py-3 border border-white rounded-lg shadow-lg cursor-pointer bg-white/10 backdrop-blur-sm hover:bg-white/20"
            onClick={() => router.push('/post')}
          >
            <BookOpenIcon className="w-5 h-5" /> 查看更多文章
          </button>
        </div>
      </section>

     {/* 5. [修改] 瀏覽活動 - 使用新的 EventCard */}
      <div className="px-4 md:px-16 py-12 bg-white">
         {/* ... (下拉選單部分保留) ... */}
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
             <span className="font-bold text-gray-900 text-2xl">瀏覽活動</span>
             <Listbox value={location} onChange={setLocation}>
                {/* ... */}
                 <div className="relative w-32">
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-100 py-2 pl-3 pr-10 text-left text-gray-700 shadow-sm hover:bg-gray-200 transition-colors">
                    {location}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiChevronDown className="h-5 w-5 text-gray-500" />
                    </span>
                  </Listbox.Button>
                  {/* ... options ... */}
                 </div>
             </Listbox>
         </div>

        {isLoadingEvents ? <div className="text-center py-12">載入中...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {browseEvents.map((event) => (
              <Link key={event.id} href={`/event/${event.id}`} className="block h-full">
                <EventCard
                  event={event}
                  isFavorited={favoriteEvents.some(fav => fav.id === event.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}