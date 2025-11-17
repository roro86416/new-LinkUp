//全頁訊息管理

import React, { useState, useMemo, useCallback, useEffect } from 'react';
// ⭐️ 匯入新的 Modal 組件
import NotificationDetailModal from './NotificationDetailModal';
import {
  ClockIcon,
  CheckCircleIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

// ----------------------------------------------------
// 1. 類型定義 (Type Definitions)
// ----------------------------------------------------

// ⭐️ 類型與後台通知系統同步
interface Notification {
  id: string;
  type: '活動提醒' | '報名成功' | '系統公告' | '活動變更';
  title: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

// 定義 MessageCard 組件的 Props 結構
interface MessageCardProps {
  message: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

// ----------------------------------------------------
// 2. 模擬資料與配置 (Initial State & Config)
// ----------------------------------------------------

// ⭐️ 新的類型配置，包含圖示和顏色
const typeConfigs: { [key: string]: { icon: React.ElementType; color: string; label: string; } } = {
  '活動提醒': { icon: ClockIcon, color: 'text-yellow-600', label: '活動提醒' },
  '報名成功': { icon: CheckCircleIcon, color: 'text-green-600', label: '報名成功' },
  '系統公告': { icon: MegaphoneIcon, color: 'text-blue-600', label: '系統公告' },
  '活動變更': { icon: ExclamationTriangleIcon, color: 'text-red-600', label: '活動變更' },
};

// ----------------------------------------------------
// 3. 組件：訊息卡片 (Message Card Component)
// ----------------------------------------------------

// ⭐️ 重新設計卡片 UI，使其樣式與「我的收藏」卡片一致
const MessageCard: React.FC<MessageCardProps> = ({ message, onToggleRead, onDelete }) => {
  const config = typeConfigs[message.type] || { icon: MegaphoneIcon, color: 'text-gray-600', label: '一般通知' };
  const Icon = config.icon;
  const isReadClass = message.isRead ? 'bg-white' : 'bg-orange-50';
  const readToggleText = message.isRead ? '標記為未讀' : '標記為已讀';

  return (
    <div
      id={`message-${message.id}`}
      className={`message-card p-4 rounded-xl shadow-md flex items-start justify-between hover:shadow-lg transition duration-200 border-l-4 border-orange-400 ${isReadClass} cursor-pointer`}
    >
      {/* 左側內容 */}
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{message.title}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{message.content.replace(/\n/g, ' ')}</p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
          <span className="font-bold">{new Date(message.sentAt).toLocaleDateString()}</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${config.color} ${message.isRead ? 'bg-gray-100' : 'bg-orange-100'}`}>{config.label}</span>
        </div>
      </div>

      {/* 右側操作按鈕 */}
      <div className="flex flex-col items-end space-y-2 flex-shrink-0">
        <button onClick={(e) => { e.stopPropagation(); onToggleRead(message.id); }} className="text-sm font-medium text-orange-600 hover:text-orange-800 p-1 rounded-lg hover:bg-orange-50 transition whitespace-nowrap">
          {readToggleText}
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(message.id, message.title); }} className="text-sm font-medium text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition">
          刪除
        </button>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// 4. 主組件 (App Component)
// ----------------------------------------------------

const Messages: React.FC = () => {
  // ⭐️ 狀態從 localStorage 讀取
  // ⭐️ 修正：使用 useState 的函式初始化，避免在 effect 中同步設定狀態
  const [messageData, setMessageData] = useState<Notification[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const data = localStorage.getItem('demo_notifications');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to parse notifications from localStorage", error);
      return [];
    }
  });
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  // ⭐️ 新增 state 來控制 Modal
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);

  // ⭐️ 封裝讀取邏輯，現在只用於事件監聽觸發的更新
  const loadMessages = useCallback(() => {
    const data = localStorage.getItem('demo_notifications');
    setMessageData(data ? JSON.parse(data) : []);
  }, []);

  // ⭐️ 修正：useEffect 現在只負責設定事件監聽
  useEffect(() => {
    // 監聽由其他分頁（如後台）觸發的 storage 變化
    window.addEventListener('storage', loadMessages);
    // 監聽由同頁面其他組件（如鈴鐺）觸發的自訂事件
    window.addEventListener('notifications-updated', loadMessages);

    // 組件卸載時清除監聽器
    return () => {
      window.removeEventListener('storage', loadMessages);
      window.removeEventListener('notifications-updated', loadMessages);
    };
  }, [loadMessages]);

  // Tab 定義 (使用 useMemo 來確保計數只在 messageData 變化時重新計算)
  const tabs = useMemo(() => [
    { id: 'all', name: '全部', count: messageData.length },
    { id: 'unread', name: '未讀', count: messageData.filter(m => !m.isRead).length },
    { id: 'read', name: '已讀', count: messageData.filter(m => m.isRead).length },
  ], [messageData]);

  // 篩選和搜尋邏輯
  const filteredMessages = useMemo(() => {
    let list = messageData;
    const lowerSearchTerm = currentSearchTerm.toLowerCase().trim();

    // 1. 執行 Tab 篩選
    if (currentFilter === 'unread') {
      list = list.filter(m => !m.isRead);
    } else if (currentFilter === 'read') {
      list = list.filter(m => m.isRead);
    }

    // 2. 執行搜尋篩選
    if (lowerSearchTerm) {
      list = list.filter(m =>
        m.title.toLowerCase().includes(lowerSearchTerm) ||
        m.content.toLowerCase().includes(lowerSearchTerm)
      );
    }

    return list;
  }, [messageData, currentFilter, currentSearchTerm]);

  // 處理函數
  const toggleReadStatus = useCallback((id: string) => {
    const updatedData = messageData.map(msg =>
      msg.id === id ? { ...msg, isRead: !msg.isRead } : msg,
    );
    setMessageData(updatedData);
    localStorage.setItem('demo_notifications', JSON.stringify(updatedData));
    // ⭐️ 發送自訂事件，通知鈴鐺等組件更新
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }, [messageData]);

  const deleteMessage = useCallback((id: string, title: string) => {
    // 使用 window.confirm 替代 alert/confirm (React 應用中應使用 Modal)
    if (window.confirm(`確定要刪除訊息：「${title}」嗎？`)) {
      const updatedData = messageData.filter(msg => msg.id !== id);
      setMessageData(updatedData);
      localStorage.setItem('demo_notifications', JSON.stringify(updatedData));
      // ⭐️ 發送自訂事件，通知鈴鐺等組件更新
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  }, [messageData]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTerm(e.target.value);
  }, []);

  const setFilter = useCallback((filterId: 'all' | 'unread' | 'read') => {
    setCurrentFilter(filterId);
  }, []);

  // ⭐️ 處理點擊卡片的函式
  const handleCardClick = (notification: Notification) => {
    setViewingNotification(notification);

    // 如果是未讀的，則標示為已讀
    if (!notification.isRead) {
      const updatedData = messageData.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      setMessageData(updatedData);
      localStorage.setItem('demo_notifications', JSON.stringify(updatedData));
      // ⭐️ 發送自訂事件，通知鈴鐺等組件更新
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  };

  return (
    <div className="w-full mx-auto">
      <header>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          訊息管理
        </h1>
        <p className="text-gray-500">管理您的所有活動通知和提醒。</p>
      </header>

      {/* 篩選器和搜尋框區域 */}
      <div className="p-4 mt-4 sticky top-16 z-10 bg-white/80 backdrop-blur-sm -mx-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">

          {/* 篩選 Tabs */}
          <div className="flex-shrink-0 w-full sm:w-auto order-2 sm:order-1">
            <div id="filter-tabs" className="inline-flex rounded-lg bg-gray-100 p-1">
              {tabs.map(tab => {
                const isActive = tab.id === currentFilter;
                const activeClass = isActive ?
                  'bg-white text-orange-600 shadow-sm font-semibold'
                  : 'text-gray-500 hover:text-gray-700 font-medium';

                return (
                  <button key={tab.id} onClick={() => setFilter(tab.id as 'all' | 'unread' | 'read')}
                    className={`px-3 py-1.5 text-sm rounded-lg transition duration-150 ${activeClass}`}>
                    {tab.name} ({tab.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 搜尋框 */}
          <div className="relative w-full sm:max-w-xs order-1 sm:order-2">
            <input type="text" id="search-input" placeholder="搜尋標題、內容或活動名稱..."
              className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150 text-gray-700"
              onChange={handleSearch}
              value={currentSearchTerm} />
            {/* 搜尋圖標 */}
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 訊息列表 */}
      {/* ⭐️ 將列表改為網格佈局 */}
      {/* ⭐️ 將網格改為單行列表，並使用 space-y */}
      <div className="space-y-4 mt-6 max-h-[65vh] overflow-y-auto pr-2">
        {filteredMessages.map(message => (
          <div key={message.id} onClick={() => handleCardClick(message)}>
            <MessageCard
              message={message}
              onToggleRead={toggleReadStatus}
              onDelete={deleteMessage}
            />
          </div>
        ))}
      </div>

      {/* 空狀態/無結果提示 */}
      {filteredMessages.length === 0 && (<div className="text-center py-20 bg-gray-50 rounded-xl">
        <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">沒有符合條件的訊息</h3>
        <p className="mt-1 text-sm text-gray-500">請嘗試更改篩選或搜尋條件。</p>
      </div>
      )}

      {/* ⭐️ 當 viewingNotification 有值時，渲染 Modal */}
      {viewingNotification && <NotificationDetailModal notification={viewingNotification} onClose={() => setViewingNotification(null)} />}
    </div>
  );
};

export default Messages;
