'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import NotificationDetailModal from './NotificationDetailModal';
import { apiClient } from '../../../api/auth/apiClient';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  sentAt: string;
  isRead: boolean;
}

const typeStyles: { [key: string]: string } = {
  '活動提醒': 'border-l-4 border-yellow-500',
  '報名成功': 'border-l-4 border-green-500',
  '系統公告': 'border-l-4 border-blue-500',
  '活動變更': 'border-l-4 border-red-500',
};

export default function MemberNotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [viewingNotification, setViewingNotification] = useState<Notification | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 混合讀取 API 與 LocalStorage
  const fetchNotifications = useCallback(async () => {
    let apiData: Notification[] = [];
    let localData: Notification[] = [];

    // API
    try {
      const res = await apiClient.get<Notification[]>('/api/notifications');
      if (Array.isArray(res)) apiData = res;
    } catch (error) {
      console.error("API 鈴鐺讀取失敗", error);
    }

    // LocalStorage
    try {
      const saved = localStorage.getItem('demo_notifications');
      if (saved) localData = JSON.parse(saved);
    } catch (error) {
      console.error("LS 鈴鐺讀取失敗", error);
    }

    // 合併排序
    const merged = [...localData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    setNotifications(merged);
  }, []);

  useEffect(() => {
    // [修正 1] 使用 setTimeout 解決 setState 同步警告
    const timer = setTimeout(() => {
      fetchNotifications();
    }, 0);

    // 監聽全域事件
    const handler = () => { fetchNotifications(); };
    window.addEventListener('notifications-updated', handler);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('notifications-updated', handler);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 點擊通知：判斷來源以決定如何標記已讀
  const handleNotificationClick = async (notification: Notification) => {
    setIsOpen(false);
    setViewingNotification(notification);

    if (!notification.isRead) {
      const isLocal = notification.id.startsWith('notif_');

      if (isLocal) {
        // 更新 LocalStorage
        try {
           const saved = localStorage.getItem('demo_notifications');
           const list: Notification[] = saved ? JSON.parse(saved) : [];
           const updated = list.map(n => n.id === notification.id ? { ...n, isRead: true } : n);
           localStorage.setItem('demo_notifications', JSON.stringify(updated));
        } catch(e) {
           // [修正 2] 加入錯誤訊息
           console.error("更新 LocalStorage 失敗:", e);
        }
      } else {
        // 呼叫 API
        try {
          await apiClient.patch(`/api/notifications/${notification.id}/read`, {});
        } catch (e) {
          // [修正 2] 加入錯誤訊息
          console.error("更新 API 狀態失敗:", e);
        }
      }

      fetchNotifications();
      // 通知其他組件更新
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  };

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <h3 className="font-semibold text-gray-800">通知中心</h3>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3 border-b hover:bg-gray-50 ${n.isRead ? 'bg-white text-gray-500' : 'bg-orange-50 text-gray-900'} ${typeStyles[n.type] || 'border-l-4 border-gray-300'}`}
                >
                  <div className="flex justify-between">
                     <p className="font-semibold text-sm truncate">{n.title}</p>
                     {!n.isRead && <span className="h-2 w-2 rounded-full bg-red-500 mt-1"></span>}
                  </div>
                  <p className="text-xs mt-1 opacity-70">{new Date(n.sentAt).toLocaleString()}</p>
                </button>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-gray-500">目前沒有任何通知。</p>
            )}
          </div>
        </div>
      )}

      {viewingNotification && <NotificationDetailModal notification={viewingNotification} onClose={() => setViewingNotification(null)} />}
    </div>
  );
}