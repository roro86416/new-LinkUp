'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
// ⭐️ 匯入 Modal 組件
import NotificationDetailModal from './NotificationDetailModal';

interface DemoNotification {
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
  // ⭐️ 修正：使用 useState 的函式初始化，避免在 effect 中同步設定狀態
  // 這個函式只會在客戶端首次渲染時執行一次。
  const [notifications, setNotifications] = useState<DemoNotification[]>(() => {
    // 確保只在客戶端執行
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const data = localStorage.getItem('demo_notifications');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);
  // ⭐️ 新增 state 來控制 Modal
  const [viewingNotification, setViewingNotification] = useState<DemoNotification | null>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // 從 localStorage 讀取通知
  const loadNotifications = useCallback(() => {
    try {
      // 這個函式現在只用於事件監聽觸發的更新
      const data = localStorage.getItem('demo_notifications');
      setNotifications(data ? JSON.parse(data) : []);
    } catch (error) {
      console.error("Failed to parse notifications from localStorage", error);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    // 監聽由其他分頁（如後台）觸發的 storage 變化
    window.addEventListener('storage', loadNotifications);
    // ⭐️ 新增：監聽由同頁面其他組件（如 Messages 頁面）觸發的自訂事件
    window.addEventListener('notifications-updated', loadNotifications);

    return () => {
      window.removeEventListener('storage', loadNotifications);
      window.removeEventListener('notifications-updated', loadNotifications);
    };
  }, [loadNotifications]);

  // ⭐️ 修正：將 unreadCount 的宣告移至最前面
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // ⭐️ 核心修改：將「標記已讀」的邏輯移到關閉選單時觸發
  // ⭐️ 修正：handleClose 現在只負責關閉選單，不再處理已讀狀態
  const handleClose = useCallback(() => {
    if (!isOpen) return; // 如果已經是關閉狀態，則不執行任何操作

    setIsOpen(false);
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // ⭐️ 修正：將 handleClose 加入依賴項陣列
  }, [handleClose]);

  const handleToggle = () => {
    // 現在點擊只負責切換開關狀態
    setIsOpen(!isOpen);
  };

  // ⭐️ 處理點擊通知項目的函式
  const handleNotificationClick = (notification: DemoNotification) => {
    // 1. 關閉鈴鐺下拉選單
    setIsOpen(false);
    // 2. 設定要顯示的通知，觸發 Modal 打開
    setViewingNotification(notification);

    // 3. 如果是未讀的，則標示為已讀
    if (!notification.isRead) {
      const updated = notifications.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      );
      localStorage.setItem('demo_notifications', JSON.stringify(updated));
      setNotifications(updated); // 更新畫面狀態
      // ⭐️ 發送一個自訂事件，通知其他組件（如 Messages 頁面）資料已更新
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full text-white transition-colors hover:bg-white/10 cursor-pointer"
        aria-label="通知中心"
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
            {/* 關閉按鈕現在也會觸發 handleClickOutside 邏輯 */}
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-100">
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.filter(n => !n.isRead).length > 0 ? (
              notifications.filter(n => !n.isRead).map(n => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3 border-b hover:bg-gray-50 ${typeStyles[n.type] || 'border-l-4 border-gray-300'}`}
                >
                  <p className="font-semibold text-sm text-gray-900 truncate">{n.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{new Date(n.sentAt).toLocaleString()}</p>
                </button>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-gray-500">目前沒有任何通知。</p>
            )}
          </div>
        </div>
      )}

      {/* ⭐️ 當 viewingNotification 有值時，渲染 Modal */}
      {viewingNotification && <NotificationDetailModal notification={viewingNotification} onClose={() => setViewingNotification(null)} />}
    </div>
  );
}