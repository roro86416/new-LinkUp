// new-LinkUp/client/src/components/content/member/Messages.tsx
'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import NotificationDetailModal from './NotificationDetailModal';
import {
  ClockIcon,
  CheckCircleIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '../../../api/auth/apiClient';

// ----------------------------------------------------
// 1. 類型定義
// ----------------------------------------------------
interface Notification {
  id: string;
  type: '活動提醒' | '報名成功' | '系統公告' | '活動變更' | '訂單通知' | '交易通知'; // 擴充後端可能回傳的類型
  title: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}

interface MessageCardProps {
  message: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string, title: string) => void;
}

// ----------------------------------------------------
// 2. 配置與樣式
// ----------------------------------------------------
const typeConfigs: { [key: string]: { icon: React.ElementType; color: string; label: string; } } = {
  '活動提醒': { icon: ClockIcon, color: 'text-yellow-400', label: '活動提醒' },
  '報名成功': { icon: CheckCircleIcon, color: 'text-green-400', label: '報名成功' },
  '系統公告': { icon: MegaphoneIcon, color: 'text-blue-400', label: '系統公告' },
  '活動變更': { icon: ExclamationTriangleIcon, color: 'text-red-400', label: '活動變更' },
  // 對應後端 Enum
  'event': { icon: ClockIcon, color: 'text-yellow-400', label: '活動提醒' },
  'transaction': { icon: CheckCircleIcon, color: 'text-green-400', label: '交易通知' },
  'announcement': { icon: MegaphoneIcon, color: 'text-blue-400', label: '系統公告' },
};

// ----------------------------------------------------
// 3. 訊息卡片組件 (深色玻璃風格)
// ----------------------------------------------------
const MessageCard: React.FC<MessageCardProps> = ({ message, onToggleRead, onDelete }) => {
  // 根據 type 取得設定，若無則用預設
  const config = typeConfigs[message.type] || typeConfigs[message.type] || { icon: MegaphoneIcon, color: 'text-gray-400', label: '一般通知' };
  
  // 未讀：亮一點的背景；已讀：暗淡背景
  const bgClass = message.isRead ? 'bg-white/5 border-transparent' : 'bg-white/10 border-l-4 border-orange-500';
  const textClass = message.isRead ? 'text-gray-400' : 'text-white font-medium';

  return (
    <div
      className={`p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start justify-between hover:bg-white/15 transition-all duration-300 cursor-pointer ${bgClass}`}
    >
      <div className="flex-grow min-w-0 pr-4 mb-3 sm:mb-0">
        <div className="flex items-center gap-2 mb-1">
            <config.icon className={`w-5 h-5 ${config.color}`} />
            <span className={`text-xs px-2 py-0.5 rounded-full bg-white/10 ${config.color}`}>{config.label}</span>
            <span className="text-xs text-gray-500">{new Date(message.sentAt).toLocaleString()}</span>
        </div>
        <h3 className={`text-lg truncate ${textClass}`}>{message.title}</h3>
        <p className="text-sm text-gray-400 mt-1 truncate">{message.content}</p>
      </div>
      
      <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleRead(message.id); }} 
            className="text-xs font-medium text-orange-400 hover:text-white border border-orange-500/50 hover:bg-orange-500 px-3 py-1.5 rounded-lg transition"
        >
          {message.isRead ? '標示未讀' : '標示已讀'}
        </button>
        <button 
            onClick={(e) => { e.stopPropagation(); onDelete(message.id, message.title); }} 
            className="text-xs font-medium text-red-400 hover:text-white border border-red-500/50 hover:bg-red-500 px-3 py-1.5 rounded-lg transition"
        >
          刪除
        </button>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. 主組件
