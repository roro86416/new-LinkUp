//完整的首頁

'use client';
import { useState, useEffect, Fragment } from 'react';
import { popularEvents, newlyAddedEvents, browseEvents } from './event/data'; // ⭐️ 引入活動資料
import { useUser } from '../context/auth/UserContext'; // ⭐️ 引入 useUser
import { useFavorites, FavoriteEvent } from '../components/content/member/FavoritesContext'; // ⭐️ 1. 引入我們的收藏 Context
// ⭐️ 匯入共用型別
import { Banner } from '../types'; // 此路徑是正確的
import { useRouter } from 'next/navigation';//是 Next.js 13+（App Router） 才有的用法，用來在 前端元件裡實現頁面導向（跳轉）
import Link from 'next/link'; // ⭐️ 引入 Link 元件
import { Listbox, Transition } from '@headlessui/react';
import toast from 'react-hot-toast'; // ⭐️ 修正：匯入 toast
// ⭐️ 修正：替換所有 react-icons，改用 Heroicons
import {
  MagnifyingGlassIcon, // 替代 AiOutlineSearch
  ChevronDownIcon as HiChevronDown, // 替代 HiChevronDown
  PaintBrushIcon, // 替代 FaPaintBrush
  CodeBracketIcon, // 替代 FaLaptopCode (用於科技/程式碼)
  BriefcaseIcon, // 替代 FaBriefcase
  MusicalNoteIcon, // 替代 FaMusic
  BoltIcon, // 替代 FaRunning (用閃電代表速度/運動)
  BookOpenIcon, // 替代 FaTicketAlt (用於查看文章)
} from '@heroicons/react/24/outline'; // 匯入 Heroicons 的線條風格圖標
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// Login Modal
function LoginModal({ onClose, onSwitch }: { onClose: () => void; onSwitch: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white/30 backdrop-blur-md rounded-xl w-96 p-6 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">登入</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm"
        />
        <input
          type="password"
          placeholder="密碼"
          className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm"
        />
        <button className="w-full bg-[#658AD0] hover:bg-[#5a7ab8] text-white py-2 rounded-md transition-colors mb-3">
          登入
        </button>
        <div className="text-center text-sm text-gray-900">
          還未註冊嗎？{' '}
          <span className="text-[#658AD0] hover:text-[#5a7ab8] cursor-pointer font-medium" onClick={onSwitch}>
            請註冊
          </span>
        </div>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Register Modal
function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md">
      <div className="bg-white/30 backdrop-blur-md rounded-xl w-96 p-6 shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">註冊</h2>
        <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <input type="password" placeholder="密碼" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <input type="password" placeholder="確認密碼" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md transition-colors">
          註冊
        </button>
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// HomePage
export default function HomePage() {
  const [location, setLocation] = useState('台北市');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // ✅ 新增 isMounted 狀態
  const { user } = useUser(); // ⭐️ 取得使用者資訊
  const router = useRouter(); // ⭐️ 取得 router 實例
  const { favoriteEvents, addFavoriteEvent, removeFavoriteEvent } = useFavorites(); // ⭐️ 2. 使用中央收藏系統

  const locations = ['台北市', '新北市', '台中市', '台南市', '高雄市'];

  const categories = [
    { name: '藝術', icon: <PaintBrushIcon className="w-6 h-6" /> },
    { name: '科技', icon: <CodeBracketIcon className="w-6 h-6" /> },
    { name: '商業', icon: <BriefcaseIcon className="w-6 h-6" /> },
    { name: '音樂', icon: <MusicalNoteIcon className="w-6 h-6" /> },
    { name: '運動', icon: <BoltIcon className="w-6 h-6" /> },
  ];

  // ⭐️ 新增: Banner 狀態
  // ⭐️ 修正：使用函式初始化，並在客戶端掛載後才讀取
  const [bannerItems, setBannerItems] = useState<Banner[]>(() => {
    // 在伺服器端或客戶端首次渲染時，永遠回傳空陣列
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const savedBanners = localStorage.getItem('home_banners');
      const banners = savedBanners ? JSON.parse(savedBanners) : [];
      // ⭐️ 修正：移除 imageUrl 的過濾，因為後台儲存時已經透過 `isActive` 過濾了
      return banners as Banner[];
    } catch (error) {
      console.error("讀取 Banner 資料失敗:", error);
      return [];
    }
  });

  // ✅ 在元件掛載後將 isMounted 設為 true
  useEffect(() => {
    // 將 setState 非同步化以避免在 effect 中同步 setState 導致 cascading renders
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // ⭐️ 修正：如果沒有圖片或只有一張，則不啟動計時器
    if (bannerItems.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      // ⭐️ 修正：使用 bannerItems.length 而不是 bannerImages.length
      setCurrentSlide((prev) => (prev + 1) % bannerItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [bannerItems.length]); // ⭐️ 修正：當 banner 數量變化時，重新設定計時器

  // ⭐️ 3. 修改點擊處理邏輯
  const handleFavoriteToggle = (event: { id: number; title: string; date: string; img?: string; desc?: string }) => {
    const isFavorited = favoriteEvents.some(fav => fav.id === event.id);

    if (isFavorited) {
      removeFavoriteEvent(event.id);
      toast.error('已取消收藏');
    } else {
      // 將首頁的活動資料轉換成符合收藏系統的格式
      const eventToSave: FavoriteEvent = {
        ...event,
        location: '地點待定', // 補上缺少的欄位
        isUpcoming: true,    // 補上缺少的欄位
        organizerName: '主辦方待定' // 補上缺少的欄位
      };
      addFavoriteEvent(eventToSave);
      toast.success('已成功收藏！');
    }
  };

  return (
    <div className="relative min-h-screen text-gray-900 bg-white overflow-x-hidden">
      {/* Banner */}
      {/* ⭐️ 修正：修改輪播圖結構 */}
      <section className="relative w-full h-[400px] overflow-hidden bg-gray-200 group">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* ⭐️ 修正：只有在 isMounted 為 true 時才渲染 Banner */}
          {isMounted && bannerItems.length > 0 ? (
            bannerItems.map((banner) => (
              <a
                key={banner.id}
                href={banner.linkUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-full flex-shrink-0"
              >
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              </a>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p>目前沒有可顯示的公告</p>
            </div>
          )}
        </div>

        {/* 搜尋欄 + 按鈕 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 gap-4">
          {/* ⭐️ 修正：使用 label 包裹，並為 icon 加上 cursor-pointer */}
          <label htmlFor="banner-search" className="relative w-96 drop-shadow-lg cursor-text">
            <input
              id="banner-search"
              type="text"
              placeholder="搜尋活動"
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-black/40 text-white placeholder-gray-200 text-center backdrop-blur-sm hover:bg-black/50 focus:outline-none border border-white/50 transition-all duration-200"
            />

            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white cursor-pointer" />
          </label>

          <div className="flex gap-2 flex-wrap justify-center">
            {/* <button className="..."> <FaBriefcase className="text-lg" /> 舉辦活動 </button> */}
            {/* <button className="..."> <FaTicketAlt className="text-lg" /> 我的票卷 </button> */}
          </div>
        </div>

        {/* 左右箭頭 (保持不變) */}
        {/* ⭐️ 修正：只有在 isMounted 為 true 且圖片大於一張時才渲染箭頭 */}
        {isMounted && bannerItems.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between px-4 z-50 pointer-events-none">
            <div
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 pointer-events-auto"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerItems.length) % bannerItems.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </div>
            <div
              className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 pointer-events-auto"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerItems.length)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        )}
      </section>

      {/* 類別按鈕 */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-14">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button className="w-20 h-20 rounded-full border border-gray-300 text-gray-900 flex items-center justify-center text-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-2 hover:border-[#EF9D11] hover:text-[#EF9D11] cursor-pointer bg-white">
                {/* ⭐️ 圖標已在 categories 陣列中替換 */}
                {cat.icon}
              </button>
              <span className="text-sm font-semibold text-gray-900">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 熱門活動卡片 */}
      <div className="px-16 py-8 bg-white">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          熱門活動
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularEvents.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="block group"
            >
              <div className="relative rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg">
                <img
                  src={event.img} // ⭐️ 使用 data.ts 中的真實圖片
                  alt={event.title}
                  className="w-full h-56 object-cover"
                />
                {/* 文字區 */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-2xl font-bold">{event.title}</h3>
                  <p className="text-base mt-1">{event.date}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 最新上架 */}
      <div className="px-16 py-8 bg-gray-50">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">
          最新上架
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {newlyAddedEvents.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg relative">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // ⭐️ 阻止 Link 的導航行為
                    e.stopPropagation();
                    handleFavoriteToggle(event);
                  }}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                  aria-label="收藏"
                >
                  {/* 直接從 context 判斷是否已收藏 */}
                  {favoriteEvents.some(fav => fav.id === event.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIconOutline className="w-5 h-5 text-white" />
                  )}
                </button>
                <img src={event.img} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-700">{event.date}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* 生活日誌精選 */}
      <section
        className="relative text-white py-20 px-8 bg-cover bg-center flex justify-center items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div> {/* 輕微暗色增加可讀性 */}

        <div className="relative max-w-3xl text-left z-10">
          <h2 className="text-5xl font-bold mb-6 tracking-tight">生活日誌</h2>

          <h3 className="text-3xl font-semibold mb-4">今日精選：城市漫步</h3>
          <p className="text-lg mb-6 leading-relaxed">
            城市的每個角落都隱藏著故事，從老街的咖啡香氣到河畔的微風，每一步都能感受到生活的溫度。跟隨步伐，慢慢走過不一樣的街道，聆聽人們的笑聲與交談，偶爾停下來看看街頭藝人的表演，或是在小巷的書店裡翻閱一本書，這些看似平凡的瞬間，卻能讓心靈得到滿足。用心觀察身邊的細節，你會發現城市也能像一本厚重的日誌，記錄著每個人的故事與情感。
          </p>

          <button
            className="flex items-center gap-2 text-white font-medium transition-all px-6 py-3 border border-white rounded-lg 
            shadow-lg cursor-pointer bg-black/20 backdrop-blur-sm hover:bg-white/20"
            onClick={() => router.push('/post')}
          >

            <BookOpenIcon className="w-5 h-5" /> 查看更多文章
          </button>
        </div>
      </section>



      <div className="px-16 py-12 bg-white">
        {/* 標題 + 下拉選單 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
          <span className="font-semibold text-gray-900 text-lg">瀏覽活動</span>

          <Listbox value={location} onChange={setLocation}>
            <div className="relative w-32">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md bg-white/50 backdrop-blur-sm py-2 pl-3 pr-10 text-left text-gray-900 shadow-sm border border-gray-300 hover:bg-white/70 transition-colors">
                {location}
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  {/* ⭐️ 替換圖標 */}
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

        {/* 活動列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {browseEvents.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg relative">
                {/* ⭐️ 新增：收藏按鈕 */}
                <button
                  onClick={(e) => {
                    e.preventDefault(); // ⭐️ 阻止 Link 的導航行為
                    e.stopPropagation();
                    handleFavoriteToggle(event);
                  }}
                  className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                  aria-label="收藏"
                >
                  {/* 直接從 context 判斷是否已收藏 */}
                  {favoriteEvents.some(fav => fav.id === event.id) ? (
                    <HeartIconSolid className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIconOutline className="w-5 h-5 text-white" />
                  )}
                </button>
                <img src={event.img} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{event.title}</h3>
                  <p className="text-sm text-gray-700">{event.date}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{event.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}