'use client';

import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { useFavorites, FavoriteEvent } from '../../components/content/member/FavoritesContext'; // 確保路徑正確
import toast from 'react-hot-toast';

// 假設你的活動卡片 props 結構如下
interface EventCardProps {
  event: FavoriteEvent; // 直接使用我們在 Context 中定義的類型
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // 1. 從 FavoritesContext 取得所需函式和狀態
  const { addFavoriteEvent, removeFavoriteEvent, favoriteEvents } = useFavorites();

  // 2. 判斷此活動是否已被收藏
  const isFavorited = favoriteEvents.some(favEvent => favEvent.id === event.id);

  // 3. 處理點擊愛心按鈕的事件
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // 防止點擊愛心時觸發卡片的其他連結（例如進入活動詳情頁）
    e.stopPropagation();

    if (isFavorited) {
      removeFavoriteEvent(event.id);
      toast.success('已取消收藏');
    } else {
      addFavoriteEvent(event);
      toast.success('已成功收藏！');
    }
  };

  return (
    <div className="group relative block overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
      {/* 活動圖片 (假設) */}
      <img
        src={`https://picsum.photos/seed/${event.id}/400/200`} // 範例圖片
        alt={event.title}
        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* 收藏按鈕 */}
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-2 text-orange-500 backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110"
        aria-label={isFavorited ? '取消收藏' : '加入收藏'}
      >
        {isFavorited ? (
          <HeartIconSolid className="h-6 w-6" />
        ) : (
          <HeartIconOutline className="h-6 w-6" />
        )}
      </button>

      {/* 卡片內容 */}
      <div className="relative bg-white p-4">
        <h3 className="truncate text-lg font-bold text-gray-900 group-hover:text-orange-600">{event.title}</h3>
        <p className="mt-1.5 text-sm text-gray-600">{event.organizerName}</p>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;