// ----------------------------------------------------
const Messages: React.FC = () => {
  const [messageData, setMessageData] = useState<Notification[]>([]);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setIsLoading(true);
    let apiData: Notification[] = [];
    let localData: Notification[] = [];

    // 1. 嘗試讀取 API (後端 UserNotificationStatus)
    try {
      const res = await apiClient.get<{data: Notification[]}>('/api/notifications'); 
      // 注意：如果您的後端回傳 { status: "success", data: [...] }，要取 res.data
      // 假設 apiClient 已經處理過這層，或者後端直接回陣列。這裡做個防呆：
      const rawData = Array.isArray(res) ? res : (res as any).data; 
      if (Array.isArray(rawData)) {
          apiData = rawData.map((item: any) => ({
            ...item,
            id: item.id.toString() // 確保 ID 是字串
          }));
      }
    } catch (error) {
      console.error("API 讀取失敗 (可能未登入):", error);
    }

    // 2. 讀取 LocalStorage (demo_notifications)
    try {
      const saved = localStorage.getItem('demo_notifications');
      if (saved) localData = JSON.parse(saved);
    } catch (error) {
      console.error("LocalStorage 讀取失敗:", error);
    }

    // 3. 合併並排序 (新到舊)
    const merged = [...localData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    
    // 簡單去重 (如果 ID 有衝突)
    const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());

    setMessageData(unique);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
    // 監聽可能的更新事件
    const handler = () => { fetchMessages(); };
    window.addEventListener('notifications-updated', handler);
    return () => window.removeEventListener('notifications-updated', handler);
  }, [fetchMessages]);

  const tabs = useMemo(() => [
    { id: 'all', name: '全部', count: messageData.length },
    { id: 'unread', name: '未讀', count: messageData.filter(m => !m.isRead).length },
    { id: 'read', name: '已讀', count: messageData.filter(m => m.isRead).length },
  ], [messageData]);

  const filteredMessages = useMemo(() => {
    let list = messageData;
    const lowerSearchTerm = currentSearchTerm.toLowerCase().trim();

    if (currentFilter === 'unread') list = list.filter(m => !m.isRead);
    else if (currentFilter === 'read') list = list.filter(m => m.isRead);

    if (lowerSearchTerm) {
      list = list.filter(m =>
        m.title.toLowerCase().includes(lowerSearchTerm) ||
        m.content.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return list;
  }, [messageData, currentFilter, currentSearchTerm]);

  // 切換讀取狀態
  const toggleReadStatus = useCallback(async (id: string) => {
    // 判斷是 Local 還是 API (假設 API ID 是數字轉字串，Local ID 通常有特定格式或也是數字)
    // 這裡簡單嘗試：先試 API，失敗再試 Local (或者根據 ID 特徵)
    
    // 樂觀更新 UI
    setMessageData(prev => prev.map(m => m.id === id ? { ...m, isRead: !m.isRead } : m));

    try {
        await apiClient.patch(`/api/notifications/${id}/read`, {});
    } catch (e) {
        // 如果 API 失敗，可能是 Local 資料
        try {
            const saved = localStorage.getItem('demo_notifications');
            const list: Notification[] = saved ? JSON.parse(saved) : [];
            const updated = list.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n);
            localStorage.setItem('demo_notifications', JSON.stringify(updated));
        } catch (localErr) { console.error(localErr); }
    }
    // 告訴小鈴鐺更新數字
    window.dispatchEvent(new Event('notifications-updated'));
  }, []);

  // 刪除訊息
  const deleteMessage = useCallback(async (id: string, title: string) => {
    if (!window.confirm(`確定要刪除訊息：「${title}」嗎？`)) return;

    // 樂觀更新
    setMessageData(prev => prev.filter(m => m.id !== id));

    try {
        await apiClient.delete(`/api/notifications/${id}`);
    } catch (e) {
         try {
            const saved = localStorage.getItem('demo_notifications');
            const list: Notification[] = saved ? JSON.parse(saved) : [];
            const updated = list.filter(n => n.id !== id);
            localStorage.setItem('demo_notifications', JSON.stringify(updated));
        } catch (localErr) { console.error(localErr); }
    }
  }, []);

  const handleCardClick = (notification: Notification) => {
    setViewingNotification(notification);
    if (!notification.isRead) {
      toggleReadStatus(notification.id);
    }
  };

  if (isLoading) return <div className="text-center py-20 text-gray-400">載入訊息中...</div>;

  return (
    <div className="w-full mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="mb-8">
        <h1 className="text-2xl font-extrabold text-white mb-2">通知管理</h1>
        <p className="text-gray-400">查看您的所有活動通知、訂單狀態與系統公告。</p>
      </header>

      {/* 篩選與搜尋 (玻璃工具列) */}
      <div className="p-4 mb-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md sticky top-4 z-20 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setCurrentFilter(tab.id as 'all')}
                className={`px-4 py-2 text-sm rounded-lg transition whitespace-nowrap font-bold
                    ${tab.id === currentFilter 
                        ? 'bg-[#EF9D11] text-white shadow-lg' 
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
              >
                {tab.name} <span className="opacity-70 ml-1 text-xs bg-black/20 px-1.5 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:max-w-xs">
            <input 
                type="text" 
                placeholder="搜尋通知..." 
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:ring-1 focus:ring-[#EF9D11] focus:border-[#EF9D11] outline-none transition"
                onChange={(e) => setCurrentSearchTerm(e.target.value)} 
                value={currentSearchTerm} 
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* 訊息列表 */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredMessages.length === 0 ? (
           <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
               <MegaphoneIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
               <p className="text-gray-400">目前沒有任何訊息</p>
           </div>
        ) : (
          filteredMessages.map(message => (
            <div key={message.id} onClick={() => handleCardClick(message)}>
              <MessageCard message={message} onToggleRead={toggleReadStatus} onDelete={deleteMessage} />
            </div>
          ))
        )}
      </div>

      {viewingNotification && (
          <NotificationDetailModal 
            notification={viewingNotification} 
            onClose={() => setViewingNotification(null)} 
          />
      )}
    </div>
  );
};

export default Messages;