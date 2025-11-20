// new-LinkUp/client/src/components/content/member/Favorites.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { useFavorites } from './FavoritesContext';
import HomeEventCard from '../../card/HomeEventCard';
import toast from 'react-hot-toast';
import { HeartIcon } from '@heroicons/react/24/outline';

// 空狀態組件
const EmptyState: React.FC<{ message: string; isSearchEmpty?: boolean; onClearSearch?: () => void }> = ({ message, isSearchEmpty = false, onClearSearch }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/40 backdrop-blur-md rounded-3xl border border-white/50 shadow-sm">
    <div className="bg-white/60 p-4 rounded-full mb-4">
       <HeartIcon className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="mt-2 text-lg font-bold text-gray-800">{isSearchEmpty ? '沒有搜尋結果' : '收藏夾是空的'}</h3>
    <p className="mt-1 text-sm text-gray-600">{message}</p>

    {isSearchEmpty && onClearSearch && (
      <div className="mt-6">
        <button onClick={onClearSearch} className="px-5 py-2.5 text-sm font-bold rounded-xl text-[#EF9D11] bg-white border border-orange-100 hover:bg-orange-50 transition-all shadow-sm">
          清除搜尋條件
        </button>
      </div>
    )}
  </div>
);

const Favorites: React.FC = () => {
  const { favoriteEvents, removeFavoriteEvent } = useFavorites();
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => setCurrentSearchTerm(''), []);
  const lowerSearchTerm = currentSearchTerm.toLowerCase().trim();

  const filteredEvents = useMemo(() => {
    if (!lowerSearchTerm) return favoriteEvents;
    return favoriteEvents.filter(e =>
      e.title.toLowerCase().includes(lowerSearchTerm) ||
      e.location_name.toLowerCase().includes(lowerSearchTerm) ||
      e.organizerName.toLowerCase().includes(lowerSearchTerm)
    );
  }, [favoriteEvents, lowerSearchTerm]);

  const handleRemoveEvent = useCallback((id: number) => {
    // 因為 HomeEventCard 的 toggle 在收藏頁面直觀上就是移除，所以直接移除
    if (window.confirm('確定要取消收藏此活動嗎？')) {
      removeFavoriteEvent(id);
      toast.success('已取消收藏');
    }
  }, [removeFavoriteEvent]);

  return (
    <div id="favorites-app" className="w-full mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* 頂部區域：標題與搜尋 */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          {/* 2. 標題：改為白色文字，樣式對齊 AccountSettings */}
          <h2 className="text-2xl font-extrabold text-white mb-2">我的收藏</h2>
          {/* 3. 副標題：改為淺灰色 */}
          <p className="text-gray-400">您目前收藏了 <span className="font-bold text-[#EF9D11]">{favoriteEvents.length}</span> 個活動。</p>
        </div>

        {/* 搜尋框：改為玻璃擬態風格 (配合深色背景) */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜尋收藏的活動..."
            className="w-full rounded-xl border border-white/20 bg-white/5 text-white pl-10 pr-4 py-2.5 text-sm shadow-sm outline-none focus:border-[#EF9D11] focus:ring-1 focus:ring-[#EF9D11] transition-all placeholder-gray-500"
            onChange={handleSearch}
            value={currentSearchTerm}
          />
        </div>
      </div>

      {/* 內容區塊 */}
      <div className="min-h-[50vh]">
        {filteredEvents.length === 0 ? (
             <EmptyState
                message={currentSearchTerm ? `找不到符合「${currentSearchTerm}」的活動。` : `您還沒有收藏任何活動，快去首頁探索吧！`}
                isSearchEmpty={!!currentSearchTerm}
                onClearSearch={clearSearch}
             />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} className="h-full">
                    <HomeEventCard 
                        event={event}
                        isFavorited={true} // 在收藏頁面當然是已收藏
                        onToggleFavorite={() => handleRemoveEvent(event.id)} // 點擊愛心即觸發移除確認
                    />
                  </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;