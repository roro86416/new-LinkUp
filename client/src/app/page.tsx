'use client';
import { useState, useEffect, Fragment } from 'react';
import { useUser } from '../context/auth/UserContext'; // ⭐️ 引入 useUser
import { useModal } from '../context/auth/ModalContext'; // ⭐️ 引入 useModal
import { Listbox, Transition } from '@headlessui/react';

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
          type="text"
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
        <input type="text" placeholder="Email" className="w-full border border-gray-300 rounded-md p-2 mb-3 bg-white/50 backdrop-blur-sm" />
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
  const { user, updateUser } = useUser(); // ⭐️ 取得使用者資訊和更新函式
  const [favorites, setFavorites] = useState<Set<number>>(new Set()); // 移除模擬資料，預設為空
  const { openLogin } = useModal(); // ⭐️ 取得開啟登入 Modal 的函式

  const locations = ['台北市', '新北市', '台中市', '台南市', '高雄市'];

  const categories = [
    { name: '藝術', icon: <PaintBrushIcon className="w-6 h-6" /> },
    { name: '科技', icon: <CodeBracketIcon className="w-6 h-6" /> },
    { name: '商業', icon: <BriefcaseIcon className="w-6 h-6" /> },
    { name: '音樂', icon: <MusicalNoteIcon className="w-6 h-6" /> },
    { name: '運動', icon: <BoltIcon className="w-6 h-6" /> },
  ];

  // 熱門活動資料 (4筆)
  const popularEvents = [
    { id: 1, title: '城市光影攝影展', date: 'Oct 20, 2025', desc: '集結頂尖攝影師，捕捉城市中最動人的光影瞬間。', img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: '沉浸式藝術體驗', date: 'Oct 21, 2025', desc: '結合聲光與數位藝術，帶您進入前所未有的奇幻世界。', img: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: '戶外爵士音樂節', date: 'Oct 22, 2025', desc: '在星空下享受慵懶的爵士樂，品味生活的美好。', img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: '未來科技高峰會', date: 'Oct 23, 2025', desc: '與科技巨頭一同探討 AI、元宇宙與區塊鏈的未來。', img: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=800&q=80' },
  ];

  // 最新上架資料 (4筆)
  const newlyAddedEvents = [
    { id: 5, title: '手沖咖啡品鑑會', date: 'Nov 1, 2025', desc: '從選豆到沖煮，咖啡大師帶您領略精品咖啡的魅力。', img: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: '週末電影馬拉松', date: 'Nov 5, 2025', desc: '連續播放經典科幻電影，享受大銀幕的震撼。', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80' },
    { id: 7, title: '寵物友善市集', date: 'Nov 10, 2025', desc: '帶上你的毛小孩，一起逛市集、交朋友。', img: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&w=800&q=80' },
    { id: 8, title: '親子烘焙教室', date: 'Nov 12, 2025', desc: '與孩子一起動手做點心，創造甜蜜的家庭回憶。', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
  ];

  // 瀏覽活動資料 (8筆)
  const browseEvents = [
    { id: 9, title: '山林健行與野餐', date: 'Dec 1, 2025', desc: '遠離塵囂，走入山林，享受大自然的寧靜與美好。', img: 'https://images.unsplash.com/photo-1454982523318-4b6396f39d3a?auto=format&fit=crop&w=800&q=80' },
    { id: 10, title: '數位行銷實戰營', date: 'Dec 5, 2025', desc: '學習最新的數位行銷工具與策略，提升品牌能見度。', img: 'https://images.unsplash.com/photo-1557862921-37829c790f19?auto=format&fit=crop&w=800&q=80' },
    { id: 11, title: 'VR 遊戲競技場', date: 'Dec 10, 2025', desc: '戴上 VR 頭盔，進入虛擬世界，體驗前所未有的遊戲快感。', img: 'https://assets.simpleviewinc.com/sv-raleigh/image/upload/c_limit,h_1200,q_75,w_1200/v1/cms_resources/clients/raleigh/EX_LCS_Finals_2023_Pablo_Jasso_04_09_23_Sunday45_cdbf5077-3eaf-4bb9-9381-307f2cb596b1.jpg' },
    { id: 12, title: '星空下的瑜珈課', date: 'Dec 12, 2025', desc: '在寧靜的夜晚，跟隨星光伸展身心，釋放壓力。', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
    { id: 13, title: '獨立樂團演唱會', date: 'Dec 15, 2025', desc: '感受最純粹的音樂能量，支持本地獨立音樂創作。', img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
    { id: 14, title: '居家調酒教學', date: 'Dec 18, 2025', desc: '學習基礎調酒技巧，在家也能輕鬆調製出美味雞尾酒。', img: 'https://www.1shot.tw/wp-content/uploads/2021/03/1005px-Gin-tonic-1.jpg' },
    { id: 15, title: '街頭美食嘉年華', date: 'Dec 20, 2025', desc: '匯集全台特色小吃，一場滿足您所有味蕾的盛宴。', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80' },
    { id: 16, title: '跨年煙火派對', date: 'Dec 31, 2025', desc: '在絢爛的煙火下，與大家一同迎接嶄新的一年。', img: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80' },
    { id: 17, title: '桌遊派對夜', date: 'Jan 5, 2026', desc: '集結各式經典與新潮桌遊，與好友們一較高下。', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80' },
    { id: 18, title: '行動應用開發者聚會', date: 'Jan 10, 2026', desc: '分享 iOS 與 Android 開發技巧，交流最新技術趨勢。', img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80' },
    { id: 19, title: '古蹟文化導覽', date: 'Jan 15, 2026', desc: '跟隨歷史學家，探索城市中被遺忘的古老故事。', img: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?auto=format&fit=crop&w=800&q=80' },
    { id: 20, title: '植栽與花藝設計', date: 'Jan 20, 2026', desc: '學習如何用綠色植物與美麗花朵點綴您的生活空間。', img: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?auto=format&fit=crop&w=800&q=80' },
  ];

  const bannerImages = [
    'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80',
    'https://images.pexels.com/photos/247599/pexels-photo-247599.jpeg?auto=compress&cs=tinysrgb&h=1080&w=1920',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 在元件掛載後將 isMounted 設為 true
  useEffect(() => {
    // 將 setState 非同步化以避免在 effect 中同步 setState 導致 cascading renders
    const t = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  // ✅ 切換收藏狀態
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
      {/* Banner */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img src={bannerImages[currentSlide]} alt="banner" className="w-full h-full object-cover" />


        {/* 搜尋欄 + 按鈕 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-40 gap-4">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="搜尋活動"
              className="w-full pl-10 pr-3 py-3 rounded-lg bg-black/20 text-white placeholder-white text-center hover:bg-black/30 focus:outline-none focus:ring-0 border border-white transition-all duration-200 cursor-pointer"
            />
            {/* ⭐️ 替換圖標 */}
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
          {/* ⭐️ 移除「舉辦活動」和「我的票卷」按鈕 */}
          <div className="flex gap-2 flex-wrap justify-center">
            {/* <button className="..."> <FaBriefcase className="text-lg" /> 舉辦活動 </button> */}
            {/* <button className="..."> <FaTicketAlt className="text-lg" /> 我的票卷 </button> */}
          </div>
        </div>

        {/* 左右箭頭 (保持不變) */}
        <div
          className="absolute inset-y-0 left-4 flex items-center z-50 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
        >
          <span className="text-white text-3xl select-none drop-shadow-md">‹</span>
        </div>
        <div
          className="absolute inset-y-0 right-4 flex items-center z-50 cursor-pointer"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerImages.length)}
        >
          <span className="text-white text-3xl select-none drop-shadow-md">›</span>
        </div>
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
            <div
              key={event.id}
              className="relative rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg"
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-56 object-cover"
              />
              {/* 文字區 */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white bg-black/30">
                <h3 className="text-2xl font-bold">{event.title}</h3>
                <p className="text-base mt-1">{event.date}</p>
                <p className="text-sm mt-2">{event.desc}</p>
              </div>
            </div>
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
            <div
              key={event.id}
              className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg relative group"
            >
              {/* ⭐️ 新增：收藏按鈕 */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 避免觸發卡片點擊
                  toggleFavorite(event.id);
                }}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                aria-label="收藏"
              >
                {favorites.has(event.id) ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIconOutline className="w-5 h-5 text-white" />
                )}
              </button>
              <img src={event.img} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.date}</p>
                <p className="text-sm text-gray-800">{event.desc}</p>
              </div>
            </div>
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
          {/* ⭐️ 修改：按鈕樣式 */}
          <button
            className="flex items-center gap-2 text-white font-medium transition-all px-6 py-3 border border-white rounded-lg 
            shadow-lg cursor-pointer bg-black/20 backdrop-blur-sm hover:bg-white/20"
          >
            {/* ⭐️ 替換為 BookOpenIcon */}
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
            <div
              key={event.id}
              className="bg-white/30 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg relative group"
            >
              {/* ⭐️ 新增：收藏按鈕 */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // 避免觸發卡片點擊
                  toggleFavorite(event.id);
                }}
                className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors cursor-pointer"
                aria-label="收藏"
              >
                {favorites.has(event.id) ? (
                  <HeartIconSolid className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIconOutline className="w-5 h-5 text-white" />
                )}
              </button>
              <img src={event.img} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                <p className="text-sm text-gray-700">{event.date}</p>
                <p className="text-sm text-gray-800">{event.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}