"use client";

// [!!!] 1. 統一使用 Heroicons (您專案已安裝)
import { HeartIcon } from '@heroicons/react/24/solid'; // 實心
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'; // 空心
import { TicketIcon } from '@heroicons/react/24/outline'; // 票券圖示 

// [!!!] 2. 定義這個元件需要的"資料" (Props)
// (這個介面對應您的 Prisma Schema 和 API)
export interface EventCardData {
  id: number;
  title: string;          // 來自 events (模組二)
  start_time: string;     // 來自 events (模組二)
  location_name: string;  // 來自 events (模組二)
  cover_image: string;    // 來自 events (模組二)
  organizerName: string;  // 來自 users (模組一)
  price: number;          // 來自 ticket_types (模組二)
  category?: {
    id: number;
    name: string;
  };
}

interface EventCardProps {
  event: EventCardData; 
  isFavorited: boolean; 
  onToggleFavorite: (id: number) => void; 
}

export default function EventCard({ event, isFavorited, onToggleFavorite }: EventCardProps) {

 
  const dateObj = new Date(event.start_time);
  const month = dateObj.toLocaleString('zh-TW', { month: 'numeric' }); 
  const day = dateObj.getDate(); 

  return (
    // 1. 基礎卡片：白色背景、圓角、陰影、裁切
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">

      <div className="relative w-full h-48">
        {/* 圖片本身 */}
        <img
          src={event.cover_image} // [!] 對應 API 欄位
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {/* 演出標籤 (如圖所示) */}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded">
          {event.location_name} {/* [!] 對應 API 欄位 */}
        </span>
        {/* 收藏按鈕 (愛心) */}
        <button 
          onClick={() => onToggleFavorite(event.id)}
          className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full text-red-500 transition-transform hover:scale-110 active:scale-95"
          title={isFavorited ? "取消收藏" : "加入收藏"}
        >
          {/* [!!!] 4. 已換成 Heroicons */}
          {isFavorited ? (
            <HeartIcon className="w-5 h-5" /> // 實心愛心
          ) : (
            <HeartIconOutline className="w-5 h-5" /> // 空心愛心
          )}
        </button>
      </div>

      {/* 3. 內容區 (flex 佈局) */}
      <div className="p-4 flex items-start space-x-4">
        {/* 日期區 (左) */}
        <div className="flex flex-col flex-shrink-0 items-center justify-center w-16 pr-4 border-r border-gray-200">
          <span className="text-sm font-semibold text-blue-700">{month}</span>
          <span className="text-3xl font-bold text-gray-900">{day}</span>
        </div>

        {/* 標題/價格區 (右) */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 leading-tight truncate" title={event.title}>
            {event.title} {/* [!] 對應 API 欄位 */}
          </h3>
          <p className="text-sm text-gray-600 mt-1 truncate">
            {event.organizerName} {/* [!] 對應 API 欄位 */}
          </p>
          <div className="flex items-center text-gray-900 font-bold mt-2">
            {/* [!!!] 5. 已換成 Heroicons */}
            <TicketIcon className="w-5 h-5 text-gray-600 mr-1.5" /> 
            <span>NT$ {event.price} 起</span> {/* [!] 對應 API 欄位 */}
          </div>
        </div>
      </div>
    </div>
  );
};