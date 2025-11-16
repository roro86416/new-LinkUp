'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DemoNotification {
  id: string;
  title: string;
  content: string;
  type: string;
  sentAt: string;
  isRead: boolean;
}

interface ModalProps {
  notification: DemoNotification;
  onClose: () => void;
}

const typeConfigs: { [key: string]: { color: string; label: string; } } = {
  '活動提醒': { color: 'text-yellow-600', label: '活動提醒' },
  '報名成功': { color: 'text-green-600', label: '報名成功' },
  '系統公告': { color: 'text-blue-600', label: '系統公告' },
  '活動變更': { color: 'text-red-600', label: '活動變更' },
};

export default function NotificationDetailModal({ notification, onClose }: ModalProps) {
  const config = typeConfigs[notification.type] || { color: 'text-gray-600', label: '一般通知' };

  // 監聽 Esc 鍵關閉視窗
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // ⭐️ 修正：直接獲取 modal-root 元素，如果不存在（例如在 SSR 期間），則不渲染 Modal
  const modalRoot = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;

  if (!modalRoot) {
    return null;
  }

  // ⭐️ 使用 createPortal 將 Modal 渲染到 body 下的 #modal-root
  return createPortal(
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl transform transition-all"
        onClick={(e) => e.stopPropagation()} // 防止點擊 Modal 內部關閉
      >
        <div className="p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{notification.title}</h1>
          <p className="text-sm text-gray-500 mt-3 border-b pb-4">
            發送時間：{new Date(notification.sentAt).toLocaleString()}
          </p>
          <div className="mt-6 text-gray-700 text-base leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto">
            {notification.content}
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}