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
  
  // 使用您偏好的變數命名
  const [showDropdown, setShowDropdown] = useState(false); 
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------
  // 核心邏輯 (保持不動)：混合讀取 API 與 LocalStorage
  // ------------------------------------------------------------
  const fetchNotifications = useCallback(async () => {
    let apiData: Notification[] = [];
    let localData: Notification[] = [];

    // 1. 嘗試讀取 API
    try {
      const res = await apiClient.get<any>('/api/notifications');
      const data = Array.isArray(res) ? res : (res?.data || []); 
      if (Array.isArray(data)) apiData = data;
    } catch (error) {
      // 靜默失敗
    }

    // 2. 讀取 LocalStorage (模擬 Admin 通知)
    try {
      const saved = localStorage.getItem('demo_notifications');
      if (saved) localData = JSON.parse(saved);
    } catch (error) {
      console.error("LS 讀取失敗", error);
    }

    // 3. 合併並排序
    const merged = [...localData, ...apiData].sort((a, b) => 
      new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    
    const unique = Array.from(new Map(merged.map(item => [item.id, item])).values());
    setNotifications(unique);
  }, []);

  // 定時輪詢與事件監聽
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

  // 點擊處理邏輯 (保持不動)：判斷來源並更新狀態
  const handleNotificationClick = async (notification: Notification) => {
    setShowDropdown(false); // 關閉下拉
    setSelectedNotification(notification); // 開啟 Modal

    if (!notification.isRead) {
      // 1. 嘗試更新 LocalStorage
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

      // 2. 嘗試呼叫 API
      try {
          await apiClient.patch(`/api/notifications/${notification.id}/read`, {});
      } catch (e) { }

      // 更新 UI
      fetchNotifications();
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  };

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ------------------------------------------------------------
  // UI 部分 (已替換為您指定的版本)
  // ------------------------------------------------------------
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
            <h3 className="text-sm font-semibold text-gray-900">通知中心</h3>
            {/* 若後端無全部已讀 API，可先隱藏此按鈕或僅做前端效果 */}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      !notification.isRead ? 'bg-[#EF9D11]' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 space-y-1">
                      <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
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
                <p className="text-sm">暫無通知</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-center">
            <a href="/member?section=通知管理" className="text-xs font-medium text-gray-600 hover:text-[#EF9D11]">
              查看所有通知
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