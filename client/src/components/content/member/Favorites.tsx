import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useFavorites, FavoriteEvent } from './FavoritesContext';
import toast from 'react-hot-toast';

// ----------------------------------------------------
// 1. 類型定義 (Type Definitions)
// ----------------------------------------------------

// ----------------------------------------------------
// 3. 收藏活動卡片
// ----------------------------------------------------

interface EventCardProps {
  event: FavoriteEvent;
  onRemove: (id: number, title: string) => void;
}

const FavoriteEventCard: React.FC<EventCardProps> = ({ event, onRemove }) => {
  const statusClass = event.isUpcoming ?? true ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500';
  const statusText = event.isUpcoming ?? true ? '即將舉行' : '已結束';

  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-start justify-between hover:shadow-lg transition duration-200 border-l-4 border-orange-400">
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
        <p className="text-sm text-gray-600 mt-1">
          <span className="font-medium text-orange-600">{event.organizerName || '主辦方待定'}</span> | {event.location || '地點待定'}
        </p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
          <span className="font-bold">{event.date}</span>
          <span className={`px-2 py-0.5 rounded-full ${statusClass} font-medium`}>{statusText}</span>
        </div>
      </div>
      <button onClick={() => onRemove(event.id, event.title)} className="text-sm font-medium text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
        取消收藏
      </button>
    </div>
  );
};

// ----------------------------------------------------
// 5. 空狀態提示
// ----------------------------------------------------

interface EmptyStateProps {
  message: string;
  isSearchEmpty?: boolean;
  onClearSearch?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, isSearchEmpty = false, onClearSearch }) => (
  <div className="text-center py-20 bg-white rounded-xl shadow-lg">
    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d={isSearchEmpty ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" : "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"} />
    </svg>
    <h3 className="mt-2 text-lg font-medium text-gray-900">{isSearchEmpty ? '沒有搜尋結果' : '收藏夾是空的'}</h3>
    <p className="mt-1 text-sm text-gray-500">{message}</p>

    {isSearchEmpty && onClearSearch && (
      <div className="mt-6">
        <button onClick={onClearSearch} className="px-4 py-2 text-sm font-medium rounded-md text-orange-600 bg-orange-50 hover:bg-orange-100 transition">
          清除搜尋條件
        </button>
      </div>
    )}
  </div>
);

// ----------------------------------------------------
// 6. 主組件
// ----------------------------------------------------

const App: React.FC = () => {
  // 從 Context 獲取收藏狀態和操作函式
  const {
    favoriteEvents,
    removeFavoriteEvent: removeEvent,
  } = useFavorites();
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
      e.location.toLowerCase().includes(lowerSearchTerm) ||
      e.organizerName.toLowerCase().includes(lowerSearchTerm)
    );
  }, [favoriteEvents, lowerSearchTerm]);

  const handleRemoveEvent = useCallback((id: number, title: string) => {
    // ⚠️ 替換掉 alert/confirm
    if (window.confirm(`確定要取消收藏活動：「${title}」嗎？`)) {
      removeEvent(id);
      toast.error('已取消收藏');
    }
  }, [removeEvent]);

  const renderContent = () => {
    const list = filteredEvents;

    if (list.length === 0) {
      return (
        <EmptyState
          message={currentSearchTerm ? `找不到符合「${currentSearchTerm}」的活動。` : `目前沒有收藏任何活動。`}
          isSearchEmpty={!!currentSearchTerm}
          onClearSearch={clearSearch}
        />
      );
    }

    return (
      <div className="space-y-4">
        {list.map(event => (
          <FavoriteEventCard key={`evt-${event.id}`} event={event} onRemove={handleRemoveEvent} />
        ))}
      </div>
    );
  };

  return (
    <div id="favorites-app" className="w-full mx-auto">

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">我的收藏</h1>
          <p className="text-gray-500 mt-1">您收藏的所有活動。</p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="搜尋收藏的活動..."
            className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 transition"
            onChange={handleSearch}
            value={currentSearchTerm}
          />
        </div>
      </div>
      <div
        id="favorites-content-list"
        className="max-h-[70vh] overflow-y-auto space-y-4"
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
