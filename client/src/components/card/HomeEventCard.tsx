// new-LinkUp/client/src/components/card/HomeEventCard.tsx
"use client";

import React from 'react';
import { MapPin, Ticket, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { EventCardData } from './EventCard';

interface HomeEventCardProps {
  event: EventCardData;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
}

const HomeEventCard: React.FC<HomeEventCardProps> = ({ event, isFavorited, onToggleFavorite }) => {
  const router = useRouter(); // [新增]
  const dateObj = new Date(event.start_time);
  const month = dateObj.toLocaleString('zh-TW', { month: 'numeric' }) + '月';
  const day = dateObj.getDate();

  return (
    <div 
      // [新增] 點擊卡片本體跳轉到詳情頁
      onClick={() => router.push(`/event/${event.id}`)}
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group h-full flex flex-col cursor-pointer"
    >
      
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={event.cover_image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
          <MapPin size={12} />
          {event.location_name}
        </span>
        
        <button 
          onClick={(e) => {
            e.stopPropagation(); // [新增] 阻止冒泡，避免觸發卡片跳轉
            onToggleFavorite(event.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 transition-all hover:scale-110 hover:bg-white active:scale-95 shadow-sm z-10"
          title={isFavorited ? "取消收藏" : "加入收藏"}
        >
          <Heart 
            className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} 
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="p-4 flex items-start gap-4 flex-1">
        <div className="flex flex-col flex-shrink-0 items-center justify-center w-14 pr-3 border-r border-gray-100">
          <span className="text-xs font-bold text-[#658AD0]">{month}</span>
          <span className="text-3xl font-bold text-gray-800">{day}</span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-[#EF9D11] transition-colors" title={event.title}>
              {event.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {event.organizerName}
            </p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center text-gray-900 font-bold">
              <Ticket className="w-4 h-4 text-[#EF9D11] mr-1.5" /> 
              <span className="text-[#EF9D11]">NT$ {event.price}</span>
              <span className="text-xs text-gray-400 font-normal ml-1">起</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeEventCard;