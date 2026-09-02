"use client";

import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';

// 定義資料介面 (對應後端 API 回傳的格式)
export interface EventCardData {
  id: number;
  title: string;
  start_time: string;    // ISO Date string
  location_name: string;
  cover_image: string;
  organizerName?: string; 
  price?: number;
}

interface EventCardProps {
  event: EventCardData;
  isFavorited: boolean;
  onToggleFavorite: (event: EventCardData) => void; // 傳回整個 event 物件以便加入收藏
}

export default function EventCard({ event, isFavorited, onToggleFavorite }: EventCardProps) {
  
  // 日期處理邏輯：從 start_time 解析出月份和日期
  const dateObj = new Date(event.start_time);
  const month = dateObj.toLocaleString('zh-TW', { month: 'numeric' }); // 例如 "11"
  const day = dateObj.getDate(); // 例如 "20"

  return (
    // 1. 基礎卡片：白色背景、圓角、陰影、Hover 上浮效果
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group cursor-pointer h-full flex flex-col border border-gray-100">

      {/* 2. 上半部：圖片區 */}
      <div className="relative w-full h-48 flex-shrink-0 overflow-hidden">
        <img
          src={event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* 地點標籤 */}
        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm">
          {event.location_name}
        </span>
        {/* 收藏按鈕 (愛心) */}
        <button
          onClick={(e) => {
            e.preventDefault(); // 防止點擊愛心時觸發卡片連結
            e.stopPropagation();
            onToggleFavorite(event);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 transition-transform hover:scale-110 active:scale-95 shadow-sm z-10"
          title={isFavorited ? "取消收藏" : "加入收藏"}
        >
          {isFavorited ? (
            <HeartIcon className="w-5 h-5" />
          ) : (
            <HeartIconOutline className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* 3. 下半部：內容區 (Flex 佈局) */}
      <div className="p-4 flex items-start space-x-4 flex-1">
        {/* 左側：日期區 */}
        <div className="flex flex-col flex-shrink-0 items-center justify-center w-14 pr-3 border-r border-gray-200 my-1">
          <span className="text-sm font-bold text-blue-600">{month}月</span>
          <span className="text-3xl font-extrabold text-gray-800 leading-none mt-1">{day}</span>
        </div>

        {/* 右側：標題與資訊 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight truncate group-hover:text-orange-600 transition-colors" title={event.title}>
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {event.organizerName || '主辦單位'}
            </p>
          </div>
          
          <div className="flex items-center text-gray-700 font-bold mt-3">
            <TicketIcon className="w-4 h-4 text-gray-400 mr-1.5" />
            <span className="text-sm">
              {event.price ? `NT$ ${event.price.toLocaleString()} 起` : '免費 / 尚未公佈'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}