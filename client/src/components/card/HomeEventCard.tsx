// new-LinkUp/client/src/components/card/HomeEventCard.tsx
"use client";

import React from 'react';
import { MapPin, Ticket, Heart, Clock, Tag } from 'lucide-react'; // [新增] Clock, Tag icon
import { useRouter } from 'next/navigation';
import { EventCardData } from './EventCard';

interface HomeEventCardProps {
  event: EventCardData;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
}

// [新增] 類別顏色對照表函式
export const getCategoryColorClass = (name: string | undefined) => {
  if (!name) return 'bg-gray-600 text-white'; // 預設
  if (name.includes('音樂') || name.includes('派對') || name.includes('表演')) return 'bg-rose-500 text-white';
  if (name.includes('戶外') || name.includes('露營') || name.includes('運動')) return 'bg-emerald-500 text-white';
  if (name.includes('展覽') || name.includes('藝術') || name.includes('設計')) return 'bg-purple-500 text-white';
  if (name.includes('學習') || name.includes('講座') || name.includes('研討')) return 'bg-blue-500 text-white';
  if (name.includes('親子') || name.includes('體驗') || name.includes('手作')) return 'bg-orange-500 text-white';
  if (name.includes('市集') || name.includes('聚會')) return 'bg-amber-500 text-white';
  return 'bg-[#0C2838] text-white'; // LinkUp 品牌深藍
};

const HomeEventCard: React.FC<HomeEventCardProps> = ({ event, isFavorited, onToggleFavorite }) => {
  const router = useRouter();
  
  const dateObj = new Date(event.start_time);
  // 處理日期顯示
  const month = (dateObj.getMonth() + 1) + '月';
  const day = dateObj.getDate();
  
  // [新增] 處理時間顯示 (例如 19:30)
  const timeString = dateObj.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });

  return (
    <div 
      onClick={() => router.push(`/event/${event.id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col cursor-pointer border border-gray-100"
    >
      
      {/* 1. 圖片區域 */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* [修改] 左下角 Tag 區域 (地點 + 類別) */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-2 max-w-[85%]">
            

            {/* [新增] 類別 Tag (如果有類別資料才顯示) */}
            {event.category && (
              <span className={`${getCategoryColorClass(event.category.name)} backdrop-blur-md text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm`}>
                <Tag size={12} />
                {event.category.name}
              </span>
              
            )}
            {/* 地點 Tag */}
            <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 shadow-sm">
              <MapPin size={12} className="text-[#EF9D11]" />
              <span className="truncate max-w-[200px]">{event.location_name}</span>
            </span>
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(event.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 transition-all hover:scale-110 hover:bg-white active:scale-95 shadow-md z-10"
          title={isFavorited ? "取消收藏" : "加入收藏"}
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} 
            strokeWidth={2.5}
          />
        </button>
      </div>

      {/* 2. 下方內容區域 */}
      <div className="p-4 flex items-start gap-4 flex-1">
        {/* 左側日期方塊 */}
        <div className="flex flex-col flex-shrink-0 items-center justify-center w-14 pr-3 border-r border-gray-100 h-16">
          <span className="text-xs font-bold text-[#658AD0] uppercase tracking-wide">{month}</span>
          <span className="text-3xl font-black text-gray-800">{day}</span>
        </div>

        {/* 右側資訊 */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-full gap-1">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-[#EF9D11] transition-colors mb-1" title={event.title}>
              {event.title}
            </h3>
            
            {/* 主辦方名稱 */}
            <p className="text-xs text-gray-500 truncate mb-1">
              由 <span className="font-medium text-gray-700">{event.organizerName}</span> 舉辦
            </p>

            {/* [新增] 活動時間顯示 */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Clock size={12} />
                <span>{timeString} 開始</span>
            </div>
          </div>

          {/* 價格 */}
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-50">
            <div className="flex items-center text-gray-900 font-bold bg-orange-50 px-2 py-1 rounded-lg">
              <Ticket className="w-3.5 h-3.5 text-[#EF9D11] mr-1.5" /> 
              <span className="text-[#EF9D11] text-sm">NT$ {event.price}</span>
              <span className="text-[10px] text-gray-400 font-normal ml-1">起</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEventCard;