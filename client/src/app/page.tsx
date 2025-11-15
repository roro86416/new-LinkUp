'use client';
import { useState, useEffect, Fragment } from 'react';
import { useUser } from '../context/auth/UserContext';
import { useModal } from '../context/auth/ModalContext';
import { Listbox, Transition } from '@headlessui/react';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon as HiChevronDown,
  PaintBrushIcon,
  CodeBracketIcon,
  BriefcaseIcon,
  MusicalNoteIcon,
  BoltIcon,
  BookOpenIcon,
  TicketIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// [!!!] 1. 引入 Swiper 元件和模組
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules'; 

// [!!!] 2. 引入 Swiper 必要的 CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import EventCard, { type EventCardData } from '../components/card/EventCard'; 
import { getEvents } from '../api/event-api'; 

// HomePage
export default function HomePage() {
  const [location, setLocation] = useState('台北市')
  const [isMounted, setIsMounted] = useState(false);
  const { user, updateUser } = useUser();
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const { openLogin } = useModal();
  const locations = ['台北市', '新北市', '台中市', '台南市', '高雄市'];
  const categories = [
    { name: '藝術', icon: <PaintBrushIcon className="w-6 h-6" /> },
    { name: '科技', icon: <CodeBracketIcon className="w-6 h-6" /> },
    { name: '商業', icon: <BriefcaseIcon className="w-6 h-6" /> },
    { name: '音樂', icon: <MusicalNoteIcon className="w-6 h-6" /> },
    { name: '運動', icon: <BoltIcon className="w-6 h-6" /> },
  ];

  const [popularEvents, setPopularEvents] = useState<EventCardData[]>([]);
  const [newlyAddedEvents, setNewlyAddedEvents] = useState<EventCardData[]>([]);
  const [browseEvents, setBrowseEvents] = useState<EventCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // (isMounted 和 API 獲取資料的 useEffect 保持不變)
  useEffect(() => {
    const t = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchHomepageData = async () => {
      setIsLoading(true);
      try {
        const [popRes, newRes, browseRes] = await Promise.all([
          getEvents('popular', 4),
          getEvents('new', 4),
          getEvents('all', 8),
        ]);
        setPopularEvents(popRes);
        setNewlyAddedEvents(newRes);
        setBrowseEvents(browseRes);
      } catch (error) {
        console.error("獲取首頁資料失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomepageData();
  }, []);

  const toggleFavorite = (eventId: number) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId);
      } else {
        newFavorites.add(eventId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="relative min-h-screen text-gray-900 bg-white overflow-x-hidden">
      
      {/* [!!!] 7. Banner (已換成 <Swiper>) */}
      <section className="relative w-full h-[400px] overflow-hidden bg-gray-200">
        {isLoading || popularEvents.length === 0 ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" /> 
        ) : (
          <Swiper
            // 註冊模組
            modules={[Autoplay, Navigation, Pagination, EffectFade]}
            
            // 功能設定
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            navigation={true} // <-- [!] 開啟 "預設" 的左右箭頭
            pagination={{ clickable: true }} // <-- [!] 開啟 "預設" 的小白點
            
            // 視覺效果 (保持您要的模糊背景邏輯)
            effect="fade"
            fadeEffect={{ crossFade: true }}
            className="w-full h-full"
          >
            {popularEvents.map((event) => (
              <SwiperSlide key={event.id}>
                {/* 這是 "一個" Slide 的內容 */}
                <>
                  {/* 圖層 1: 模糊背景層 (z-10) */}
                  <img
                    src={event.cover_image}
                    alt="Banner Background"
                    className="absolute inset-0 z-10 w-full h-full object-cover filter blur-xl scale-110"
                  />
                  <div className="absolute inset-0 z-10 bg-black/30" />
                  
                  {/* 圖層 2: 清晰前景層 (z-20) */}
                  <div className="relative z-20 w-full h-full flex justify-center items-center">
                    <img
                      src={event.cover_image} 
                      alt={event.title}
                      className="z-20 w-[1000px] h-full object-cover" 
                    />
                  </div>
                </>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        {/* [!!!] 8. 移除了手動的左右箭頭 <div> */}
        
        {/* [!!!] 9. 移除了手動的小白點 <div> */}

      </section>
      {/* 類別按鈕 (保持不變) */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-14">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button className="w-20 h-20 rounded-full border border-gray-300 text-gray-900 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-2 hover:border-[#EF9D11] hover:text-[#EF9D11] cursor-pointer bg-white">
                {cat.icon}
              </button>
              <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 熱門活動卡片 (保持不變) */}
      <div className="px-16 py-8 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          熱門活動
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <p className="text-center col-span-4">載入中...</p>
          ) : (
            popularEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event} 
                isFavorited={favorites.has(event.id)} 
                onToggleFavorite={toggleFavorite} 
              />
            ))
          )}
        </div>
      </div>

      {/* 最新上架 (保持不變) */}
      <div className="px-16 py-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          最新上架
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {isLoading ? (
            <p className="text-center col-span-4">載入中...</p>
          ) : (
            newlyAddedEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                isFavorited={favorites.has(event.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

      {/* 生活日誌精選 (保持不變) */}
      <section
        className="relative text-white py-20 px-8 bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div> 
        <div className="relative max-w-3xl text-left z-10">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">生活日誌</h2>
          <h3 className="text-3xl font-semibold mb-4">今日精選：城市漫步</h3>
          <p className="text-lg mb-6 leading-relaxed">
            城市的每個角落都隱藏著故事...
          </p>
          <button
            className="flex items-center gap-2 text-white font-medium transition-all px-6 py-3 border border-white rounded-lg 
            shadow-lg cursor-pointer bg-black/20 backdrop-blur-sm hover:bg-white/20"
          >
            <BookOpenIcon className="w-5 h-5" /> 查看更多文章
          </button>
        </div>
      </section>

      {/* 瀏覽活動 (保持不變) */}
      <div className="px-16 py-12 bg-white">
        {/* 標題 + 下拉選單 (保持不變) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <span className="font-semibold text-gray-900 text-lg">瀏覽活動</span>
          <Listbox value={location} onChange={setLocation}>
            <div className="relative w-32">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white/50 backdrop-blur-sm py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm border border-gray-300 hover:bg-white/70 transition-colors">
                {location}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiChevronDown className="h-5 w-5 text-gray-700" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white/70 backdrop-blur-sm py-1 text-base shadow-lg focus:outline-none z-[9999]">
                  {locations.map((loc, idx) => (
                    <Listbox.Option
                      key={idx}
                      className={({ active, selected }) =>
                        `cursor-pointer select-none py-2 pl-3 pr-9 transition-all duration-200 ${selected ? 'bg-orange-400 text-white' : active ? 'bg-orange-400/30 text-white' : 'text-gray-900'}`
                      }
                      value={loc}
                    >
                      {loc}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>

        {/* 活動列表 (保持不變) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {isLoading ? (
             <p className="text-center col-span-4">載入中...</p>
          ) : (
            browseEvents.map((event) => (
              <EventCard 
                key={event.id}
                event={event}
                isFavorited={favorites.has(event.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}