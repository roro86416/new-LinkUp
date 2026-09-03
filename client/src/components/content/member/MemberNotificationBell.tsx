'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import NotificationDetailModal from './NotificationDetailModal';
import { apiClient } from '../../../api/auth/apiClient';
import { useUser } from '../../../context/auth/UserContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // [新增 1] 引入 Router

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  sentAt: string;
  isRead: boolean;
  link?: string; // [新增 2] 增加連結欄位 (可選)
}

export default function MemberNotificationBell({ className = '' }: { className?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const router = useRouter(); // [新增 3] 初始化 Router

  // ... (fetchNotifications 與 useEffect 保持不變) ...
  const fetchNotifications = useCallback(async () => {
    if (!user) {
        setNotifications([]);
        return;
    }

    let apiData: Notification[] = [];
    let globalData: Notification[] = [];
    let userData: Notification[] = [];

    try {
      const res = await apiClient.get<any>('/api/notifications');
      const data = Array.isArray(res) ? res : (res?.data || []); 
      if (Array.isArray(data)) apiData = data;
    } catch (error) { }

    try {
      const savedGlobal = localStorage.getItem('demo_notifications');
      if (savedGlobal) globalData = JSON.parse(savedGlobal);
    } catch (error) { console.error("Global LS error", error); }

    try {
      const userKey = `notifications_${user.userId}`;
      const savedUser = localStorage.getItem(userKey);
      if (savedUser) userData = JSON.parse(savedUser);
    } catch (error) { console.error("User LS error", error); }

    const merged = [...globalData, ...userData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    
    const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
    setNotifications(unique);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const handler = () => { fetchNotifications(); };
    window.addEventListener('notifications-updated', handler);
    const interval = setInterval(fetchNotifications, 5000);
    return () => {
      window.removeEventListener('notifications-updated', handler);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadList = notifications.filter(n => !n.isRead);

  // ... (handleMarkAllAsRead 保持不變) ...
  const handleMarkAllAsRead = async () => {
    if (!user || unreadList.length === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      const globalKey = 'demo_notifications';
      const globalStored = localStorage.getItem(globalKey);
      if (globalStored) {
        const list = JSON.parse(globalStored) as Notification[];
        const updated = list.map(n => ({ ...n, isRead: true }));
        localStorage.setItem(globalKey, JSON.stringify(updated));
      }
      const userKey = `notifications_${user.userId}`;
      const userStored = localStorage.getItem(userKey);
      if (userStored) {
        const list = JSON.parse(userStored) as Notification[];
        const updated = list.map(n => ({ ...n, isRead: true }));
        localStorage.setItem(userKey, JSON.stringify(updated));
      }
      const updatePromises = unreadList.map(n => 
        apiClient.patch(`/api/notifications/${n.id}/read`, {}).catch(() => {})
      );
      await Promise.all(updatePromises);
      window.dispatchEvent(new CustomEvent('notifications-updated'));
      toast.success('所有通知已標示為已讀');
    } catch (error) {
      console.error('一鍵已讀失敗', error);
    }
  };

  // [修改 4] 點擊處理邏輯：支援連結跳轉
  const handleNotificationClick = async (notification: Notification) => {
    setShowDropdown(false); 
    
    // 如果沒有連結，才打開詳情 Modal
    if (!notification.link) {
        setSelectedNotification(notification); 
    }

    // 標記為已讀 (邏輯保持不變)
    if (!notification.isRead && user) {
      try {
           // 檢查全域
           const globalKey = 'demo_notifications';
           const savedGlobal = localStorage.getItem(globalKey);
           if (savedGlobal) {
             const list: Notification[] = JSON.parse(savedGlobal);
             if (list.some(n => n.id === notification.id)) {
                const updated = list.map(n => n.id === notification.id ? { ...n, isRead: true } : n);
                localStorage.setItem(globalKey, JSON.stringify(updated));
             }
           }

           // 檢查個人
           const userKey = `notifications_${user.userId}`;
           const savedUser = localStorage.getItem(userKey);
           if (savedUser) {
             const list: Notification[] = JSON.parse(savedUser);
             if (list.some(n => n.id === notification.id)) {
                const updated = list.map(n => n.id === notification.id ? { ...n, isRead: true } : n);
                localStorage.setItem(userKey, JSON.stringify(updated));
             }
           }
      } catch(e) { console.error(e); }

      try {
          await apiClient.patch(`/api/notifications/${notification.id}/read`, {});
      } catch (e) { }

      fetchNotifications();
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }

    // [關鍵] 如果有連結，執行跳轉
    if (notification.link) {
        router.push(notification.link);
    }
  };

  // ... (useEffect clickOutside 與 render 保持不變) ...
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-full transition-colors hover:bg-black/5 ${className}`}
      >
        <BellIcon className={`w-6 h-6 ${className ? '' : 'text-white'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-xl border border-gray-100 focus:outline-none z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              未讀通知 
              {unreadCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
            </h3>
            
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead}
                className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors hover:bg-blue-50 px-2 py-1 rounded"
                title="全部標示為已讀"
              >
                <CheckCircleIcon className="w-4 h-4" />
                一鍵已讀
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {unreadList.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {unreadList.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 bg-orange-50/30 group"
                  >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#EF9D11] group-hover:scale-110 transition-transform" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {notification.content}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(notification.sentAt).toLocaleString('zh-TW')}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <BellIcon className="mb-2 h-10 w-10 opacity-20" />
                <p className="text-sm">暫無未讀通知</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center hover:bg-gray-100 transition-colors">
            <a href="/member?section=通知管理" className="text-xs font-bold text-gray-600 hover:text-[#EF9D11] block w-full py-1">
              查看歷史通知
            </a>
          </div>
        </div>
      )}

      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
}