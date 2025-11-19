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
  type: '活動提醒' | '報名成功' | '系統公告' | '活動變更';
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
// 2. 配置
// ----------------------------------------------------
const typeConfigs: { [key: string]: { icon: React.ElementType; color: string; label: string; } } = {
  '活動提醒': { icon: ClockIcon, color: 'text-yellow-600', label: '活動提醒' },
  '報名成功': { icon: CheckCircleIcon, color: 'text-green-600', label: '報名成功' },
  '系統公告': { icon: MegaphoneIcon, color: 'text-blue-600', label: '系統公告' },
  '活動變更': { icon: ExclamationTriangleIcon, color: 'text-red-600', label: '活動變更' },
};

// ----------------------------------------------------
// 3. 訊息卡片組件
// ----------------------------------------------------
const MessageCard: React.FC<MessageCardProps> = ({ message, onToggleRead, onDelete }) => {
  const config = typeConfigs[message.type] || { icon: MegaphoneIcon, color: 'text-gray-600', label: '一般通知' };
  const isReadClass = message.isRead ? 'bg-white' : 'bg-orange-50';
  const readToggleText = message.isRead ? '標記為未讀' : '標記為已讀';

  return (
    <div
      id={`message-${message.id}`}
      className={`message-card p-4 rounded-xl shadow-md flex items-start justify-between hover:shadow-lg transition duration-200 border-l-4 border-orange-400 ${isReadClass} cursor-pointer`}
    >
      <div className="flex-grow min-w-0 pr-4">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{message.title}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{message.content.replace(/\n/g, ' ')}</p>
        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
          <span className="font-bold">{new Date(message.sentAt).toLocaleString()}</span>
          <span className={`px-2 py-0.5 rounded-full font-medium ${config.color} ${message.isRead ? 'bg-gray-100' : 'bg-orange-100'}`}>{config.label}</span>
        </div>
      </div>
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
// 4. 主組件
// ----------------------------------------------------
const Messages: React.FC = () => {
  const [messageData, setMessageData] = useState<Notification[]>([]);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentSearchTerm, setCurrentSearchTerm] = useState('');
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);

  const fetchMessages = useCallback(async () => {
    let apiData: Notification[] = [];
    let localData: Notification[] = [];

    try {
      const res = await apiClient.get<Notification[]>('/api/notifications');
      if (Array.isArray(res)) apiData = res;
    } catch (error) {
      console.error("API 讀取失敗:", error);
    }

    try {
      const saved = localStorage.getItem('demo_notifications');
      if (saved) localData = JSON.parse(saved);
    } catch (error) {
      console.error("LocalStorage 讀取失敗:", error);
    }

    const merged = [...localData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    
    setMessageData(merged);
  }, []);

  useEffect(() => {
    // [修正 1] 使用 setTimeout 延遲執行，解決 setState synchronous warning
    const timer = setTimeout(() => {
      fetchMessages();
    }, 0);

    const handler = () => { fetchMessages(); };
    window.addEventListener('notifications-updated', handler);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('notifications-updated', handler);
    };
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

  const toggleReadStatus = useCallback(async (id: string) => {
    const isLocal = id.startsWith('notif_');

    if (isLocal) {
      try {
        const saved = localStorage.getItem('demo_notifications');
        const list: Notification[] = saved ? JSON.parse(saved) : [];
        const updated = list.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n);
        localStorage.setItem('demo_notifications', JSON.stringify(updated));
      } catch (e) { console.error(e); }
    } else {
      try {
        // [修正] 現在 apiClient.ts 已有 patch 方法，這裡不會報錯了
        await apiClient.patch(`/api/notifications/${id}/read`, {}); 
      } catch (e) { console.error(e); }
    }

    fetchMessages();
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }, [fetchMessages]);

  const deleteMessage = useCallback(async (id: string, title: string) => {
    if (!window.confirm(`確定要刪除訊息：「${title}」嗎？`)) return;

    const isLocal = id.startsWith('notif_');

    if (isLocal) {
       try {
        const saved = localStorage.getItem('demo_notifications');
        const list: Notification[] = saved ? JSON.parse(saved) : [];
        const updated = list.filter(n => n.id !== id);
        localStorage.setItem('demo_notifications', JSON.stringify(updated));
      } catch (e) { console.error(e); }
    } else {
       try {
        await apiClient.delete(`/api/notifications/${id}`);
      } catch (e) { console.error(e); }
    }

    fetchMessages();
    window.dispatchEvent(new CustomEvent('notifications-updated'));
  }, [fetchMessages]);

  const handleCardClick = (notification: Notification) => {
    setViewingNotification(notification);
    if (!notification.isRead) {
      toggleReadStatus(notification.id);
    }
  };

  // [修正 2] 明確指定型別，解決 Unexpected any 錯誤
  const setFilter = (filterId: 'all' | 'unread' | 'read') => {
    setCurrentFilter(filterId);
  };

  return (
    <div className="w-full mx-auto">
      <header>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">訊息管理</h1>
        <p className="text-gray-500">管理您的所有活動通知和提醒。</p>
      </header>

      <div className="p-4 mt-4 sticky top-16 z-10 bg-white/80 backdrop-blur-sm -mx-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-shrink-0 w-full sm:w-auto order-2 sm:order-1">
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              {tabs.map(tab => (
                <button 
                  key={tab.id} 
                  onClick={() => setFilter(tab.id as 'all' | 'unread' | 'read')}
                  className={`px-3 py-1.5 text-sm rounded-lg transition duration-150 ${tab.id === currentFilter ? 'bg-white text-orange-600 shadow-sm font-semibold' : 'text-gray-500 hover:text-gray-700 font-medium'}`}
                >
                  {tab.name} ({tab.count})
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full sm:max-w-xs order-1 sm:order-2">
            <input type="text" placeholder="搜尋..." className="w-full border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 text-gray-700"
              onChange={(e) => setCurrentSearchTerm(e.target.value)} value={currentSearchTerm} />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-4 mt-6 max-h-[65vh] overflow-y-auto pr-2">
        {filteredMessages.length === 0 ? (
           <div className="text-center py-20 bg-gray-50 rounded-xl text-gray-500">沒有訊息</div>
        ) : (
          filteredMessages.map(message => (
            <div key={message.id} onClick={() => handleCardClick(message)}>
              <MessageCard message={message} onToggleRead={toggleReadStatus} onDelete={deleteMessage} />
            </div>
          ))
        )}
      </div>

      {viewingNotification && <NotificationDetailModal notification={viewingNotification} onClose={() => setViewingNotification(null)} />}
    </div>
  );
};

export default Messages;