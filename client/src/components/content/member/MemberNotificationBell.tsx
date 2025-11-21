// new-LinkUp/client/src/components/content/member/MemberNotificationBell.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
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

export default function MemberNotificationBell({ className = '' }: { className?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [showDropdown, setShowDropdown] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // 核心邏輯 (保持不動)：混合讀取 API 與 LocalStorage
  // ------------------------------------------------------------
  const fetchNotifications = useCallback(async () => {
    let apiData: Notification[] = [];
    let localData: Notification[] = [];

    try {
      const res = await apiClient.get<any>('/api/notifications');
      const data = Array.isArray(res) ? res : (res?.data || []); 
      if (Array.isArray(data)) apiData = data;
    } catch (error) { }

    try {
      const saved = localStorage.getItem('demo_notifications');
      if (saved) localData = JSON.parse(saved);
    } catch (error) { console.error("LS 讀取失敗", error); }

    const merged = [...localData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    
    const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
    setNotifications(unique);
  }, []);

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

  // 1. 計算未讀數量 (用於紅點)
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 2. [新增] 產生一個只包含未讀通知的列表，用於渲染
  const unreadList = notifications.filter(n => !n.isRead);

  const handleNotificationClick = async (notification: Notification) => {
    setShowDropdown(false); 
    setSelectedNotification(notification); 

    if (!notification.isRead) {
      try {
           const saved = localStorage.getItem('demo_notifications');
           if (saved) {
             const list: Notification[] = JSON.parse(saved);
             if (list.some(n => n.id === notification.id)) {
                const updated = list.map(n => n.id === notification.id ? { ...n, isRead: true } : n);
                localStorage.setItem('demo_notifications', JSON.stringify(updated));
             }
           }
      } catch(e) { console.error(e); }

      try {
          await apiClient.patch(`/api/notifications/${notification.id}/read`, {});
      } catch (e) { }

      fetchNotifications();
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  };

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
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h3 className="text-sm font-semibold text-gray-900">未讀通知</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {/* 3. 修改這裡：判斷未讀列表長度，並渲染 unreadList */}
            {unreadList.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {unreadList.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 bg-orange-50/30"
                  >
                    {/* 因為只顯示未讀，所以這裡的小圓點一定是橘色 */}
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#EF9D11]" />
                    
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
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <BellIcon className="mb-2 h-8 w-8 opacity-20" />
                <p className="text-sm">暫無未讀通知</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center">
            <a href="/member?section=通知管理" className="text-xs font-medium text-gray-600 hover:text-[#EF9D11]">
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